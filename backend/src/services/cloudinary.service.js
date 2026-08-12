import { getCloudinaryClient } from "../config/cloudinary.js";
import { appError } from "../utils/appError.js";

const PROFILE_IMAGE_FOLDER = "bootcamp-lms/profiles";

export async function uploadProfileImage(buffer) {
  const cloudinary = getCloudinaryClient();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: PROFILE_IMAGE_FOLDER,
        resource_type: "image",
        transformation: [
          { width: 512, height: 512, crop: "fill" },
          { quality: "auto", fetch_format: "auto" }
        ]
      },
      (err, result) => {
        if (err || !result?.secure_url || !result?.public_id) {
          return reject(appError("Profile image upload failed", 500));
        }
        return resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );

    stream.end(buffer);
  });
}

export async function deleteProfileImage(publicId) {
  if (!publicId) return;
  const cloudinary = getCloudinaryClient();
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image", invalidate: true });
  } catch (err) {
    throw appError("Profile image delete failed", 500);
  }
}
