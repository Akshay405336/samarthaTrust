import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/server";
import { adminDonationsQuerySchema } from "@/lib/validations/donation";
import { listAdminDonations } from "@/lib/donations/donation-service";

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    const rawParams = {
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "10",
      search: searchParams.get("search") || undefined,
      status: searchParams.get("status") || "ALL",
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
    };

    const parsed = adminDonationsQuerySchema.safeParse(rawParams);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid query parameters.",
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const result = await listAdminDonations(parsed.data);

    return NextResponse.json(
      {
        success: true,
        ...result,
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

    console.error("Admin Donations List Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error fetching donations." },
      { status: 500 }
    );
  }
}
