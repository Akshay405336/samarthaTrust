import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth/server";
import { updateSingleWorkOrder } from "@/lib/works/work-service";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(request: NextRequest, context: RouteParams) {
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
    const displayOrder = Number(body.displayOrder);

    if (isNaN(displayOrder)) {
      return NextResponse.json(
        { success: false, error: "Invalid displayOrder number" },
        { status: 400 }
      );
    }

    const work = await updateSingleWorkOrder(id, Math.floor(displayOrder));

    try {
      revalidatePath("/our-works");
      revalidatePath("/admin/works");
    } catch {
      // Ignored outside Next.js request context
    }

    return NextResponse.json({
      success: true,
      work,
      message: "Display order updated successfully",
    });
  } catch (error) {
    console.error("Admin Update Display Order Error:", error);
    const message =
      error instanceof Error ? error.message : "Error updating display order";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
