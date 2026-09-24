import { NextResponse } from "next/server";
import { companyInfo, reasons, serviceItems } from "@/lib/site-data";

// Only reachable on a real Next.js server (Vercel) — the GitHub Pages /
// Hostinger / USB builds run `output: "export"`, which can't host route
// handlers at all, so this directory is stripped out before that build
// (see .github/workflows/deploy.yml). Those static builds instead call
// THIS deployment's own /api/chat cross-origin (see CHAT_API_URL in
// construction-chatbot.tsx) rather than embedding the Groq key
// client-side, which is why CORS is open here rather than same-origin
// only. The chatbot component falls back to its built-in keyword
// responses if every attempt fails, so nothing ever breaks outright.
export const runtime = "edge";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

function json(body: unknown, status: number) {
  return NextResponse.json(body, { status, headers: CORS_HEADERS });
}

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "openai/gpt-oss-20b";

const systemPrompt = `You are the Monricher Assistant, the virtual assistant for Monricher Construction and Development Corp, a construction company based at ${companyInfo.address}, Philippines.

Company facts:
- Phone: ${companyInfo.phone}
- Email: ${companyInfo.email}
- Facebook: ${companyInfo.facebook}

Services offered:
${serviceItems.map((item) => `- ${item.title}: ${item.text}`).join("\n")}

Why clients choose Monricher:
${reasons.map((reason) => `- ${reason}`).join("\n")}

Rough pricing tiers (Philippine pesos per square meter, construction cost only):
- Low tier: ₱20,000/sqm
- Mid tier: ₱30,000-40,000/sqm
- High-end: ₱50,000/sqm and above

Guidelines:
- Keep replies short and warm: 2-4 sentences, plain text, no markdown formatting.
- If someone asks for a quick estimate or "how much" for a given size and finish level, use the pricing tiers above to give a rough peso range (e.g. size x rate), but always frame it as a rough ballpark, not a quote — the real number depends on a site assessment. Ask which tier (low/mid/high-end) fits their vision if they haven't said.
- If someone wants a full/formal quote, an estimate beyond the rough ballpark, or wants to start a project, tell them you can collect their project details right now and to say something like "I want a quote" so the guided form can start.
- Never state the rough ballpark as a final or guaranteed price — always note it can change based on site conditions, materials, and design.
- If asked something unrelated to construction or Monricher, briefly decline and steer back to how you can help with their project.`;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return json({ error: "AI not configured" }, 503);
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }

  const history = Array.isArray(body.messages)
    ? body.messages
        .filter((message) => message && typeof message.content === "string")
        .slice(-10)
    : [];

  if (history.length === 0) {
    return json({ error: "No messages" }, 400);
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: systemPrompt }, ...history],
        temperature: 0.6,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      return json({ error: "Upstream error" }, 502);
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return json({ error: "Empty response" }, 502);
    }

    return json({ reply }, 200);
  } catch {
    return json({ error: "Request failed" }, 502);
  }
}
