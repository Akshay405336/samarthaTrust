import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth/server";
import { toggleFeaturedWork } from "@/lib/works/work-service";

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
    const work = await toggleFeaturedWork(id);

    try {
      revalidatePath("/our-works");
      revalidatePath("/admin/works");
    } catch {
      // Ignore revalidate error outside request context
    }

    return NextResponse.json({
      success: true,
      work,
      message: `Work initiative ${work.isFeatured ? "marked as featured" : "removed from featured"}`,
    });
  } catch (error) {
    console.error("Admin Feature Work Error:", error);
    const message =
      error instanceof Error ? error.message : "Error toggling featured work";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
