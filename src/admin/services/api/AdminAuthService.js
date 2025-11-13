// 🔐 ADMIN AUTHENTICATION SERVICE - Chuẩn hóa hoàn toàn
import { adminApiClient, apiUtils } from "./AdminApiClient.js";

/**
 * ✅ ADMIN AUTHENTICATION SERVICE
 * - Centralized admin authentication
 * - Role-based access control
 * - Token lifecycle management
 */
export const adminAuthService = {
  /**
   * 🔓 Admin Login
   * @param {Object} credentials - Email and password
   * @returns {Promise<Object>} Login result
   */
  async login(credentials) {
    try {
      console.log("🔐 [AUTH] Attempting admin login...");

      const response = await adminApiClient.post("/auth/login", {
        email: credentials.email,
        password: credentials.password,
        rememberMe: credentials.rememberMe || true,
      });

      if (response.success && response.data) {
        // Store tokens and admin info
        adminApiClient.setAdminToken(response.data.token);
        adminApiClient.setRefreshToken(response.data.refreshToken);
        localStorage.setItem("adminInfo", JSON.stringify(response.data.user));

        console.log("✅ [AUTH] Login successful");
        return {
          success: true,
          data: {
            user: response.data.user,
            token: response.data.token,
          },
        };
      }

      console.log("❌ [AUTH] Login failed - Invalid response");
      return {
        success: false,
        message: response.message || "Login failed",
      };
    } catch (error) {
      console.error("❌ [AUTH] Login error:", error);
      return {
        success: false,
        message: apiUtils.formatErrorMessage(error),
      };
    }
  },

  /**
   * 🚪 Admin Logout
   * @returns {Promise<Object>} Logout result
   */
  async logout() {
    try {
      console.log("🚪 [AUTH] Logging out admin...");

      // Call logout endpoint (optional - tokens will be cleared anyway)
      try {
        await adminApiClient.post("/auth/logout");
      } catch (error) {
        console.warn("⚠️ [AUTH] Logout API call failed:", error);
      }

      // Clear all tokens and admin data
      adminApiClient.clearTokens();

      console.log("✅ [AUTH] Logout successful");
      return { success: true };
    } catch (error) {
      console.error("❌ [AUTH] Logout error:", error);
      // Force clear tokens even if logout fails
      adminApiClient.clearTokens();
      return { success: true }; // Always return success for logout
    }
  },

  /**
   * 👤 Get Current Admin
   * @returns {Promise<Object|null>} Current admin data
   */
  async getCurrentAdmin() {
    try {
      console.log("👤 [AUTH] Getting current admin...");

      const response = await adminApiClient.get("/auth/me");

      if (response.success && response.data) {
        // Update stored admin info
        localStorage.setItem("adminInfo", JSON.stringify(response.data));
        console.log("✅ [AUTH] Got current admin data");
        return response.data;
      }

      // Fallback to stored admin info
      const storedAdmin = localStorage.getItem("adminInfo");
      if (storedAdmin) {
        console.log("📦 [AUTH] Using stored admin data");
        return JSON.parse(storedAdmin);
      }

      console.log("❌ [AUTH] No admin data found");
      return null;
    } catch (error) {
      console.error("❌ [AUTH] Get current admin error:", error);

      // Try fallback to stored data
      try {
        const storedAdmin = localStorage.getItem("adminInfo");
        if (storedAdmin) {
          console.log("📦 [AUTH] Fallback to stored admin data");
          return JSON.parse(storedAdmin);
        }
      } catch (parseError) {
        console.error(
          "❌ [AUTH] Failed to parse stored admin data:",
          parseError
        );
      }

      return null;
    }
  },

  /**
   * 🔍 Check Admin Role
   * @returns {boolean} Whether user has admin privileges
   */
  checkAdminRole() {
    try {
      const adminInfo = JSON.parse(localStorage.getItem("adminInfo") || "{}");
      const role = adminInfo.role;

      console.log("🔍 [AUTH] Checking admin role:", { role, adminInfo });

      // Handle numeric roles (4 = Admin, 3 = Staff, 2 = Moderator)
      if (typeof role === "number") {
        return role >= 2;
      }

      // Handle string roles
      if (typeof role === "string") {
        const numericRole = parseInt(role);
        if (!isNaN(numericRole)) {
          return numericRole >= 2;
        }
        return ["Admin", "Staff", "Moderator"].includes(role);
      }

      console.log("❌ [AUTH] Invalid role format");
      return false;
    } catch (error) {
      console.error("❌ [AUTH] Check admin role error:", error);
      return false;
    }
  },

  /**
   * 🔐 Check if Logged In
   * @returns {boolean} Whether admin is logged in
   */
  isLoggedIn() {
    const token = adminApiClient.getAdminToken();
    const adminInfo = localStorage.getItem("adminInfo");
    const hasValidRole = this.checkAdminRole();

    const isLoggedIn = !!(token && adminInfo && hasValidRole);

    console.log("🔐 [AUTH] Login status check:", {
      hasToken: !!token,
      hasAdminInfo: !!adminInfo,
      hasValidRole,
      isLoggedIn,
    });

    return isLoggedIn;
  },

  /**
   * 🔄 Refresh Token
   * @returns {Promise<Object>} Refresh result
   */
  async refreshToken() {
    try {
      console.log("🔄 [AUTH] Refreshing token...");

      const refreshToken = adminApiClient.getRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token found");
      }

      const response = await adminApiClient.post("/auth/refresh-token", {
        refreshToken,
      });

      if (response.success && response.data) {
        adminApiClient.setAdminToken(response.data.token);
        if (response.data.refreshToken) {
          adminApiClient.setRefreshToken(response.data.refreshToken);
        }

        console.log("✅ [AUTH] Token refreshed successfully");
        return {
          success: true,
          token: response.data.token,
        };
      }

      throw new Error(response.message || "Token refresh failed");
    } catch (error) {
      console.error("❌ [AUTH] Token refresh error:", error);

      // Clear invalid tokens
      adminApiClient.clearTokens();

      return {
        success: false,
        error: apiUtils.formatErrorMessage(error),
      };
    }
  },

  /**
   * 🔒 Change Password
   * @param {Object} passwordData - Current and new password
   * @returns {Promise<Object>} Change password result
   */
  async changePassword(passwordData) {
    try {
      console.log("🔒 [AUTH] Changing password...");

      const response = await adminApiClient.post("/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.success) {
        console.log("✅ [AUTH] Password changed successfully");
        return { success: true };
      }

      console.log("❌ [AUTH] Password change failed");
      return {
        success: false,
        message: response.message || "Password change failed",
      };
    } catch (error) {
      console.error("❌ [AUTH] Change password error:", error);
      return {
        success: false,
        message: apiUtils.formatErrorMessage(error),
      };
    }
  },
};
