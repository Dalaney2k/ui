// 📂 ADMIN CATEGORY SERVICE - Category management for admin
import { adminApiClient, apiUtils } from "./AdminApiClient.js";

/**
 * ✅ ADMIN CATEGORY SERVICE
 * - Category listing and management
 * - Category filtering and search
 */
export const adminCategoryService = {
  /**
   * 📂 Get All Categories
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} Categories list
   */
  async getCategories(filters = {}) {
    try {
      console.log("📂 [CATEGORY] Getting categories with filters:", filters);

      const queryParams = {};

      // Add optional filter parameters
      if (filters.search?.trim()) queryParams.search = filters.search.trim();
      if (filters.isActive !== undefined)
        queryParams.isActive = filters.isActive;
      if (filters.page) queryParams.page = filters.page;
      if (filters.pageSize) queryParams.pageSize = filters.pageSize;

      const response = await adminApiClient.get("/category", queryParams);

      console.log("🔍 [CATEGORY DEBUG] Raw API response:", response);
      console.log(
        "🔍 [CATEGORY DEBUG] Response data structure:",
        response.data
      );

      if (response.success && response.data) {
        // Handle different possible response structures
        const categories = Array.isArray(response.data)
          ? response.data
          : response.data.categories ||
            response.data.items ||
            response.data ||
            [];

        const totalCount =
          response.data.totalCount ||
          response.data.total ||
          categories.length ||
          0;

        console.log("✅ [CATEGORY] Categories retrieved:", {
          count: categories.length,
          totalCount: totalCount,
        });

        return {
          success: true,
          data: {
            categories: categories,
            items: categories,
            totalCount: totalCount,
            pagination: apiUtils.parsePagination(response),
          },
        };
      }

      console.log("❌ [CATEGORY] API returned unsuccessful response");
      return {
        success: false,
        data: { categories: [], items: [], totalCount: 0 },
        error: "Failed to retrieve categories",
      };
    } catch (error) {
      console.error("❌ [CATEGORY] Get categories error:", error);
      return {
        success: false,
        data: { categories: [], items: [], totalCount: 0 },
        error: apiUtils.formatErrorMessage(error),
      };
    }
  },

  /**
   * 🔍 Get Category by ID
   * @param {string|number} categoryId - Category ID
   * @returns {Promise<Object>} Category details
   */
  async getCategoryById(categoryId) {
    try {
      console.log("🔍 [CATEGORY] Getting category by ID:", categoryId);

      const response = await adminApiClient.get(`/category/${categoryId}`);

      if (response.success && response.data) {
        console.log("✅ [CATEGORY] Category retrieved");
        return response.data;
      }

      console.log("❌ [CATEGORY] Category not found");
      return null;
    } catch (error) {
      console.error("❌ [CATEGORY] Get category by ID error:", error);
      return null;
    }
  },

  /**
   * 📂 Get Category Tree (alias for getCategories)
   * @returns {Promise<Array>} Categories tree
   */
  async getCategoryTree() {
    return await this.getCategories();
  },

  /**
   * ➕ Create Category
   * @param {Object} categoryData - Category data
   * @returns {Promise<Object>} Created category
   */
  async createCategory(categoryData) {
    try {
      console.log("➕ [CATEGORY] Creating category:", categoryData);

      const response = await adminApiClient.post("/category", categoryData);

      if (response.success && response.data) {
        console.log("✅ [CATEGORY] Category created");
        return {
          success: true,
          data: response.data,
        };
      }

      return {
        success: false,
        error: "Failed to create category",
      };
    } catch (error) {
      console.error("❌ [CATEGORY] Create category error:", error);
      return {
        success: false,
        error: apiUtils.formatErrorMessage(error),
      };
    }
  },

  /**
   * ✏️ Update Category
   * @param {string|number} categoryId - Category ID
   * @param {Object} categoryData - Updated category data
   * @returns {Promise<Object>} Updated category
   */
  async updateCategory(categoryId, categoryData) {
    try {
      console.log("✏️ [CATEGORY] Updating category:", categoryId, categoryData);

      const response = await adminApiClient.put(
        `/category/${categoryId}`,
        categoryData
      );

      if (response.success && response.data) {
        console.log("✅ [CATEGORY] Category updated");
        return {
          success: true,
          data: response.data,
        };
      }

      return {
        success: false,
        error: "Failed to update category",
      };
    } catch (error) {
      console.error("❌ [CATEGORY] Update category error:", error);
      return {
        success: false,
        error: apiUtils.formatErrorMessage(error),
      };
    }
  },

  /**
   * 🗑️ Delete Category
   * @param {string|number} categoryId - Category ID
   * @returns {Promise<Object>} Delete result
   */
  async deleteCategory(categoryId) {
    try {
      console.log("🗑️ [CATEGORY] Deleting category:", categoryId);

      const response = await adminApiClient.delete(`/category/${categoryId}`);

      if (response.success) {
        console.log("✅ [CATEGORY] Category deleted");
        return {
          success: true,
        };
      }

      return {
        success: false,
        error: "Failed to delete category",
      };
    } catch (error) {
      console.error("❌ [CATEGORY] Delete category error:", error);
      return {
        success: false,
        error: apiUtils.formatErrorMessage(error),
      };
    }
  },
};
