import { NextResponse } from 'next/server';
import mcpClientManager from '@/lib/mcp-client-manager';

export async function POST(req) {
  try {
    const body = await req.json();
    const { toolName, args } = body;

    if (!toolName) {
      return NextResponse.json(
        { error: 'toolName is required.' },
        { status: 400 }
      );
    }

    // Initialize MCP client manager
    await mcpClientManager.initialize();

    // Call the MCP tool via subprocess stdio
    const mcpResponse = await mcpClientManager.executeTool(toolName, args || {});

    // Un-wrap the MCP standard envelope to return the raw data payload to frontend widgets
    if (mcpResponse && mcpResponse.content && Array.isArray(mcpResponse.content)) {
      const firstContent = mcpResponse.content[0];
      if (firstContent) {
        if (firstContent.type === 'text') {
          try {
            // If it's a serialized JSON string, parse it
            const parsed = JSON.parse(firstContent.text);
            return NextResponse.json(parsed);
          } catch (e) {
            // Otherwise, return it as plain text
            return NextResponse.json(firstContent.text);
          }
        }
        // If it's a custom JSON object array from our server (where content = result)
        if (firstContent.type === undefined) {
          return NextResponse.json(mcpResponse.content);
        }
      }
    }

    return NextResponse.json(mcpResponse);
  } catch (err) {
    console.error(`[API Widget Query Error for ${req.body?.toolName}]:`, err);
    return NextResponse.json(
      { error: err.message || 'Failed to query MCP tool.' },
      { status: 500 }
    );
  }
}
