// app/opt-in/[token]/page.tsx
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  params: { token: string };
};

export default function OptInPage({ params }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch(`/api/opt-in/submit/${params.token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to save profile");
      }

      router.push("/thank-you?code=YYYY-YYYY-YYYY");
    } catch (err) {
      console.error(err);
      setError("Could not save profile. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="border border-slate-200 bg-white rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-semibold mb-2">Create your profile - get 10 dollars</h1>
        <p className="text-sm text-slate-600">
          You were nominated as top BYU talent. This form is a rough MVP version of the full
          opt in flow.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="border border-slate-200 bg-white rounded-xl p-6 shadow-sm space-y-6 text-sm"
      >
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Step 1 - Verify your info</h2>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <input
                name="name"
                required
                className="w-full border border-slate-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full border border-slate-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Phone
              </label>
              <input
                name="phone"
                required
                className="w-full border border-slate-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Major
              </label>
              <input
                name="major"
                required
                className="w-full border border-slate-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Expected Graduation
              </label>
              <input
                name="graduation_date"
                required
                placeholder="May 2025"
                className="w-full border border-slate-300 rounded-md px-3 py-2"
              />
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Step 2 - Academic info</h2>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Current GPA
              </label>
              <input
                name="gpa"
                type="number"
                step="0.01"
                min="0"
                max="4"
                required
                className="w-full border border-slate-300 rounded-md px-3 py-2"
              />
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-700 mb-1">
              Academic honors (check any)
            </div>
            <label className="flex items-center gap-2 mb-1">
              <input type="checkbox" name="honors" value="Dean's List" />
              <span className="text-xs">Dean&apos;s List</span>
            </label>
            <label className="flex items-center gap-2 mb-1">
              <input type="checkbox" name="honors" value="Honors Grad" />
              <span className="text-xs">Graduated with honors</span>
            </label>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Step 3 - Work experience</h2>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              LinkedIn profile (required)
            </label>
            <input
              name="linkedin_url"
              required
              placeholder="https://www.linkedin.com/in/..."
              className="w-full border border-slate-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Internship company
              </label>
              <input
                name="internship_company"
                placeholder="Qualtrics"
                className="w-full border border-slate-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Internship role
              </label>
              <input
                name="internship_role"
                placeholder="Product Marketing Intern"
                className="w-full border border-slate-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Internship dates
              </label>
              <input
                name="internship_dates"
                placeholder="Summer 2024"
                className="w-full border border-slate-300 rounded-md px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Leadership positions (comma separated)
            </label>
            <input
              name="leadership_positions"
              placeholder="Marketing Club VP, TA"
              className="w-full border border-slate-300 rounded-md px-3 py-2"
            />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Step 4 - Job preferences</h2>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Role interests
            </label>
            <input
              name="job_types_interested"
              placeholder="Software Engineering, Product Management"
              className="w-full border border-slate-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Max introductions per month
              </label>
              <select
                name="max_intros_per_month"
                defaultValue="2"
                className="w-full border border-slate-300 rounded-md px-3 py-2"
              >
                <option value="2">1 to 2 companies</option>
                <option value="5">3 to 5 companies</option>
                <option value="999">Open to all</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Preferred company sizes
            </label>
            <input
              name="preferred_company_sizes"
              placeholder="Large tech, startups"
              className="w-full border border-slate-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="space-y-1 text-xs text-slate-700">
            <label className="flex items-start gap-2">
              <input type="checkbox" required className="mt-1" />
              <span>
                I consent to sharing my profile with companies who purchase platform access.
              </span>
            </label>
            <label className="flex items-start gap-2">
              <input type="checkbox" required className="mt-1" />
              <span>
                I understand that companies will request introductions through the platform and
                I can pause my profile later.
              </span>
            </label>
          </div>
        </section>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded-md bg-slate-900 text-white text-sm font-medium disabled:opacity-60"
        >
          {submitting ? "Saving profile..." : "Create profile and get 10 dollars"}
        </button>
      </form>
    </div>
  );
}