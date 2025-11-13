// src/services/index.js - Main Service Index File
// This file exports all services for easy importing

// Import API client and cart/wishlist services from api.js
import apiClient, { cartService, wishlistService } from "./api.js";

// Import individual services
import { userService } from "./userService.js";
import { productService } from "./productService.js";
import { categoryService } from "./categoryService.js";
import { brandService } from "./brandService.js";
import { orderService } from "./orderService.js";
import { addressService } from "./addressService.js";
import { couponService } from "./couponService.js";
import { shippingService } from "./shippingService.js";
import { analyticsService } from "./analyticsService.js";

// Export individual services for named imports
export {
  userService,
  productService,
  categoryService,
  brandService,
  cartService,
  wishlistService,
  orderService,
  addressService,
  couponService,
  shippingService,
  analyticsService,
  apiClient,
};

// Export default object with all services
export default {
  userService,
  productService,
  categoryService,
  brandService,
  cartService,
  wishlistService,
  orderService,
  addressService,
  couponService,
  shippingService,
  analyticsService,
  apiClient,
};

// Convenience exports for common service combinations
export const authServices = {
  userService,
};

export const ecommerceServices = {
  productService,
  categoryService,
  brandService,
  cartService,
  wishlistService,
  orderService,
  couponService,
};

export const locationServices = {
  addressService,
  shippingService,
};

export const trackingServices = {
  analyticsService,
};
