// src/services/userService.js - Fixed Token Storage Keys
import apiClient from "./api";

export const userService = {
  // ✅ Login with consistent token storage
  login: async (credentials) => {
    try {
      console.log("🔍 userService.login: Attempting login with:", {
        email: credentials.email,
      });

      const response = await apiClient.post("/auth/login", {
        email: credentials.email,
        password: credentials.password,
        rememberMe: credentials.rememberMe || false,
      });

      console.log("✅ userService.login: Login successful:", response);

      // 🔧 FIX: Use consistent token storage keys
      if (response.data?.token) {
        localStorage.setItem("accessToken", response.data.token); // Changed from "auth_token"
        localStorage.setItem("refreshToken", response.data.refreshToken); // Changed from "refresh_token"
        localStorage.setItem("user_data", JSON.stringify(response.data.user));
        localStorage.setItem("tokenExpiresAt", response.data.expiresAt); // Changed from "token_expires_at"
      }

      return {
        success: response.success, // 🔧 FIX: Return actual response.success
        data: response.data, // 🔧 FIX: Return data object to match AuthContext expectations
        user: response.data?.user || null,
        token: response.data?.token || null,
        refreshToken: response.data?.refreshToken || null,
        expiresAt: response.data?.expiresAt || null,
        message: response.message,
      };
    } catch (error) {
      console.error("❌ userService.login: Error:", error);
      throw error;
    }
  },

  // ✅ Register with consistent token storage
  register: async (userData) => {
    try {
      console.log("🔍 userService.register: Attempting registration", userData);

      const payload = {
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
      };

      // Add optional fields if provided
      if (userData.phoneNumber) payload.phoneNumber = userData.phoneNumber;
      if (userData.dateOfBirth) payload.dateOfBirth = userData.dateOfBirth;
      if (userData.gender) payload.gender = userData.gender;
      if (userData.preferredLanguage)
        payload.preferredLanguage = userData.preferredLanguage;
      if (userData.acceptTerms !== undefined)
        payload.acceptTerms = userData.acceptTerms;
      if (userData.emailNotifications !== undefined)
        payload.emailNotifications = userData.emailNotifications;
      if (userData.smsNotifications !== undefined)
        payload.smsNotifications = userData.smsNotifications;

      const response = await apiClient.post("/auth/register", payload);

      console.log(
        "✅ userService.register: Registration successful:",
        response
      );

      // 🔧 FIX: Use consistent token storage keys
      if (response.data?.token) {
        localStorage.setItem("accessToken", response.data.token); // Changed from "auth_token"
        localStorage.setItem("refreshToken", response.data.refreshToken); // Changed from "refresh_token"
        localStorage.setItem("user_data", JSON.stringify(response.data.user));
        localStorage.setItem("tokenExpiresAt", response.data.expiresAt); // Changed from "token_expires_at"
      }

      return {
        success: response.success, // 🔧 FIX: Return actual response.success
        data: response.data, // 🔧 FIX: Return data object to match AuthContext expectations
        user: response.data?.user || response.user || null,
        token: response.data?.token || response.token || null,
        refreshToken:
          response.data?.refreshToken || response.refreshToken || null,
        expiresAt: response.data?.expiresAt || response.expiresAt || null,
        message: response.message || "Đăng ký thành công!",
      };
    } catch (error) {
      console.error("❌ userService.register: Error:", error);
      throw error;
    }
  },

  // ✅ Get Current User Info (GET /api/auth/me)
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get("/auth/me");

      // Update stored user data
      if (response.data) {
        localStorage.setItem("user_data", JSON.stringify(response.data));
      }

      return {
        success: response.success,
        data: response.data, // 🔧 FIX: Return data object
        user: response.data || null,
        message: response.message,
      };
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  },

  // ✅ Check Authentication Status (GET /api/auth/check)
  checkAuthStatus: async () => {
    try {
      const response = await apiClient.get("/auth/check");
      return {
        isAuthenticated: response.data?.isAuthenticated || false,
        user: response.data?.user || null,
        success: response.success,
        message: response.message,
      };
    } catch (error) {
      console.error("Error checking auth status:", error);
      throw error;
    }
  },

  // ✅ Logout with consistent token keys
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken"); // Changed from "refresh_token"
      if (refreshToken) {
        await apiClient.post("/auth/logout", {
          refreshToken: refreshToken,
        });
      }
    } catch (error) {
      console.warn("Logout API call failed:", error);
    } finally {
      // 🔧 FIX: Clear all possible token keys for cleanup
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user_data");
      localStorage.removeItem("tokenExpiresAt");
      // Legacy cleanup
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("token_expires_at");
      localStorage.removeItem("authToken");
    }
  },

  // ✅ Refresh Token with consistent keys
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken"); // Changed from "refresh_token"
      const accessToken = localStorage.getItem("accessToken"); // Changed from "auth_token"

      if (!refreshToken || !accessToken) {
        throw new Error("No refresh token or access token available");
      }

      const response = await apiClient.post("/auth/refresh-token", {
        accessToken: accessToken,
        refreshToken: refreshToken,
      });

      if (response.data?.token) {
        localStorage.setItem("accessToken", response.data.token); // Changed from "auth_token"
        localStorage.setItem("refreshToken", response.data.refreshToken); // Changed from "refresh_token"
        localStorage.setItem("tokenExpiresAt", response.data.expiresAt); // Changed from "token_expires_at"
      }

      return {
        token: response.data?.token || null,
        refreshToken: response.data?.refreshToken || null,
        expiresAt: response.data?.expiresAt || null,
        success: response.success,
        message: response.message,
      };
    } catch (error) {
      console.error("Error refreshing token:", error);
      // Clear tokens if refresh fails
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user_data");
      localStorage.removeItem("tokenExpiresAt");
      throw error;
    }
  },

  // ✅ Revoke Specific Token
  revokeToken: async (refreshToken) => {
    try {
      const tokenToRevoke =
        refreshToken || localStorage.getItem("refreshToken"); // Changed from "refresh_token"

      const response = await apiClient.post("/auth/revoke-token", {
        refreshToken: tokenToRevoke,
      });

      return {
        success: response.success,
        message: response.message,
      };
    } catch (error) {
      console.error("Error revoking token:", error);
      throw error;
    }
  },

  // ✅ Revoke All Tokens
  revokeAllTokens: async () => {
    try {
      const response = await apiClient.post("/auth/revoke-all-tokens");

      // Clear local storage after revoking all tokens
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user_data");
      localStorage.removeItem("tokenExpiresAt");

      return {
        success: response.success,
        message: response.message,
      };
    } catch (error) {
      console.error("Error revoking all tokens:", error);
      throw error;
    }
  },

  // ✅ Change Password
  changePassword: async (passwordData) => {
    try {
      const response = await apiClient.post("/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      return {
        success: response.success,
        message: response.message,
      };
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  },

  // ✅ Forgot Password
  forgotPassword: async (email) => {
    try {
      const response = await apiClient.post("/auth/forgot-password", {
        email: email,
      });

      return {
        success: response.success,
        message: response.message,
      };
    } catch (error) {
      console.error("Error sending forgot password email:", error);
      throw error;
    }
  },

  // ✅ Reset Password
  resetPassword: async (resetData) => {
    try {
      const response = await apiClient.post("/auth/reset-password", {
        email: resetData.email,
        token: resetData.token,
        newPassword: resetData.newPassword,
        confirmPassword: resetData.confirmPassword,
      });

      return {
        success: response.success,
        message: response.message,
      };
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  },

  // ✅ Verify Email
  verifyEmail: async (verificationData) => {
    try {
      const response = await apiClient.post("/auth/verify-email", {
        email: verificationData.email,
        token: verificationData.token,
      });

      return {
        success: response.success,
        message: response.message,
      };
    } catch (error) {
      console.error("Error verifying email:", error);
      throw error;
    }
  },

  // ✅ Resend Email Verification
  resendEmailVerification: async (email) => {
    try {
      const response = await apiClient.post(
        "/auth/resend-email-verification",
        email
      );

      return {
        success: response.success,
        message: response.message,
      };
    } catch (error) {
      console.error("Error resending email verification:", error);
      throw error;
    }
  },

  // Profile Management
  updateProfile: async (userData) => {
    try {
      console.log(
        "📝 userService.updateProfile: Updating profile with:",
        userData
      );
      const response = await apiClient.put("/user/profile", userData);
      console.log("✅ userService.updateProfile: Success:", response);

      // Update stored user data
      if (response.data) {
        localStorage.setItem("user_data", JSON.stringify(response.data));
      }

      return {
        user: response.data || null,
        success: response.success,
        message: response.message || "Cập nhật thông tin thành công",
      };
    } catch (error) {
      console.error("❌ userService.updateProfile: Error:", error);
      throw error;
    }
  },

  // Get user statistics
  getUserStats: async () => {
    try {
      const response = await apiClient.get("/user/stats");
      return {
        stats: response.data || null,
        success: response.success,
        message: response.message,
      };
    } catch (error) {
      console.error("❌ userService.getUserStats: Error:", error);
      throw error;
    }
  },

  // Get user activities/audit log
  getUserActivities: async (params = {}) => {
    try {
      const response = await apiClient.get("/user/activities", {
        page: params.page || 1,
        pageSize: params.pageSize || 20,
        ...params,
      });
      return {
        activities: response.data || [],
        pagination: response.pagination || {},
        success: response.success,
        message: response.message,
      };
    } catch (error) {
      console.error("❌ userService.getUserActivities: Error:", error);
      // Return mock data for now if API not implemented
      return {
        activities: [
          {
            id: 1,
            activityType: "Login",
            description: "Đăng nhập hệ thống",
            ipAddress: "192.168.1.1",
            createdAt: new Date().toISOString(),
          },
          {
            id: 2,
            activityType: "ChangePassword",
            description: "Thay đổi mật khẩu",
            ipAddress: "192.168.1.1",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
        ],
        success: true,
        message: "Activities loaded (mock data)",
      };
    }
  },

  // Helper Functions with consistent token keys
  // Check if user is logged in
  isLoggedIn: () => {
    const token = localStorage.getItem("accessToken"); // Changed from "auth_token"
    const userData = localStorage.getItem("user_data");
    const expiresAt = localStorage.getItem("tokenExpiresAt"); // Changed from "token_expires_at"

    if (!token || !userData) {
      return false;
    }

    // Check if token is expired
    if (expiresAt) {
      const expirationTime = new Date(expiresAt).getTime();
      const currentTime = new Date().getTime();

      if (currentTime >= expirationTime) {
        // Token expired, clear storage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user_data");
        localStorage.removeItem("tokenExpiresAt");
        return false;
      }
    }

    return true;
  },

  // Get stored user data
  getStoredUser: () => {
    try {
      const userData = localStorage.getItem("user_data");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing stored user data:", error);
      return null;
    }
  },

  // Get stored token
  getStoredToken: () => {
    return localStorage.getItem("accessToken"); // Changed from "auth_token"
  },

  // Legacy aliases for backward compatibility
  getProfile: async () => {
    return await userService.getCurrentUser();
  },
};
