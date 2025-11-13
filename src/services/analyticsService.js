// src/services/analyticsService.js
import apiClient from "./api";

export const analyticsService = {
  // Track page view
  trackPageView: async (pageData) => {
    try {
      await apiClient.post("/analytics/page-view", {
        page: pageData.page,
        title: pageData.title,
        referrer: pageData.referrer,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("❌ analyticsService.trackPageView: Error:", error);
      // Don't throw error for analytics to avoid breaking user experience
    }
  },

  // Track product view
  trackProductView: async (productId) => {
    try {
      await apiClient.post("/analytics/product-view", {
        productId: productId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("❌ analyticsService.trackProductView: Error:", error);
    }
  },

  // Track search
  trackSearch: async (query, resultsCount = 0) => {
    try {
      await apiClient.post("/analytics/search", {
        query: query,
        resultsCount: resultsCount,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("❌ analyticsService.trackSearch: Error:", error);
    }
  },

  // Track cart actions
  trackCartAction: async (action, productData = {}) => {
    try {
      await apiClient.post("/analytics/cart-action", {
        action: action, // 'add', 'remove', 'update', 'clear'
        productId: productData.productId,
        quantity: productData.quantity,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("❌ analyticsService.trackCartAction: Error:", error);
    }
  },

  // Track wishlist actions
  trackWishlistAction: async (action, productData = {}) => {
    try {
      await apiClient.post("/analytics/wishlist-action", {
        action: action, // 'add', 'remove'
        productId: productData.productId,
        wishlistId: productData.wishlistId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("❌ analyticsService.trackWishlistAction: Error:", error);
    }
  },

  // Track order events
  trackOrderEvent: async (event, orderData = {}) => {
    try {
      await apiClient.post("/analytics/order-event", {
        event: event, // 'created', 'payment_completed', 'shipped', 'delivered', 'cancelled'
        orderId: orderData.orderId,
        orderValue: orderData.orderValue,
        paymentMethod: orderData.paymentMethod,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("❌ analyticsService.trackOrderEvent: Error:", error);
    }
  },

  // Track user registration
  trackUserRegistration: async (registrationData = {}) => {
    try {
      await apiClient.post("/analytics/user-registration", {
        registrationMethod: registrationData.method || "email", // 'email', 'google', 'facebook'
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("❌ analyticsService.trackUserRegistration: Error:", error);
    }
  },

  // Track user login
  trackUserLogin: async (loginData = {}) => {
    try {
      await apiClient.post("/analytics/user-login", {
        loginMethod: loginData.method || "email", // 'email', 'google', 'facebook'
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("❌ analyticsService.trackUserLogin: Error:", error);
    }
  },
};
