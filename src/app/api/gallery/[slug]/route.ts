import { NextResponse } from "next/server";

/** Legacy album URLs — flat gallery no longer uses slugs. */
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: "Gallery albums have been replaced by a single photo grid. Use GET /api/gallery.",
    },
    { status: 410 }
  );
}
