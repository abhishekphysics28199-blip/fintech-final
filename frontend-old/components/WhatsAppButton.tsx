"use client";

import { useMemo, useState } from "react";
import { api } from "@/lib/api";
import { STORAGE_KEYS } from "@/lib/languages";

export function WhatsAppButton({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const [to, setTo] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const language_code = useMemo(() => {
    if (typeof window === "undefined") return "en";
    return localStorage.getItem(STORAGE_KEYS.languageCode) || "en";
  }, []);

  async function send() {
    setStatus("sending");
    setError(null);
    try {
      await api.sendWhatsApp({ to, text, language_code });
      setStatus("sent");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Failed");
    }
  }

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
          setStatus("idle");
          setError(null);
        }}
        className="rounded-xl bg-saffron px-4 py-2 text-sm font-semibold text-navy hover:opacity-90"
      >
        Send to WhatsApp
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#071326] p-4">
            <div className="mb-2 text-lg font-semibold text-white">Send to WhatsApp</div>
            <div className="mb-3 text-sm text-white/70">
              Enter your WhatsApp number with country code (example: <span className="text-white">+9198xxxxxxx</span>).
            </div>
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="+91..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus:border-saffron/60"
            />
            {error && <div className="mt-2 text-sm text-red-200">{error}</div>}
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                disabled={!to || status === "sending"}
                onClick={send}
                className="rounded-xl bg-saffron px-4 py-2 text-sm font-semibold text-navy disabled:opacity-50"
              >
                {status === "sending" ? "Sending…" : status === "sent" ? "Sent" : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

