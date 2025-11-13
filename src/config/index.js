// Environment configuration
console.log(
  "Environment VITE_API_BASE_URL:",
  import.meta.env.VITE_API_BASE_URL
);

export const config = {
  // API Configuration - All APIs use the same base URL
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || "https://localhost:8080/api", // All APIs under /api
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,

  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || "Nihon Store",
  APP_VERSION: import.meta.env.VITE_APP_VERSION || "1.0.0",

  // Pagination
  DEFAULT_PAGE_SIZE: parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE) || 12,
  MAX_PAGE_SIZE: parseInt(import.meta.env.VITE_MAX_PAGE_SIZE) || 100,

  // Cache
  CACHE_DURATION:
    parseInt(import.meta.env.VITE_CACHE_DURATION) || 5 * 60 * 1000, // 5 minutes

  // Image configuration
  DEFAULT_PRODUCT_IMAGE: "/images/default-product.jpg",
  DEFAULT_BRAND_IMAGE: "/images/default-brand.jpg",
  DEFAULT_CATEGORY_IMAGE: "/images/default-category.jpg",

  // Development
  IS_DEVELOPMENT: import.meta.env.MODE === "development",
  IS_PRODUCTION: import.meta.env.MODE === "production",

  // Feature flags
  ENABLE_WISHLIST: import.meta.env.VITE_ENABLE_WISHLIST !== "false",
  ENABLE_REVIEWS: import.meta.env.VITE_ENABLE_REVIEWS !== "false",
  ENABLE_CART: import.meta.env.VITE_ENABLE_CART !== "false",
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
};

console.log("Final API_BASE_URL:", config.API_BASE_URL);

// Validate required environment variables
const requiredEnvVars = [];

for (const envVar of requiredEnvVars) {
  if (!import.meta.env[envVar]) {
    console.warn(`Missing required environment variable: ${envVar}`);
  }
}

export default config;
