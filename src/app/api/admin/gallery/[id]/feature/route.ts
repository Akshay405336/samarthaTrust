import { NextResponse } from "next/server";

/** Legacy endpoint — flat gallery photos no longer support featured albums. */
export async function POST() {
  return NextResponse.json(
    { success: false, error: "Featured gallery albums are no longer supported." },
    { status: 410 }
  );
}
