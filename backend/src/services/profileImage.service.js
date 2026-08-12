import User from "../modules/auth/auth.model.js";
import { appError } from "../utils/appError.js";
import { deleteProfileImage, uploadProfileImage } from "./cloudinary.service.js";

const JPEG = "image/jpeg";
const PNG = "image/png";
const WEBP = "image/webp";

function toSafeProfileImage(profileImage) {
  return profileImage?.url ? { url: profileImage.url } : null;
}

function isValidImageSignature(file) {
  const buffer = file?.buffer;
  if (!buffer?.length) return false;

  if (file.mimetype === JPEG) {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  if (file.mimetype === PNG) {
    return buffer.length >= 8 &&
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a;
  }

  if (file.mimetype === WEBP) {
    return buffer.length >= 12 &&
      buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
      buffer.subarray(8, 12).toString("ascii") === "WEBP";
  }

  return false;
}

function assertProfileImageFile(file) {
  if (!file) throw appError("Profile image file is required", 400);
  if (!isValidImageSignature(file)) throw appError("Profile image content is invalid", 400);
}

async function safeDeleteOldImage(publicId) {
  if (!publicId) return;
  try {
    await deleteProfileImage(publicId);
  } catch (err) {
    console.error("Profile image cleanup failed");
  }
}

export async function uploadAuthenticatedProfileImage(userId, role, file) {
  assertProfileImageFile(file);
  const user = await User.findOne({ _id: userId, role }).select("profileImage.url +profileImage.publicId");
  if (!user) throw appError("User not found", 404);

  const oldPublicId = user.profileImage?.publicId;
  const uploaded = await uploadProfileImage(file.buffer);

  let updatedUser;
  try {
    updatedUser = await User.findOneAndUpdate(
      { _id: userId, role },
      { profileImage: uploaded },
      { returnDocument: "after", runValidators: true }
    ).select("profileImage");
  } catch (err) {
    await safeDeleteOldImage(uploaded.publicId);
    throw err;
  }

  if (!updatedUser) {
    await safeDeleteOldImage(uploaded.publicId);
    throw appError("User not found", 404);
  }

  await safeDeleteOldImage(oldPublicId);
  return { profileImage: toSafeProfileImage(updatedUser.profileImage) };
}

export async function deleteAuthenticatedProfileImage(userId, role) {
  const user = await User.findOne({ _id: userId, role }).select("profileImage.url +profileImage.publicId");
  if (!user) throw appError("User not found", 404);

  const oldPublicId = user.profileImage?.publicId;
  if (oldPublicId) await deleteProfileImage(oldPublicId);

  await User.findOneAndUpdate(
    { _id: userId, role },
    { $unset: { profileImage: "" } },
    { returnDocument: "after", runValidators: true }
  );

  return { profileImage: null };
}
