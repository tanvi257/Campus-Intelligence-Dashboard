import { NextResponse } from 'next/server';
import mcpClientManager from '@/lib/mcp-client-manager';

export async function GET() {
  try {
    // Make sure servers are initialized
    await mcpClientManager.initialize();
    
    const status = mcpClientManager.getStatus();
    
    return NextResponse.json({
      status: 'success',
      servers: status
    });
  } catch (err) {
    console.error('[API MCP Status Error]:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to retrieve MCP status.' },
      { status: 500 }
    );
  }
}
