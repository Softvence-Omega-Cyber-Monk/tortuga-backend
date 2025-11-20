import multer from "multer";
import fs from "fs";

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const fileName = file.originalname
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-\.]/g, "");
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2)}-${fileName}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (_req: any, file: any, cb: any) => {
  const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const allowedVideoTypes = ["video/mp4", "video/mpeg", "video/quicktime", "video/x-msvideo"];

  if (file.mimetype.startsWith("video/")) {
    return allowedVideoTypes.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Invalid video format"));
  }

  if (file.mimetype.startsWith("image/")) {
    return allowedImageTypes.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Invalid image format"));
  }

  cb(new Error("Unsupported file type"));
};

// ✅ Good: Only FILE fields here
export const multerUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1000 * 1024 * 1024, files: 10000 },
}).fields([
  { name: "image", maxCount: 1 },
  { name: "galleryImages", maxCount: 5 },
]);