import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth/server";
import { updateGalleryPhotoOrder } from "@/lib/gallery/gallery-service";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

const updateOrderSchema = z.object({
  displayOrder: z.coerce.number().int(),
});

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
    const body = await request.json().catch(() => null);

    const parsed = updateOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid displayOrder value" },
        { status: 400 }
      );
    }

    const photo = await updateGalleryPhotoOrder(id, parsed.data.displayOrder);

    try {
      revalidatePath("/gallery");
      revalidatePath("/admin/gallery");
    } catch {
      // Ignore revalidate error outside request context
    }

    return NextResponse.json({
      success: true,
      photo,
      message: "Display order updated successfully",
    });
  } catch (error) {
    console.error("Admin Gallery Order Update Error:", error);
    const message =
      error instanceof Error ? error.message : "Error updating gallery display order";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
