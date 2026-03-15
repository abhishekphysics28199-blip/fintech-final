"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { api, ChatResponse } from "@/lib/api";
import { STORAGE_KEYS } from "@/lib/languages";
import { FraudSeverityBadge } from "@/components/FraudSeverityBadge";
import { WhatsAppButton } from "@/components/WhatsAppButton";

type Msg = { role: "user" | "assistant"; content: string; payload?: ChatResponse };

function getLangCode() {
  if (typeof window === "undefined") return "en";
  return localStorage.getItem(STORAGE_KEYS.languageCode) || "en";
}

export function ChatWindow() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const languageCode = useMemo(() => getLangCode(), []);
  const sessionId = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    const key = "fintech_ai_session_id";
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    const id = crypto.randomUUID();
    localStorage.setItem(key, id);
    return id;
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setLoading(true);
    setMessages((m) => [...m, { role: "user", content: text }]);
    try {
      const res = await api.chat({ message: text, language_code: languageCode, session_id: sessionId });
      setMessages((m) => [...m, { role: "assistant", content: res.answer, payload: res }]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            `Sorry — I couldn’t reach the Fintech.AI backend.\n\n` +
            `Details: ${msg}\n\n` +
            `Cybercrime Helpline: 1930 | Report at: cybercrime.gov.in`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
        <div className="text-xs text-white/60">
          Tip: Describe what happened (amount, UPI app, time, link/call/SMS). If it’s ongoing, call{" "}
          <span className="text-white">1930</span> now.
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-sm text-white/70">
              Ask about UPI fraud, suspicious links, fake customer care calls, investment scams, insurance fraud, or
              reporting steps.
            </div>
          )}

          {messages.map((m, idx) => {
            const isUser = m.role === "user";
            return (
              <div key={idx} className={isUser ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={[
                    "max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    isUser ? "bg-saffron text-navy" : "bg-[#0B2148] text-white",
                  ].join(" ")}
                >
                  {!isUser && m.payload && (
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <FraudSeverityBadge severity={m.payload.severity} />
                      <span className="text-xs text-white/70">Scam type:</span>
                      <span className="text-xs font-semibold">{m.payload.scam_type}</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{m.content}</div>

                  {!isUser && m.payload && (
                    <div className="mt-3 space-y-3">
                      <div>
                        <div className="mb-1 text-xs font-semibold text-white/90">Step-by-step action plan</div>
                        <ul className="list-disc space-y-1 pl-5 text-sm text-white/90">
                          {m.payload.action_plan.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="mb-1 text-xs font-semibold text-white/90">Official help</div>
                        <div className="flex flex-wrap gap-2">
                          {m.payload.official_links.map((l) => (
                            <a
                              key={l.url}
                              href={l.url}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/90 hover:bg-white/10"
                            >
                              {l.label}
                            </a>
                          ))}
                        </div>
                      </div>
                      <div className="pt-1">
                        <WhatsAppButton text={m.payload.whatsapp_ready_text} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {loading && <div className="text-sm text-white/60">Fintech.AI is thinking…</div>}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          placeholder="Describe your issue…"
          className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-saffron/60"
        />
        <button
          disabled={loading}
          onClick={send}
          className="rounded-2xl bg-saffron px-5 py-3 text-sm font-semibold text-navy disabled:opacity-60"
        >
          Send
        </button>
      </div>
    </div>
  );
}

