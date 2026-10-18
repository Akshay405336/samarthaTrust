import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth/server";
import { toggleTeamMemberActive } from "@/lib/team/team-service";

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
    const isActive =
      typeof body.isActive === "boolean" ? body.isActive : undefined;

    const member = await toggleTeamMemberActive(id, isActive);

    try {
      revalidatePath("/about");
      revalidatePath("/our-trustees");
      revalidatePath("/team");
      revalidatePath(`/team/${member.slug}`);
    } catch {
      // Ignored outside Next.js request context
    }

    return NextResponse.json({
      success: true,
      member,
      message: `Team member ${member.isActive ? "activated" : "deactivated"} successfully`,
    });
  } catch (error) {
    console.error("Admin Toggle Team Member Active Error:", error);
    const message =
      error instanceof Error ? error.message : "Error updating member status";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
