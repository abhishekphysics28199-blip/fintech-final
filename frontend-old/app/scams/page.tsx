"use client";

import { useEffect, useMemo, useState } from "react";
import { api, ScamAlert } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { ScamTicker } from "@/components/ScamTicker";
import { FraudSeverityBadge } from "@/components/FraudSeverityBadge";

export default function ScamsPage() {
  const [items, setItems] = useState<ScamAlert[]>([]);
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = state ? await api.scamsByState(state) : await api.trendingScams();
      setItems(res.items || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [state]);

  const title = useMemo(
    () => (state ? `Live Scam Alerts — ${state}` : "Trending Scams in India Today"),
    [state]
  );

  return (
    <div>
      <ScamTicker />
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xl font-semibold text-white">{title}</div>
            <div className="text-sm text-white/70">
              Data refreshes on the backend schedule (and can be triggered manually in dev).
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="Filter by state (e.g., Maharashtra)"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-saffron/60 sm:w-72"
            />
          </div>
        </div>

        {loading && <div className="text-sm text-white/70">Loading…</div>}
        {error && <div className="text-sm text-red-200">{error}</div>}

        <div className="grid gap-3">
          {items.map((x) => (
            <div key={x.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-base font-semibold text-white">{x.title}</div>
                <FraudSeverityBadge severity={x.severity} />
              </div>
              <div className="mt-2 text-sm text-white/80">{x.description}</div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/70">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  Type: <span className="text-white/90">{x.scam_type}</span>
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  States: <span className="text-white/90">{x.affected_states}</span>
                </span>
                <a
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 hover:bg-white/10"
                  href={x.source_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Source: <span className="text-white/90">{x.source_name}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

