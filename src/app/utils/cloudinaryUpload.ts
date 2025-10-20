import { cloudinary, configureCloudinary } from "../config/cloudinary.config";
import fs from "fs";

export const uploadToCloudinary = async (
  filePath: string,
  folder: string
): Promise<string> => {
  try {
    // Ensure cloudinary is configured before uploading
    configureCloudinary();

    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: "auto",
    });

    // Delete the local file after successful upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return result.secure_url;
  } catch (error) {
    // Clean up the file even if upload fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};