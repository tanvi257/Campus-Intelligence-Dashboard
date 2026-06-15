const path = require('path');

try {
  console.log("Attempting to import mcp-client-manager...");
  const mcpClientManager = require('./src/lib/mcp-client-manager');
  console.log("Imported successfully! Testing initialization...");
  
  mcpClientManager.initialize()
    .then(() => {
      console.log("Initialization complete!");
      console.log("Status:", mcpClientManager.getStatus());
      mcpClientManager.shutdown();
    })
    .catch(err => {
      console.error("Initialization failed with error:", err);
      mcpClientManager.shutdown();
    });
} catch (err) {
  console.error("Fatal error during import/execution:", err);
}
