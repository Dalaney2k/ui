// hooks/useAuth.js - Custom Authentication Hook
import { useState, useEffect, useCallback, useContext } from "react";
import { userService } from "../services";
import CartContext from "../contexts/CartContext";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Get cart context for merging guest cart
  const cartContext = useContext(CartContext);

  // Initialize auth state from stored data
  useEffect(() => {
    const initializeAuth = () => {
      try {
        if (userService.isLoggedIn()) {
          const storedUser = userService.getStoredUser();
          if (storedUser) {
            setUser({
              id: storedUser.id,
              name:
                storedUser.fullName ||
                `${storedUser.firstName} ${storedUser.lastName}`,
              email: storedUser.email,
              firstName: storedUser.firstName,
              lastName: storedUser.lastName,
              avatar:
                storedUser.avatar ||
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
              tier: storedUser.tier,
              points: storedUser.points,
              totalSpent: storedUser.totalSpent,
            });
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Clear invalid stored data
        userService.logout();
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  // Login function with cart merging
  const login = useCallback(
    async (credentials) => {
      setIsLoading(true);
      try {
        const response = await userService.login(credentials);

        if (response.success && response.user) {
          const userData = {
            id: response.user.id,
            name:
              response.user.fullName ||
              `${response.user.firstName} ${response.user.lastName}`,
            email: response.user.email,
            firstName: response.user.firstName,
            lastName: response.user.lastName,
            avatar:
              response.user.avatar ||
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
            tier: response.user.tier,
            points: response.user.points,
            totalSpent: response.user.totalSpent,
          };

          setUser(userData);

          // Merge guest cart after successful login
          try {
            if (cartContext && cartContext.mergeGuestCart) {
              console.log("🔀 Attempting to merge guest cart after login...");
              await cartContext.mergeGuestCart();

              // Force reload cart after login to ensure UI is updated
              if (cartContext.loadCart) {
                console.log("🔄 Reloading cart after login...");
                await cartContext.loadCart();
              }
            } else if (cartContext && cartContext.loadCart) {
              // If no guest cart, still reload to get user's cart
              console.log("🔄 Loading user cart after login...");
              await cartContext.loadCart();
            }
          } catch (mergeError) {
            console.error("Error merging guest cart:", mergeError);
            // Don't fail login if cart merge fails
          }

          return { success: true, user: userData, message: response.message };
        } else {
          return {
            success: false,
            message: response.message || "Thông tin đăng nhập không chính xác",
          };
        }
      } catch (error) {
        console.error("Login error:", error);
        return {
          success: false,
          message: error.message || "Không thể kết nối đến server",
        };
      } finally {
        setIsLoading(false);
      }
    },
    [cartContext]
  );

  // Register function with cart merging
  const register = useCallback(
    async (userData) => {
      setIsLoading(true);
      try {
        const response = await userService.register({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          firstName: userData.name.split(" ")[0],
          lastName: userData.name.split(" ").slice(1).join(" "),
        });

        if (response.success && response.user) {
          const newUserData = {
            id: response.user.id,
            name:
              response.user.fullName ||
              `${response.user.firstName} ${response.user.lastName}`,
            email: response.user.email,
            firstName: response.user.firstName,
            lastName: response.user.lastName,
            avatar:
              response.user.avatar ||
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
            tier: response.user.tier,
            points: response.user.points,
            totalSpent: response.user.totalSpent,
          };

          setUser(newUserData);

          // Merge guest cart after successful registration
          try {
            if (cartContext && cartContext.mergeGuestCart) {
              console.log(
                "🔀 Attempting to merge guest cart after registration..."
              );
              await cartContext.mergeGuestCart();

              // Force reload cart after registration
              if (cartContext.loadCart) {
                console.log("🔄 Reloading cart after registration...");
                await cartContext.loadCart();
              }
            } else if (cartContext && cartContext.loadCart) {
              // If no guest cart, still reload to get user's cart
              console.log("🔄 Loading user cart after registration...");
              await cartContext.loadCart();
            }
          } catch (mergeError) {
            console.error("Error merging guest cart:", mergeError);
            // Don't fail registration if cart merge fails
          }

          return {
            success: true,
            user: newUserData,
            message: response.message,
          };
        } else {
          return {
            success: false,
            message: response.message || "Không thể tạo tài khoản",
          };
        }
      } catch (error) {
        console.error("Register error:", error);
        return {
          success: false,
          message: error.message || "Không thể kết nối đến server",
        };
      } finally {
        setIsLoading(false);
      }
    },
    [cartContext]
  );

  // Logout function
  const logout = useCallback(async () => {
    try {
      await userService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  }, []);

  // Refresh token function
  const refreshToken = useCallback(async () => {
    try {
      await userService.refreshToken();
      return true;
    } catch (error) {
      console.error("Refresh token error:", error);
      // If refresh fails, logout user
      setUser(null);
      return false;
    }
  }, []);

  // Update user data
  const updateUser = useCallback((newUserData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...newUserData,
    }));
  }, []);

  return {
    user,
    isLoading,
    isInitialized,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshToken,
    updateUser,
  };
};
