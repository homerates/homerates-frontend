// POST /api/chat
// Body: { messages: [{ role: "user"|"assistant"|"system", content: string }, ...] }
// Needs: OPENAI_API_KEY in .env.local  (no quotes)

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

  try {
    // support either string or parsed body
    const body =
      typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {})

    const messages = Array.isArray(body.messages) ? body.messages : null
    if (!messages) return res.status(400).json({ error: "messages must be an array" })

    const key = process.env.OPENAI_API_KEY
    if (!key) {
      return res.status(500).json({
        error: "Missing OPENAI_API_KEY in .env.local (add it and restart dev server)"
      })
    }

    const system = {
      role: "system",
      content:
        "You are the HomeRates.ai assistant. Be concise and practical. " +
        "Explain mortgage concepts plainly; show math when useful. Educational only.",
    }

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.3,
        messages: [system, ...messages],
      }),
    })

    const raw = await r.text()
    if (!r.ok) return res.status(500).json({ error: `OpenAI ${r.status} ${r.statusText}: ${raw}` })

    let data; try { data = JSON.parse(raw) } catch { return res.status(500).json({ error: `Non-JSON from OpenAI: ${raw}` }) }

    const reply = data?.choices?.[0]?.message?.content || "No reply generated."
    return res.status(200).json({ reply })
  } catch (e) {
    return res.status(500).json({ error: `Server error: ${e?.message || e}` })
  }
}
