const readline = require('readline');

/**
 * A simple, zero-dependency implementation of the Model Context Protocol (MCP) server
 * communicating via stdio JSON-RPC.
 */
class McpServer {
  constructor(name, version) {
    this.name = name;
    this.version = version;
    this.tools = {};
  }

  /**
   * Registers a tool on the server.
   * @param {string} name - Unique name of the tool.
   * @param {string} description - Description of what the tool does.
   * @param {object} properties - Schema definitions for input parameters (properties of the object schema).
   * @param {string[]} required - Array of required parameter names.
   * @param {function} handler - Async function executed when the tool is called.
   */
  registerTool(name, description, properties, required, handler) {
    this.tools[name] = {
      name,
      description,
      inputSchema: {
        type: "object",
        properties: properties || {},
        required: required || []
      },
      handler
    };
  }

  /**
   * Starts the server reading from stdin.
   */
  start() {
    const rl = readline.createInterface({
      input: process.stdin
    });

    rl.on('line', async (line) => {
      if (!line.trim()) return;
      try {
        const request = JSON.parse(line);
        await this.handleRequest(request);
      } catch (err) {
        this.sendError(null, -32700, "Parse error: " + err.message);
      }
    });

    // Handle termination signals
    process.on('SIGINT', () => process.exit(0));
    process.on('SIGTERM', () => process.exit(0));
  }

  async handleRequest(req) {
    const { method, params, id } = req;

    if (method === 'initialize') {
      this.sendResponse(id, {
        protocolVersion: "2024-11-05",
        capabilities: {
          tools: {}
        },
        serverInfo: {
          name: this.name,
          version: this.version
        }
      });
    } else if (method === 'notifications/initialized') {
      // Client handshake initialization complete
    } else if (method === 'tools/list') {
      const toolsList = Object.values(this.tools).map(t => ({
        name: t.name,
        description: t.description,
        inputSchema: t.inputSchema
      }));
      this.sendResponse(id, { tools: toolsList });
    } else if (method === 'tools/call') {
      const toolName = params.name;
      const toolArgs = params.arguments || {};
      const tool = this.tools[toolName];
      
      if (!tool) {
        this.sendError(id, -32601, `Tool not found: ${toolName}`);
        return;
      }

      try {
        const result = await tool.handler(toolArgs);
        let content;
        
        if (typeof result === 'string') {
          content = [{ type: 'text', text: result }];
        } else if (Array.isArray(result)) {
          content = result;
        } else {
          content = [{ type: 'text', text: JSON.stringify(result, null, 2) }];
        }
        
        this.sendResponse(id, { content });
      } catch (err) {
        this.sendResponse(id, {
          content: [{ type: 'text', text: `Error: ${err.message}` }],
          isError: true
        });
      }
    } else {
      if (id !== undefined) {
        this.sendError(id, -32601, `Method not found: ${method}`);
      }
    }
  }

  sendResponse(id, result) {
    const response = {
      jsonrpc: "2.0",
      id,
      result
    };
    process.stdout.write(JSON.stringify(response) + "\n");
  }

  sendError(id, code, message) {
    const response = {
      jsonrpc: "2.0",
      id,
      error: {
        code,
        message
      }
    };
    process.stdout.write(JSON.stringify(response) + "\n");
  }
}

module.exports = McpServer;
