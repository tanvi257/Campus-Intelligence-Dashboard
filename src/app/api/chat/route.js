import { NextResponse } from 'next/server';
import { chatWithMcp } from '@/lib/gemini-service';

export async function POST(req) {
  try {
    const body = await req.json();
    const { message, history, systemInstruction, modelName } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required.' },
        { status: 400 }
      );
    }

    // Retrieve API key from custom header or server environment
    const clientApiKey = req.headers.get('x-api-key');
    const apiKey = clientApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API Key is missing. Please set it in the settings panel or .env.local on the server.' },
        { status: 400 }
      );
    }

    // Run the LLM + MCP tool call loop
    const result = await chatWithMcp(apiKey, message, history || [], systemInstruction, modelName);

    return NextResponse.json({
      response: result.response,
      toolCalls: result.toolCalls
    });
  } catch (err) {
    console.error('[API Chat Route Error]:', err);
    return NextResponse.json(
      { error: err.message || 'An error occurred during tool routing.' },
      { status: 500 }
    );
  }
}
