import { NextRequest, NextResponse } from "next/server";
import { listPublishedGalleryPhotosPaginated } from "@/lib/gallery/gallery-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Number.parseInt(searchParams.get("page") || "1", 10);
    const limit = Number.parseInt(searchParams.get("limit") || "24", 10);
    const search = searchParams.get("search") || undefined;

    const result = await listPublishedGalleryPhotosPaginated({
      page: Number.isFinite(page) ? page : 1,
      limit: Number.isFinite(limit) ? limit : 24,
      search,
    });

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
    console.error("Public Gallery List Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error fetching gallery photos" },
      { status: 500 }
    );
  }
}
