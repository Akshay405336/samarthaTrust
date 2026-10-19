import { NextRequest, NextResponse } from "next/server";
import { getWorkBySlug } from "@/lib/works/work-service";
import { WorkStatus } from "@prisma/client";

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(request: NextRequest, context: RouteParams) {
  try {
    const { slug } = await context.params;
    const work = await getWorkBySlug(slug);

    if (!work || work.status !== WorkStatus.PUBLISHED) {
      return NextResponse.json(
        { success: false, error: "Work initiative not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      work,
    });
  } catch (error) {
    console.error("Public Get Work Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error fetching work initiative",
      },
      { status: 500 }
    );
  }
}
