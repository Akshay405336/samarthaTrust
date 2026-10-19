import { NextRequest, NextResponse } from "next/server";
import { createDonationOrderSchema } from "@/lib/validations/donation";
import { createDonationOrder } from "@/lib/donations/donation-service";

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

    const parsed = createDonationOrderSchema.safeParse(body);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        {
          success: false,
          error: issue?.message || "Invalid donation submission details.",
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const result = await createDonationOrder(parsed.data);

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

    console.error("Donation create order API error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create donation order with payment gateway.";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
