import multer from "multer";
import { appError } from "../utils/appError.js";

export const PROFILE_IMAGE_FIELD = "avatar";
export const PROFILE_IMAGE_MAX_BYTES = 2 * 1024 * 1024;

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: PROFILE_IMAGE_MAX_BYTES, files: 1 },
  fileFilter: (req, file, cb) => {
    if (!allowedImageTypes.has(file.mimetype)) return cb(appError("Only JPEG, PNG, and WEBP profile images are allowed", 400));
    return cb(null, true);
  }
});

export function uploadSingleProfileImage(req, res, next) {
  upload.single(PROFILE_IMAGE_FIELD)(req, res, (err) => {
    if (!err) return next();
    if (err.code === "LIMIT_FILE_SIZE") return next(appError("Profile image must be 2MB or smaller", 413));
    if (err.code === "LIMIT_UNEXPECTED_FILE") return next(appError(`Use a single ${PROFILE_IMAGE_FIELD} file`, 400));
    return next(err);
  });
}
