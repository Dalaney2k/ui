// Cloudinary Configuration
export const CLOUDINARY_CONFIG = {
  // Bạn cần lấy từ Cloudinary Dashboard
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "your_cloud_name",
  api_key: import.meta.env.VITE_CLOUDINARY_API_KEY || "your_api_key",
  api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET || "your_api_secret",

  // Upload preset (tạo unsigned preset trong Cloudinary Dashboard)
  upload_preset:
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "your_upload_preset",
};

// Cloudinary base URL for transformations
export const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloud_name}`;

// Common image transformations
export const IMAGE_TRANSFORMATIONS = {
  thumbnail: "w_150,h_150,c_fill",
  medium: "w_400,h_400,c_fill",
  large: "w_800,h_800,c_fill",
  product_main: "w_600,h_600,c_fill,q_auto,f_auto",
  product_gallery: "w_300,h_300,c_fill,q_auto,f_auto",
};
