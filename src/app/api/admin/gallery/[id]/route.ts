import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth/server";
import { updateGalleryPhotoSchema } from "@/lib/validations/gallery";
import {
  getGalleryPhotoById,
  updateGalleryPhoto,
  deleteGalleryPhoto,
} from "@/lib/gallery/gallery-service";

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
    const photo = await getGalleryPhotoById(id);

    if (!photo) {
      return NextResponse.json(
        { success: false, error: "Gallery photo not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      photo,
    });
  } catch (error) {
    console.error("Admin Get Gallery Photo Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error fetching gallery photo",
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

    const parsed = updateGalleryPhotoSchema.safeParse(body);
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

    const photo = await updateGalleryPhoto(id, parsed.data);

    try {
      revalidatePath("/gallery");
      revalidatePath("/admin/gallery");
    } catch {
      // Ignore revalidate error outside request context
    }

    return NextResponse.json({
      success: true,
      photo,
      message: "Gallery photo updated successfully",
    });
  } catch (error) {
    console.error("Admin Update Gallery Photo Error:", error);
    const message =
      error instanceof Error ? error.message : "Error updating gallery photo";
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
    await deleteGalleryPhoto(id);

    try {
      revalidatePath("/gallery");
      revalidatePath("/admin/gallery");
    } catch {
      // Ignore revalidate error outside request context
    }

    return NextResponse.json({
      success: true,
      message: "Gallery photo deleted successfully",
    });
  } catch (error) {
    console.error("Admin Delete Gallery Photo Error:", error);
    const message =
      error instanceof Error ? error.message : "Error deleting gallery photo";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
