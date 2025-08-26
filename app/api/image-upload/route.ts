import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createOrGetUser } from "@/lib/createOrGetUser";
import { prisma } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";



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

  let user = await prisma.user.findUnique({
    where : {
      clerkId: userId
    }
  })

  if(!user) {
    user = await prisma.user.create({
      data: {
        clerkId: userId,
      }
    })
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }

    // ✅ Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ✅ Upload to Cloudinary
    const result: CloudinaryUploadResult = await new Promise(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "next-cloudinary-uploads",
            resource_type: "image", // can be auto for video too
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

    const savedImage = await prisma.image.create({
          data: {
            userId: user.id,
            publicId: result.public_id,
            originalUrl: result.secure_url,
          }
        })

    return NextResponse.json(
      { publicId: result.public_id, url: result.secure_url },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
