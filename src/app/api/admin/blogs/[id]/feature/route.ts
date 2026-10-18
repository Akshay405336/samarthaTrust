import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/server";
import { toggleFeatureBlog } from "@/lib/blogs/blog-service";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(request: NextRequest, context: RouteParams) {
  try {
    const session = await getAdminSession(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));
    const isFeatured =
      typeof body.isFeatured === "boolean" ? body.isFeatured : undefined;

    const blog = await toggleFeatureBlog(id, isFeatured);

    return NextResponse.json({
      success: true,
      blog,
      message: blog.isFeatured
        ? "Blog post featured on home and blog pages"
        : "Blog post unfeatured",
    });
  } catch (error) {
    console.error("Admin Feature Blog Error:", error);
    const message =
      error instanceof Error ? error.message : "Error updating featured status";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
