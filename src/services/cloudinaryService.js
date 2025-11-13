import {
  CLOUDINARY_CONFIG,
  CLOUDINARY_BASE_URL,
  IMAGE_TRANSFORMATIONS,
} from "../config/cloudinary.js";

/**
 * Cloudinary Image Upload Service
 */
class CloudinaryService {
  constructor() {
    this.uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloud_name}/image/upload`;
  }

  /**
   * Upload single image to Cloudinary
   * @param {File|string} file - File object or base64 string
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} Upload result with URL
   */
  async uploadImage(file, options = {}) {
    try {
      const formData = new FormData();

      // Add file to form data
      if (file instanceof File) {
        formData.append("file", file);
      } else if (typeof file === "string") {
        // Base64 string
        formData.append("file", file);
      } else {
        throw new Error("Invalid file format");
      }

      // Add upload preset
      formData.append("upload_preset", CLOUDINARY_CONFIG.upload_preset);

      // Add folder if specified
      if (options.folder) {
        formData.append("folder", options.folder);
      }

      // Add tags if specified
      if (options.tags) {
        formData.append(
          "tags",
          Array.isArray(options.tags) ? options.tags.join(",") : options.tags
        );
      }

      // Add public_id if specified
      if (options.public_id) {
        formData.append("public_id", options.public_id);
      }

      console.log("📤 Uploading image to Cloudinary...");

      const response = await fetch(this.uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Cloudinary upload failed: ${
            errorData.error?.message || response.statusText
          }`
        );
      }

      const result = await response.json();

      console.log("✅ Cloudinary upload success:", result.secure_url);

      return {
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
        created_at: result.created_at,
        // Generated thumbnail URLs with transformations
        thumbnails: {
          small: this.getTransformedUrl(
            result.public_id,
            IMAGE_TRANSFORMATIONS.thumbnail
          ),
          medium: this.getTransformedUrl(
            result.public_id,
            IMAGE_TRANSFORMATIONS.medium
          ),
          large: this.getTransformedUrl(
            result.public_id,
            IMAGE_TRANSFORMATIONS.large
          ),
          product_main: this.getTransformedUrl(
            result.public_id,
            IMAGE_TRANSFORMATIONS.product_main
          ),
          product_gallery: this.getTransformedUrl(
            result.public_id,
            IMAGE_TRANSFORMATIONS.product_gallery
          ),
        },
      };
    } catch (error) {
      console.error("❌ Cloudinary upload error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Upload multiple images
   * @param {Array} files - Array of File objects or base64 strings
   * @param {Object} options - Upload options
   * @returns {Promise<Array>} Array of upload results
   */
  async uploadMultipleImages(files, options = {}) {
    try {
      console.log(`📤 Uploading ${files.length} images to Cloudinary...`);

      const uploadPromises = files.map((file, index) => {
        const fileOptions = {
          ...options,
          public_id: options.public_id
            ? `${options.public_id}_${index + 1}`
            : undefined,
        };
        return this.uploadImage(file, fileOptions);
      });

      const results = await Promise.all(uploadPromises);

      const successful = results.filter((result) => result.success);
      const failed = results.filter((result) => !result.success);

      console.log(
        `✅ Uploaded ${successful.length}/${files.length} images successfully`
      );

      if (failed.length > 0) {
        console.warn(`⚠️ ${failed.length} uploads failed:`, failed);
      }

      return {
        success: failed.length === 0,
        results,
        successful,
        failed,
        totalUploaded: successful.length,
        totalFailed: failed.length,
      };
    } catch (error) {
      console.error("❌ Multiple upload error:", error);
      return {
        success: false,
        error: error.message,
        results: [],
        successful: [],
        failed: files.map(() => ({ success: false, error: error.message })),
      };
    }
  }

  /**
   * Get transformed image URL
   * @param {string} publicId - Cloudinary public ID
   * @param {string} transformation - Transformation string
   * @returns {string} Transformed URL
   */
  getTransformedUrl(publicId, transformation) {
    return `${CLOUDINARY_BASE_URL}/image/upload/${transformation}/${publicId}`;
  }

  /**
   * Delete image from Cloudinary
   * @param {string} publicId - Public ID of image to delete
   * @returns {Promise<Object>} Deletion result
   */
  async deleteImage(publicId) {
    try {
      // Note: Deletion requires authentication, usually done on backend
      // For now, just log the deletion request
      console.log("🗑️ Request to delete image:", publicId);

      // This would typically be handled by your backend API
      return {
        success: true,
        message: "Delete request logged (implement backend deletion)",
      };
    } catch (error) {
      console.error("❌ Delete image error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Validate image file
   * @param {File} file - File to validate
   * @returns {Object} Validation result
   */
  validateImage(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (!file) {
      return { valid: false, error: "No file provided" };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed: ${allowedTypes.join(", ")}`,
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`,
      };
    }

    return { valid: true };
  }
}

// Export singleton instance
export const cloudinaryService = new CloudinaryService();
export default cloudinaryService;
