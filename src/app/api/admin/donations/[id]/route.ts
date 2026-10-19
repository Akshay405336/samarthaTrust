import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/server";
import { getAdminDonationById } from "@/lib/donations/donation-service";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getAdminSession(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Donation identifier is required." },
        { status: 400 }
      );
    }

    const donation = await getAdminDonationById(id);
    if (!donation) {
      return NextResponse.json(
        { success: false, error: "Donation record not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: donation.id,
          referenceId: donation.referenceId,
          amountInRupees: donation.amount / 100,
          currency: donation.currency,
          frequency: donation.frequency,
          status: donation.status,
          causeId: donation.causeId,
          causeTitle: donation.causeTitle,
          donorName: donation.donorName,
          donorEmail: donation.donorEmail,
          donorPhone: donation.donorPhone,
          panNumber: donation.panNumber,
          isAnonymous: donation.isAnonymous,
          consentUpdates: donation.consentUpdates,
          addressLine1: donation.addressLine1,
          addressLine2: donation.addressLine2,
          city: donation.city,
          state: donation.state,
          pincode: donation.pincode,
          country: donation.country,
          message: donation.message,
          razorpayOrderId: donation.razorpayOrderId,
          razorpayPaymentId: donation.razorpayPaymentId,
          paymentMethod: donation.paymentMethod,
          capturedAt: donation.capturedAt
            ? donation.capturedAt.toISOString()
            : null,
          failedAt: donation.failedAt ? donation.failedAt.toISOString() : null,
          createdAt: donation.createdAt.toISOString(),
          updatedAt: donation.updatedAt.toISOString(),
        },
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

    console.error("Admin Donation Detail Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error fetching donation details.",
      },
      { status: 500 }
    );
  }
}
