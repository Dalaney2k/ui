// hooks/useWishlist.js - Wishlist Management Hook
import { useState, useEffect, useCallback, useContext, useMemo } from "react";
import { wishlistService } from "../services";
import { useAuth } from "./useAuth";
import CartContext from "../contexts/CartContext";

export const useWishlist = () => {
  const [wishlists, setWishlists] = useState([]);
  const [defaultWishlist, setDefaultWishlist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isApiReady, setIsApiReady] = useState(() => {
    // Check if we've previously detected API is not ready
    return localStorage.getItem("wishlist_api_not_ready") !== "true";
  });

  const { user, isInitialized } = useAuth();
  const cartContext = useContext(CartContext);

  // Fetch all wishlists
  const fetchWishlists = useCallback(async () => {
    // Don't fetch if auth is not initialized yet
    if (!isInitialized) {
      console.log("⏳ Waiting for auth initialization...");
      return;
    }

    if (!user) {
      setWishlists([]);
      setDefaultWishlist(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await wishlistService.getWishlists();

      // Extract data safely
      let wishlistsData = [];
      if (response && response.data) {
        if (Array.isArray(response.data)) {
          wishlistsData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          wishlistsData = response.data.data;
        }
      }

      console.log("📋 Extracted wishlists data:", wishlistsData);
      setWishlists(wishlistsData);

      // Find default wishlist safely
      const defaultWL = Array.isArray(wishlistsData)
        ? wishlistsData.find((w) => w.isDefault)
        : null;
      setDefaultWishlist(defaultWL);

      console.log(
        "📋 Wishlists loaded:",
        Array.isArray(wishlistsData) ? wishlistsData.length : 0
      );
    } catch (err) {
      console.error("❌ Error fetching wishlists:", err);
      setError(err.message);

      // If API not ready, set empty state but don't crash
      if (
        err.message.includes("chưa được backend implement") ||
        err.message.includes("404")
      ) {
        console.warn("⚠️ Wishlist API not ready, using empty state");
        setWishlists([]);
        setDefaultWishlist(null);
        setIsApiReady(false);
      }
    } finally {
      setLoading(false);
    }
  }, [user, isInitialized]);

  // Add product to wishlist
  const addToWishlist = useCallback(
    async (productId, wishlistId = null, notes = "") => {
      try {
        const result = await wishlistService.addToWishlist(
          productId,
          wishlistId,
          notes
        );

        // Refresh wishlists to get updated counts
        await fetchWishlists();

        console.log("✅ Added to wishlist");
        return result;
      } catch (err) {
        console.error("❌ Error adding to wishlist:", err);

        // Show user-friendly message for API not ready
        if (
          err.message.includes("chưa được backend implement") ||
          err.message.includes("404")
        ) {
          throw new Error(
            "Tính năng wishlist đang được phát triển. Vui lòng thử lại sau."
          );
        }

        throw err;
      }
    },
    [fetchWishlists]
  );

  // Remove from wishlist
  const removeFromWishlist = useCallback(
    async (wishlistItemId) => {
      try {
        await wishlistService.removeFromWishlist(wishlistItemId);

        // Refresh wishlists to get updated counts
        await fetchWishlists();

        console.log("✅ Removed from wishlist");
      } catch (err) {
        console.error("❌ Error removing from wishlist:", err);
        throw err;
      }
    },
    [fetchWishlists]
  );

  // Check if product is in wishlist
  const isInWishlist = useCallback(
    (productId) => {
      return wishlists.some((wishlist) =>
        wishlist.items?.some((item) => item.productId === productId)
      );
    },
    [wishlists]
  );

  // Get wishlist items for a product
  const getWishlistItems = useCallback(
    (productId) => {
      const items = [];
      wishlists.forEach((wishlist) => {
        const item = wishlist.items?.find(
          (item) => item.productId === productId
        );
        if (item) {
          items.push({
            ...item,
            wishlistName: wishlist.name,
            wishlistId: wishlist.id,
          });
        }
      });
      return items;
    },
    [wishlists]
  );

  // Move item to cart
  const moveToCart = useCallback(
    async (wishlistItemId, quantity = 1) => {
      try {
        await wishlistService.moveToCart(wishlistItemId, quantity);

        // Refresh both wishlist and cart
        await fetchWishlists();
        if (cartContext?.loadCart) {
          await cartContext.loadCart();
        }

        console.log("✅ Moved to cart");
      } catch (err) {
        console.error("❌ Error moving to cart:", err);
        throw err;
      }
    },
    [fetchWishlists, cartContext]
  );

  // Initialize - fetch wishlists when user logs in
  useEffect(() => {
    if (user && isInitialized) {
      // Only try to fetch if we haven't detected API is not ready
      if (isApiReady) {
        fetchWishlists();
      } else {
        console.warn("⚠️ Wishlist API not ready, skipping fetch");
      }
    } else {
      setWishlists([]);
      setDefaultWishlist(null);
      setError(null);
    }
  }, [user, isInitialized, fetchWishlists, isApiReady]);

  // Get all wishlist items for display
  const wishlistItems = useMemo(() => {
    return Array.isArray(wishlists)
      ? wishlists.reduce((acc, wishlist) => {
          if (wishlist.items && wishlist.items.length > 0) {
            acc.push(...wishlist.items);
          }
          return acc;
        }, [])
      : [];
  }, [wishlists]);

  // Get total count for badge
  const wishlistCount = wishlistItems.length;

  // Debug wishlist data (less frequently for performance)
  useEffect(() => {
    if (import.meta.env.DEV && Math.random() < 0.1) {
      console.log("🔍 useWishlist debug:", {
        wishlists: Array.isArray(wishlists) ? wishlists.length : 0,
        wishlistItems: wishlistItems.length,
        wishlistCount,
        user: user?.name || "not logged in",
        isInitialized,
        isApiReady,
      });
    }
  }, [
    wishlists,
    wishlistItems.length,
    wishlistCount,
    user,
    isInitialized,
    isApiReady,
  ]);

  // Simple toggle function for product cards with notifications
  const toggleWishlist = useCallback(
    async (productId, productName = "sản phẩm", onNotification = null) => {
      if (!user) {
        const error = "Vui lòng đăng nhập để sử dụng tính năng yêu thích";
        if (onNotification) {
          onNotification("warning", "Cần đăng nhập", error);
        }
        throw new Error(error);
      }

      try {
        const isCurrentlyInWishlist = isInWishlist(productId);

        if (isCurrentlyInWishlist) {
          // Find the item to remove
          const itemToRemove = wishlistItems.find(
            (item) => item.productId === productId
          );
          if (itemToRemove) {
            await removeFromWishlist(itemToRemove.id);
            if (onNotification) {
              onNotification(
                "info",
                "Đã xóa",
                `Đã xóa ${productName} khỏi danh sách yêu thích`
              );
            }
            // Force UI update
            setTimeout(() => fetchWishlists(), 100);
          }
        } else {
          // Add to default wishlist
          await addToWishlist(productId);
          if (onNotification) {
            onNotification(
              "success",
              "Thành công!",
              `Đã thêm ${productName} vào danh sách yêu thích`
            );
          }
          // Force UI update
          setTimeout(() => fetchWishlists(), 100);
        }

        return { success: true, isInWishlist: !isCurrentlyInWishlist };
      } catch (err) {
        console.error("❌ Error toggling wishlist:", err);
        if (onNotification) {
          onNotification(
            "error",
            "Lỗi!",
            err.message || "Không thể cập nhật danh sách yêu thích"
          );
        }
        throw err;
      }
    },
    [
      user,
      isInWishlist,
      wishlistItems,
      removeFromWishlist,
      addToWishlist,
      fetchWishlists,
    ]
  );

  return {
    // State
    wishlists,
    defaultWishlist,
    wishlistItems, // Array of all items from all wishlists
    wishlistCount, // Total count for badge
    loading,
    error,
    isApiReady,

    // Actions
    fetchWishlists,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist, // Simple toggle for product cards
    moveToCart,

    // Utilities
    isInWishlist,
    getWishlistItems,
  };
};

export default useWishlist;
