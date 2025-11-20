import multer from "multer";
import fs from "fs";

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const fileName = file.originalname
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-\.]/g, "");
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2)}-${fileName}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const allowedVideoTypes = ["video/mp4", "video/mpeg", "video/quicktime", "video/x-msvideo"];

  if (file.mimetype.startsWith("video/")) {
    allowedVideoTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error("Invalid video format"));
  } else if (file.mimetype.startsWith("image/")) {
    allowedImageTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error("Invalid image format"));
  } else {
    cb(new Error("Unsupported file type"));
  }
};

// ✅ FIXED: Create the multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1000 * 1024 * 1024, files: 10000 },
});

// ✅ FIXED: Export the fields configuration to handle both files and text fields
export const multerUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "galleryImages", maxCount: 5 },
  // Text fields that won't be treated as unexpected
  { name: "name", maxCount: 0 },
  { name: "category", maxCount: 0 },
  { name: "company", maxCount: 0 },
  { name: "description", maxCount: 0 },
  { name: "price", maxCount: 0 },
  { name: "stock", maxCount: 0 },
  { name: "sku", maxCount: 0 },
  { name: "attributes", maxCount: 0 },
  { name: "compatibilityRules", maxCount: 0 },
  { name: "keyFeatures", maxCount: 0 },
  { name: "isActive", maxCount: 0 },
  { name: "isEOL", maxCount: 0 },
]);

export const multerUploadVideo = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024, files: 1 },
});