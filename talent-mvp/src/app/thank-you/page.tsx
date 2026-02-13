// app/thank-you/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Survey Complete - BYU Talent MVP",
};

type Props = {
  searchParams: { code?: string; email?: string };
};

export default function ThankYouPage({ searchParams }: Props) {
  const code = searchParams.code || "XXXX-XXXX-XXXX";
  const email = searchParams.email || "your@byu.edu";

  return (
    <div className="border border-slate-200 bg-white rounded-xl p-6 shadow-sm space-y-4">
      <h1 className="text-2xl font-semibold">Survey complete</h1>
      <p className="text-sm text-slate-600">
        This is a rough MVP, so the gift card code is static for now. You can plug in a real
        gift card system or manual spreadsheet after launch.
      </p>
      <div className="border border-green-200 bg-green-50 rounded-lg p-4 space-y-2">
        <div className="text-green-700 font-medium text-sm">Your 5 dollar gift card code</div>
        <div className="text-lg font-mono tracking-widest">{code}</div>
      </div>
      <div className="space-y-1 text-sm text-slate-700">
        <p>
          Bonus opportunity - for each person you nominated who opts in, you will get an
          additional 10 dollars.
        </p>
        <p>We will email you at {email} when they join.</p>
      </div>
    </div>
  );
}