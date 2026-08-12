import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.js";
import { appError } from "../utils/appError.js";

let configured = false;

export function getCloudinaryClient() {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    throw appError("Cloudinary is not configured", 500);
  }

  if (!configured) {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
      secure: true
    });
    configured = true;
  }

  return cloudinary;
}
