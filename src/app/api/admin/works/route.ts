import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth/server";
import { createWorkSchema, workQuerySchema } from "@/lib/validations/work";
import { listAdminWorks, createWork } from "@/lib/works/work-service";

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
      category: searchParams.get("category") || undefined,
      featured: searchParams.get("featured") || undefined,
      sort: searchParams.get("sort") || "order_asc",
    };

    const parsed = workQuerySchema.safeParse(rawParams);
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

    const result = await listAdminWorks(parsed.data);

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
    console.error("Admin Work List Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error fetching works" },
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

    const parsed = createWorkSchema.safeParse(body);
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

    const work = await createWork(parsed.data);

    try {
      revalidatePath("/our-works");
      revalidatePath("/admin/works");
    } catch {
      // Ignore revalidate error outside request context
    }

    return NextResponse.json(
      {
        success: true,
        work,
        message: "Work initiative created successfully",
      },
      { status: 201 }
    );
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
    console.error("Admin Create Work Error:", error);
    const message =
      error instanceof Error ? error.message : "Error creating work initiative";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
