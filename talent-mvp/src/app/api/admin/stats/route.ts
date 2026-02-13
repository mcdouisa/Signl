// app/api/admin/stats/route.ts
import { NextResponse } from "next/server";
import { getSurveyStats } from "@/lib/db";

export async function GET() {
  const stats = await getSurveyStats();
  return NextResponse.json(stats);
}