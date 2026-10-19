import { NextRequest, NextResponse } from "next/server";
import { processWebhookEvent } from "@/lib/donations/donation-service";

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { success: false, error: "Missing webhook signature header." },
        { status: 400 }
      );
    }

    // Read the exact raw body string before JSON parsing
    const rawBody = await request.text();

    const result = await processWebhookEvent(rawBody, signature);

    return NextResponse.json(
      {
        success: true,
        ...result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Razorpay Webhook Error:", error);
    const message =
      error instanceof Error ? error.message : "Webhook processing failed.";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 400 }
    );
  }
}
