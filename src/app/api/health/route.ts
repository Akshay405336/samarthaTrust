import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "Samartha Trust API",
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
      version: "0.1.0",
    },
    { status: 200 }
  );
}
