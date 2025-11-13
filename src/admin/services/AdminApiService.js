// 🏪 ADMIN API SERVICE - File chính chuẩn hóa (thay thế adminApi.js cũ)
// This file replaces the old adminApi.js with a standardized structure

// Import all standardized services
import {
  adminApiClient,
  apiUtils,
  adminAuthService,
  adminDashboardService,
  adminProductService,
  adminUserService,
  adminOrderService,
  adminBrandService,
  adminCategoryService,
  formatCurrency,
  formatDate,
  getStatusColor,
} from "./api/index.js";

// Export standardized services with consistent naming
export {
  adminApiClient,
  apiUtils,
  adminAuthService,
  adminDashboardService,
  adminProductService,
  adminUserService,
  adminOrderService,
  adminBrandService,
  adminCategoryService,
  formatCurrency,
  formatDate,
  getStatusColor,
};

// Note: Legacy services from adminApi.js replaced with new standardized services

// Legacy exports - maintain exact same interface as before
export const authService = adminAuthService;
export const dashboardService = adminDashboardService;
export const productService = adminProductService;
export const userService = adminUserService;
export const orderService = adminOrderService;
// Use new standardized services instead of legacy ones
export const brandService = adminBrandService;
export const categoryService = adminCategoryService;

// Default export for components that use default import
export default {
  authService: adminAuthService,
  dashboardService: adminDashboardService,
  productService: adminProductService,
  userService: adminUserService,
  orderService: adminOrderService,
  formatCurrency,
  formatDate,
  getStatusColor,
};
