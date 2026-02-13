// components/StudentCard.tsx
import React from "react";

export type Student = {
  id: string;
  name: string;
  major: string;
  gpa: number;
  grad: string;
  nominations: number;
  peer_score: number;
  gpa_score: number;
  experience_score: number;
  total_score: number;
  tier: "Gold" | "Silver" | "Bronze" | "None";
  linkedin_url?: string;
};

type Props = {
  rank: number;
  student: Student;
};

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const tierStyles: Record<
  Student["tier"],
  { card: string; chip: string; chipText: string }
> = {
  Gold: {
    card: "border-amber-300/40 bg-amber-50/5",
    chip: "bg-amber-400/15 border-amber-300/60",
    chipText: "text-amber-200",
  },
  Silver: {
    card: "border-slate-300/40 bg-slate-50/5",
    chip: "bg-slate-300/15 border-slate-200/60",
    chipText: "text-slate-100",
  },
  Bronze: {
    card: "border-orange-300/40 bg-orange-50/5",
    chip: "bg-orange-400/15 border-orange-300/60",
    chipText: "text-orange-100",
  },
  None: {
    card: "border-slate-800 bg-slate-900/70",
    chip: "bg-slate-800 border-slate-700",
    chipText: "text-slate-200",
  },
};

export default function StudentCard({ rank, student }: Props) {
  const styles = tierStyles[student.tier];

  return (
    <article
      className={classNames(
        "rounded-2xl px-5 py-4 shadow-sm transition hover:shadow-md border",
        styles.card
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>#{rank}</span>
            <span>•</span>
            <span>
              {student.tier !== "None"
                ? `${student.tier} tier`
                : "Untiered candidate"}
            </span>
          </div>
          <h3 className="mt-1 text-lg font-semibold text-slate-50">
            {student.name}{" "}
            <span className="text-xs font-normal text-slate-400">
              ({student.major})
            </span>
          </h3>
          <p className="mt-1 text-xs text-slate-300">
            GPA {student.gpa.toFixed(2)} · Graduation {student.grad}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Overall score
          </p>
          <p className="mt-1 text-2xl font-semibold text-slate-50">
            {student.total_score}
            <span className="text-sm text-slate-400">/100</span>
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-3 text-xs text-slate-200 sm:grid-cols-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">
            Peer validation
          </p>
          <p>Nominations: {student.nominations}</p>
          <p>Peer score: {student.peer_score}/60</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">
            Academic
          </p>
          <p>GPA score: {student.gpa_score}/20</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">
            Experience
          </p>
          <p>Experience score: {student.experience_score}/20</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div
          className={classNames(
            "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium",
            styles.chip
          )}
        >
          <span className={styles.chipText}>BYU candidate</span>
        </div>

        {student.linkedin_url && (
          <a
            href={student.linkedin_url}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-sky-300 hover:text-sky-200"
          >
            View LinkedIn
          </a>
        )}
      </div>
    </article>
  );
}