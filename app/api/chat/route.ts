import { NextResponse } from "next/server";
import { companyInfo, reasons, serviceItems } from "@/lib/site-data";

// Only reachable on a real Next.js server (Vercel) — the GitHub Pages /
// Hostinger / USB builds run `output: "export"`, which can't host route
// handlers at all, so this directory is stripped out before that build
// (see .github/workflows/deploy.yml). The chatbot component calls this and
// falls back to its built-in keyword responses if the request fails, so
// nothing breaks on deployments where this route doesn't exist.
export const runtime = "edge";

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

Guidelines:
- Keep replies short and warm: 2-4 sentences, plain text, no markdown formatting.
- If someone wants a quote, an estimate, or wants to start a project, tell them you can collect their project details right now and to say something like "I want a quote" so the guided form can start.
- Never invent exact prices, timelines, or guarantees — those depend on a real project assessment.
- If asked something unrelated to construction or Monricher, briefly decline and steer back to how you can help with their project.`;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI not configured" }, { status: 503 });
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const history = Array.isArray(body.messages)
    ? body.messages
        .filter((message) => message && typeof message.content === "string")
        .slice(-10)
    : [];

  if (history.length === 0) {
    return NextResponse.json({ error: "No messages" }, { status: 400 });
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
      return NextResponse.json({ error: "Upstream error" }, { status: 502 });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return NextResponse.json({ error: "Empty response" }, { status: 502 });
    }

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: "Request failed" }, { status: 502 });
  }
}
