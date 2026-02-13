// components/StatCard.tsx
import React from "react";

type Props = {
  label: string;
  value: string | number;
  sublabel?: string;
};

export default function StatCard({ label, value, sublabel }: Props) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-4 shadow-sm">
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-slate-50">{value}</p>
      {sublabel && (
        <p className="mt-1 text-xs leading-relaxed text-slate-400">
          {sublabel}
        </p>
      )}
    </div>
  );
}