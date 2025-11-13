// 🏷️ ADMIN BRAND SERVICE - Brand management for admin
import { adminApiClient, apiUtils } from "./AdminApiClient.js";

/**
 * ✅ ADMIN BRAND SERVICE
 * - Brand listing and management
 * - Brand filtering and search
 */
export const adminBrandService = {
  /**
   * 🏷️ Get All Brands
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} Brands list
   */
  async getBrands(filters = {}) {
    try {
      console.log("🏷️ [BRAND] Getting brands with filters:", filters);

      const queryParams = {};

      // Add optional filter parameters
      if (filters.search?.trim()) queryParams.search = filters.search.trim();
      if (filters.isActive !== undefined)
        queryParams.isActive = filters.isActive;
      if (filters.page) queryParams.page = filters.page;
      if (filters.pageSize) queryParams.pageSize = filters.pageSize;

      const response = await adminApiClient.get("/brand", queryParams);

      console.log("🔍 [BRAND DEBUG] Raw API response:", response);
      console.log("🔍 [BRAND DEBUG] Response data structure:", response.data);

      if (response.success && response.data) {
        // Handle different possible response structures
        const brands = Array.isArray(response.data)
          ? response.data
          : response.data.brands || response.data.items || response.data || [];

        const totalCount =
          response.data.totalCount || response.data.total || brands.length || 0;

        console.log("✅ [BRAND] Brands retrieved:", {
          count: brands.length,
          totalCount: totalCount,
        });

        return {
          success: true,
          data: {
            brands: brands,
            items: brands,
            totalCount: totalCount,
            pagination: apiUtils.parsePagination(response),
          },
        };
      }

      console.log("❌ [BRAND] API returned unsuccessful response");
      return {
        success: false,
        data: { brands: [], items: [], totalCount: 0 },
        error: "Failed to retrieve brands",
      };
    } catch (error) {
      console.error("❌ [BRAND] Get brands error:", error);
      return {
        success: false,
        data: { brands: [], items: [], totalCount: 0 },
        error: apiUtils.formatErrorMessage(error),
      };
    }
  },

  /**
   * 🔍 Get Brand by ID
   * @param {string|number} brandId - Brand ID
   * @returns {Promise<Object>} Brand details
   */
  async getBrandById(brandId) {
    try {
      console.log("🔍 [BRAND] Getting brand by ID:", brandId);

      const response = await adminApiClient.get(`/brand/${brandId}`);

      if (response.success && response.data) {
        console.log("✅ [BRAND] Brand retrieved");
        return response.data;
      }

      console.log("❌ [BRAND] Brand not found");
      return null;
    } catch (error) {
      console.error("❌ [BRAND] Get brand by ID error:", error);
      return null;
    }
  },

  /**
   * ➕ Create Brand
   * @param {Object} brandData - Brand data
   * @returns {Promise<Object>} Created brand
   */
  async createBrand(brandData) {
    try {
      console.log("➕ [BRAND] Creating brand:", brandData);

      const response = await adminApiClient.post("/brand", brandData);

      if (response.success && response.data) {
        console.log("✅ [BRAND] Brand created");
        return {
          success: true,
          data: response.data,
        };
      }

      return {
        success: false,
        error: "Failed to create brand",
      };
    } catch (error) {
      console.error("❌ [BRAND] Create brand error:", error);
      return {
        success: false,
        error: apiUtils.formatErrorMessage(error),
      };
    }
  },

  /**
   * ✏️ Update Brand
   * @param {string|number} brandId - Brand ID
   * @param {Object} brandData - Updated brand data
   * @returns {Promise<Object>} Updated brand
   */
  async updateBrand(brandId, brandData) {
    try {
      console.log("✏️ [BRAND] Updating brand:", brandId, brandData);

      const response = await adminApiClient.put(`/brand/${brandId}`, brandData);

      if (response.success && response.data) {
        console.log("✅ [BRAND] Brand updated");
        return {
          success: true,
          data: response.data,
        };
      }

      return {
        success: false,
        error: "Failed to update brand",
      };
    } catch (error) {
      console.error("❌ [BRAND] Update brand error:", error);
      return {
        success: false,
        error: apiUtils.formatErrorMessage(error),
      };
    }
  },

  /**
   * 🗑️ Delete Brand
   * @param {string|number} brandId - Brand ID
   * @returns {Promise<Object>} Delete result
   */
  async deleteBrand(brandId) {
    try {
      console.log("🗑️ [BRAND] Deleting brand:", brandId);

      const response = await adminApiClient.delete(`/brand/${brandId}`);

      if (response.success) {
        console.log("✅ [BRAND] Brand deleted");
        return {
          success: true,
        };
      }

      return {
        success: false,
        error: "Failed to delete brand",
      };
    } catch (error) {
      console.error("❌ [BRAND] Delete brand error:", error);
      return {
        success: false,
        error: apiUtils.formatErrorMessage(error),
      };
    }
  },
};
