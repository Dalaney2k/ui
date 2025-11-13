// hooks/useCartManagement.js - Complete Enhanced Cart Management Hook
import { useContext, useCallback, useMemo, useRef } from "react";
import { debounce } from "lodash";
import CartContext from "../contexts/CartContext";
import { useAuth } from "./useAuth";

export const useCartManagement = () => {
  const cartContext = useContext(CartContext);
  const { user } = useAuth();

  if (!cartContext) {
    throw new Error("useCartManagement must be used within a CartProvider");
  }

  const {
    cartItems,
    cartItemCount,
    cartTotal,
    totalAmount,
    totalItems,
    isGuestCart,
    loading,
    error,
    isCartOpen,
    pendingUpdates,
    lastSync,
    addToCart: contextAddToCart,
    removeFromCart: contextRemoveFromCart,
    updateQuantity: contextUpdateQuantity,
    clearCart: contextClearCart,
    openCart,
    closeCart,
    loadCart,
    mergeGuestCart,
    isInCart,
    getCartItem,
    getPerformanceMetrics,
    recoverFromBackup,
  } = cartContext;

  // ✅ NEW: Performance optimizations
  const updateTimeoutRef = useRef(null);
  const pendingUpdatesRef = useRef(new Map());

  // ✅ NEW: Derived cart statistics
  const cartStats = useMemo(() => {
    const stats = {
      subtotal: 0,
      itemCount: 0,
      uniqueItems: cartItems.length,
      averageItemPrice: 0,
      heaviestItem: null,
      lightestItem: null,
      totalWeight: 0,
      estimatedShipping: 0,
      categories: {},
      priceRanges: {
        under50k: 0,
        from50to100k: 0,
        over100k: 0,
      },
    };

    if (cartItems.length === 0) return stats;

    // Calculate comprehensive stats
    cartItems.forEach((item) => {
      const itemTotal = item.totalPrice || item.unitPrice * item.quantity;
      const unitPrice = item.unitPrice || 0;

      stats.subtotal += itemTotal;
      stats.itemCount += item.quantity;

      // Weight calculations (if product has weight)
      const weight = item.product?.weight || 0;
      stats.totalWeight += weight * item.quantity;

      if (
        !stats.heaviestItem ||
        weight > (stats.heaviestItem.product?.weight || 0)
      ) {
        stats.heaviestItem = item;
      }
      if (
        !stats.lightestItem ||
        weight < (stats.lightestItem.product?.weight || 0)
      ) {
        stats.lightestItem = item;
      }

      // Category tracking
      const category = item.product?.category?.name || "Uncategorized";
      stats.categories[category] =
        (stats.categories[category] || 0) + item.quantity;

      // Price range tracking
      if (unitPrice < 50000) {
        stats.priceRanges.under50k += item.quantity;
      } else if (unitPrice < 100000) {
        stats.priceRanges.from50to100k += item.quantity;
      } else {
        stats.priceRanges.over100k += item.quantity;
      }
    });

    // Calculate averages and estimates
    stats.averageItemPrice =
      stats.itemCount > 0 ? stats.subtotal / stats.itemCount : 0;

    // Estimated shipping based on weight and item count
    stats.estimatedShipping = Math.max(
      stats.totalWeight * 0.5, // Weight-based (0.5k per gram)
      stats.uniqueItems * 1000, // Item-based (1k per unique item)
      5000 // Minimum shipping (5k)
    );

    return stats;
  }, [cartItems]);

  // Enhanced add to cart with better error handling
  const addItem = useCallback(
    async (product, quantity = 1, customOptions = {}) => {
      try {
        if (!product || !product.id) {
          throw new Error("Invalid product data");
        }

        if (quantity <= 0) {
          throw new Error("Quantity must be greater than 0");
        }

        // Check stock if available
        if (product.stock !== undefined && quantity > product.stock) {
          throw new Error(`Chỉ còn ${product.stock} sản phẩm trong kho`);
        }

        console.log("🛒 useCartManagement.addItem:", {
          product: product.name,
          productId: product.id,
          quantity,
          customOptions,
          isAuthenticated: !!user,
          isGuestCart,
        });

        const result = await contextAddToCart(product, quantity, customOptions);

        if (result.success) {
          console.log("✅ Item added successfully to cart");
        }

        return result;
      } catch (error) {
        console.error("❌ Error in addItem:", error);
        return { success: false, message: error.message };
      }
    },
    [contextAddToCart, user, isGuestCart]
  );

  // ✅ NEW: Enhanced updateItem with debouncing and optimistic updates
  const updateItem = useCallback(
    async (productId, quantity) => {
      try {
        if (!productId) {
          throw new Error("Product ID is required");
        }

        if (quantity < 0) {
          throw new Error("Quantity cannot be negative");
        }

        const item = getCartItem(productId);
        if (!item) {
          throw new Error("Product not found in cart");
        }

        // Check stock if available
        if (
          item.product?.stock !== undefined &&
          quantity > item.product.stock
        ) {
          throw new Error(`Chỉ còn ${item.product.stock} sản phẩm trong kho`);
        }

        // ✅ NEW: Debounced update logic
        if (updateTimeoutRef.current) {
          clearTimeout(updateTimeoutRef.current);
        }

        // Store pending update
        pendingUpdatesRef.current.set(productId, quantity);

        // Return a promise that resolves after debounce
        return new Promise((resolve) => {
          updateTimeoutRef.current = setTimeout(async () => {
            try {
              const finalQuantity =
                pendingUpdatesRef.current.get(productId) || quantity;
              pendingUpdatesRef.current.delete(productId);

              console.log("🔄 useCartManagement.updateItem (debounced):", {
                productId,
                oldQuantity: item.quantity,
                newQuantity: finalQuantity,
                isAuthenticated: !!user,
                isGuestCart,
              });

              const result = await contextUpdateQuantity(
                productId,
                finalQuantity
              );

              if (result.success) {
                console.log("✅ Item quantity updated successfully");
              }

              resolve(result);
            } catch (error) {
              console.error("❌ Error in debounced updateItem:", error);
              resolve({ success: false, message: error.message });
            }
          }, 500); // 500ms debounce
        });
      } catch (error) {
        console.error("❌ Error in updateItem:", error);
        return { success: false, message: error.message };
      }
    },
    [contextUpdateQuantity, user, isGuestCart, getCartItem]
  );

  // Enhanced remove with confirmation
  const removeItem = useCallback(
    async (productId, confirm = false) => {
      try {
        if (!productId) {
          throw new Error("Product ID is required");
        }

        const item = getCartItem(productId);
        if (!item) {
          throw new Error("Product not found in cart");
        }

        if (!confirm) {
          // Return confirmation required
          return {
            success: false,
            requiresConfirmation: true,
            message: `Bạn có chắc muốn xóa "${
              item.product?.name || "sản phẩm này"
            }" khỏi giỏ hàng?`,
          };
        }

        console.log("🗑️ useCartManagement.removeItem:", {
          productId,
          productName: item.product?.name,
          isAuthenticated: !!user,
          isGuestCart,
        });

        const result = await contextRemoveFromCart(productId);

        if (result.success) {
          console.log("✅ Item removed successfully from cart");
        }

        return result;
      } catch (error) {
        console.error("❌ Error in removeItem:", error);
        return { success: false, message: error.message };
      }
    },
    [contextRemoveFromCart, user, isGuestCart, getCartItem]
  );

  // Enhanced clear with confirmation
  const clearAll = useCallback(
    async (confirm = false) => {
      try {
        if (cartItemCount === 0) {
          return { success: true, message: "Giỏ hàng đã trống" };
        }

        if (!confirm) {
          return {
            success: false,
            requiresConfirmation: true,
            message: `Bạn có chắc muốn xóa toàn bộ ${cartItemCount} sản phẩm khỏi giỏ hàng?`,
          };
        }

        console.log("🗑️ useCartManagement.clearAll:", {
          itemCount: cartItemCount,
          isAuthenticated: !!user,
          isGuestCart,
        });

        const result = await contextClearCart();

        if (result.success) {
          console.log("✅ Cart cleared successfully");
        }

        return result;
      } catch (error) {
        console.error("❌ Error in clearAll:", error);
        return { success: false, message: error.message };
      }
    },
    [contextClearCart, cartItemCount, user, isGuestCart]
  );

  // ✅ NEW: Enhanced cart summary with statistics
  const getCartSummary = useCallback(() => {
    return {
      // Basic info
      itemCount: cartItemCount,
      totalItems: totalItems,
      subtotal: cartTotal,
      total: totalAmount,
      hasItems: cartItemCount > 0,
      isEmpty: cartItemCount === 0,
      isGuestCart: isGuestCart,

      // Enhanced stats
      ...cartStats,

      // Performance info
      pendingUpdates: pendingUpdates?.size || 0,
      lastSync: lastSync,
      timeSinceLastSync: lastSync ? Date.now() - lastSync : null,
    };
  }, [
    cartItemCount,
    totalItems,
    cartTotal,
    totalAmount,
    isGuestCart,
    cartStats,
    pendingUpdates,
    lastSync,
  ]);

  // Check if product is in cart with quantity
  const getProductCartInfo = useCallback(
    (productId) => {
      const item = getCartItem(productId);
      const isPending = pendingUpdates?.has(productId) || false;

      return {
        isInCart: !!item,
        quantity: item?.quantity || 0,
        totalPrice: item?.totalPrice || 0,
        unitPrice: item?.unitPrice || 0,
        isPending: isPending,
        isOptimistic: item?.isOptimistic || false,
      };
    },
    [getCartItem, pendingUpdates]
  );

  // ✅ NEW: Enhanced bulk operations with batch processing
  const bulkUpdate = useCallback(
    async (updates, options = {}) => {
      const {
        batchSize = 5,
        delayBetweenBatches = 100,
        stopOnFirstError = false,
      } = options;

      try {
        console.log("🔄 Starting bulk update:", {
          updateCount: updates.length,
          batchSize,
        });

        const results = [];
        const batches = [];

        // Split into batches
        for (let i = 0; i < updates.length; i += batchSize) {
          batches.push(updates.slice(i, i + batchSize));
        }

        // Process each batch
        for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
          const batch = batches[batchIndex];
          console.log(
            `🔄 Processing batch ${batchIndex + 1}/${batches.length}`
          );

          // Process batch items in parallel
          const batchPromises = batch.map(async (update) => {
            try {
              const result = await updateItem(
                update.productId,
                update.quantity
              );
              return { ...result, productId: update.productId };
            } catch (error) {
              return {
                success: false,
                message: error.message,
                productId: update.productId,
              };
            }
          });

          const batchResults = await Promise.all(batchPromises);
          results.push(...batchResults);

          // Check for errors
          const failed = batchResults.filter((r) => !r.success);
          if (failed.length > 0 && stopOnFirstError) {
            return {
              success: false,
              message: `Batch ${batchIndex + 1} failed: ${failed[0].message}`,
              results: results,
              failedUpdates: failed,
            };
          }

          // Delay between batches (except last one)
          if (batchIndex < batches.length - 1) {
            await new Promise((resolve) =>
              setTimeout(resolve, delayBetweenBatches)
            );
          }
        }

        const failed = results.filter((r) => !r.success);
        if (failed.length > 0) {
          return {
            success: false,
            message: `${failed.length}/${updates.length} cập nhật thất bại`,
            results: results,
            failedUpdates: failed,
            successCount: results.length - failed.length,
          };
        }

        return {
          success: true,
          message: "Cập nhật hàng loạt thành công",
          results: results,
          successCount: results.length,
        };
      } catch (error) {
        console.error("❌ Error in bulkUpdate:", error);
        return { success: false, message: error.message };
      }
    },
    [updateItem]
  );

  // ✅ NEW: Smart recommendations based on cart content
  const getRecommendations = useCallback(() => {
    if (cartItems.length === 0) return [];

    const recommendations = [];

    // Category-based recommendations
    const categories = cartStats.categories;
    Object.keys(categories).forEach((category) => {
      if (categories[category] >= 2) {
        recommendations.push({
          type: "category_bundle",
          message: `Bạn có ${categories[category]} sản phẩm ${category}. Có thể bạn quan tâm đến combo ${category}?`,
          category: category,
          priority: "medium",
        });
      }
    });

    // Price-based recommendations
    if (cartStats.subtotal > 500000) {
      recommendations.push({
        type: "free_shipping",
        message: "Bạn đủ điều kiện miễn phí vận chuyển!",
        threshold: 500000,
        priority: "high",
      });
    } else if (cartStats.subtotal > 300000) {
      const remaining = 500000 - cartStats.subtotal;
      recommendations.push({
        type: "almost_free_shipping",
        message: `Thêm ${remaining.toLocaleString(
          "vi-VN"
        )}đ nữa để được miễn phí vận chuyển`,
        remaining: remaining,
        priority: "high",
      });
    }

    // Quantity-based recommendations
    if (cartStats.itemCount >= 5) {
      recommendations.push({
        type: "bulk_discount",
        message: "Bạn có thể được giảm giá khi mua số lượng lớn!",
        itemCount: cartStats.itemCount,
        priority: "medium",
      });
    }

    // Weight-based shipping recommendations
    if (cartStats.totalWeight > 1000) {
      // > 1kg
      recommendations.push({
        type: "heavy_order",
        message: "Đơn hàng nặng - có thể áp dụng phí vận chuyển đặc biệt",
        weight: cartStats.totalWeight,
        priority: "low",
      });
    }

    // Sort by priority
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return recommendations.sort(
      (a, b) =>
        (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
    );
  }, [cartItems, cartStats]);

  // ✅ NEW: Cart validation
  const validateCart = useCallback(() => {
    const issues = [];

    cartItems.forEach((item) => {
      // Stock validation
      if (
        item.product?.stock !== undefined &&
        item.quantity > item.product.stock
      ) {
        issues.push({
          type: "stock_exceeded",
          productId: item.productId,
          productName: item.product?.name,
          requested: item.quantity,
          available: item.product.stock,
        });
      }

      // Price validation
      if (!item.unitPrice || item.unitPrice <= 0) {
        issues.push({
          type: "invalid_price",
          productId: item.productId,
          productName: item.product?.name,
        });
      }

      // Quantity validation
      if (item.quantity <= 0) {
        issues.push({
          type: "invalid_quantity",
          productId: item.productId,
          productName: item.product?.name,
          quantity: item.quantity,
        });
      }
    });

    return {
      isValid: issues.length === 0,
      issues: issues,
      hasStockIssues: issues.some((i) => i.type === "stock_exceeded"),
      hasPriceIssues: issues.some((i) => i.type === "invalid_price"),
      hasQuantityIssues: issues.some((i) => i.type === "invalid_quantity"),
    };
  }, [cartItems]);

  // ✅ NEW: Emergency cart recovery
  const emergencyRecover = useCallback(async () => {
    try {
      console.log("🚨 Emergency cart recovery initiated");

      // Try to recover from backup first
      const recovered = await recoverFromBackup();
      if (recovered) {
        console.log("✅ Recovered from local backup");
        return { success: true, method: "backup" };
      }

      // Try to reload from server
      try {
        await loadCart();
        console.log("✅ Recovered from server");
        return { success: true, method: "server" };
      } catch (error) {
        console.log("❌ Server recovery failed, using empty cart");
        return { success: false, method: "none" };
      }
    } catch (error) {
      console.error("❌ Emergency recovery failed:", error);
      return { success: false, method: "none", error: error.message };
    }
  }, [recoverFromBackup, loadCart]);

  return {
    // State
    cart: {
      items: cartItems,
      itemCount: cartItemCount,
      total: cartTotal,
      totalAmount: totalAmount,
      totalItems: totalItems,
      isGuestCart: isGuestCart,
      isEmpty: cartItemCount === 0,
      hasItems: cartItemCount > 0,
    },
    loading,
    error,
    isCartOpen,

    // ✅ NEW: Performance data
    performance: {
      pendingUpdates: pendingUpdates?.size || 0,
      lastSync: lastSync,
      timeSinceLastSync: lastSync ? Date.now() - lastSync : null,
      metrics: getPerformanceMetrics,
    },

    // Actions
    actions: {
      addItem,
      updateItem,
      removeItem,
      clearAll,
      openCart,
      closeCart,
      refresh: loadCart,
      mergeGuestCart,
      bulkUpdate,
      emergencyRecover,
    },

    // Utilities
    utils: {
      isInCart,
      getCartItem,
      getCartSummary,
      getProductCartInfo,
      getRecommendations,
      validateCart,
    },

    // ✅ NEW: Enhanced analytics
    analytics: {
      stats: cartStats,
      recommendations: getRecommendations(),
      validation: validateCart(),
    },
  };
};
