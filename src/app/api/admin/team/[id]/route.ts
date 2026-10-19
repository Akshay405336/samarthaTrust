import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth/server";
import { updateTeamMemberSchema } from "@/lib/validations/team";
import {
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
} from "@/lib/team/team-service";

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
    const member = await getTeamMemberById(id);

    if (!member) {
      return NextResponse.json(
        { success: false, error: "Team member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      member,
    });
  } catch (error) {
    console.error("Admin Get Team Member Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error fetching team member" },
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

    const parsed = updateTeamMemberSchema.safeParse(body);
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

    const member = await updateTeamMember(id, parsed.data);

    try {
      revalidatePath("/about");
      revalidatePath("/our-trustees");
    } catch {
      // Ignored outside Next.js request context
    }

    return NextResponse.json({
      success: true,
      member,
      message: "Team member updated successfully",
    });
  } catch (error) {
    console.error("Admin Update Team Member Error:", error);
    const message =
      error instanceof Error ? error.message : "Error updating team member";
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
    const deleted = await deleteTeamMember(id);

    try {
      revalidatePath("/about");
      revalidatePath("/our-trustees");
    } catch {
      // Ignored outside Next.js request context
    }

    return NextResponse.json({
      success: true,
      message: "Team member deleted successfully",
    });
  } catch (error) {
    console.error("Admin Delete Team Member Error:", error);
    const message =
      error instanceof Error ? error.message : "Error deleting team member";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
