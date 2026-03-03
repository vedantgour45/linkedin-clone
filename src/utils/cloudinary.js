/**
 * Uploads a file to Cloudinary.
 * @param {File} file - The file to upload.
 * @param {string} folder - The folder to store the file in.
 * @returns {Promise<string>} - The secure URL of the uploaded file.
 */
export const uploadToCloudinary = async (file, folder = "linkedin-clone") => {
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

  if (
    !cloudName ||
    !uploadPreset ||
    uploadPreset === "your_upload_preset_here"
  ) {
    throw new Error(
      "Cloudinary setup incomplete. Please check your .env file.",
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error.message || "Failed to upload to Cloudinary",
      );
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};
