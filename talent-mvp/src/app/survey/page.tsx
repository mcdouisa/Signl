// app/survey/page.tsx
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Nominee = {
  fullName: string;
  major: string;
  email: string;
  phone: string;
  linkedin: string;
  reason: string;
};

export default function SurveyPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nominees, setNominees] = useState<Nominee[]>([
    {
      fullName: "",
      major: "",
      email: "",
      phone: "",
      linkedin: "",
      reason: "",
    },
    {
      fullName: "",
      major: "",
      email: "",
      phone: "",
      linkedin: "",
      reason: "",
    },
    {
      fullName: "",
      major: "",
      email: "",
      phone: "",
      linkedin: "",
      reason: "",
    },
  ]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const respondent = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      major: formData.get("major") as string,
      gradYear: formData.get("gradYear") as string,
      consent: formData.get("consent") === "on",
    };

    if (!respondent.email.endsWith("@byu.edu") && !respondent.email.endsWith("@byu.net")) {
      setError("Email must be a BYU email ending in @byu.edu or @byu.net");
      setSubmitting(false);
      return;
    }

    const filteredNominees = nominees.filter((n) => n.fullName.trim().length > 0);
    if (filteredNominees.length < 3 || filteredNominees.length > 5) {
      setError("Please nominate between 3 and 5 peers.");
      setSubmitting(false);
      return;
    }

    for (const n of filteredNominees) {
      const hasContact = n.email || n.phone || n.linkedin;
      if (!hasContact) {
        setError("Each nominee must have at least one contact method.");
        setSubmitting(false);
        return;
      }
      if (n.reason.trim().length < 5 || n.reason.trim().length > 200) {
        setError("Each reason must be between 5 and 200 characters.");
        setSubmitting(false);
        return;
      }
    }

    try {
      const res = await fetch("/api/survey/submit", {
        method: "POST",
        body: JSON.stringify({
          respondent,
          nominees: filteredNominees,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to submit survey");
      }

      router.push("/thank-you?code=XXXX-XXXX-XXXX");
    } catch (err) {
      console.error(err);
      setError("Something went wrong submitting the survey. Please try again.");
      setSubmitting(false);
    }
  }

  function updateNominee(index: number, field: keyof Nominee, value: string) {
    setNominees((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  }

  function addNominee() {
    if (nominees.length >= 5) return;
    setNominees((prev) => [
      ...prev,
      { fullName: "", major: "", email: "", phone: "", linkedin: "", reason: "" },
    ]);
  }

  function removeNominee(index: number) {
    if (nominees.length <= 3) return;
    setNominees((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-6">
      <div className="border border-slate-200 bg-white rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-semibold mb-2">
          Peer Validated Talent Platform - BYU Survey
        </h1>
        <p className="text-sm text-slate-600">
          Get 5 dollars for completing this 5 minute survey. Nominate peers you would most
          want to work with, and earn 10 dollars more for each person who opts in.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="border border-slate-200 bg-white rounded-xl p-6 shadow-sm space-y-8"
      >
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Section 1 - Your information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <input
                name="name"
                required
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                BYU Email
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="yourname@byu.edu"
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Major
              </label>
              <input
                name="major"
                required
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Expected Graduation
              </label>
              <input
                name="gradYear"
                required
                placeholder="May 2025"
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>

          <label className="flex items-start gap-2 text-sm text-slate-700">
            <input type="checkbox" name="consent" required className="mt-1" />
            <span>
              I understand that if I am nominated by peers, you may contact me about job
              opportunities.
            </span>
          </label>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Section 2 - Nominate your peers</h2>
          <p className="text-sm text-slate-600">
            Think about group projects, classes, clubs, or jobs. Who are 3 to 5 BYU students
            you would most want to work with on a difficult project.
          </p>

          <div className="space-y-4">
            {nominees.map((nominee, index) => (
              <div
                key={index}
                className="border border-slate-200 rounded-lg p-4 space-y-3 bg-slate-50"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-sm">Nominee #{index + 1}</h3>
                  {index >= 3 && (
                    <button
                      type="button"
                      onClick={() => removeNominee(index)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Full Name
                    </label>
                    <input
                      required={index < 3}
                      value={nominee.fullName}
                      onChange={(e) =>
                        updateNominee(index, "fullName", e.target.value)
                      }
                      className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Major (optional)
                    </label>
                    <input
                      value={nominee.major}
                      onChange={(e) => updateNominee(index, "major", e.target.value)}
                      className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Email
                    </label>
                    <input
                      value={nominee.email}
                      onChange={(e) => updateNominee(index, "email", e.target.value)}
                      className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Phone
                    </label>
                    <input
                      value={nominee.phone}
                      onChange={(e) => updateNominee(index, "phone", e.target.value)}
                      className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      LinkedIn
                    </label>
                    <input
                      value={nominee.linkedin}
                      onChange={(e) => updateNominee(index, "linkedin", e.target.value)}
                      className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Why would you want to work with them 1 sentence
                  </label>
                  <textarea
                    value={nominee.reason}
                    onChange={(e) => updateNominee(index, "reason", e.target.value)}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>

          {nominees.length < 5 && (
            <button
              type="button"
              onClick={addNominee}
              className="text-sm text-blue-600 hover:underline"
            >
              + Add another nominee
            </button>
          )}

          <label className="flex items-start gap-2 text-sm text-slate-700">
            <input type="checkbox" required className="mt-1" />
            <span>I confirm I know these people or can find their contact info.</span>
          </label>
        </section>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded-md bg-slate-900 text-white text-sm font-medium disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit Survey"}
        </button>
      </form>
    </div>
  );
}