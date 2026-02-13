// src/app/api/opt-in/submit/[token]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  // Next.js 16 types expect params as a Promise for route handlers
  const { token } = await context.params;

  const body = await request.json();
  console.log("Received opt-in payload for token", token, body);

  // Here you would:
  // - Look up nominee by token
  // - Create or update a student record in database
  // - Recalculate scores
  // For now, just return success for demo purposes.
  return NextResponse.json({ ok: true });
}