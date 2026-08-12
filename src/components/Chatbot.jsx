import { useEffect, useRef, useState } from "react";
import "../styles/Chatbot.css";

const AI_BASE = (import.meta.env.AI_API_URL || "/api/ai").replace(/\/+$/, "");

const WELCOME =
  "Hi — I’m Atlas, your Traveler guide. Ask about itineraries, restaurants, tours, cinemas, or how to use the app.";

async function fetchStatus() {
  const res = await fetch(`${AI_BASE}/status`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Status check failed (${res.status})`);
  }
  return data;
}

async function sendChat(messages) {
  const res = await fetch(`${AI_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.reply) {
    throw new Error(data.error || data.detail || `Chat failed (${res.status})`);
  }
  return data.reply;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([{ type: "assistant", text: WELCOME }]);
  const [statusInfo, setStatusInfo] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchStatus();
        if (!cancelled) setStatusInfo(data);
      } catch {
        if (!cancelled) {
          setStatusInfo({
            ok: false,
            message:
              "Atlas is offline. Run npm run ai (or check AI_API_URL).",
          });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [isOpen, messages, busy]);

  const send = async (e) => {
    e?.preventDefault?.();
    const text = input.trim();
    if (!text || busy) return;

    const nextMessages = [...messages, { type: "user", text }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setBusy(true);

    try {
      const history = nextMessages
        .filter((m) => m.type === "user" || m.type === "assistant")
        .map((m) => ({
          role: m.type === "user" ? "user" : "assistant",
          content: m.text,
        }));
      const reply = await sendChat(history);
      setMessages((prev) => [...prev, { type: "assistant", text: reply }]);
    } catch (err) {
      setError(err.message || "Could not reach Atlas");
    } finally {
      setBusy(false);
    }
  };

  const ready = Boolean(statusInfo?.ok);

  return (
    <div className="chatbot-container">
      <button
        type="button"
        className={`chatbot-toggle ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close Atlas" : "Open Atlas"}
        aria-expanded={isOpen}
      >
        <i className={`fas ${isOpen ? "fa-times" : "fa-compass"}`} aria-hidden="true" />
      </button>

      {isOpen && (
        <section className="chatbot" role="dialog" aria-label="Atlas travel guide">
          <header className="chatbot-header">
            <div className="chatbot-header-main">
              <span className="chatbot-header-mark" aria-hidden="true">
                <i className="fas fa-compass" />
              </span>
              <div>
                <h2 className="chatbot-header-title">Atlas</h2>
                <p className="chatbot-header-sub">
                  Your Traveler guide · Cloudflare AI
                  {busy ? " · Thinking…" : ready ? " · Online" : " · Offline"}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close Atlas"
            >
              <i className="fas fa-times" aria-hidden="true" />
            </button>
          </header>

          <div className="chatbot-status">
            {ready ? (
              <span className="ok">Atlas is online</span>
            ) : (
              <span className="warn">{statusInfo?.message || "Checking Atlas…"}</span>
            )}
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={`${msg.type}-${index}`} className={`chatbot-message-row ${msg.type}`}>
                {msg.type === "assistant" && (
                  <span className="chatbot-avatar assistant-avatar" aria-hidden="true">
                    <i className="fas fa-plane" />
                  </span>
                )}
                <div className={`chatbot-message ${msg.type}`}>{msg.text}</div>
              </div>
            ))}
            {busy && (
              <div className="chatbot-message-row assistant">
                <span className="chatbot-avatar assistant-avatar" aria-hidden="true">
                  <i className="fas fa-plane" />
                </span>
                <div className="chatbot-message assistant chatbot-typing" aria-live="polite">
                  Thinking…
                </div>
              </div>
            )}
            {error && (
              <div className="chatbot-message-row assistant">
                <div className="chatbot-message assistant chatbot-error">{error}</div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form className="chatbot-input" onSubmit={send}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={ready ? "Ask about your trip…" : "Start the AI worker first"}
              disabled={!ready || busy}
              aria-label="Message Atlas"
            />
            <button type="submit" disabled={!ready || busy || !input.trim()} aria-label="Send message">
              <i className="fas fa-paper-plane" aria-hidden="true" />
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
