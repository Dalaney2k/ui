// src/services/brandService.js
import apiClient from "./api";

export const brandService = {
  // Get all brands
  getBrands: async (params = {}) => {
    try {
      console.log("🔍 brandService.getBrands: Calling API...");
      const response = await apiClient.get("/brand", {
        includeProductCount: params.includeProductCount || false,
        ...params,
      });
      console.log("✅ brandService.getBrands: Got response:", response);

      return {
        brands: response.data || [],
        success: response.success,
        message: response.message,
      };
    } catch (error) {
      console.error("❌ brandService.getBrands: Error:", error);
      throw error;
    }
  },

  // Get brand by slug
  getBrandBySlug: async (slug) => {
    try {
      const response = await apiClient.get(`/brand/${slug}`);

      return {
        brand: response.data || null,
        success: response.success,
        message: response.message,
      };
    } catch (error) {
      console.error(
        `❌ brandService.getBrandBySlug: Error fetching brand ${slug}:`,
        error
      );
      throw error;
    }
  },

  // Get brand by ID
  getBrandById: async (id) => {
    try {
      const response = await apiClient.get(`/brand/${id}`);

      return {
        brand: response.data || null,
        success: response.success,
        message: response.message,
      };
    } catch (error) {
      console.error(
        `❌ brandService.getBrandById: Error fetching brand ${id}:`,
        error
      );
      throw error;
    }
  },
};
