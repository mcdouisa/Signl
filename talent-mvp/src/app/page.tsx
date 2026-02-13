// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="space-y-5">
        <span className="inline-flex items-center rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-300">
          BYU pilot MVP
        </span>

        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">
          Peer validated BYU talent rankings companies can trust.
        </h1>

        <p className="max-w-2xl text-sm text-slate-300 md:text-base">
          This rough MVP demo collects peer nominations, lets top students
          opt in, and shows a ranked BYU talent database that Utah tech
          companies can browse.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/survey"
            className="inline-flex items-center rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 shadow-sm hover:bg-sky-400"
          >
            Go to student survey
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-800"
          >
            View company demo
          </Link>
          <Link
            href="/admin"
            className="inline-flex items-center rounded-full border border-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-900"
          >
            Admin dashboard
          </Link>
        </div>
      </section>

      {/* Flows */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm">
          <h2 className="mb-2 text-sm font-semibold text-slate-50">
            Student flow
          </h2>
          <ul className="space-y-1 text-sm text-slate-300">
            <li>Survey at /survey with peer nominations.</li>
            <li>Fake verification flow and thank you page.</li>
            <li>Top nominees opt in via /opt-in/token.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm">
          <h2 className="mb-2 text-sm font-semibold text-slate-50">
            Admin flow
          </h2>
          <ul className="space-y-1 text-sm text-slate-300">
            <li>Simple password gate at /admin.</li>
            <li>Seeded stats, rankings, and incentive costs.</li>
            <li>Calculate scores button is mocked.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm">
          <h2 className="mb-2 text-sm font-semibold text-slate-50">
            Company demo
          </h2>
          <ul className="space-y-1 text-sm text-slate-300">
            <li>Read only BYU database at /demo.</li>
            <li>Sample top students with peer, GPA, and experience scores.</li>
            <li>Filters for major and minimum GPA.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}