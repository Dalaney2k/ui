// src/contexts/AuthContext.jsx - Fixed to match userService token keys
import React, { createContext, useContext, useState, useEffect } from "react";
import { userService } from "../services";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Constants for enum values
const USER_ROLES = {
  1: "Customer",
  2: "Admin",
  3: "SuperAdmin",
};

const USER_TIERS = {
  1: "Bronze",
  2: "Silver",
  3: "Gold",
  4: "Platinum",
};

const USER_STATUS = {
  1: "Pending",
  2: "Active",
  3: "Suspended",
  4: "Inactive",
};

const GENDER = {
  0: "Unknown",
  1: "Male",
  2: "Female",
  3: "Other",
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Transform user data from API response to app format
  const transformUserData = (apiUser) => {
    if (!apiUser) return null;

    return {
      id: apiUser.id,
      email: apiUser.email,
      firstName: apiUser.firstName,
      lastName: apiUser.lastName,
      fullName: apiUser.fullName,
      name: apiUser.fullName, // Alias for backward compatibility

      // Profile info
      gender: GENDER[apiUser.gender] || "Unknown",
      genderCode: apiUser.gender,
      avatar:
        apiUser.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          apiUser.fullName
        )}&background=ef4444&color=fff`,
      phone: apiUser.phone || apiUser.phoneNumber,

      // Account info
      role: USER_ROLES[apiUser.role] || "Customer",
      roleCode: apiUser.role,
      tier: USER_TIERS[apiUser.tier] || "Bronze",
      tierCode: apiUser.tier,
      status: USER_STATUS[apiUser.status] || "Active",
      statusCode: apiUser.status,

      // Points & spending
      points: apiUser.points || 0,
      totalSpent: apiUser.totalSpent || 0,

      // Verification status
      emailVerified: apiUser.emailVerified || false,
      phoneVerified: apiUser.phoneVerified || false,

      // Preferences
      preferredLanguage: apiUser.preferredLanguage || "vi",
      preferredCurrency: apiUser.preferredCurrency || "VND",

      // Notifications
      emailNotifications: apiUser.emailNotifications !== false,
      smsNotifications: apiUser.smsNotifications || false,
      pushNotifications: apiUser.pushNotifications !== false,

      // Timestamps
      createdAt: apiUser.createdAt,
      lastLoginAt: apiUser.lastLoginAt,

      // Additional fields for checkout
      addresses: apiUser.addresses || [],
    };
  };

  // Check for stored user data on app load
  useEffect(() => {
    const checkStoredUser = () => {
      try {
        if (userService.isLoggedIn()) {
          const storedUser = userService.getStoredUser();
          if (storedUser) {
            const transformedUser = transformUserData(storedUser);
            setUser(transformedUser);
          }
        }
      } catch (error) {
        console.error("Error checking stored user:", error);
        // Clear invalid stored data
        userService.logout();
      } finally {
        setIsInitialized(true);
      }
    };

    checkStoredUser();
  }, []);

  // Login function
  const login = async (credentials) => {
    setIsAuthLoading(true);
    try {
      const response = await userService.login(credentials);

      console.log("🔍 AuthContext.login: userService response:", response);

      // 🔧 FIX: Check both response.success AND response.data structure
      if (response.success && response.data?.user) {
        const transformedUser = transformUserData(response.data.user);
        setUser(transformedUser);

        // 🔧 FIX: Tokens are already stored in userService.login()
        // No need to duplicate storage here

        return {
          success: true,
          user: transformedUser,
          message: response.message || "Đăng nhập thành công",
        };
      }

      // 🔧 FIX: Also handle case where response.success is true but no data.user
      if (response.success && response.user) {
        const transformedUser = transformUserData(response.user);
        setUser(transformedUser);

        return {
          success: true,
          user: transformedUser,
          message: response.message || "Đăng nhập thành công",
        };
      }

      return {
        success: false,
        message: response.message || "Đăng nhập thất bại",
        errors: response.errors || [],
      };
    } catch (error) {
      console.error("❌ AuthContext.login error:", error);
      return {
        success: false,
        message: error.message || "Không thể kết nối đến server",
        errors: [error.message],
      };
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setIsAuthLoading(true);
    try {
      const response = await userService.register(userData);

      console.log("🔍 AuthContext.register: userService response:", response);

      // 🔧 FIX: Check both response.success AND response.data structure
      if (response.success && response.data?.user) {
        const transformedUser = transformUserData(response.data.user);
        setUser(transformedUser);

        // 🔧 FIX: Tokens are already stored in userService.register()
        // No need to duplicate storage here

        return {
          success: true,
          user: transformedUser,
          message: response.message || "Đăng ký thành công",
        };
      }

      // 🔧 FIX: Also handle case where response.success is true but no data.user
      if (response.success && response.user) {
        const transformedUser = transformUserData(response.user);
        setUser(transformedUser);

        return {
          success: true,
          user: transformedUser,
          message: response.message || "Đăng ký thành công",
        };
      }

      return {
        success: false,
        message: response.message || "Đăng ký thất bại",
        errors: response.errors || [],
      };
    } catch (error) {
      console.error("❌ AuthContext.register error:", error);
      return {
        success: false,
        message: error.message || "Không thể kết nối đến server",
        errors: [error.message],
      };
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await userService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      // 🔧 FIX: userService.logout() already clears tokens, no need to duplicate
    }
  };

  // Update user info
  const updateUser = (userData) => {
    const updatedUser = transformUserData({ ...user, ...userData });
    setUser(updatedUser);

    // Update stored user data if needed
    try {
      const storedUser = userService.getStoredUser();
      if (storedUser) {
        userService.updateStoredUser({ ...storedUser, ...userData });
      }
    } catch (error) {
      console.error("Error updating stored user:", error);
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const response = await userService.getCurrentUser();
      if (response.success && response.data?.user) {
        const transformedUser = transformUserData(response.data.user);
        setUser(transformedUser);
        return { success: true, user: transformedUser };
      }
      return { success: false, message: "Không thể tải thông tin người dùng" };
    } catch (error) {
      console.error("Refresh user error:", error);
      return { success: false, message: error.message };
    }
  };

  // Check if token is expired using consistent key
  const isTokenExpired = () => {
    const expiresAt = localStorage.getItem("tokenExpiresAt"); // 🔧 FIX: Use consistent key
    if (!expiresAt) return true;

    try {
      const expiryTime = new Date(expiresAt).getTime();
      const currentTime = new Date().getTime();
      return currentTime >= expiryTime;
    } catch {
      return true;
    }
  };

  // Auto refresh token if needed using consistent keys
  const refreshTokenIfNeeded = async () => {
    const refreshToken = localStorage.getItem("refreshToken"); // 🔧 FIX: Use consistent key
    if (!refreshToken || !isTokenExpired()) return;

    try {
      const response = await userService.refreshToken(refreshToken);
      if (response.success && response.data?.token) {
        // 🔧 FIX: userService.refreshToken() already stores tokens
        return true;
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      // If refresh fails, logout user
      logout();
    }
    return false;
  };

  // Helper functions
  const hasPermission = (permission) => {
    if (!user) return false;
    // Add permission checking logic based on user role
    return true;
  };

  const isAdmin = () => {
    return user?.roleCode >= 2; // Admin or SuperAdmin
  };

  const canCheckout = () => {
    return user?.statusCode === 2; // Active status
  };

  const value = {
    // User state
    user,
    isAuthLoading,
    isInitialized,
    isLoggedIn: !!user,

    // Auth actions
    login,
    register,
    logout,
    updateUser,
    refreshUser,

    // Token management
    isTokenExpired,
    refreshTokenIfNeeded,

    // Helper functions
    hasPermission,
    isAdmin,
    canCheckout,

    // User info helpers
    getUserDisplayName: () => user?.fullName || user?.name || "Người dùng",
    getUserInitials: () => {
      if (!user?.fullName) return "U";
      return user.fullName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    },
    getTierDisplay: () => {
      const tierNames = {
        Bronze: "🥉 Đồng",
        Silver: "🥈 Bạc",
        Gold: "🥇 Vàng",
        Platinum: "💎 Bạch Kim",
      };
      return tierNames[user?.tier] || "🥉 Đồng";
    },

    // Constants for components
    USER_ROLES,
    USER_TIERS,
    USER_STATUS,
    GENDER,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
