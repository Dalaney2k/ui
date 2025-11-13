import axios from "axios";
import config from "../config/index.js";

const { API_BASE_URL, API_TIMEOUT } = config;

console.log("🔧 API Configuration Debug:");
console.log("🌐 API_BASE_URL:", API_BASE_URL);
console.log("ⱖ️ API_TIMEOUT:", API_TIMEOUT);

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // ENHANCED: Try multiple token sources for better compatibility
    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("accessToken") ||
      sessionStorage.getItem("auth_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔐 Token added to request:", token.substring(0, 20) + "...");
    } else {
      console.log("⚠️ No authentication token found");
    }

    // Debug request details
    console.log("📡 API Request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      data: config.data,
      params: config.params,
    });

    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("📨 API Response interceptor SUCCESS:", {
      url: response.config.url,
      method: response.config.method,
      status: response.status,
      data: response.data,
    });

    // Return the entire response data structure
    // Backend returns: { success: true, message: "...", data: {...}, errors: [], timestamp: "..." }
    return response.data;
  },
  (error) => {
    console.error("❌ API Response error interceptor:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    if (error.response) {
      // Server responded with error status
      const errorData = error.response.data;

      // ENHANCED: Better error logging for debugging
      if (error.response.status === 400 && errorData) {
        console.error("🚨 400 Bad Request Details:", {
          url: error.config?.url,
          method: error.config?.method,
          requestData:
            typeof error.config?.data === "string"
              ? error.config.data
              : JSON.stringify(error.config?.data),
          responseData: errorData,
        });

        console.error(
          "🚨 Full response data:",
          JSON.stringify(errorData, null, 2)
        );

        // Log validation errors in more detail
        if (errorData.errors) {
          console.error("🚨 Validation Errors:", errorData.errors);

          // If errors is an object (field-specific errors)
          if (
            typeof errorData.errors === "object" &&
            !Array.isArray(errorData.errors)
          ) {
            Object.keys(errorData.errors).forEach((field) => {
              console.error(
                `🚨 Field '${field}' errors:`,
                errorData.errors[field]
              );
            });
          }
        }

        // Log other error fields
        if (errorData.title) {
          console.error("🚨 Error Title:", errorData.title);
        }
        if (errorData.detail) {
          console.error("🚨 Error Detail:", errorData.detail);
        }
        if (errorData.type) {
          console.error("🚨 Error Type:", errorData.type);
        }
      }

      // ENHANCED: Better 401 handling
      if (error.response.status === 401) {
        console.error("🔒 Authentication failed - clearing tokens");
        // Clear all possible token storage locations
        localStorage.removeItem("accessToken");
        localStorage.removeItem("auth_token");
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("auth_token");

        // Optionally redirect to login
        // window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      }

      // ENHANCED: Better 403 handling
      if (error.response.status === 403) {
        console.error("🚫 Access forbidden");
        // Có thể thêm logic xử lý forbidden ở đây
      }

      // Handle 404 for cart endpoints gracefully for guest users
      if (
        error.response.status === 404 &&
        error.config.url?.includes("/cart")
      ) {
        console.log("🛒 Cart 404 - likely guest user without cart yet");
        return {
          success: true,
          data: {
            items: [],
            summary: { total: 0, totalItems: 0 },
            isGuestCart: true,
          },
          message: "Cart not found - initializing empty cart",
        };
      }

      // FIXED: Better error message extraction
      let errorMessage = "Có lỗi xảy ra";

      if (errorData) {
        // Ưu tiên message từ backend
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.title) {
          errorMessage = errorData.title;
        } else if (errorData.errors) {
          // Handle different error formats
          if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
            errorMessage = errorData.errors[0];
          } else if (typeof errorData.errors === "object") {
            // Get first field error
            const firstField = Object.keys(errorData.errors)[0];
            if (firstField && errorData.errors[firstField]) {
              const fieldError = Array.isArray(errorData.errors[firstField])
                ? errorData.errors[firstField][0]
                : errorData.errors[firstField];
              errorMessage = `${firstField}: ${fieldError}`;
            }
          } else if (typeof errorData.errors === "string") {
            errorMessage = errorData.errors;
          }
        } else if (error.response.statusText) {
          errorMessage = error.response.statusText;
        }
      }

      // Fallback to HTTP status text
      if (!errorMessage || errorMessage === "Có lỗi xảy ra") {
        errorMessage = `HTTP ${error.response.status}`;
      }

      throw new Error(errorMessage);
    } else if (error.request) {
      // Request was made but no response received
      console.error("🔌 Network Error - No response received:", error.request);
      throw new Error(
        "Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet."
      );
    } else {
      // Something else happened
      console.error("⚡ Request setup error:", error.message);
      throw new Error(error.message || "Có lỗi xảy ra khi gọi API");
    }
  }
);

// API Client with error handling
class ApiClient {
  // GET request
  async get(endpoint, params = {}) {
    try {
      return await axiosInstance.get(endpoint, { params });
    } catch (error) {
      console.error("API GET error:", error);
      throw error;
    }
  }

  // POST request
  async post(endpoint, data = {}) {
    try {
      return await axiosInstance.post(endpoint, data);
    } catch (error) {
      console.error("API POST error:", error);
      throw error;
    }
  }

  // PUT request
  async put(endpoint, data = {}) {
    try {
      return await axiosInstance.put(endpoint, data);
    } catch (error) {
      console.error("API PUT error:", error);
      throw error;
    }
  }

  // DELETE request - Enhanced to support body and custom config
  async delete(endpoint, config = {}) {
    try {
      // If config has data, it's a DELETE with body
      if (config.data) {
        return await axiosInstance.delete(endpoint, {
          data: config.data,
          headers: {
            "Content-Type": "application/json",
            ...config.headers,
          },
        });
      }
      // Standard DELETE without body
      return await axiosInstance.delete(endpoint, config);
    } catch (error) {
      console.error("API DELETE error:", error);
      throw error;
    }
  }

  // PATCH request
  async patch(endpoint, data = {}) {
    try {
      return await axiosInstance.patch(endpoint, data);
    } catch (error) {
      console.error("API PATCH error:", error);
      throw error;
    }
  }
}

// Create API client instance
const apiClient = new ApiClient();

// Cart Service - Handle all cart-related API calls with guest cart support
export const cartService = {
  // Generate session ID for guest users
  generateSessionId() {
    return (
      "guest_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now()
    );
  },

  // Get or create session ID for guest users
  getSessionId() {
    let sessionId = localStorage.getItem("guestSessionId");
    if (!sessionId) {
      sessionId = this.generateSessionId();
      localStorage.setItem("guestSessionId", sessionId);
    }
    return sessionId;
  },

  // Clear guest session ID
  clearSessionId() {
    localStorage.removeItem("guestSessionId");
  },

  // Get cart URL with session ID for guest users
  getCartUrl(endpoint, isAuthenticated = false) {
    const baseUrl = endpoint;
    console.log("🔗 getCartUrl debug:", {
      endpoint,
      isAuthenticated,
      baseUrl,
      configAPIBase: API_BASE_URL,
      axiosBaseURL: axiosInstance.defaults.baseURL,
    });

    if (!isAuthenticated) {
      const sessionId = this.getSessionId();
      const separator = endpoint.includes("?") ? "&" : "?";
      const finalUrl = `${baseUrl}${separator}sessionId=${sessionId}`;
      console.log("🔗 Final guest URL:", finalUrl);
      return finalUrl;
    }
    console.log("🔗 Final auth URL:", baseUrl);
    return baseUrl;
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token =
      localStorage.getItem("accessToken") || localStorage.getItem("auth_token");
    return !!token;
  },

  // Get current user's cart (both authenticated and guest)
  getCart: async () => {
    try {
      console.log("🛒 Getting cart...");

      const isAuth = cartService.isAuthenticated();
      const url = cartService.getCartUrl("/cart", isAuth);

      console.log("🛒 Cart URL:", url, "isAuth:", isAuth);

      // Real API call
      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      console.error("❌ Error getting cart:", error);

      // For guest users, return empty cart instead of error
      if (!cartService.isAuthenticated()) {
        console.log("🛒 Guest user, returning empty cart");
        return {
          success: true,
          data: {
            items: [],
            summary: { total: 0, totalItems: 0 },
            isGuestCart: true,
          },
          message: "Guest cart initialized",
        };
      }

      throw error;
    }
  },

  // Get cart summary (item count, total, etc.)
  getCartSummary: async () => {
    try {
      console.log("📊 Getting cart summary...");

      const isAuth = cartService.isAuthenticated();
      const url = cartService.getCartUrl("/cart/summary", isAuth);

      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      console.error("❌ Error getting cart summary:", error);
      throw error;
    }
  },

  // Add item to cart (both authenticated and guest)
  addToCart: async (productData) => {
    try {
      console.log("➕ Adding to cart:", productData);

      const isAuth = cartService.isAuthenticated();
      const url = cartService.getCartUrl("/cart/items", isAuth);

      // Real API call - no mock data
      console.log("� Calling real API:", url);

      // Backend expects PascalCase format with CustomOptions as JSON string
      const payload = {
        ProductId: parseInt(productData.productId),
        Quantity: parseInt(productData.quantity) || 1,
        CustomOptions: JSON.stringify(productData.customOptions || {}),
      };

      console.log("📦 Add to cart payload (final format):", payload);
      console.log("📦 Add to cart URL:", url);

      const response = await apiClient.post(url, payload);
      console.log("✅ Add to cart response:", response);
      return response;
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      throw error;
    }
  },

  // Update cart item quantity (both authenticated and guest)
  updateCartItem: async (updateData) => {
    try {
      console.log("🔄 Updating cart item:", updateData);

      const isAuth = cartService.isAuthenticated();
      const url = cartService.getCartUrl("/cart/items", isAuth);

      // Real API call
      console.log("� Calling real update API:", url);

      // According to API documentation, request body should be:
      const payload = {
        productId: updateData.productId,
        quantity: updateData.quantity,
      };

      console.log("📦 Update cart payload:", payload);
      console.log("📦 Update cart URL:", url);

      const response = await apiClient.put(url, payload);
      console.log("✅ Update cart response:", response);
      return response;
    } catch (error) {
      console.error("❌ Error updating cart item:", error);
      throw error;
    }
  },

  // Remove item from cart (both authenticated and guest)
  removeFromCart: async (removeData) => {
    try {
      console.log("🗑️ Removing from cart:", removeData);

      const isAuth = cartService.isAuthenticated();
      const url = cartService.getCartUrl("/cart/items", isAuth);

      // Real API call
      console.log("� Calling real remove API:", url);

      // According to API documentation, request body should be:
      const payload = {
        productId: removeData.productId,
      };

      console.log("📦 Remove cart payload:", payload);
      console.log("📦 Remove cart URL:", url);

      const response = await apiClient.delete(url, {
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("✅ Remove cart response:", response);
      return response;
    } catch (error) {
      console.error("❌ Error removing from cart:", error);
      throw error;
    }
  },

  // Clear entire cart (both authenticated and guest)
  clearCart: async () => {
    try {
      console.log("🗑️ Clearing entire cart...");

      const isAuth = cartService.isAuthenticated();
      const url = cartService.getCartUrl("/cart/clear", isAuth);

      const response = await apiClient.delete(url);
      return response;
    } catch (error) {
      console.error("❌ Error clearing cart:", error);
      throw error;
    }
  },

  // Bulk update cart items (both authenticated and guest)
  bulkUpdateCart: async (items) => {
    try {
      console.log("🔄 Bulk updating cart:", items);

      const isAuth = cartService.isAuthenticated();
      const url = cartService.getCartUrl("/cart/bulk", isAuth);

      const payload = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      const response = await apiClient.put(url, payload);
      return response;
    } catch (error) {
      console.error("❌ Error bulk updating cart:", error);
      throw error;
    }
  },

  // Validate cart (both authenticated and guest)
  validateCart: async () => {
    try {
      console.log("✅ Validating cart...");

      const isAuth = cartService.isAuthenticated();
      const url = cartService.getCartUrl("/cart/validate", isAuth);

      const response = await apiClient.post(url);
      return response;
    } catch (error) {
      console.error("❌ Error validating cart:", error);
      throw error;
    }
  },

  // Merge guest cart with user cart after login
  mergeGuestCart: async () => {
    try {
      const guestSessionId = localStorage.getItem("guestSessionId");
      if (!guestSessionId) {
        console.log("🔀 No guest cart to merge");
        return { success: true, message: "No guest cart to merge" };
      }

      console.log("🔀 Merging guest cart with session ID:", guestSessionId);

      const url = `/cart/merge?sessionId=${guestSessionId}`;
      const response = await apiClient.post(url);

      if (response.success) {
        // Clear guest session after successful merge
        cartService.clearSessionId();
        console.log("✅ Guest cart merged successfully");
      }

      return response;
    } catch (error) {
      console.error("❌ Error merging guest cart:", error);
      // Don't throw error, merging is not critical
      return { success: false, message: error.message };
    }
  },

  // Apply coupon to cart (both authenticated and guest)
  applyCoupon: async (couponCode) => {
    try {
      console.log("🎫 Applying coupon:", couponCode);

      const isAuth = cartService.isAuthenticated();
      const url = cartService.getCartUrl(`/cart/coupon/${couponCode}`, isAuth);

      const response = await apiClient.post(url);
      return response;
    } catch (error) {
      console.error("❌ Error applying coupon:", error);
      throw error;
    }
  },

  // Remove coupon from cart (both authenticated and guest)
  removeCoupon: async () => {
    try {
      console.log("🗑️ Removing coupon...");

      const isAuth = cartService.isAuthenticated();
      const url = cartService.getCartUrl("/cart/coupon", isAuth);

      const response = await apiClient.delete(url);
      return response;
    } catch (error) {
      console.error("❌ Error removing coupon:", error);
      throw error;
    }
  },
};

// Wishlist Service - Handle all wishlist-related API calls
export const wishlistService = {
  // Get all wishlists for current user
  getWishlists: async () => {
    try {
      console.log("💝 Getting wishlists...");
      const response = await apiClient.get("/wishlist");
      return response;
    } catch (error) {
      console.error("❌ Error getting wishlists:", error);
      throw error;
    }
  },

  // Create new wishlist
  createWishlist: async (wishlistData) => {
    try {
      console.log("➕ Creating wishlist:", wishlistData);
      const payload = {
        name: wishlistData.name,
        description: wishlistData.description || "",
        isPublic: wishlistData.isPublic || false,
        isDefault: wishlistData.isDefault || false,
      };

      const response = await apiClient.post("/wishlist", payload);
      return response;
    } catch (error) {
      console.error("❌ Error creating wishlist:", error);
      throw error;
    }
  },

  // Update wishlist
  updateWishlist: async (wishlistId, updateData) => {
    try {
      console.log("🔄 Updating wishlist:", wishlistId, updateData);
      const payload = {
        name: updateData.name,
        description: updateData.description || "",
        isPublic: updateData.isPublic || false,
        isDefault: updateData.isDefault || false,
      };

      const response = await apiClient.put(`/wishlist/${wishlistId}`, payload);
      return response;
    } catch (error) {
      console.error("❌ Error updating wishlist:", error);
      throw error;
    }
  },

  // Delete wishlist
  deleteWishlist: async (wishlistId) => {
    try {
      console.log("🗑️ Deleting wishlist:", wishlistId);
      const response = await apiClient.delete(`/wishlist/${wishlistId}`);
      return response;
    } catch (error) {
      console.error("❌ Error deleting wishlist:", error);
      throw error;
    }
  },

  // Add product to wishlist
  addToWishlist: async (wishlistId, productData) => {
    try {
      console.log("💝 Adding to wishlist:", wishlistId, productData);
      const payload = {
        productId: productData.productId,
        notes: productData.notes || "",
        desiredPrice: productData.desiredPrice || null,
        priority: productData.priority || 1,
        notifyOnPriceChange: productData.notifyOnPriceChange || false,
        notifyOnRestock: productData.notifyOnRestock || false,
        notifyOnSale: productData.notifyOnSale || false,
      };

      const response = await apiClient.post(
        `/wishlist/${wishlistId}/items`,
        payload
      );
      return response;
    } catch (error) {
      console.error("❌ Error adding to wishlist:", error);
      throw error;
    }
  },

  // Remove product from wishlist
  removeFromWishlist: async (wishlistId, productId) => {
    try {
      console.log("🗑️ Removing from wishlist:", wishlistId, productId);
      const response = await apiClient.delete(
        `/wishlist/${wishlistId}/items/${productId}`
      );
      return response;
    } catch (error) {
      console.error("❌ Error removing from wishlist:", error);
      throw error;
    }
  },

  // Move single product from wishlist to cart
  moveToCart: async (wishlistId, productId, quantity = 1) => {
    try {
      console.log("🛒 Moving to cart:", wishlistId, productId, quantity);
      const payload = { quantity };
      const response = await apiClient.post(
        `/wishlist/${wishlistId}/items/${productId}/move-to-cart`,
        payload
      );
      return response;
    } catch (error) {
      console.error("❌ Error moving to cart:", error);
      throw error;
    }
  },

  // Move all products from wishlist to cart
  moveAllToCart: async (wishlistId) => {
    try {
      console.log("🛒 Moving all to cart:", wishlistId);
      const response = await apiClient.post(
        `/wishlist/${wishlistId}/move-all-to-cart`
      );
      return response;
    } catch (error) {
      console.error("❌ Error moving all to cart:", error);
      throw error;
    }
  },

  // Get shareable link for wishlist
  getShareLink: async (wishlistId) => {
    try {
      console.log("🔗 Getting share link:", wishlistId);
      const response = await apiClient.get(`/wishlist/${wishlistId}/share`);
      return response;
    } catch (error) {
      console.error("❌ Error getting share link:", error);
      throw error;
    }
  },

  // Helper: Add product to default wishlist
  addToDefaultWishlist: async (productData) => {
    try {
      const wishlists = await wishlistService.getWishlists();
      const defaultWishlist =
        wishlists.data?.find((w) => w.isDefault) || wishlists.data?.[0];

      if (!defaultWishlist) {
        const newWishlist = await wishlistService.createWishlist({
          name: "Danh sách yêu thích của tôi",
          isDefault: true,
        });
        return await wishlistService.addToWishlist(
          newWishlist.data.id,
          productData
        );
      }

      return await wishlistService.addToWishlist(
        defaultWishlist.id,
        productData
      );
    } catch (error) {
      console.error("❌ Error adding to default wishlist:", error);
      throw error;
    }
  },

  // Helper: Check if product is in any wishlist
  isInWishlist: async (productId) => {
    try {
      const wishlists = await wishlistService.getWishlists();
      return (
        wishlists.data?.some((wishlist) =>
          wishlist.items?.some((item) => item.productId === productId)
        ) || false
      );
    } catch (error) {
      console.error("❌ Error checking wishlist:", error);
      return false;
    }
  },
};

export default apiClient;
