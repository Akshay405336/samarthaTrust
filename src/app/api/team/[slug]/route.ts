import { NextRequest, NextResponse } from "next/server";
import { getTeamMemberBySlug } from "@/lib/team/team-service";

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(request: NextRequest, context: RouteParams) {
  try {
    const { slug } = await context.params;
    const member = await getTeamMemberBySlug(slug, true);

    if (!member) {
      return NextResponse.json(
        { success: false, error: "Team member not found or inactive" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: member,
    });
  } catch (error) {
    console.error("Public Team Member Detail Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error fetching team member" },
      { status: 500 }
    );
  }
}
