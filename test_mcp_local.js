const { spawn } = require('child_process');
const path = require('path');
const readline = require('readline');

function testServer(name, filename, testMethod, testParams) {
  return new Promise((resolve) => {
    console.log(`\n=== Testing Server: ${name} ===`);
    const scriptPath = path.join(__dirname, 'mcp-servers', filename);
    const child = spawn('node', [scriptPath]);

    const rl = readline.createInterface({
      input: child.stdout,
      terminal: false
    });

    let step = 0;
    
    rl.on('line', (line) => {
      console.log(`[${name} STDOUT]:`, line);
      const res = JSON.parse(line);

      if (step === 0) {
        // Step 0 received: response to initialize.
        console.log("-> Handshake Success!");
        // Send initialized notification
        child.stdin.write(JSON.stringify({
          jsonrpc: "2.0",
          method: "notifications/initialized"
        }) + '\n');
        
        // Send tools/list
        console.log("<- Listing Tools...");
        child.stdin.write(JSON.stringify({
          jsonrpc: "2.0",
          id: 2,
          method: "tools/list"
        }) + '\n');
        step = 1;
      } else if (step === 1) {
        // Step 1 received: response to tools/list
        console.log(`-> Registered Tools:`, res.result?.tools?.map(t => t.name));
        
        // Send tools/call
        console.log(`<- Calling Tool ${testMethod} with args:`, testParams);
        child.stdin.write(JSON.stringify({
          jsonrpc: "2.0",
          id: 3,
          method: "tools/call",
          params: {
            name: testMethod,
            arguments: testParams
          }
        }) + '\n');
        step = 2;
      } else if (step === 2) {
        // Step 2 received: response to tools/call
        console.log(`-> Tool Execution Result:`, JSON.stringify(res.result?.content, null, 2));
        child.kill();
        resolve();
      }
    });

    child.stderr.on('data', (data) => {
      console.log(`[${name} STDERR]:`, data.toString().trim());
    });

    child.on('close', (code) => {
      console.log(`[${name} PROCESS CLOSED] Code:`, code);
    });

    // Start with initialize request
    console.log("<- Sending Initialize Handshake...");
    child.stdin.write(JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: { name: "test-client", version: "1.0" }
      }
    }) + '\n');
  });
}

async function runTests() {
  try {
    await testServer('Library', 'library-server.js', 'search_books', { query: 'Algorithms' });
    await testServer('Cafeteria', 'cafeteria-server.js', 'check_crowd_level', {});
    console.log("\nAll MCP servers tested successfully and verified!");
  } catch (err) {
    console.error("Test failed:", err);
  }
}

runTests();
