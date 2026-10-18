import { NextRequest, NextResponse } from "next/server";
import { getBlogBySlug } from "@/lib/blogs/blog-service";

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(_request: NextRequest, context: RouteParams) {
  try {
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Slug is required" },
        { status: 400 }
      );
    }

    // Only published blogs are accessible publicly
    const blog = await getBlogBySlug(slug, true);

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found or not published" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Public Blog Detail Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error fetching blog" },
      { status: 500 }
    );
  }
}
