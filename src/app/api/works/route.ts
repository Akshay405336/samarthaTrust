import { NextRequest, NextResponse } from "next/server";
import { publicWorkQuerySchema } from "@/lib/validations/work";
import {
  listPublishedWorks,
  getWorkCategories,
} from "@/lib/works/work-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // If query requests categories list
    if (searchParams.get("view") === "categories") {
      const categories = await getWorkCategories();
      return NextResponse.json({ success: true, categories });
    }

    const rawParams = {
      category: searchParams.get("category") || undefined,
      featured: searchParams.get("featured") || undefined,
      limit: searchParams.get("limit") || undefined,
    };

    const parsed = publicWorkQuerySchema.safeParse(rawParams);
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

    const works = await listPublishedWorks(parsed.data);

    return NextResponse.json({
      success: true,
      data: works,
      count: works.length,
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
    console.error("Public Works List Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error fetching works" },
      { status: 500 }
    );
  }
}
