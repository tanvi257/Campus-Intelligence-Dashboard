import { NextResponse } from 'next/server';
import mcpClientManager from '@/lib/mcp-client-manager';

export async function GET() {
  try {
    // Perform initialization check
    await mcpClientManager.initialize();
    
    // Check if at least one MCP server is running/connected
    const status = mcpClientManager.getStatus();
    const activeServers = Object.values(status).filter(s => s.connected);
    
    if (activeServers.length === 0) {
      return NextResponse.json(
        { status: 'warning', message: 'No MCP servers connected.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      activeServers: activeServers.map(s => s.name)
    });
  } catch (err) {
    console.error('[Health Check Failure]:', err);
    return NextResponse.json(
      { status: 'error', error: err.message || 'Health check failed.' },
      { status: 500 }
    );
  }
}
