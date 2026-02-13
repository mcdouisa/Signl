// app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";

type SurveyStats = {
  totalResponses: number;
  goal: number;
  percent: number;
  verifiedEmails: number;
  totalNominations: number;
  uniqueNominees: number;
  surveyCost: number;
  referralBonuses: number;
  totalCost: number;
  recent: {
    id: string;
    respondent_name: string;
    respondent_email: string;
    respondent_major: string;
    respondent_grad_year: string;
    nominations_count: number;
    created_at: string;
  }[];
};

type Student = import("@/components/StudentCard").Student;

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [stats, setStats] = useState<SurveyStats | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      const [statsRes, studentsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/students"),
      ]);
      const statsJson = await statsRes.json();
      const studentsJson = await studentsRes.json();
      setStats(statsJson);
      setStudents(studentsJson);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authed) {
      loadData();
    }
  }, [authed]);

  function handleLogin() {
    if (password === "admin123") {
      setAuthed(true);
    } else {
      alert("Incorrect admin password. Use admin123 for the MVP demo.");
    }
  }

  if (!authed) {
    return (
      <div className="max-w-sm mx-auto border border-slate-700 bg-slate-800 rounded-xl p-6 shadow-sm space-y-4">
        <h1 className="text-xl font-semibold text-slate-50">
          Signl admin login
        </h1>
        <p className="text-sm text-slate-300">
          For the rough MVP demo, admin access is protected by a simple client
          side password. Use{" "}
          <span className="font-mono text-xs text-slate-100">admin123</span>.
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-slate-500 rounded-md px-3 py-2 text-sm bg-slate-900 text-slate-50"
        />
        <button
          onClick={handleLogin}
          className="w-full px-4 py-2 rounded-md bg-slate-50 text-slate-900 text-sm font-medium"
        >
          Enter dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-50">
        Signl admin dashboard - BYU pilot MVP
      </h1>

      {loading && (
        <p className="text-sm text-slate-300">Loading data...</p>
      )}

      {stats && (
        <>
          <section className="grid md:grid-cols-4 gap-4">
            <StatCard
              label="Total responses"
              value={`${stats.totalResponses} / ${stats.goal}`}
              sublabel={`${stats.percent} percent of goal`}
            />
            <StatCard
              label="Verified emails"
              value={stats.verifiedEmails}
              sublabel="Rough estimate"
            />
            <StatCard
              label="Total nominations"
              value={stats.totalNominations}
              sublabel={`Unique nominees (approx) ${stats.uniqueNominees}`}
            />
            <StatCard
              label="Incentive costs"
              value={`$${stats.totalCost}`}
              sublabel={`Completions $${stats.surveyCost}, referrals $${stats.referralBonuses}`}
            />
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-50">
              Recent survey responses
            </h2>
            <div className="border border-slate-700 rounded-xl bg-slate-800 overflow-hidden">
              <table className="min-w-full text-xs">
                <thead className="bg-slate-900 border-b border-slate-700">
                  <tr className="text-left text-slate-300">
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">Major</th>
                    <th className="px-3 py-2">Grad</th>
                    <th className="px-3 py-2">Nominations</th>
                    <th className="px-3 py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent.map((r) => (
                    <tr key={r.id} className="border-t border-slate-700">
                      <td className="px-3 py-2 text-slate-50">
                        {r.respondent_name}
                      </td>
                      <td className="px-3 py-2 text-slate-200">
                        {r.respondent_email}
                      </td>
                      <td className="px-3 py-2 text-slate-200">
                        {r.respondent_major}
                      </td>
                      <td className="px-3 py-2 text-slate-200">
                        {r.respondent_grad_year}
                      </td>
                      <td className="px-3 py-2 text-slate-200">
                        {r.nominations_count}
                      </td>
                      <td className="px-3 py-2 text-slate-400">
                        {new Date(r.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {stats.recent.length === 0 && (
                    <tr>
                      <td
                        className="px-3 py-4 text-center text-slate-400"
                        colSpan={6}
                      >
                        No responses yet. Use the survey form to seed some data.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {students.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-50">
            Opted in students and rankings
          </h2>
          <p className="text-xs text-slate-300">
            This list is seeded with a few example BYU students for demo. In a
            full build, this would be calculated from live survey and opt in
            data.
          </p>
          <div className="space-y-3">
            {students.map((s, idx) => (
              <div
                key={s.id}
                className="border border-slate-700 bg-slate-800 rounded-xl p-4 shadow-sm"
              >
                <div className="flex justify-between gap-3">
                  <div>
                    <div className="text-xs text-slate-400">
                      Rank {idx + 1} • {s.tier} tier
                    </div>
                    <div className="text-sm font-semibold text-slate-50">
                      {s.name}{" "}
                      <span className="text-xs text-slate-400">
                        ({s.major})
                      </span>
                    </div>
                    <div className="text-xs text-slate-300">
                      Nominations {s.nominations}, GPA {s.gpa.toFixed(2)}, grad{" "}
                      {s.grad}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Total score</div>
                    <div className="text-xl font-semibold text-slate-50">
                      {s.total_score}/100
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-300 grid md:grid-cols-3 gap-2">
                  <div>Peer score {s.peer_score}/60</div>
                  <div>GPA score {s.gpa_score}/20</div>
                  <div>Experience score {s.experience_score}/20</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}