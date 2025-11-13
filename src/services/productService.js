// src/services/productService.js
import apiClient from "./api";

export const productService = {
  // Get all products with pagination and filters
  getProducts: async (params = {}) => {
    try {
      console.log(
        "🔍 productService.getProducts: Calling API with params:",
        params
      );
      const response = await apiClient.get("/product", params);
      console.log("✅ productService.getProducts: Got response:", response);

      return {
        products: response.data || [],
        pagination: response.pagination || {},
        totalCount: response.totalCount || 0,
        success: response.success,
        message: response.message,
      };
    } catch (error) {
      console.error("❌ productService.getProducts: Error:", error);
      throw error;
    }
  },

  // Get single product by ID
  getProductById: async (id) => {
    try {
      console.log(`🔍 productService.getProductById: Fetching product ${id}`);
      const response = await apiClient.get(`/product/${id}`);
      console.log("✅ productService.getProductById: Got response:", response);

      return {
        product: response.data || null,
        success: response.success,
        message: response.message,
      };
    } catch (error) {
      console.error(
        `❌ productService.getProductById: Error fetching product ${id}:`,
        error
      );
      throw error;
    }
  },

  // Get featured products
  getFeaturedProducts: async (params = {}) => {
    try {
      const response = await apiClient.get("/product", {
        isFeatured: true,
        pageSize: params.pageSize || 10,
        page: params.page || 1,
        ...params,
      });

      return {
        products: response.data || [],
        pagination: response.pagination || {},
        totalCount: response.totalCount || 0,
        success: response.success,
        message: response.message,
      };
    } catch (error) {
      console.error("❌ productService.getFeaturedProducts: Error:", error);
      throw error;
    }
  },

  // Get products by category
  getProductsByCategory: async (categorySlug, params = {}) => {
    try {
      const response = await apiClient.get("/product", {
        category: categorySlug,
        page: params.page || 1,
        pageSize: params.pageSize || 12,
        sortBy: params.sortBy || "name",
        sortOrder: params.sortOrder || "asc",
        ...params,
      });

      return {
        products: response.data || [],
        pagination: response.pagination || {},
        totalCount: response.totalCount || 0,
        success: response.success,
        message: response.message,
      };
    } catch (error) {
      console.error(
        `❌ productService.getProductsByCategory: Error fetching products for category ${categorySlug}:`,
        error
      );
      throw error;
    }
  },

  // Get new products
  getNewProducts: async (params = {}) => {
    try {
      const response = await apiClient.get("/product", {
        isNew: true,
        pageSize: params.pageSize || 10,
        page: params.page || 1,
        sortBy: "createdAt",
        sortOrder: "desc",
        ...params,
      });

      return {
        products: response.data || [],
        pagination: response.pagination || {},
        totalCount: response.totalCount || 0,
        success: response.success,
        message: response.message,
      };
    } catch (error) {
      console.error("❌ productService.getNewProducts: Error:", error);
      throw error;
    }
  },

  // Get bestseller products
  getBestsellerProducts: async (params = {}) => {
    try {
      const response = await apiClient.get("/product", {
        isBestseller: true,
        pageSize: params.pageSize || 10,
        page: params.page || 1,
        sortBy: "salesCount",
        sortOrder: "desc",
        ...params,
      });

      return {
        products: response.data || [],
        pagination: response.pagination || {},
        totalCount: response.totalCount || 0,
        success: response.success,
        message: response.message,
      };
    } catch (error) {
      console.error("❌ productService.getBestsellerProducts: Error:", error);
      throw error;
    }
  },

  // Get sale products
  getSaleProducts: async (params = {}) => {
    try {
      const response = await apiClient.get("/product", {
        onSale: true,
        pageSize: params.pageSize || 10,
        page: params.page || 1,
        sortBy: "discountPercent",
        sortOrder: "desc",
        ...params,
      });

      return {
        products: response.data || [],
        pagination: response.pagination || {},
        totalCount: response.totalCount || 0,
        success: response.success,
        message: response.message,
      };
    } catch (error) {
      console.error("❌ productService.getSaleProducts: Error:", error);
      throw error;
    }
  },

  // Search products
  searchProducts: async (query, params = {}) => {
    try {
      console.log(`🔍 productService.searchProducts: Searching for "${query}"`);
      const response = await apiClient.get("/product", {
        search: query,
        page: params.page || 1,
        pageSize: params.pageSize || 12,
        sortBy: params.sortBy || "relevance",
        sortOrder: params.sortOrder || "desc",
        ...params,
      });

      return {
        products: response.data || [],
        pagination: response.pagination || {},
        totalCount: response.totalCount || 0,
        success: response.success,
        message: response.message,
        query: query,
      };
    } catch (error) {
      console.error(
        `❌ productService.searchProducts: Error searching products with query "${query}":`,
        error
      );
      throw error;
    }
  },

  // Get product reviews
  getProductReviews: async (productId, params = {}) => {
    try {
      const response = await apiClient.get(`/product/${productId}/reviews`, {
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        sortBy: params.sortBy || "createdAt",
        sortOrder: params.sortOrder || "desc",
        ...params,
      });

      return {
        reviews: response.data || [],
        pagination: response.pagination || {},
        totalCount: response.totalCount || 0,
        averageRating: response.averageRating || 0,
        ratingDistribution: response.ratingDistribution || {},
        success: response.success,
        message: response.message,
      };
    } catch (error) {
      console.error(
        `❌ productService.getProductReviews: Error fetching reviews for product ${productId}:`,
        error
      );
      throw error;
    }
  },

  // Add product review
  addProductReview: async (productId, reviewData) => {
    try {
      const response = await apiClient.post(`/product/${productId}/reviews`, {
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment,
        images: reviewData.images || [],
      });

      return {
        review: response.data || null,
        success: response.success,
        message: response.message,
      };
    } catch (error) {
      console.error(
        `❌ productService.addProductReview: Error adding review for product ${productId}:`,
        error
      );
      throw error;
    }
  },
};
