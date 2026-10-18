import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth/server";
import { toggleTeamMemberFeatured } from "@/lib/team/team-service";

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
    const isFeatured =
      typeof body.isFeatured === "boolean" ? body.isFeatured : undefined;

    const member = await toggleTeamMemberFeatured(id, isFeatured);

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
      message: `Team member ${member.isFeatured ? "featured" : "unfeatured"} successfully`,
    });
  } catch (error) {
    console.error("Admin Toggle Team Member Featured Error:", error);
    const message =
      error instanceof Error ? error.message : "Error updating featured status";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
