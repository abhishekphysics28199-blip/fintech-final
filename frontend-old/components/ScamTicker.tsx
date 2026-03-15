"use client";

import { useEffect, useMemo, useState } from "react";
import { api, ScamAlert } from "@/lib/api";

export function ScamTicker() {
  const [items, setItems] = useState<ScamAlert[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    try {
      setError(null);
      const res = await api.trendingScams();
      setItems(res.items || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    }
  }

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 30 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const text = useMemo(() => {
    if (error) return "Trending Scams: unable to load right now.";
    if (!items.length) return "Trending Scams in India Today: Loading…";
    const top = items.slice(0, 6).map((x) => x.title);
    return `Trending Scams in India Today: ${top.join(" • ")}`;
  }, [items, error]);

  return (
    <div className="border-b border-white/10 bg-black/20">
      <div className="mx-auto max-w-5xl px-4 py-2">
        <div className="truncate text-sm text-saffron">{text}</div>
      </div>
    </div>
  );
}

