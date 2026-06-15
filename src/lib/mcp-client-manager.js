import { spawn } from 'child_process';
import path from 'path';
import readline from 'readline';

class McpClient {
  constructor(name, scriptPath) {
    this.name = name;
    this.scriptPath = scriptPath;
    this.process = null;
    this.tools = [];
    this.requestId = 1;
    this.pendingRequests = new Map();
    this.isInitialized = false;
    this.stdoutBuffer = '';
  }

  async start() {
    return new Promise((resolve, reject) => {
      console.log(`[MCP Client] Spawning server ${this.name} from ${this.scriptPath}`);
      
      this.process = spawn('node', [this.scriptPath], {
        env: { ...process.env, NODE_ENV: 'production' }
      });

      // Handle stderr for server logs
      this.process.stderr.on('data', (data) => {
        console.error(`[${this.name} stderr] ${data.toString().trim()}`);
      });

      // Handle stdout line buffering
      const rl = readline.createInterface({
        input: this.process.stdout,
        terminal: false
      });

      rl.on('line', (line) => {
        this.handleResponseLine(line);
      });

      this.process.on('close', (code) => {
        console.log(`[MCP Client] Server ${this.name} exited with code ${code}`);
        this.isInitialized = false;
        // Reject all pending requests
        for (const [id, { reject: rejectReq }] of this.pendingRequests.entries()) {
          rejectReq(new Error(`Server ${this.name} closed unexpectedly`));
        }
        this.pendingRequests.clear();
      });

      this.process.on('error', (err) => {
        console.error(`[MCP Client] Error in process ${this.name}:`, err);
        reject(err);
      });

      // Perform standard MCP handshake
      this.initializeHandshake()
        .then(() => this.listTools())
        .then((tools) => {
          this.tools = tools;
          this.isInitialized = true;
          console.log(`[MCP Client] Server ${this.name} ready with ${tools.length} tools`);
          resolve(this);
        })
        .catch(err => {
          console.error(`[MCP Client] Handshake failed for ${this.name}:`, err);
          this.process.kill();
          reject(err);
        });
    });
  }

  handleResponseLine(line) {
    if (!line.trim()) return;
    try {
      const response = JSON.parse(line);
      const { id, result, error } = response;
      
      if (id && this.pendingRequests.has(id)) {
        const { resolve, reject } = this.pendingRequests.get(id);
        this.pendingRequests.delete(id);
        
        if (error) {
          reject(new Error(error.message || JSON.stringify(error)));
        } else {
          resolve(result);
        }
      }
    } catch (e) {
      console.error(`[MCP Client] Failed to parse stdout line from ${this.name}:`, e, "Line:", line);
    }
  }

  sendRequest(method, params = {}) {
    return new Promise((resolve, reject) => {
      if (!this.process || this.process.killed) {
        return reject(new Error(`Server ${this.name} is not running.`));
      }
      
      const id = this.requestId++;
      const request = {
        jsonrpc: "2.0",
        id,
        method,
        params
      };
      
      this.pendingRequests.set(id, { resolve, reject });
      this.process.stdin.write(JSON.stringify(request) + '\n');
    });
  }

  async initializeHandshake() {
    return this.sendRequest('initialize', {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: {
        name: "nextjs-client",
        version: "1.0.0"
      }
    }).then((res) => {
      // Send initialized notification (doesn't expect response)
      const notification = {
        jsonrpc: "2.0",
        method: "notifications/initialized"
      };
      this.process.stdin.write(JSON.stringify(notification) + '\n');
      return res;
    });
  }

  async listTools() {
    const res = await this.sendRequest('tools/list');
    return res.tools || [];
  }

  async callTool(name, args) {
    const res = await this.sendRequest('tools/call', {
      name,
      arguments: args
    });
    return res;
  }

  kill() {
    if (this.process) {
      this.process.kill();
      this.process = null;
      this.isInitialized = false;
    }
  }
}

class McpClientManager {
  constructor() {
    this.clients = new Map();
    this.toolToClientMap = new Map();
    this.isLoaded = false;
  }

  async initialize() {
    if (this.isLoaded) return;
    
    const serverDir = path.join(process.cwd(), 'mcp-servers');
    const serversConfig = [
      { name: 'library', filename: 'library-server.js' },
      { name: 'cafeteria', filename: 'cafeteria-server.js' },
      { name: 'events', filename: 'events-server.js' },
      { name: 'academics', filename: 'academics-server.js' }
    ];

    console.log("[MCP Client Manager] Starting all MCP servers...");
    
    const startPromises = serversConfig.map(async (cfg) => {
      const scriptPath = path.join(serverDir, cfg.filename);
      const client = new McpClient(cfg.name, scriptPath);
      try {
        await client.start();
        this.clients.set(cfg.name, client);
        
        // Map each tool back to the client that serves it
        client.tools.forEach(tool => {
          this.toolToClientMap.set(tool.name, cfg.name);
        });
      } catch (err) {
        console.error(`[MCP Client Manager] Failed to start server ${cfg.name}:`, err);
      }
    });

    await Promise.all(startPromises);
    this.isLoaded = true;
    console.log("[MCP Client Manager] All servers initialized successfully!");
  }

  getAllTools() {
    const allTools = [];
    for (const client of this.clients.values()) {
      allTools.push(...client.tools);
    }
    return allTools;
  }

  getStatus() {
    const status = {};
    for (const [name, client] of this.clients.entries()) {
      status[name] = {
        name: client.name,
        connected: client.isInitialized,
        tools: client.tools.map(t => t.name)
      };
    }
    return status;
  }

  async executeTool(toolName, args) {
    const clientName = this.toolToClientMap.get(toolName);
    if (!clientName) {
      throw new Error(`No MCP server registered for tool: ${toolName}`);
    }
    
    const client = this.clients.get(clientName);
    if (!client) {
      throw new Error(`MCP client ${clientName} is not running.`);
    }

    console.log(`[MCP Client Manager] Executing tool ${toolName} on server ${clientName} with args:`, args);
    return await client.callTool(toolName, args);
  }

  shutdown() {
    console.log("[MCP Client Manager] Shutting down all MCP servers...");
    for (const client of this.clients.values()) {
      client.kill();
    }
    this.clients.clear();
    this.toolToClientMap.clear();
    this.isLoaded = false;
  }
}

// Global Singleton for Next.js Hot Reloading
let mcpClientManager;

if (process.env.NODE_ENV === 'production') {
  mcpClientManager = new McpClientManager();
} else {
  if (!global.mcpClientManager) {
    global.mcpClientManager = new McpClientManager();
    
    // Register shutdown on exit
    process.on('exit', () => global.mcpClientManager.shutdown());
    process.on('SIGINT', () => {
      global.mcpClientManager.shutdown();
      process.exit(0);
    });
    process.on('SIGTERM', () => {
      global.mcpClientManager.shutdown();
      process.exit(0);
    });
  }
  mcpClientManager = global.mcpClientManager;
}

export default mcpClientManager;
