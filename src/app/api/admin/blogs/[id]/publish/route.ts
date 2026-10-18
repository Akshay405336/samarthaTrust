import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/server";
import { publishBlog } from "@/lib/blogs/blog-service";

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
    const blog = await publishBlog(id);

    return NextResponse.json({
      success: true,
      blog,
      message: "Blog post published successfully",
    });
  } catch (error) {
    console.error("Admin Publish Blog Error:", error);
    const message =
      error instanceof Error ? error.message : "Error publishing blog post";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
