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

    // Return the raw response from MCP server
    return NextResponse.json(mcpResponse);
  } catch (err) {
    console.error(`[API Widget Query Error for ${req.body?.toolName}]:`, err);
    return NextResponse.json(
      { error: err.message || 'Failed to query MCP tool.' },
      { status: 500 }
    );
  }
}
