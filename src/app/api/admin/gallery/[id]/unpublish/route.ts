import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth/server";
import { unpublishGalleryPhoto } from "@/lib/gallery/gallery-service";

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
    const photo = await unpublishGalleryPhoto(id);

    try {
      revalidatePath("/gallery");
      revalidatePath("/admin/gallery");
    } catch {
      // Ignore revalidate error outside request context
    }

    return NextResponse.json({
      success: true,
      photo,
      message: "Gallery photo unpublished successfully",
    });
  } catch (error) {
    console.error("Admin Unpublish Gallery Error:", error);
    const message =
      error instanceof Error ? error.message : "Error unpublishing gallery entry";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
