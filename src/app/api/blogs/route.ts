import { NextRequest, NextResponse } from "next/server";
import { blogQuerySchema } from "@/lib/validations/blog";
import {
  listPublishedBlogs,
  getBlogCategories,
} from "@/lib/blogs/blog-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // If query requests categories list
    if (searchParams.get("view") === "categories") {
      const categories = await getBlogCategories();
      return NextResponse.json({ success: true, categories });
    }

    const rawParams = {
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "9",
      search: searchParams.get("search") || undefined,
      category: searchParams.get("category") || undefined,
      tag: searchParams.get("tag") || undefined,
      featured: searchParams.get("featured") || undefined,
      sort: searchParams.get("sort") || "newest",
    };

    const parsed = blogQuerySchema.safeParse(rawParams);
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

    const result = await listPublishedBlogs(parsed.data);

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
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
    console.error("Public Blog List Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error fetching blogs" },
      { status: 500 }
    );
  }
}
