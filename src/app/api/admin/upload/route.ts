import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/server";
import fs from "fs";
import path from "path";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
]);

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided for upload" },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid file type. Allowed formats: JPG, PNG, WebP, AVIF, GIF, SVG.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "File is too large. Maximum size is 5 MB.",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const folderParam = (formData.get("folder") as string | null) || "blogs";

    let uploadDir: string;
    let publicUrlPrefix: string;

    if (folderParam === "team" || folderParam === "profiles") {
      // Store team profile images inside public/images/profiles/
      uploadDir = path.join(process.cwd(), "public", "images", "profiles");
      publicUrlPrefix = "/images/profiles";
    } else {
      const safeFolder = folderParam.replace(/[^a-z0-9_-]/gi, "") || "blogs";
      uploadDir = path.join(process.cwd(), "public", "uploads", safeFolder);
      publicUrlPrefix = `/uploads/${safeFolder}`;
    }

    // Create target directory if it doesn't exist
    if (!fs.existsSync(/*turbopackIgnore: true*/ uploadDir)) {
      fs.mkdirSync(/*turbopackIgnore: true*/ uploadDir, { recursive: true });
    }

    // Generate safe, collision-resistant filename
    const originalExt = path.extname(file.name) || "";
    const cleanExt = originalExt
      ? originalExt.toLowerCase()
      : MIME_TO_EXT[file.type] || ".jpg";
    const timestamp = Date.now().toString(36);
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const rawBaseName = originalExt
      ? path.basename(file.name, originalExt)
      : file.name;
    const safeBase =
      rawBaseName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "")
        .substring(0, 40) ||
      (folderParam === "team" || folderParam === "profiles"
        ? "profile"
        : "image");

    const fileName = `${safeBase}-${timestamp}-${randomSuffix}${cleanExt}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `${publicUrlPrefix}/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      size: file.size,
      mimeType: file.type,
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.error("Admin File Upload Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload image file." },
      { status: 500 }
    );
  }
}
