import { v2 as cloudinary } from 'cloudinary';
import fs from "fs-extra";
import sharp from 'sharp';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


const upLoadToCloudinary = async (buffer, mimeType) => {
  try {
    // Validate MIME type
    if (!mimeType) {
      throw new Error("Could not determine MIME type.");
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(mimeType)) {
      throw new Error(`Unsupported file type: ${mimeType}`);
    }

    // Compress and convert to WebP in memory
    const compressedBuffer = await sharp(buffer)
      .webp({ quality: 20 })
      .toBuffer();

    // Upload to Cloudinary from buffer
    const result = await cloudinary.uploader.upload_stream({
      folder: "Notes-App-Images",
      resource_type: "image",
      format: "webp"
    }, (error, result) => {
      if (error) throw error;
      return result;
    });

    // We need to wrap the stream in a Promise
    await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({
        folder: "Notes-App-Images",
        resource_type: "image",
        format: "webp"
      }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      stream.end(compressedBuffer);
    });

    // Return the secure_url from the result
    return (await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({
        folder: "Notes-App-Images",
        resource_type: "image",
        format: "webp"
      }, (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }).end(compressedBuffer);
    }));
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};

export default upLoadToCloudinary;