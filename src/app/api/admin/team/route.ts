import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth/server";
import {
  createTeamMemberSchema,
  teamQuerySchema,
} from "@/lib/validations/team";
import {
  listAdminTeamMembers,
  createTeamMember,
} from "@/lib/team/team-service";

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    const rawParams = {
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "10",
      search: searchParams.get("search") || undefined,
      status: searchParams.get("status") || "ALL",
      featured: searchParams.get("featured") || "ALL",
      sort: searchParams.get("sort") || "order_asc",
    };

    const parsed = teamQuerySchema.safeParse(rawParams);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid query parameters",
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const result = await listAdminTeamMembers(parsed.data);

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as { digest: unknown }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_")
    ) {
      throw error;
    }
    console.error("Admin Team List Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error fetching team members" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request body" },
        { status: 400 }
      );
    }

    const parsed = createTeamMemberSchema.safeParse(body);
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

    const member = await createTeamMember(parsed.data);

    try {
      revalidatePath("/about");
      revalidatePath("/our-trustees");
    } catch {
      // Ignored when outside Next.js request context (e.g. unit tests)
    }

    return NextResponse.json(
      {
        success: true,
        member,
        message: "Team member created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin Create Team Member Error:", error);
    const message =
      error instanceof Error ? error.message : "Error creating team member";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
