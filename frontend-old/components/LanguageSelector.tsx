"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LANGUAGES, STORAGE_KEYS } from "@/lib/languages";

export function LanguageSelector() {
  const router = useRouter();
  const [selected, setSelected] = useState<string>(() => {
    if (typeof window === "undefined") return "en";
    return localStorage.getItem(STORAGE_KEYS.languageCode) || "en";
  });

  const selectedLabel = useMemo(
    () => LANGUAGES.find((l) => l.code === selected)?.label || "English",
    [selected]
  );

  function choose(code: string) {
    setSelected(code);
    const label = LANGUAGES.find((l) => l.code === code)?.label || code;
    localStorage.setItem(STORAGE_KEYS.languageCode, code);
    localStorage.setItem(STORAGE_KEYS.languageLabel, label);
    router.push("/chat");
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3">
        <div className="text-sm text-white/70">Choose your language</div>
        <div className="text-lg font-semibold text-white">{selectedLabel}</div>
      </div>
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map((l) => {
          const active = l.code === selected;
          return (
            <button
              key={l.code}
              onClick={() => choose(l.code)}
              className={[
                "rounded-full px-3 py-2 text-sm transition",
                active
                  ? "bg-saffron text-navy"
                  : "bg-white/10 text-white hover:bg-white/15",
              ].join(" ")}
            >
              {l.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

