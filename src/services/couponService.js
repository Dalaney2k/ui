// src/services/couponService.js
import apiClient from "./api";

export const couponService = {
  // Validate mã giảm giá
  validate: async (code, items) => {
    try {
      const response = await apiClient.post("/coupon/validate", {
        code,
        items,
      });
      return response;
    } catch (error) {
      console.error("Validate coupon error:", error);
      throw error;
    }
  },

  // Áp dụng mã giảm giá
  apply: async (code) => {
    try {
      const response = await apiClient.post("/coupon/apply", { code });
      return response;
    } catch (error) {
      console.error("Apply coupon error:", error);
      throw error;
    }
  },

  // Lấy danh sách mã giảm giá khả dụng
  getAvailableCoupons: async () => {
    try {
      const response = await apiClient.get("/coupon/available");
      return response;
    } catch (error) {
      console.error("Get available coupons error:", error);
      throw error;
    }
  },

  // Hủy áp dụng mã giảm giá
  remove: async (code) => {
    try {
      const response = await apiClient.delete(`/coupon/apply/${code}`);
      return response;
    } catch (error) {
      console.error("Remove coupon error:", error);
      throw error;
    }
  },
};
