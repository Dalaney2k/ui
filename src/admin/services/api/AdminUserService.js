// 👥 ADMIN USER SERVICE - Chuẩn hóa hoàn toàn
import { adminApiClient, apiUtils } from "./AdminApiClient.js";

/**
 * ✅ ADMIN USER SERVICE
 * - Centralized user management
 * - CRUD operations
 * - User statistics
 * - Role management
 */
export const adminUserService = {
  /**
   * 👥 Get Users with Filters
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} Users with pagination
   */
  async getUsers(filters = {}) {
    try {
      console.log("👥 [USER] Getting users with filters:", filters);

      const queryParams = {
        page: filters.page || 1,
        pageSize: filters.pageSize || 20,
      };

      // Add optional filter parameters
      if (filters.keyword?.trim()) queryParams.keyword = filters.keyword.trim();
      if (filters.role) queryParams.role = filters.role;
      if (filters.isActive !== undefined)
        queryParams.isActive = filters.isActive;

      console.log(
        "👥 [USER] Calling API endpoint: /admin/users with params:",
        queryParams
      );
      const response = await adminApiClient.get("/admin/users", queryParams);

      if (response.success && response.data) {
        console.log("✅ [USER] Users retrieved");
        return {
          success: true,
          users: response.data.users || [],
          totalCount: response.data.totalCount || 0,
          page: response.data.page || 1,
          pageSize: response.data.pageSize || 20,
          pagination: apiUtils.parsePagination(response),
        };
      }

      console.log("❌ [USER] API returned unsuccessful response");
      return {
        success: false,
        users: [],
        totalCount: 0,
        error: "Backend chưa implement /admin/users endpoint",
      };
    } catch (error) {
      console.error("❌ [USER] Get users error:", error);

      // Return detailed error information
      const errorMessage =
        error.response?.status === 401
          ? "Chưa đăng nhập admin hoặc token hết hạn"
          : error.response?.status === 404
          ? "Backend chưa implement /admin/users endpoint"
          : `Lỗi API: ${apiUtils.formatErrorMessage(error)}`;

      return {
        success: false,
        users: [],
        totalCount: 0,
        error: errorMessage,
      };
    }
  },

  /**
   * 🔍 Get User by ID
   * @param {string|number} userId - User ID
   * @returns {Promise<Object>} User details
   */
  async getUserById(userId) {
    try {
      console.log("🔍 [USER] Getting user by ID:", userId);

      const response = await adminApiClient.get(`/admin/users/${userId}`);

      if (response.success && response.data) {
        console.log("✅ [USER] User retrieved");
        return {
          success: true,
          data: response.data,
        };
      }

      console.log("❌ [USER] User not found");
      return {
        success: false,
        data: null,
        error: "User not found",
      };
    } catch (error) {
      console.error("❌ [USER] Get user by ID error:", error);
      return {
        success: false,
        data: null,
        error: apiUtils.formatErrorMessage(error),
      };
    }
  },

  /**
   * ➕ Create New User
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  async createUser(userData) {
    try {
      console.log("➕ [USER] Creating user:", userData.email);

      // Prepare request payload with all user fields
      const payload = {
        // Basic Information
        email: userData.email,
        userName: userData.userName,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber || null,
        dateOfBirth: userData.dateOfBirth || null,
        gender: userData.gender || 1,
        avatar: userData.avatar || null,

        // Role & Status
        role: userData.role || "Customer",
        isActive: userData.isActive !== false,
        status: userData.status || 2, // Active by default
        tier: userData.tier || 1,

        // Preferences
        preferredLanguage: userData.preferredLanguage || "vi",
        preferredCurrency: userData.preferredCurrency || "VND",
        emailNotifications: userData.emailNotifications !== false,
        smsNotifications: userData.smsNotifications || false,
        pushNotifications: userData.pushNotifications !== false,

        // Staff specific fields
        ...(userData.role === "Staff" && {
          department: userData.department,
          position: userData.position,
          salary: userData.salary,
          startDate: userData.startDate,
          permissions: userData.permissions || {},
        }),

        // Customer specific fields
        ...(userData.role === "Customer" && {
          initialPoints: userData.initialPoints || 0,
          initialSpent: userData.initialSpent || 0,
          referralCode: userData.referralCode,
        }),

        // Initial address (optional)
        ...(userData.addAddress &&
          userData.address && {
            initialAddress: userData.address,
          }),
      };

      console.log("➕ [USER] Sending payload:", payload);

      const response = await adminApiClient.post("/admin/users", payload);

      if (response.success) {
        console.log("✅ [USER] User created successfully");
        return {
          success: true,
          data: response.data,
          message: "User created successfully",
        };
      }

      console.log("❌ [USER] User creation failed");
      return {
        success: false,
        data: null,
        error: response.message || "Failed to create user",
      };
    } catch (error) {
      console.error("❌ [USER] Create user error:", error);
      return {
        success: false,
        data: null,
        error: apiUtils.formatErrorMessage(error),
      };
    }
  },

  /**
   * ✏️ Check Username Availability
   * @param {string} username - Username to check
   * @returns {Promise<Object>} Availability result
   */
  async checkUsernameAvailability(username) {
    try {
      console.log("🔍 [USER] Checking username availability:", username);

      const response = await adminApiClient.get("/admin/users/check-username", {
        username: username,
      });

      if (response.success) {
        console.log("✅ [USER] Username availability checked");
        return {
          success: true,
          available: response.data.available,
          message: response.data.message,
        };
      }

      // Default to unavailable if API fails
      return {
        success: false,
        available: false,
        message: "Unable to check username availability",
      };
    } catch (error) {
      console.error("❌ [USER] Check username availability error:", error);
      return {
        success: false,
        available: false,
        message: "Unable to check username availability",
      };
    }
  },

  /**
   * 📧 Check Email Availability
   * @param {string} email - Email to check
   * @returns {Promise<Object>} Availability result
   */
  async checkEmailAvailability(email) {
    try {
      console.log("📧 [USER] Checking email availability:", email);

      const response = await adminApiClient.get("/admin/users/check-email", {
        email: email,
      });

      if (response.success) {
        console.log("✅ [USER] Email availability checked");
        return {
          success: true,
          available: response.data.available,
          message: response.data.message,
        };
      }

      // Default to unavailable if API fails
      return {
        success: false,
        available: false,
        message: "Unable to check email availability",
      };
    } catch (error) {
      console.error("❌ [USER] Check email availability error:", error);
      return {
        success: false,
        available: false,
        message: "Unable to check email availability",
      };
    }
  },

  /**
   * ✏️ Update User
   * @param {string|number} userId - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Updated user
   */
  async updateUser(userId, userData) {
    try {
      console.log("✏️ [USER] Updating user:", userId);

      const response = await adminApiClient.put(
        `/admin/users/${userId}`,
        userData
      );

      if (response.success) {
        console.log("✅ [USER] User updated successfully");
        return {
          success: true,
          data: response.data,
          message: "User updated successfully",
        };
      }

      console.log("❌ [USER] User update failed");
      return {
        success: false,
        data: null,
        error: response.message || "Failed to update user",
      };
    } catch (error) {
      console.error("❌ [USER] Update user error:", error);
      return {
        success: false,
        data: null,
        error: apiUtils.formatErrorMessage(error),
      };
    }
  },

  /**
   * 🔄 Toggle User Status
   * @param {string|number} userId - User ID
   * @param {boolean} isActive - New active status
   * @returns {Promise<Object>} Update result
   */
  async toggleUserStatus(userId, isActive) {
    try {
      console.log("🔄 [USER] Toggling user status:", userId, isActive);

      const response = await adminApiClient.patch(
        `/admin/users/${userId}/status`,
        {
          isActive,
        }
      );

      if (response.success) {
        console.log("✅ [USER] User status updated successfully");
        return {
          success: true,
          data: response.data,
          message: `User ${
            isActive ? "activated" : "deactivated"
          } successfully`,
        };
      }

      console.log("❌ [USER] User status update failed");
      return {
        success: false,
        error: response.message || "Failed to update user status",
      };
    } catch (error) {
      console.error("❌ [USER] Toggle user status error:", error);
      return {
        success: false,
        error: apiUtils.formatErrorMessage(error),
      };
    }
  },

  /**
   * 📊 Get User Statistics
   * @returns {Promise<Object>} User statistics
   */
  async getUserStats() {
    try {
      console.log("📊 [USER] Getting user statistics...");

      const response = await adminApiClient.get("/admin/users/stats");

      if (response.success && response.data) {
        console.log("✅ [USER] User statistics retrieved");
        return {
          success: true,
          data: response.data,
        };
      }

      console.log("❌ [USER] User statistics not available");
      return {
        success: false,
        data: {
          totalUsers: 0,
          activeUsers: 0,
          newUsersToday: 0,
          newUsersThisMonth: 0,
        },
        error: "User statistics not available",
      };
    } catch (error) {
      console.error("❌ [USER] Get user stats error:", error);
      return {
        success: false,
        data: {
          totalUsers: 0,
          activeUsers: 0,
          newUsersToday: 0,
          newUsersThisMonth: 0,
        },
        error: apiUtils.formatErrorMessage(error),
      };
    }
  },

  /**
   * 🗑️ Delete User
   * @param {string|number} userId - User ID
   * @returns {Promise<Object>} Delete result
   */
  async deleteUser(userId) {
    try {
      console.log("🗑️ [USER] Deleting user:", userId);

      const response = await adminApiClient.delete(`/admin/users/${userId}`);

      if (response.success) {
        console.log("✅ [USER] User deleted successfully");
        return {
          success: true,
          message: "User deleted successfully",
        };
      }

      console.log("❌ [USER] User deletion failed");
      return {
        success: false,
        error: response.message || "Failed to delete user",
      };
    } catch (error) {
      console.error("❌ [USER] Delete user error:", error);
      return {
        success: false,
        error: apiUtils.formatErrorMessage(error),
      };
    }
  },

  /**
   * 🔒 Reset User Password
   * @param {string|number} userId - User ID
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Reset result
   */
  async resetUserPassword(userId, newPassword) {
    try {
      console.log("🔒 [USER] Resetting user password:", userId);

      const response = await adminApiClient.patch(
        `/admin/users/${userId}/reset-password`,
        {
          newPassword,
        }
      );

      if (response.success) {
        console.log("✅ [USER] Password reset successfully");
        return {
          success: true,
          message: "Password reset successfully",
        };
      }

      console.log("❌ [USER] Password reset failed");
      return {
        success: false,
        error: response.message || "Failed to reset password",
      };
    } catch (error) {
      console.error("❌ [USER] Reset password error:", error);
      return {
        success: false,
        error: apiUtils.formatErrorMessage(error),
      };
    }
  },

  /**
   * 👑 Update User Role
   * @param {string|number} userId - User ID
   * @param {string} role - New role
   * @returns {Promise<Object>} Update result
   */
  async updateUserRole(userId, role) {
    try {
      console.log("👑 [USER] Updating user role:", userId, role);

      const response = await adminApiClient.patch(
        `/admin/users/${userId}/role`,
        {
          role,
        }
      );

      if (response.success) {
        console.log("✅ [USER] User role updated successfully");
        return {
          success: true,
          data: response.data,
          message: "User role updated successfully",
        };
      }

      console.log("❌ [USER] User role update failed");
      return {
        success: false,
        error: response.message || "Failed to update user role",
      };
    } catch (error) {
      console.error("❌ [USER] Update user role error:", error);
      return {
        success: false,
        error: apiUtils.formatErrorMessage(error),
      };
    }
  },
};
