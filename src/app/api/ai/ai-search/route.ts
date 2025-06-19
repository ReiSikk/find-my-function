import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function POST(req: NextRequest) {
  const { query, stack, systemPrompt } = await req.json();

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-8b-instruct:free",
         messages: [
          { role: "system", content: systemPrompt || `You are a helpful AI assistant for nutrition and fitness. Provide formatted responses without unnecessary information and keep the responses concise. Think and reason like an expert. No hallucinating allowed. When input includes drinks names, provide links to purchase those products in your output responses.` },
          { role: "user", content: `I'm looking for ${stack} products. ${query}` },
        ],
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    console.error("AI Search error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "AI search failed" }, { status: 500 });
  }
}