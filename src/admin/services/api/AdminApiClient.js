// 🔧 ADMIN API CLIENT - Chuẩn hóa hoàn toàn
import axios from "axios";
import config from "../../../config/index.js";

const { API_BASE_URL, API_TIMEOUT } = config;

/**
 * ✅ CENTRALIZED ADMIN API CLIENT
 * - Consistent token management
 * - Unified error handling
 * - Standardized request/response processing
 */

class AdminApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = API_TIMEOUT;

    // Create axios instance with admin-specific configuration
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    this.setupInterceptors();
  }

  /**
   * 🔐 Setup request/response interceptors
   */
  setupInterceptors() {
    // Request interceptor - Add admin token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAdminToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        console.log("📡 [ADMIN API] Request:", {
          method: config.method?.toUpperCase(),
          url: config.url,
          data: config.data,
          params: config.params,
        });

        return config;
      },
      (error) => {
        console.error("❌ [ADMIN API] Request interceptor error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle admin-specific responses
    this.client.interceptors.response.use(
      (response) => {
        console.log("📨 [ADMIN API] Response SUCCESS:", {
          url: response.config.url,
          method: response.config.method,
          status: response.status,
          data: response.data,
        });

        // Return standardized response format
        return response.data;
      },
      async (error) => {
        console.error("❌ [ADMIN API] Response error:", {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });

        // Handle 401 - Token expired
        if (error.response?.status === 401) {
          const refreshed = await this.handleTokenRefresh();
          if (refreshed) {
            // Retry original request
            return this.client.request(error.config);
          }
        }

        // Standardize error format
        throw this.formatError(error);
      }
    );
  }

  /**
   * 🔐 Token Management
   */
  getAdminToken() {
    return localStorage.getItem("adminToken");
  }

  setAdminToken(token) {
    localStorage.setItem("adminToken", token);
  }

  getRefreshToken() {
    return localStorage.getItem("adminRefreshToken");
  }

  setRefreshToken(token) {
    localStorage.setItem("adminRefreshToken", token);
  }

  clearTokens() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRefreshToken");
    localStorage.removeItem("adminInfo");
  }

  /**
   * 🔄 Handle token refresh
   */
  async handleTokenRefresh() {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        this.redirectToLogin();
        return false;
      }

      const response = await axios.post(
        `${this.baseURL}/auth/refresh-token`,
        { refreshToken },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        this.setAdminToken(response.data.data.token);
        if (response.data.data.refreshToken) {
          this.setRefreshToken(response.data.data.refreshToken);
        }
        return true;
      }

      this.redirectToLogin();
      return false;
    } catch (error) {
      console.error("❌ [ADMIN API] Token refresh failed:", error);
      this.redirectToLogin();
      return false;
    }
  }

  /**
   * 🚪 Redirect to admin login
   */
  redirectToLogin() {
    this.clearTokens();
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
  }

  /**
   * ⚠️ Format error for consistent handling
   */
  formatError(error) {
    const formattedError = {
      message: "An error occurred",
      status: 500,
      data: null,
      isApiError: true,
    };

    if (error.response) {
      // Server responded with error status
      formattedError.status = error.response.status;
      formattedError.data = error.response.data;
      formattedError.message =
        error.response.data?.message ||
        error.response.statusText ||
        `HTTP ${error.response.status}`;
    } else if (error.request) {
      // Network error
      formattedError.message = "Network error - Unable to connect to server";
      formattedError.status = 0;
    } else {
      // Request setup error
      formattedError.message = error.message || "Request setup error";
    }

    return formattedError;
  }

  /**
   * 📡 HTTP Methods
   */
  async get(endpoint, params = {}) {
    return this.client.get(endpoint, { params });
  }

  async post(endpoint, data = {}) {
    return this.client.post(endpoint, data);
  }

  async put(endpoint, data = {}) {
    return this.client.put(endpoint, data);
  }

  async patch(endpoint, data = {}) {
    return this.client.patch(endpoint, data);
  }

  async delete(endpoint, config = {}) {
    return this.client.delete(endpoint, config);
  }
}

// Create singleton instance
const adminApiClient = new AdminApiClient();

/**
 * 🛠️ API UTILITIES
 */
export const apiUtils = {
  /**
   * Format error message for UI display
   */
  formatErrorMessage(error) {
    if (!error) return "Unknown error occurred";

    if (error.isApiError) {
      switch (error.status) {
        case 401:
          return "Unauthorized - Please login again";
        case 403:
          return "Access denied - Insufficient permissions";
        case 404:
          return "Resource not found";
        case 422:
          return error.data?.message || "Validation error";
        case 500:
          return "Server error - Please try again later";
        default:
          return error.message || "An error occurred";
      }
    }

    return error.message || "An error occurred";
  },

  /**
   * Check if error requires user action
   */
  requiresUserAction(error) {
    if (!error || !error.isApiError) return false;
    return [401, 403].includes(error.status);
  },

  /**
   * Build query string from object
   */
  buildQueryString(params) {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        searchParams.append(key, value);
      }
    });

    return searchParams.toString();
  },

  /**
   * Parse pagination from response
   */
  parsePagination(response) {
    const pagination = response.pagination || {};
    const data = response.data || {};

    return {
      currentPage: pagination.currentPage || data.page || 1,
      pageSize: pagination.pageSize || data.pageSize || 20,
      totalItems: pagination.totalItems || data.totalCount || 0,
      totalPages:
        pagination.totalPages ||
        Math.ceil((pagination.totalItems || 0) / (pagination.pageSize || 20)),
    };
  },
};

export { adminApiClient };
export default adminApiClient;
