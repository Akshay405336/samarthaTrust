import { NextRequest, NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth/server";
import { getGalleryAdminStats } from "@/lib/gallery/gallery-service";

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    const stats = await getGalleryAdminStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error("Gallery stats error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load gallery statistics" },
      { status: 500 }
    );
  }
}
