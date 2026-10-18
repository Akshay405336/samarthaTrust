import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/server";
import { updateBlogSchema } from "@/lib/validations/blog";
import { getBlogById, updateBlog, deleteBlog } from "@/lib/blogs/blog-service";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, context: RouteParams) {
  try {
    const session = await getAdminSession(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const blog = await getBlogById(id);

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Admin Get Blog Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error fetching blog" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: RouteParams) {
  try {
    const session = await getAdminSession(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request body" },
        { status: 400 }
      );
    }

    const parsed = updateBlogSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const blog = await updateBlog(id, parsed.data);

    return NextResponse.json({
      success: true,
      blog,
      message: "Blog post updated successfully",
    });
  } catch (error) {
    console.error("Admin Update Blog Error:", error);
    const message =
      error instanceof Error ? error.message : "Error updating blog post";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteParams) {
  return PUT(request, context);
}

export async function DELETE(request: NextRequest, context: RouteParams) {
  try {
    const session = await getAdminSession(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    await deleteBlog(id);

    return NextResponse.json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    console.error("Admin Delete Blog Error:", error);
    const message =
      error instanceof Error ? error.message : "Error deleting blog post";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
