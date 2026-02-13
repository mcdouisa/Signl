// app/api/admin/students/route.ts
import { NextResponse } from "next/server";
import { getRankedStudents } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const major = url.searchParams.get("major") || undefined;
  const minGpaParam = url.searchParams.get("minGpa");
  const minGpa = minGpaParam ? parseFloat(minGpaParam) : undefined;

  const students = await getRankedStudents({ major, minGpa });
  return NextResponse.json(students);
}