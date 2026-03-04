import cloudinary from "../config/cloudinary.js";

// Uploads a file buffer to a specific Cloudinary folder
export const uploadToCloudinary = async (file, folderName) => {
  if (!file) return null;
  
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        folder: folderName,
        resource_type: "auto" // Accepts both images and PDFs
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(file.buffer);
  });
};

// Helper to extract the public_id from a secure_url
const extractPublicId = (url) => {
  const splitUrl = url.split("/");
  // Gets the folder and filename (e.g., "event-images/abcd123")
  const folderAndFile = splitUrl.slice(-2).join("/"); 
  return folderAndFile.split(".")[0]; // Removes the file extension
};

// Deletes a file from Cloudinary using its secure_url
export const deleteFromCloudinary = async (url) => {
  if (!url) return;
  try {
    const publicId = extractPublicId(url);
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting from cloudinary:", error);
  }
};