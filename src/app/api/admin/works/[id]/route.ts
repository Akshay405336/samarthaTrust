import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth/server";
import { updateWorkSchema } from "@/lib/validations/work";
import { getWorkById, updateWork, deleteWork } from "@/lib/works/work-service";

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
    const work = await getWorkById(id);

    if (!work) {
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
    console.error("Admin Get Work Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error fetching work initiative",
      },
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

    const parsed = updateWorkSchema.safeParse(body);
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

    const work = await updateWork(id, parsed.data);

    try {
      revalidatePath("/our-works");
      revalidatePath("/admin/works");
    } catch {
      // Ignore revalidate error outside request context
    }

    return NextResponse.json({
      success: true,
      work,
      message: "Work initiative updated successfully",
    });
  } catch (error) {
    console.error("Admin Update Work Error:", error);
    const message =
      error instanceof Error ? error.message : "Error updating work initiative";
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
    await deleteWork(id);

    try {
      revalidatePath("/our-works");
      revalidatePath("/admin/works");
    } catch {
      // Ignore revalidate error outside request context
    }

    return NextResponse.json({
      success: true,
      message: "Work initiative deleted successfully",
    });
  } catch (error) {
    console.error("Admin Delete Work Error:", error);
    const message =
      error instanceof Error ? error.message : "Error deleting work initiative";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
