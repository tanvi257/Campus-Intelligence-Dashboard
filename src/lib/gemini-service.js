import { GoogleGenerativeAI } from '@google/generative-ai';
import mcpClientManager from './mcp-client-manager';

/**
 * Helper to convert JSON schema types to Gemini API Schema types (uppercase)
 */
function mapJsonSchemaToGemini(schema) {
  if (!schema) return undefined;
  
  const mapped = { ...schema };
  
  if (typeof schema.type === 'string') {
    const typeMap = {
      'string': 'STRING',
      'number': 'NUMBER',
      'integer': 'NUMBER',
      'boolean': 'BOOLEAN',
      'object': 'OBJECT',
      'array': 'ARRAY'
    };
    mapped.type = typeMap[schema.type.toLowerCase()] || 'STRING';
  }
  
  if (schema.properties) {
    mapped.properties = {};
    for (const [key, value] of Object.entries(schema.properties)) {
      mapped.properties[key] = mapJsonSchemaToGemini(value);
    }
  }
  
  if (schema.items) {
    mapped.items = mapJsonSchemaToGemini(schema.items);
  }
  
  // Remove fields not supported in Gemini parameter schema if necessary
  delete mapped.additionalProperties;
  
  return mapped;
}

/**
 * Orchestrates LLM chat session and executes tool-calling iteration loop.
 */
export async function chatWithMcp(apiKey, userMessage, chatHistory = [], systemInstruction = '', modelName = 'gemini-2.5-flash') {
  // Initialize MCP servers first
  await mcpClientManager.initialize();
  
  // Get all tools from the MCP Client Manager
  const mcpTools = mcpClientManager.getAllTools();
  
  // Format MCP tools as Gemini function declarations
  const functionDeclarations = mcpTools.map(tool => {
    const parameters = mapJsonSchemaToGemini(tool.inputSchema);
    return {
      name: tool.name,
      description: tool.description,
      parameters: parameters
    };
  });

  const toolsConfig = functionDeclarations.length > 0 ? [{ functionDeclarations }] : [];

  // Initialize the Gemini API client
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Use the selected Gemini model
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: systemInstruction || 
      "You are the Campus Intelligence Assistant. You help students find info about the library, cafeteria menus, events, and academics. " +
      "You have access to live data via MCP tools. Always search for info using the appropriate tools. " +
      "When answering, be friendly, concise, and mention which campus database or server you queried. " +
      "If a student wants to checkout a book or register for an event, ask for their Student ID or details, then run the checkout/registration tools.",
    tools: toolsConfig
  });

  // Reconstruct chat history in the format Gemini expects
  let formattedHistory = chatHistory.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  // Gemini requires the first message in chat history to have the 'user' role.
  // We slice off the initial assistant greeting (role: 'model') to satisfy this.
  if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
    formattedHistory = formattedHistory.slice(1);
  }

  const chat = model.startChat({
    history: formattedHistory
  });

  console.log(`[Gemini Service] Sending message to model: "${userMessage}"`);
  let result = await chat.sendMessage(userMessage);
  let responseText = '';
  const executedToolCalls = [];

  const maxIterations = 6;
  let iterations = 0;

  // Function execution loop
  while (result.response.functionCalls && result.response.functionCalls.length > 0 && iterations < maxIterations) {
    iterations++;
    const functionCalls = result.response.functionCalls;
    console.log(`[Gemini Service] Model requested ${functionCalls.length} tool calls (Iteration ${iterations})`);
    
    const functionResponses = [];
    
    for (const call of functionCalls) {
      const toolName = call.name;
      const toolArgs = call.args;
      
      console.log(`[Gemini Service] Executing tool: ${toolName} with args:`, toolArgs);
      
      executedToolCalls.push({
        id: `call-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: toolName,
        args: toolArgs,
        status: 'running'
      });
      
      let executionResult;
      try {
        const mcpResponse = await mcpClientManager.executeTool(toolName, toolArgs);
        
        // Extract content from MCP response
        let textResult = '';
        if (mcpResponse && mcpResponse.content && Array.isArray(mcpResponse.content)) {
          textResult = mcpResponse.content.map(c => c.text || '').join('\n');
        } else {
          textResult = JSON.stringify(mcpResponse);
        }
        
        executionResult = { value: textResult };
        executedToolCalls[executedToolCalls.length - 1].status = 'success';
        executedToolCalls[executedToolCalls.length - 1].result = textResult;
      } catch (err) {
        console.error(`[Gemini Service] Tool execution failed for ${toolName}:`, err);
        executionResult = { error: err.message };
        executedToolCalls[executedToolCalls.length - 1].status = 'error';
        executedToolCalls[executedToolCalls.length - 1].result = err.message;
      }
      
      functionResponses.push({
        response: executionResult,
        name: toolName
      });
    }

    // Send tool outputs back to model to continue the generation
    console.log(`[Gemini Service] Sending tool results back to model...`);
    const responseParts = functionResponses.map(fr => ({
      functionResponse: fr
    }));
    result = await chat.sendMessage(responseParts);
  }

  responseText = result.response.text();
  console.log(`[Gemini Service] Final response generated: "${responseText.substring(0, 100)}..."`);

  return {
    response: responseText,
    toolCalls: executedToolCalls
  };
}
