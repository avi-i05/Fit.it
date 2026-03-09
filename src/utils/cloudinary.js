import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ---------------- UPLOAD ---------------- */

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "products"
    });

    // remove local file after upload
    fs.unlinkSync(localFilePath);

    return response;

  } catch (error) {

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    console.error("Cloudinary Upload Error:", error);
    return null;
  }
};

/* ---------------- DELETE ---------------- */

export const deleteFromCloudinary = async (imageUrl) => {
  try {

    if (!imageUrl) return;

    const parts = imageUrl.split("/");

    const fileName = parts[parts.length - 1];

    const publicId = `products/${fileName.split(".")[0]}`;

    await cloudinary.uploader.destroy(publicId);

    console.log("Cloudinary image deleted:", publicId);

  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
  }
};