import { NextRequest, NextResponse } from "next/server";
import { getDonationStatus } from "@/lib/donations/donation-service";

interface RouteParams {
  params: Promise<{
    donationId: string;
  }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { donationId } = await params;

    if (!donationId || donationId.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Donation reference is required." },
        { status: 400 }
      );
    }

    const donation = await getDonationStatus(donationId.trim());

    if (!donation) {
      return NextResponse.json(
        { success: false, error: "Donation record not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: donation,
      },
      { status: 200 }
    );
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

    console.error("Donation status API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error fetching donation status.",
      },
      { status: 500 }
    );
  }
}
