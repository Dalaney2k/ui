// src/services/categoryService.js
import apiClient from "./api";

export const categoryService = {
  // Get all categories
  getCategories: async (params = {}) => {
    try {
      console.log("🔍 categoryService.getCategories: Calling API...");
      const response = await apiClient.get("/category", {
        includeProductCount: params.includeProductCount || false,
        parentOnly: params.parentOnly || false,
        ...params,
      });
      console.log("✅ categoryService.getCategories: Got response:", response);

      return {
        categories: response.data || [],
        success: response.success,
        message: response.message,
      };
    } catch (error) {
      console.error("❌ categoryService.getCategories: Error:", error);
      throw error;
    }
  },

  // Get category by slug
  getCategoryBySlug: async (slug) => {
    try {
      console.log(
        `🔍 categoryService.getCategoryBySlug: Fetching category ${slug}`
      );
      const response = await apiClient.get(`/category/${slug}`);
      console.log(
        "✅ categoryService.getCategoryBySlug: Got response:",
        response
      );

      return {
        category: response.data || null,
        success: response.success,
        message: response.message,
      };
    } catch (error) {
      console.error(
        `❌ categoryService.getCategoryBySlug: Error fetching category ${slug}:`,
        error
      );
      throw error;
    }
  },

  // Get category by ID
  getCategoryById: async (id) => {
    try {
      const response = await apiClient.get(`/category/${id}`);

      return {
        category: response.data || null,
        success: response.success,
        message: response.message,
      };
    } catch (error) {
      console.error(
        `❌ categoryService.getCategoryById: Error fetching category ${id}:`,
        error
      );
      throw error;
    }
  },
};
