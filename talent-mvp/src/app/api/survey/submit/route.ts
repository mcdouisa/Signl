// app/api/survey/submit/route.ts
import { NextResponse } from "next/server";
import { saveSurveyResponse } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();
  try {
    await saveSurveyResponse(body);

    // In a real implementation, send verification email here.
    // For MVP, we just return success.
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save survey" }, { status: 500 });
  }
}