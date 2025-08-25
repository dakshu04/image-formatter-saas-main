// /api/bg-remover/route.ts
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  [key: string]: unknown;
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ✅ Upload original image only (no effects here)
    const result: CloudinaryUploadResult = await new Promise(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "bg-uploads",
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else if (result) {
              resolve(result as CloudinaryUploadResult);
            } else {
              reject(new Error("Upload result is null"));
            }
          }
        );

        uploadStream.end(buffer);
      }
    );

    // ✅ Construct transformation URL with only ONE background removal effect
    const bgRemovedUrl = cloudinary.url(result.public_id, {
       transformation: [
        { effect: "background_removal" }, 
        { fetch_format: "png" }
      ]
    });

    return NextResponse.json(
      {
        publicId: result.public_id,
        originalUrl: result.secure_url,
        bgRemovedUrl, // background removed version
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
