import { NextRequest, NextResponse } from "next/server";
import { verifyDonationPaymentSchema } from "@/lib/validations/donation";
import { verifyDonationPayment } from "@/lib/donations/donation-service";

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request payload." },
        { status: 400 }
      );
    }

    const parsed = verifyDonationPaymentSchema.safeParse(body);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        {
          success: false,
          error: issue?.message || "Invalid payment verification payload.",
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const result = await verifyDonationPayment(parsed.data);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as { digest: unknown }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_")
    ) {
      throw error;
    }

    console.error("Donation verify payment API error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to verify payment with payment gateway.";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 400 }
    );
  }
}
