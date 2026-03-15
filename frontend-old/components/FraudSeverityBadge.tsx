export function FraudSeverityBadge({
  severity,
}: {
  severity: "HIGH" | "MEDIUM" | "LOW";
}) {
  const map = {
    HIGH: { label: "High", cls: "bg-red-500/20 text-red-200 border-red-400/30" },
    MEDIUM: { label: "Medium", cls: "bg-yellow-500/20 text-yellow-100 border-yellow-400/30" },
    LOW: { label: "Low", cls: "bg-green-500/20 text-green-100 border-green-400/30" },
  } as const;
  const v = map[severity];
  const dot = severity === "HIGH" ? "🔴" : severity === "MEDIUM" ? "🟡" : "🟢";
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${v.cls}`}>
      <span>{dot}</span>
      <span>{v.label}</span>
    </span>
  );
}

