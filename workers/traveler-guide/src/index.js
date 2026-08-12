const MODEL = "@cf/meta/llama-3.1-8b-instruct-fast";

const SYSTEM_PROMPT = `You are Atlas — a concise, friendly travel assistant inside the Traveler web app (a trip command center + booking simulator). When asked your name, say you are Atlas.

Help users with:
- Planning itineraries, packing checklists, and budgets
- Choosing restaurants, bars, tours, cinemas, concerts, and activities
- Navigating the app: Overview (/app), My Trips, Itinerary, Map, Bookings, Budget, Documents, Checklist, Discover
- Booking flows: restaurant table booking, cinema seats, tour details

Tone: warm, practical, short paragraphs. Prefer concrete suggestions over fluff.
If asked about real-time availability or payments, remind them this is a demo/simulator.
Do not invent booking confirmation codes. Keep answers under ~180 words unless the user asks for detail.`;

function corsHeaders(origin, allowedOrigins) {
  const list = String(allowedOrigins || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const allow =
    origin && (list.includes(origin) || list.includes("*")) ? origin : list[0] || "*";

  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
}

function normalizeMessages(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, 4000) }))
    .filter((m) => m.content)
    .slice(-16);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const headers = corsHeaders(origin, env.ALLOWED_ORIGINS);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    const path = url.pathname.replace(/\/+$/, "") || "/";

    if (request.method === "GET" && (path === "/api/ai/status" || path === "/status")) {
      return json(
        {
          ok: true,
          configured: true,
          provider: "cloudflare-workers-ai",
          model: MODEL,
          message: "Atlas is ready",
        },
        200,
        headers
      );
    }

    if (request.method === "POST" && (path === "/api/ai/chat" || path === "/chat")) {
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ error: "Invalid JSON body" }, 400, headers);
      }

      const history = normalizeMessages(body?.messages);
      if (!history.length || history[history.length - 1].role !== "user") {
        return json({ error: "Send at least one user message" }, 400, headers);
      }

      try {
        const result = await env.AI.run(MODEL, {
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
          max_tokens: 512,
          temperature: 0.7,
        });

        const reply =
          (typeof result?.response === "string" && result.response.trim()) ||
          (typeof result === "string" && result.trim()) ||
          "";

        if (!reply) {
          return json({ error: "Empty model response", detail: result }, 502, headers);
        }

        return json({ reply, model: MODEL }, 200, headers);
      } catch (err) {
        return json(
          {
            error: "Workers AI request failed",
            detail: err?.message || String(err),
          },
          502,
          headers
        );
      }
    }

    return json(
      {
        ok: true,
        service: "traveler-guide",
        endpoints: ["GET /api/ai/status", "POST /api/ai/chat"],
      },
      200,
      headers
    );
  },
};
