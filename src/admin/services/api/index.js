// 🏪 ADMIN SERVICES INDEX - Chuẩn hóa exports
export { adminApiClient, apiUtils } from "./AdminApiClient.js";
export { adminAuthService } from "./AdminAuthService.js";
export { adminDashboardService } from "./AdminDashboardService.js";
export { adminProductService } from "./AdminProductService.js";
export { adminUserService } from "./AdminUserService.js";
export { adminOrderService } from "./AdminOrderService.js";
export { adminBrandService } from "./AdminBrandService.js";
export { adminCategoryService } from "./AdminCategoryService.js";

// Import services for re-export
import { adminAuthService } from "./AdminAuthService.js";
import { adminDashboardService } from "./AdminDashboardService.js";
import { adminProductService } from "./AdminProductService.js";
import { adminUserService } from "./AdminUserService.js";
import { adminOrderService } from "./AdminOrderService.js";
import { adminBrandService } from "./AdminBrandService.js";
import { adminCategoryService } from "./AdminCategoryService.js";

// Convenience exports for backward compatibility
export const authService = adminAuthService;
export const dashboardService = adminDashboardService;
export const productService = adminProductService;
export const userService = adminUserService;
export const orderService = adminOrderService;
export const brandService = adminBrandService;
export const categoryService = adminCategoryService;

// Utility functions
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";

  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const getStatusColor = (status) => {
  const colors = {
    Pending: "#f59e0b",
    Confirmed: "#3b82f6",
    Processing: "#06b6d4",
    Shipped: "#8b5cf6",
    Delivered: "#10b981",
    Cancelled: "#ef4444",
    Returned: "#6b7280",
    Refunded: "#eab308",
    Active: "#10b981",
    Inactive: "#6b7280",
    Locked: "#ef4444",
  };
  return colors[status] || "#6b7280";
};
