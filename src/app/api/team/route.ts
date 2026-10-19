import { NextRequest, NextResponse } from "next/server";
import { publicTeamQuerySchema } from "@/lib/validations/team";
import { listPublicTeamMembers } from "@/lib/team/team-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const rawParams = {
      featured: searchParams.get("featured") || undefined,
      limit: searchParams.get("limit") || undefined,
    };

    const parsed = publicTeamQuerySchema.safeParse(rawParams);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid query parameters",
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const members = await listPublicTeamMembers({
      featured:
        parsed.data.featured === "true"
          ? true
          : parsed.data.featured === "false"
            ? false
            : undefined,
      limit: parsed.data.limit,
    });

    return NextResponse.json({
      success: true,
      data: members,
    });
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
    console.error("Public Team List Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error fetching team members" },
      { status: 500 }
    );
  }
}
