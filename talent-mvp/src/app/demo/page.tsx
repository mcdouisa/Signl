// app/demo/page.tsx
"use client";

import { FormEvent, useEffect, useState } from "react";
import StudentCard, { Student } from "@/components/StudentCard";

export default function DemoPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [major, setMajor] = useState<string>("All");
  const [minGpa, setMinGpa] = useState<string>("3.0");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (major !== "All") params.set("major", major);
      if (minGpa) params.set("minGpa", minGpa);

      const res = await fetch(`/api/admin/students?${params.toString()}`);
      const json = await res.json();
      setStudents(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function applyFilters(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await load();
  }

  return (
    <div className="space-y-6">
      {/* Intro card */}
      <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-50">
          Peer validated talent platform – BYU database demo
        </h1>
        <p className="max-w-2xl text-sm text-slate-300">
          This is a rough, read only demo of what a Gold tier Utah tech company
          would see. Data is seeded for now. In production this would be live
          rankings from BYU survey data and opt in profiles.
        </p>
      </div>

      {/* Filters */}
      <form
        onSubmit={applyFilters}
        className="flex flex-wrap items-end gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm shadow-sm"
      >
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-300">
            Major
          </label>
          <select
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50"
          >
            <option>All</option>
            <option>Marketing</option>
            <option>Computer Science</option>
            <option>Finance</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-300">
            Min GPA
          </label>
          <select
            value={minGpa}
            onChange={(e) => setMinGpa(e.target.value)}
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50"
          >
            <option value="3.0">3.0</option>
            <option value="3.3">3.3</option>
            <option value="3.5">3.5</option>
            <option value="3.7">3.7</option>
          </select>
        </div>

        <button
          type="submit"
          className="rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-sky-400"
        >
          Apply filters
        </button>

        {loading && (
          <div className="text-xs text-slate-400">Loading students...</div>
        )}
      </form>

      {/* Results */}
      <section className="space-y-3">
        <div className="text-sm text-slate-300">
          Showing {students.length} students (most nominated and highly ranked
          BYU talent).
        </div>
        <div className="space-y-3">
          {students.map((s, idx) => (
            <StudentCard key={s.id} rank={idx + 1} student={s} />
          ))}
          {students.length === 0 && !loading && (
            <p className="text-sm text-slate-400">
              No students match the current filters.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}