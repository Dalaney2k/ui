import React, {
  createContext,
  useReducer,
  useEffect,
  useState,
  useCallback,
} from "react";
import { cartService } from "../services/api.js";

// Enhanced Cart actions
const CART_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_CART: "SET_CART",
  SET_ERROR: "SET_ERROR",
  ADD_TO_CART: "ADD_TO_CART",
  REMOVE_FROM_CART: "REMOVE_FROM_CART",
  UPDATE_QUANTITY: "UPDATE_QUANTITY",
  CLEAR_CART: "CLEAR_CART",
  LOAD_CART: "LOAD_CART",
  MERGE_CART: "MERGE_CART",
  SET_OPTIMISTIC_UPDATE: "SET_OPTIMISTIC_UPDATE",
  ROLLBACK_UPDATE: "ROLLBACK_UPDATE",
  SET_PENDING_UPDATES: "SET_PENDING_UPDATES",
  SET_LAST_SYNC: "SET_LAST_SYNC",

  // Selection actions
  SELECT_ITEM: "SELECT_ITEM",
  SELECT_ALL_ITEMS: "SELECT_ALL_ITEMS",
  CLEAR_SELECTION: "CLEAR_SELECTION",
  SET_SELECTED_ITEMS: "SET_SELECTED_ITEMS",
};

// Enhanced Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case CART_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case CART_ACTIONS.SET_CART:
      return {
        ...state,
        items: action.payload.items || [],
        totalAmount: action.payload.totalAmount || 0,
        totalItems: action.payload.totalItems || 0,
        isGuestCart: action.payload.isGuestCart || false,
        loading: false,
        error: null,
        lastSync: Date.now(),
        pendingUpdates: new Set(),
        // FIXED: Không auto-select tất cả items, chỉ giữ lại selection hiện tại nếu items vẫn có trong cart
        selectedItems: state.selectedItems.filter((selectedItem) =>
          (action.payload.items || []).some(
            (cartItem) =>
              cartItem.productId === selectedItem.productId &&
              (cartItem.productVariantId || null) ===
                (selectedItem.productVariantId || null)
          )
        ),
        selectAllChecked: false,
      };

    // Item selection logic
    case CART_ACTIONS.SELECT_ITEM: {
      const { productId, productVariantId, selected } = action.payload;

      if (selected) {
        // Add item to selection
        const itemToAdd = state.items.find(
          (item) =>
            item.productId === productId &&
            (item.productVariantId || null) === (productVariantId || null)
        );

        if (
          itemToAdd &&
          !state.selectedItems.some(
            (item) =>
              item.productId === productId &&
              (item.productVariantId || null) === (productVariantId || null)
          )
        ) {
          const newSelectedItems = [...state.selectedItems, itemToAdd];
          return {
            ...state,
            selectedItems: newSelectedItems,
            selectAllChecked: newSelectedItems.length === state.items.length,
          };
        }
      } else {
        // Remove item from selection
        const newSelectedItems = state.selectedItems.filter(
          (item) =>
            !(
              item.productId === productId &&
              (item.productVariantId || null) === (productVariantId || null)
            )
        );
        return {
          ...state,
          selectedItems: newSelectedItems,
          selectAllChecked: false,
        };
      }
      return state;
    }

    case CART_ACTIONS.SELECT_ALL_ITEMS: {
      const selected = action.payload;
      return {
        ...state,
        selectedItems: selected ? [...state.items] : [],
        selectAllChecked: selected,
      };
    }

    case CART_ACTIONS.CLEAR_SELECTION:
      return {
        ...state,
        selectedItems: [],
        selectAllChecked: false,
      };

    case CART_ACTIONS.SET_SELECTED_ITEMS:
      return {
        ...state,
        selectedItems: action.payload,
        selectAllChecked: action.payload.length === state.items.length,
      };

    case CART_ACTIONS.ADD_TO_CART: {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(
        (item) => item.productId === product.id
      );

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );

        const updatedSelectedItems = state.selectedItems.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );

        return {
          ...state,
          items: updatedItems,
          selectedItems: updatedSelectedItems,
        };
      }

      const newItem = {
        productId: product.id,
        product: product,
        quantity,
        unitPrice: product.price,
        totalPrice: product.price * quantity,
      };

      return {
        ...state,
        items: [...state.items, newItem],
        // FIXED: Không tự động add vào selectedItems
        selectAllChecked: false,
      };
    }

    case CART_ACTIONS.REMOVE_FROM_CART: {
      const productIdToRemove = action.payload;
      const newItems = state.items.filter(
        (item) => item.productId !== productIdToRemove
      );
      const newSelectedItems = state.selectedItems.filter(
        (item) => item.productId !== productIdToRemove
      );

      return {
        ...state,
        items: newItems,
        selectedItems: newSelectedItems,
        selectAllChecked:
          newSelectedItems.length === newItems.length && newItems.length > 0,
      };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { productId, quantity } = action.payload;

      if (quantity <= 0) {
        const newItems = state.items.filter(
          (item) => item.productId !== productId
        );
        const newSelectedItems = state.selectedItems.filter(
          (item) => item.productId !== productId
        );

        return {
          ...state,
          items: newItems,
          selectedItems: newSelectedItems,
          selectAllChecked:
            newSelectedItems.length === newItems.length && newItems.length > 0,
        };
      }

      const updatedItems = state.items.map((item) =>
        item.productId === productId
          ? { ...item, quantity, totalPrice: item.unitPrice * quantity }
          : item
      );

      const updatedSelectedItems = state.selectedItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity, totalPrice: item.unitPrice * quantity }
          : item
      );

      return {
        ...state,
        items: updatedItems,
        selectedItems: updatedSelectedItems,
      };
    }

    case CART_ACTIONS.SET_OPTIMISTIC_UPDATE: {
      const { productId, quantity } = action.payload;

      if (quantity <= 0) {
        const newItems = state.items.filter(
          (item) => item.productId !== productId
        );
        const newSelectedItems = state.selectedItems.filter(
          (item) => item.productId !== productId
        );

        return {
          ...state,
          items: newItems,
          selectedItems: newSelectedItems,
          pendingUpdates: new Set([...state.pendingUpdates, productId]),
          selectAllChecked:
            newSelectedItems.length === newItems.length && newItems.length > 0,
        };
      }

      const updatedItems = state.items.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity,
              totalPrice: item.unitPrice * quantity,
              isOptimistic: true,
            }
          : item
      );

      const updatedSelectedItems = state.selectedItems.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity,
              totalPrice: item.unitPrice * quantity,
              isOptimistic: true,
            }
          : item
      );

      return {
        ...state,
        items: updatedItems,
        selectedItems: updatedSelectedItems,
        pendingUpdates: new Set([...state.pendingUpdates, productId]),
      };
    }

    case CART_ACTIONS.ROLLBACK_UPDATE: {
      const productId = action.payload;
      const newPendingUpdates = new Set(state.pendingUpdates);
      newPendingUpdates.delete(productId);

      const updatedItems = state.items.map((item) =>
        item.productId === productId ? { ...item, isOptimistic: false } : item
      );

      const updatedSelectedItems = state.selectedItems.map((item) =>
        item.productId === productId ? { ...item, isOptimistic: false } : item
      );

      return {
        ...state,
        items: updatedItems,
        selectedItems: updatedSelectedItems,
        pendingUpdates: newPendingUpdates,
      };
    }

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: [],
        totalAmount: 0,
        totalItems: 0,
        selectedItems: [],
        selectAllChecked: false,
      };

    case CART_ACTIONS.LOAD_CART:
      return {
        ...state,
        items: action.payload || [],
      };

    case CART_ACTIONS.MERGE_CART:
      return {
        ...state,
        items: action.payload.items || state.items,
        totalAmount: action.payload.totalAmount || state.totalAmount,
        totalItems: action.payload.totalItems || state.totalItems,
        isGuestCart: false,
        // FIXED: Không auto-select sau merge
        selectedItems: [],
        selectAllChecked: false,
      };

    case CART_ACTIONS.SET_PENDING_UPDATES:
      return {
        ...state,
        pendingUpdates: action.payload,
      };

    case CART_ACTIONS.SET_LAST_SYNC:
      return {
        ...state,
        lastSync: action.payload,
      };

    default:
      return state;
  }
};

// Enhanced Initial state
const initialState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
  isGuestCart: false,
  loading: false,
  error: null,
  isOpen: false,
  pendingUpdates: new Set(),
  lastSync: null,
  retryQueue: [],

  // Selection state
  selectedItems: [],
  selectAllChecked: false,
};

// Create context
const CartContext = createContext();

// Enhanced Cart provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  console.log("🛒 CartProvider rendered:", {
    cartItems: state.items?.length || 0,
    selectedItems: state.selectedItems?.length || 0,
    user: user?.name || "guest",
    pendingUpdates: state.pendingUpdates.size,
    lastSync: state.lastSync
      ? new Date(state.lastSync).toLocaleTimeString()
      : "never",
  });

  // Backup to localStorage
  useEffect(() => {
    if (state.items.length > 0) {
      const backupData = {
        items: state.items,
        selectedItems: state.selectedItems,
        totalAmount: state.totalAmount,
        totalItems: state.totalItems,
        timestamp: Date.now(),
        isGuestCart: state.isGuestCart,
        selectAllChecked: state.selectAllChecked,
      };

      try {
        localStorage.setItem("cart_backup", JSON.stringify(backupData));
        console.log("💾 Cart backed up to localStorage");
      } catch (error) {
        console.warn("⚠️ Failed to backup cart:", error);
      }
    }
  }, [
    state.items,
    state.selectedItems,
    state.totalAmount,
    state.totalItems,
    state.isGuestCart,
    state.selectAllChecked,
  ]);

  // Recovery from backup
  const recoverFromBackup = useCallback(async () => {
    try {
      const backup = localStorage.getItem("cart_backup");
      if (backup) {
        const backupData = JSON.parse(backup);

        if (Date.now() - backupData.timestamp < 24 * 60 * 60 * 1000) {
          console.log("🔄 Recovering cart from backup");
          dispatch({
            type: CART_ACTIONS.SET_CART,
            payload: {
              ...backupData,
              selectedItems: backupData.selectedItems || [],
            },
          });

          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("❌ Failed to recover from backup:", error);
      return false;
    }
  }, []);

  // Item selection methods
  const selectItem = useCallback((productId, productVariantId, selected) => {
    dispatch({
      type: CART_ACTIONS.SELECT_ITEM,
      payload: { productId, productVariantId, selected },
    });
  }, []);

  const selectAllItems = useCallback((selected) => {
    dispatch({
      type: CART_ACTIONS.SELECT_ALL_ITEMS,
      payload: selected,
    });
  }, []);

  const clearSelection = useCallback(() => {
    dispatch({ type: CART_ACTIONS.CLEAR_SELECTION });
  }, []);

  const getSelectedItems = useCallback(() => {
    return state.selectedItems.map((selectedItem) => {
      const currentCartItem = state.items.find(
        (cartItem) =>
          cartItem.productId === selectedItem.productId &&
          (cartItem.productVariantId || null) ===
            (selectedItem.productVariantId || null)
      );

      return {
        ...selectedItem,
        quantity: currentCartItem?.quantity || selectedItem.quantity,
        totalPrice: currentCartItem?.totalPrice || selectedItem.totalPrice,
      };
    });
  }, [state.selectedItems, state.items]);

  const isItemSelected = useCallback(
    (productId, productVariantId = null) => {
      return state.selectedItems.some(
        (item) =>
          item.productId === productId &&
          (item.productVariantId || null) === (productVariantId || null)
      );
    },
    [state.selectedItems]
  );

  const getSelectedTotal = useCallback(() => {
    return getSelectedItems().reduce((total, item) => {
      return total + (item.totalPrice || item.unitPrice * item.quantity);
    }, 0);
  }, [getSelectedItems]);

  const getSelectedItemsCount = useCallback(() => {
    return getSelectedItems().reduce((total, item) => total + item.quantity, 0);
  }, [getSelectedItems]);

  // FIXED: Method để xóa chỉ những items cụ thể (checkout items)
  const removeSpecificItemsFromCart = useCallback(async (itemsToRemove) => {
    try {
      console.log("🗑️ Removing specific items from cart:", itemsToRemove);

      if (!itemsToRemove || itemsToRemove.length === 0) {
        return { success: true, message: "No items to remove" };
      }

      const removeResults = [];

      for (const item of itemsToRemove) {
        try {
          console.log(
            `🗑️ Removing item ${item.productId} (qty: ${item.quantity}) from cart...`
          );

          const response = await cartService.removeFromCart({
            productId: item.productId,
            productVariantId: item.productVariantId,
            quantity: item.quantity,
          });

          removeResults.push({
            productId: item.productId,
            success: response.success,
            message: response.message,
          });

          if (response.success) {
            console.log(`✅ Successfully removed item ${item.productId}`);
          } else {
            console.warn(
              `⚠️ Failed to remove item ${item.productId}:`,
              response.message
            );
          }
        } catch (error) {
          console.warn(`❌ Error removing item ${item.productId}:`, error);
          removeResults.push({
            productId: item.productId,
            success: false,
            message: error.message,
          });
        }
      }

      // Reload cart để cập nhật UI
      await loadCart();

      const successCount = removeResults.filter((r) => r.success).length;
      const totalCount = removeResults.length;

      console.log(
        `✅ Cart cleanup completed: ${successCount}/${totalCount} items removed`
      );

      return {
        success: true,
        message: `Đã xóa ${successCount}/${totalCount} sản phẩm khỏi giỏ hàng`,
        results: removeResults,
      };
    } catch (error) {
      console.error("❌ Error removing specific items:", error);
      return {
        success: false,
        error: error.message,
        message: "Có lỗi khi cập nhật giỏ hàng",
      };
    }
  }, []);

  // Remove only selected items from cart (giữ nguyên method cũ cho tương thích)
  const removeSelectedItemsFromCart = useCallback(async () => {
    try {
      console.log("🗑️ Removing selected items from cart...");
      const selectedItems = getSelectedItems();

      if (selectedItems.length === 0) {
        return { success: true, message: "No items selected to remove" };
      }

      const result = await removeSpecificItemsFromCart(selectedItems);

      if (result.success) {
        clearSelection();
        console.log("✅ Selected items removed from cart");
      }

      return result;
    } catch (error) {
      console.error("❌ Error removing selected items:", error);
      return { success: false, error: error.message };
    }
  }, [getSelectedItems, clearSelection, removeSpecificItemsFromCart]);

  // Load cart
  const loadCart = useCallback(async () => {
    try {
      console.log("🛒 CartContext.loadCart: Starting to load cart...");
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

      const response = await cartService.getCart();
      console.log("🛒 CartContext.loadCart: API response:", response);

      if (response && response.success) {
        console.log("🛒 Cart items from API:", response.data?.items);
        console.log("🛒 Full cart response:", response);

        const cartData = response.data || {};
        dispatch({
          type: CART_ACTIONS.SET_CART,
          payload: {
            items: cartData.items || [],
            totalAmount: cartData.summary?.total || 0,
            totalItems: cartData.summary?.totalItems || 0,
            isGuestCart: cartData.isGuestCart || false,
          },
        });
      } else {
        console.log("🛒 Cart load failed or no response:", response);
        const recovered = await recoverFromBackup();
        if (!recovered) {
          dispatch({
            type: CART_ACTIONS.SET_ERROR,
            payload: response?.message || "Không thể tải giỏ hàng",
          });
        }
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      const recovered = await recoverFromBackup();

      if (!recovered) {
        if (user) {
          dispatch({
            type: CART_ACTIONS.SET_ERROR,
            payload: "Không thể tải giỏ hàng",
          });
        } else {
          dispatch({
            type: CART_ACTIONS.SET_CART,
            payload: {
              items: [],
              totalAmount: 0,
              totalItems: 0,
              isGuestCart: true,
            },
          });
        }
      }
    }
  }, [user, recoverFromBackup]);

  // Listen for auth changes
  useEffect(() => {
    let previousUser = null;

    const handleStorageChange = async () => {
      const token =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("auth_token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          const userData = JSON.parse(storedUser);

          if (!previousUser && userData) {
            console.log(
              "🔀 User just logged in, attempting to merge guest cart..."
            );
            try {
              const mergeResult = await cartService.mergeGuestCart();
              if (mergeResult.success) {
                console.log("✅ Guest cart merged successfully after login");
                loadCart();
              }
            } catch (error) {
              console.error("❌ Error merging guest cart after login:", error);
            }
          }

          previousUser = userData;
          setUser(userData);
        } catch (error) {
          console.error("Error parsing user data:", error);
          setUser(null);
          previousUser = null;
        }
      } else {
        setUser(null);
        previousUser = null;
      }
    };

    handleStorageChange();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [loadCart]);

  // Load cart on mount
  useEffect(() => {
    console.log("🛒 CartProvider: useEffect triggered, calling loadCart");
    loadCart();
  }, [loadCart]);

  // Merge guest cart after login
  const mergeGuestCart = async () => {
    try {
      console.log(
        "🔀 CartContext.mergeGuestCart: Starting to merge guest cart..."
      );

      const response = await cartService.mergeGuestCart();

      if (response.success) {
        console.log("🔀 Guest cart merged successfully");
        await loadCart();
        return { success: true, message: "Đã gộp giỏ hàng thành công" };
      } else {
        console.log(
          "🔀 No guest cart to merge or merge failed:",
          response.message
        );
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error("🔀 Error merging guest cart:", error);
      return { success: false, message: "Không thể gộp giỏ hàng" };
    }
  };

  // Add to cart
  const addToCart = async (
    product,
    quantity = 1,
    customOptions = {},
    retryCount = 0
  ) => {
    try {
      console.log("🛒 CartContext.addToCart called with:", {
        product,
        quantity,
        customOptions,
        userAuth: !!user,
        retryAttempt: retryCount,
      });

      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

      const response = await cartService.addToCart({
        productId: product.id,
        quantity: quantity,
        customOptions: customOptions,
      });

      console.log("🛒 CartContext.addToCart response:", response);

      if (response && response.success) {
        console.log("🛒 Add to cart successful, reloading cart...");
        await loadCart();
        return { success: true, message: "Thêm vào giỏ hàng thành công" };
      } else {
        throw new Error(response?.message || "Không thể thêm vào giỏ hàng");
      }
    } catch (error) {
      console.error("🛒 Error adding to cart:", error);

      if (
        retryCount < 2 &&
        (error.code === "NETWORK_ERROR" || error.name === "NetworkError")
      ) {
        console.log(`🔄 Retrying addToCart, attempt ${retryCount + 1}`);
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (retryCount + 1))
        );
        return addToCart(product, quantity, customOptions, retryCount + 1);
      }

      const errorMessage = error.message || "Không thể thêm vào giỏ hàng";
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  // Remove from cart
  const removeFromCart = async (productId) => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

      const response = await cartService.removeFromCart({
        productId: productId,
      });

      if (response.success) {
        await loadCart();
        return { success: true, message: "Xóa khỏi giỏ hàng thành công" };
      } else {
        dispatch({ type: CART_ACTIONS.SET_ERROR, payload: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      dispatch({
        type: CART_ACTIONS.SET_ERROR,
        payload: "Không thể xóa khỏi giỏ hàng",
      });
      return { success: false, message: "Không thể xóa khỏi giỏ hàng" };
    }
  };

  // Update quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      dispatch({
        type: CART_ACTIONS.SET_OPTIMISTIC_UPDATE,
        payload: { productId, quantity },
      });

      if (quantity <= 0) {
        const result = await removeFromCart(productId);
        dispatch({
          type: CART_ACTIONS.ROLLBACK_UPDATE,
          payload: productId,
        });
        return result;
      }

      const response = await cartService.updateCartItem({
        productId: productId,
        quantity: quantity,
      });

      if (response.success) {
        dispatch({
          type: CART_ACTIONS.ROLLBACK_UPDATE,
          payload: productId,
        });

        await loadCart();
        return { success: true, message: "Cập nhật số lượng thành công" };
      } else {
        await loadCart();
        dispatch({ type: CART_ACTIONS.SET_ERROR, payload: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error("Error updating cart item:", error);
      await loadCart();
      dispatch({
        type: CART_ACTIONS.SET_ERROR,
        payload: "Không thể cập nhật số lượng",
      });
      return { success: false, message: "Không thể cập nhật số lượng" };
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

      const response = await cartService.clearCart();

      if (response.success) {
        dispatch({ type: CART_ACTIONS.CLEAR_CART });
        localStorage.removeItem("cart_backup");
        return { success: true, message: "Xóa toàn bộ giỏ hàng thành công" };
      } else {
        dispatch({ type: CART_ACTIONS.SET_ERROR, payload: response.message });
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      dispatch({
        type: CART_ACTIONS.SET_ERROR,
        payload: "Không thể xóa giỏ hàng",
      });
      return { success: false, message: "Không thể xóa giỏ hàng" };
    }
  };

  const openCart = () => {
    setIsOpen(true);
    document.body.classList.add("cart-open");
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = "15px";
  };

  const closeCart = () => {
    setIsOpen(false);
    document.body.classList.remove("cart-open");
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  };

  // Cart utilities
  const getCartItemCount = () => {
    return (
      state.totalItems ||
      state.items.reduce((total, item) => total + item.quantity, 0)
    );
  };

  const getCartTotal = () => {
    return (
      state.totalAmount ||
      state.items.reduce(
        (total, item) =>
          total + (item.totalPrice || item.unitPrice * item.quantity),
        0
      )
    );
  };

  const isInCart = (productId) => {
    return state.items.some((item) => item.productId === productId);
  };

  const getCartItem = (productId) => {
    return state.items.find((item) => item.productId === productId);
  };

  // Performance monitoring
  const getPerformanceMetrics = useCallback(() => {
    return {
      itemCount: state.items.length,
      pendingUpdates: state.pendingUpdates.size,
      lastSync: state.lastSync,
      timeSinceLastSync: state.lastSync ? Date.now() - state.lastSync : null,
      hasBackup: !!localStorage.getItem("cart_backup"),
      isOnline: navigator.onLine,
    };
  }, [state.items.length, state.pendingUpdates.size, state.lastSync]);

  // Enhanced Context value
  const value = {
    // State
    cartItems: state.items,
    cartItemCount: getCartItemCount(),
    cartTotal: getCartTotal(),
    totalAmount: state.totalAmount,
    totalItems: state.totalItems,
    isGuestCart: state.isGuestCart,
    loading: state.loading,
    error: state.error,
    isCartOpen: isOpen,
    pendingUpdates: state.pendingUpdates,
    lastSync: state.lastSync,

    // Selection state
    selectedItems: state.selectedItems,
    selectAllChecked: state.selectAllChecked,
    selectedItemsCount: getSelectedItemsCount(),
    selectedTotal: getSelectedTotal(),

    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    loadCart,
    mergeGuestCart,

    // Selection actions
    selectItem,
    selectAllItems,
    clearSelection,
    getSelectedItems,
    isItemSelected,
    removeSelectedItemsFromCart,

    // FIXED: Method mới để xóa items cụ thể
    removeSpecificItemsFromCart,

    // Utilities
    isInCart,
    getCartItem,
    getPerformanceMetrics,
    recoverFromBackup,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
