import React, { useState, useContext } from "react";
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  Trash2,
  RefreshCw,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../../utils/dataTransform";
import { useAuth } from "../../contexts/AuthContext";
import CartContext from "../../contexts/CartContext";

const ShoppingCart = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Get selection methods from CartContext
  const cartContext = useContext(CartContext);

  // Check if context is available
  if (!cartContext) {
    console.error("CartContext not found!");
    return null;
  }

  const {
    cartItems = [],
    cartItemCount = 0,
    cartTotal = 0,
    loading = false,
    error = null,
    selectedItems = [],
    selectAllChecked = false,
    selectedTotal = 0,
    selectItem,
    selectAllItems,
    isItemSelected,
    getSelectedItems,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = cartContext;

  const [notifications, setNotifications] = useState([]);
  const [pendingRemoval, setPendingRemoval] = useState(null);
  const [animatingItems, setAnimatingItems] = useState(new Set());
  const [optimisticUpdates, setOptimisticUpdates] = useState(new Map());
  const [isNotificationsExpanded, setIsNotificationsExpanded] = useState(false);

  console.log("🛒 ShoppingCart rendered with:", {
    cartItems: cartItems?.length || 0,
    selectedItems: selectedItems?.length || 0,
    loading,
    error,
  });

  // Enhanced notification system
  const addNotification = (type, message, options = {}) => {
    const notification = {
      id: Date.now() + Math.random(),
      type,
      message,
      timestamp: Date.now(),
      ...options,
    };

    setNotifications((prev) => {
      const newNotifications = [...prev, notification];

      if (prev.length === 0) {
        setIsNotificationsExpanded(true);
      } else if (newNotifications.length > 2 && !isNotificationsExpanded) {
        setIsNotificationsExpanded(false);
      }

      return newNotifications;
    });

    if (type !== "confirm" && !options.persistent) {
      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== notification.id)
        );
      }, options.duration || 3000);
    }

    return notification.id;
  };

  const getDisplayedNotifications = () => {
    if (isNotificationsExpanded) {
      return notifications;
    }
    return notifications.slice(-2);
  };

  // Handle item selection
  const handleItemSelect = (productId, productVariantId, selected) => {
    if (selectItem) {
      selectItem(productId, productVariantId, selected);
    }
  };

  // Handle select all
  const handleSelectAll = (selected) => {
    if (selectAllItems) {
      selectAllItems(selected);
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    console.log("[LOG] handleCheckout:", {
      cartItems,
      selectedItems,
      user,
      checkoutItems: getSelectedItems ? getSelectedItems() : selectedItems,
    });

    if (!cartItems || cartItems.length === 0) {
      addNotification("warning", "Giỏ hàng trống");
      return;
    }

    if (!selectedItems || selectedItems.length === 0) {
      addNotification(
        "warning",
        "Vui lòng chọn ít nhất một sản phẩm để thanh toán"
      );
      return;
    }

    if (!user) {
      console.log("[LOG] Chưa đăng nhập, chuyển hướng /auth?redirect=checkout");
      navigate("/auth?redirect=checkout");
    } else {
      console.log("[LOG] Đã đăng nhập, chuyển hướng /checkout với state:", {
        checkoutItems: getSelectedItems ? getSelectedItems() : selectedItems,
        source: "cart_selection",
      });
      navigate("/checkout", {
        state: {
          checkoutItems: getSelectedItems ? getSelectedItems() : selectedItems,
          source: "cart_selection",
        },
      });
    }

    if (onClose) onClose();
  };

  // Handle remove item with confirmation notification
  const handleRemoveItem = async (item) => {
    const productName =
      item.productName || item.product?.name || "sản phẩm này";

    setPendingRemoval(item);
    addNotification(
      "confirm",
      `Bạn có chắc muốn xóa "${productName}" khỏi giỏ hàng?`
    );
  };

  const confirmRemoveItem = async (item) => {
    try {
      setNotifications((prev) => prev.filter((n) => n.type !== "confirm"));
      setPendingRemoval(null);

      if (removeFromCart) {
        const result = await removeFromCart(item.productId);
        if (result && result.success) {
          addNotification("success", "Đã xóa sản phẩm khỏi giỏ hàng");
        } else {
          addNotification("error", "Không thể xóa sản phẩm");
        }
      }
    } catch (error) {
      console.error("Error removing item:", error);
      addNotification("error", "Không thể xóa sản phẩm");
    }
  };

  const cancelRemoval = () => {
    setPendingRemoval(null);
    setNotifications((prev) => prev.filter((n) => n.type !== "confirm"));
  };

  // Enhanced quantity update with animations
  const handleQuantityUpdate = async (
    productId,
    newQuantity,
    currentQuantity
  ) => {
    if (newQuantity < 1 || newQuantity === currentQuantity) return;

    try {
      // Animation state
      setAnimatingItems((prev) => new Set(prev).add(productId));

      // Optimistic update for instant UI feedback
      setOptimisticUpdates((prev) =>
        new Map(prev).set(productId, {
          quantity: newQuantity,
          previousQuantity: currentQuantity,
          timestamp: Date.now(),
        })
      );

      if (updateQuantity) {
        const result = await updateQuantity(productId, newQuantity);

        if (!result.success) {
          // Rollback optimistic update
          setOptimisticUpdates((prev) => {
            const newMap = new Map(prev);
            newMap.delete(productId);
            return newMap;
          });

          addNotification(
            "error",
            result.message || "Không thể cập nhật số lượng"
          );
        }
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      addNotification("error", "Không thể cập nhật số lượng");

      // Rollback optimistic update
      setOptimisticUpdates((prev) => {
        const newMap = new Map(prev);
        newMap.delete(productId);
        return newMap;
      });
    } finally {
      // Remove animation state
      setTimeout(() => {
        setAnimatingItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });

        // Clear optimistic update after animation
        setOptimisticUpdates((prev) => {
          const newMap = new Map(prev);
          newMap.delete(productId);
          return newMap;
        });
      }, 300);
    }
  };

  // Handle clear cart
  const handleClearCart = async () => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?");
    if (confirmed && clearCart) {
      try {
        const result = await clearCart();
        if (result.success) {
          addNotification("success", "Đã xóa toàn bộ giỏ hàng");
        }
      } catch (error) {
        addNotification("error", "Không thể xóa giỏ hàng");
      }
    }
  };

  const handleContinueShopping = () => {
    navigate("/products");
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  const hasItems = cartItems && cartItems.length > 0;
  const displayedNotifications = getDisplayedNotifications();
  const hasHiddenNotifications =
    notifications.length > displayedNotifications.length;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar Cart */}
      <div
        className={`fixed top-0 right-0 h-screen w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Enhanced Header with Selection Info */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2" />
            Giỏ hàng
            {hasItems && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {cartItemCount}
              </span>
            )}
            {selectedItems && selectedItems.length > 0 && (
              <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                {selectedItems.length} đã chọn
              </span>
            )}
            {loading && (
              <RefreshCw className="w-4 h-4 ml-2 animate-spin text-blue-500" />
            )}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Đóng giỏ hàng"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Select All Section */}
        {!loading && hasItems && (
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex-shrink-0">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectAllChecked && cartItems.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                disabled={cartItems.length === 0}
                className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Chọn tất cả ({cartItemCount} sản phẩm)
              </span>
            </label>

            {selectedItems && selectedItems.length > 0 && (
              <div className="mt-2 text-xs text-green-600">
                ✓ Đã chọn {selectedItems.length} sản phẩm -{" "}
                {formatPrice(selectedTotal)}
              </div>
            )}
          </div>
        )}

        {/* Enhanced Notifications with Collapsible Design */}
        {notifications.length > 0 && (
          <div className="border-b border-gray-100 flex-shrink-0">
            {notifications.length > 2 && (
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                <button
                  onClick={() =>
                    setIsNotificationsExpanded(!isNotificationsExpanded)
                  }
                  className="flex items-center justify-between w-full text-sm text-gray-600 hover:text-gray-800"
                >
                  <span>
                    {notifications.length} thông báo
                    {hasHiddenNotifications && !isNotificationsExpanded
                      ? ` (hiển thị ${displayedNotifications.length})`
                      : ""}
                  </span>
                  {isNotificationsExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}

            <div
              className={`
                overflow-y-auto transition-all duration-200 ease-in-out
                ${
                  notifications.length <= 2
                    ? "max-h-32"
                    : isNotificationsExpanded
                    ? "max-h-40"
                    : "max-h-24"
                }
              `}
            >
              <div className="p-3 space-y-2">
                {displayedNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-2 rounded-lg text-sm transition-all duration-200 ${
                      notification.type === "success"
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : notification.type === "error"
                        ? "bg-red-100 text-red-800 border border-red-200"
                        : notification.type === "warning"
                        ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                        : notification.type === "confirm"
                        ? "bg-orange-100 text-orange-800 border border-orange-200"
                        : "bg-blue-100 text-blue-800 border border-blue-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="flex-1 flex items-start text-xs leading-relaxed">
                        {notification.type === "warning" && (
                          <AlertTriangle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                        )}
                        {notification.message}
                      </span>
                      {notification.type === "confirm" && pendingRemoval && (
                        <div className="flex space-x-1 ml-2 flex-shrink-0">
                          <button
                            onClick={() => confirmRemoveItem(pendingRemoval)}
                            className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                          >
                            Xóa
                          </button>
                          <button
                            onClick={cancelRemoval}
                            className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors"
                          >
                            Hủy
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-col h-full overflow-hidden">
          {/* Loading State */}
          {loading && (
            <div className="flex-1 flex items-center justify-center min-h-0">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-3"></div>
                <p className="text-gray-600">Đang cập nhật giỏ hàng...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex-1 flex items-center justify-center p-4 min-h-0">
              <div className="text-center">
                <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
                <p className="text-red-600 mb-3 text-sm">
                  Có lỗi xảy ra: {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="block w-full px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                >
                  Tải lại trang
                </button>
              </div>
            </div>
          )}

          {/* Empty Cart */}
          {!loading && !hasItems && !error && (
            <div className="flex-1 flex items-center justify-center p-4 min-h-0">
              <div className="text-center">
                <div className="text-6xl mb-4 animate-bounce">🛒</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Giỏ hàng trống
                </h3>
                <p className="text-gray-600 mb-4">
                  Hãy thêm một số sản phẩm tuyệt vời!
                </p>
                <button
                  onClick={handleContinueShopping}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            </div>
          )}

          {/* Cart Items with Enhanced Effects */}
          {!loading && hasItems && !error && (
            <>
              <div className="flex-1 min-h-0 flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 py-2">
                  <div className="space-y-3">
                    {cartItems.map((item) => {
                      const productName =
                        item.productName ||
                        item.product?.name ||
                        "Unknown Product";
                      const productImage =
                        item.productImage ||
                        item.product?.mainImage ||
                        "/images/default-product.svg";
                      const unitPrice = item.unitPrice || item.price || 0;

                      // Check for optimistic updates
                      const optimisticUpdate = optimisticUpdates.get(
                        item.productId
                      );
                      const displayQuantity =
                        optimisticUpdate?.quantity ?? item.quantity;
                      const totalPrice = optimisticUpdate
                        ? unitPrice * optimisticUpdate.quantity
                        : item.totalPrice || unitPrice * item.quantity;

                      // Animation and state classes
                      const isAnimating = animatingItems.has(item.productId);
                      const isOptimistic = optimisticUpdate !== undefined;
                      const itemIsSelected = isItemSelected
                        ? isItemSelected(item.productId, item.productVariantId)
                        : false;

                      return (
                        <div
                          key={item.id || item.productId}
                          className={`
                            flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ease-in-out
                            ${
                              isAnimating
                                ? "scale-95 bg-blue-50 ring-1 ring-blue-200"
                                : itemIsSelected
                                ? "bg-green-50 ring-1 ring-green-200"
                                : "bg-gray-50"
                            }
                            ${isOptimistic ? "ring-1 ring-blue-200" : ""}
                          `}
                        >
                          {/* Selection Checkbox */}
                          <div className="flex-shrink-0">
                            <input
                              type="checkbox"
                              checked={itemIsSelected}
                              onChange={(e) =>
                                handleItemSelect(
                                  item.productId,
                                  item.productVariantId,
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                            />
                          </div>

                          {/* Product Image with Loading Overlay */}
                          <div className="flex-shrink-0 relative">
                            <img
                              src={productImage}
                              alt={productName}
                              className="w-12 h-12 object-cover rounded-md transition-transform duration-200 hover:scale-105"
                              loading="lazy"
                              onError={(e) => {
                                e.target.src = "/images/default-product.svg";
                              }}
                            />
                            {/* Loading overlay */}
                            {isOptimistic && (
                              <div className="absolute inset-0 bg-white bg-opacity-50 rounded-md flex items-center justify-center">
                                <RefreshCw className="w-3 h-3 animate-spin text-blue-500" />
                              </div>
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate hover:text-red-600 transition-colors">
                              {productName}
                            </h4>
                            <p className="text-xs text-gray-600">
                              {formatPrice(unitPrice)}
                            </p>

                            {/* Enhanced Quantity Controls */}
                            <div className="flex items-center mt-2 space-x-1">
                              <button
                                onClick={() =>
                                  handleQuantityUpdate(
                                    item.productId,
                                    displayQuantity - 1,
                                    item.quantity
                                  )
                                }
                                disabled={displayQuantity <= 1 || isAnimating}
                                className={`
                                  w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full 
                                  hover:bg-gray-300 disabled:opacity-50 transition-all duration-200
                                  ${isAnimating ? "animate-pulse" : ""}
                                `}
                              >
                                <Minus className="w-3 h-3" />
                              </button>

                              <div className="flex flex-col items-center">
                                <span
                                  className={`
                                  text-sm font-medium px-2 min-w-[30px] text-center
                                  transition-all duration-200
                                  ${
                                    isOptimistic
                                      ? "text-blue-600 scale-110"
                                      : "text-gray-900"
                                  }
                                `}
                                >
                                  {displayQuantity}
                                </span>
                                {isOptimistic && (
                                  <span className="text-xs text-blue-500">
                                    ...
                                  </span>
                                )}
                              </div>

                              <button
                                onClick={() =>
                                  handleQuantityUpdate(
                                    item.productId,
                                    displayQuantity + 1,
                                    item.quantity
                                  )
                                }
                                disabled={isAnimating}
                                className={`
                                  w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full 
                                  hover:bg-gray-300 disabled:opacity-50 transition-all duration-200
                                  ${isAnimating ? "animate-pulse" : ""}
                                `}
                              >
                                <Plus className="w-3 h-3" />
                              </button>

                              <button
                                onClick={() => handleRemoveItem(item)}
                                disabled={isAnimating}
                                className="p-1 text-gray-400 hover:text-red-500 transition-colors ml-1"
                                title="Xóa khỏi giỏ hàng"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Enhanced Price Display */}
                          <div className="text-right">
                            <p
                              className={`
                              text-sm font-semibold transition-all duration-200
                              ${
                                isOptimistic
                                  ? "text-blue-600 scale-105"
                                  : "text-gray-900"
                              }
                            `}
                            >
                              {formatPrice(totalPrice)}
                            </p>

                            {displayQuantity > 1 && (
                              <p className="text-xs text-gray-500">
                                {formatPrice(unitPrice)}/cái
                              </p>
                            )}

                            {itemIsSelected && (
                              <div className="text-xs text-green-600 font-medium mt-1">
                                ✓ Đã chọn
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 bg-white flex-shrink-0">
                  <div className="p-4 space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Tổng giỏ hàng:</span>
                        <span>{formatPrice(cartTotal)}</span>
                      </div>

                      {selectedItems && selectedItems.length > 0 && (
                        <div className="flex justify-between text-sm border-t pt-1">
                          <span className="text-green-600">
                            Đã chọn ({selectedItems.length} SP):
                          </span>
                          <span className="text-green-600 font-semibold">
                            {formatPrice(selectedTotal)}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between text-lg font-semibold border-t pt-2">
                        <span>Thanh toán:</span>
                        <span className="text-red-600">
                          {selectedItems && selectedItems.length > 0
                            ? formatPrice(selectedTotal)
                            : formatPrice(cartTotal)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={handleCheckout}
                        className={`
                          w-full py-3 px-4 rounded-lg font-medium transition-all duration-200
                          ${
                            selectedItems && selectedItems.length > 0
                              ? "bg-red-500 text-white hover:bg-red-600 hover:scale-105"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }
                        `}
                        disabled={!selectedItems || selectedItems.length === 0}
                      >
                        {selectedItems && selectedItems.length > 0
                          ? `Thanh toán (${selectedItems.length} SP)`
                          : "Chọn sản phẩm để thanh toán"}
                      </button>

                      <div className="flex space-x-2">
                        <button
                          onClick={handleContinueShopping}
                          className="flex-1 bg-gray-200 text-gray-800 py-2 px-3 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                        >
                          Tiếp tục mua sắm
                        </button>

                        <button
                          onClick={handleClearCart}
                          className="flex-1 bg-gray-200 text-gray-800 py-2 px-3 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                          disabled={!hasItems}
                        >
                          Xóa toàn bộ
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ShoppingCart;
