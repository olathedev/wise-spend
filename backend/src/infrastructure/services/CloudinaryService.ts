import { v2 as cloudinary } from "cloudinary";
import { Logger } from "@shared/utils/logger";

const FOLDER = "wise-spend/receipts";

function ensureConfig(): void {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary credentials required. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env"
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

/**
 * Upload receipt image buffer to Cloudinary. Returns the secure URL.
 */
export async function uploadReceiptImage(
  buffer: Buffer,
  mimeType: string,
  options?: { folder?: string }
): Promise<string> {
  ensureConfig();

  const folder = options?.folder ?? FOLDER;
  const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;

  const uploadTimeoutMs = 60_000; // 60s for slow networks / larger receipts

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: "image",
      overwrite: false,
      timeout: uploadTimeoutMs,
    });
    return result.secure_url;
  } catch (error) {
    Logger.error("Cloudinary upload failed", error);
    throw error;
  }
}
