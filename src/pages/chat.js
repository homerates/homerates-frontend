import { useState, useRef, useEffect } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I’m the HomeRates.ai assistant. How can I help?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  async function onSubmit(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    const userMsg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next })
      });
      const data = await res.json();
      const reply = data?.reply || "No reply";
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages([...next, { role: "assistant", content: `Error: ${err?.message || err}` }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh"}}>
      <header style={{padding:"12px 16px",borderBottom:"1px solid #eee"}}>
        <strong>HomeRates.ai Chat</strong>
      </header>

      <main ref={listRef} style={{flex:"1 1 auto",overflowY:"auto",padding:"16px",background:"#fafafa"}}>
        {messages.map((m, i) => (
          <div key={i} style={{
            maxWidth:"70%", margin:"8px 0",
            padding:"10px 12px", borderRadius:"12px",
            background: m.role === "user" ? "#cce5ff" : "#fff",
            border: "1px solid #e5e5e5",
            alignSelf: m.role === "user" ? "flex-end" : "flex-start",
            whiteSpace: "pre-wrap"
          }}>
            {m.content}
          </div>
        ))}
        {loading && <div style={{opacity:0.6, fontStyle:"italic"}}>Thinking…</div>}
      </main>

      <form onSubmit={onSubmit} style={{display:"flex",gap:"8px",padding:"12px",borderTop:"1px solid #eee"}}>
        <input
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          placeholder="Ask about rates, payments, scenarios…"
          style={{flex:1,padding:"10px 12px",border:"1px solid #ddd",borderRadius:8}}
        />
        <button type="submit" disabled={loading} style={{padding:"10px 14px",borderRadius:8,border:"1px solid #0a7",background:"#0a7",color:"#fff"}}>
          {loading ? "Sending…" : "Send"}
        </button>
      </form>
    </div>
  );
}
