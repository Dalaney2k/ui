import React, { useState, useEffect } from "react";
import { X, Plus, Minus, MapPin, AlertCircle } from "lucide-react";
import AddressForm from "../AddressForm";
import AddressSelectionModal from "../AddressSelectionModal";
import { formatPrice } from "../../../utils/dataTransform";
import checkoutService from "../../../services/checkoutService";
import { addressService } from "../../../services/addressService";
import { shippingService } from "../../../services/shippingService";
import { couponService } from "../../../services/couponService";

const Step1DeliveryInfo = ({
  cart,
  orderSummary,
  onOrderSummaryUpdate,
  onNextStep,
  user,
  errors = {},
  // ✅ Add checkout items update handler
  onUpdateCheckoutItems,
  // Address props
  addresses = [],
  selectedAddress,
  onSelectAddress,
  onAddAddress,
  // Shipping props
  selectedShipping,
  shippingMethods = [],
  onSelectShipping,
  // Coupon props
  couponCode,
  setCouponCode,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  // Reward points
  useRewardPoints,
  setUseRewardPoints,
  rewardPointsAmount,
  setRewardPointsAmount,
  // Loading states
  loading = {},
}) => {
  // Local states
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showCartDetails, setShowCartDetails] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // ✅ SEPARATE CHECKOUT ITEMS STATE - không ảnh hưởng đến cart
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [updatingItems, setUpdatingItems] = useState(false);
  const [initialized, setInitialized] = useState(false); // ✅ Add flag to prevent re-initialization

  // ✅ Initialize checkout items from cart - CHỈ MỘT LẦN
  useEffect(() => {
    if (cart?.items?.length && !initialized) {
      console.log("🚀 Initializing checkout items from cart:", cart.items);
      setCheckoutItems([...cart.items]);
      setInitialized(true); // ✅ Mark as initialized
    }
  }, [cart, initialized]);

  // ✅ FREE SHIPPING THRESHOLD - 500k
  const FREE_SHIPPING_THRESHOLD = 500000;

  // ✅ CHECKOUT ITEM MANAGEMENT - chỉ cập nhật local state
  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }

    console.log(
      "📝 Updating quantity for item ID:",
      itemId,
      "to quantity:",
      newQuantity
    );

    setCheckoutItems((prev) =>
      prev.map((item) => {
        const currentItemId = item.id || item.productId;
        if (currentItemId === itemId) {
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: (item.price || item.unitPrice) * newQuantity,
          };
        }
        return item;
      })
    );

    // Show success message briefly
    setValidationErrors((prev) => ({
      ...prev,
      itemUpdate: "Đã cập nhật số lượng thành công",
    }));

    setTimeout(() => {
      setValidationErrors((prev) => ({ ...prev, itemUpdate: null }));
    }, 2000);
  };

  const handleRemoveItem = (itemId) => {
    // ✅ Bỏ confirm dialog theo yêu cầu

    console.log("🗑️ Removing item with ID:", itemId);
    console.log("📦 Current checkout items BEFORE removal:", checkoutItems);

    setCheckoutItems((prev) => {
      const newItems = prev.filter((item) => {
        const currentItemId = item.id || item.productId;
        const shouldKeep = currentItemId !== itemId;

        console.log(
          `🔍 Item ${currentItemId}: ${shouldKeep ? "KEEP" : "REMOVE"}`
        );
        return shouldKeep;
      });

      console.log("📦 Items AFTER removal:", newItems);
      console.log(`📊 Removed ${prev.length - newItems.length} items`);

      // ✅ Notify parent component about the change
      if (onUpdateCheckoutItems) {
        onUpdateCheckoutItems(newItems);
      }

      return newItems;
    });

    setValidationErrors((prev) => ({
      ...prev,
      itemUpdate: "Đã xóa sản phẩm thành công",
    }));

    setTimeout(() => {
      setValidationErrors((prev) => ({ ...prev, itemUpdate: null }));
    }, 2000);
  };

  // ✅ Debug effect to track checkoutItems changes
  useEffect(() => {
    console.log("🔄 CheckoutItems state changed:", checkoutItems);
  }, [checkoutItems]);

  // ✅ IMPROVED ORDER SUMMARY CALCULATION WITH FREE SHIPPING
  const calculateOrderSummary = (items = checkoutItems) => {
    console.log("🧮 Calculating order summary with items:", items);

    if (!items?.length) {
      console.log("⚠️ No items to calculate summary");
      const emptySummary = {
        subtotal: 0,
        shippingFee: 0,
        discount: 0,
        rewardPointsDiscount: 0,
        total: 0,
      };
      onOrderSummaryUpdate(emptySummary);
      return;
    }

    try {
      // Calculate subtotal from checkout items
      const subtotal = items.reduce(
        (total, item) =>
          total + (item.price || item.unitPrice || 0) * (item.quantity || 0),
        0
      );

      console.log("💰 Calculated subtotal:", subtotal);

      // ✅ Apply free shipping rule
      let shippingFee = selectedShipping?.price || 0;
      if (subtotal >= FREE_SHIPPING_THRESHOLD) {
        shippingFee = 0;
      }

      // Calculate discount
      let discount = 0;
      if (appliedCoupon) {
        if (appliedCoupon.type === "percentage") {
          discount = (subtotal * (appliedCoupon.discountAmount || 0)) / 100;
        } else {
          discount = appliedCoupon.discountAmount || 0;
        }
      }

      // Apply reward points discount
      const rewardPointsDiscount = useRewardPoints ? rewardPointsAmount : 0;

      // Calculate total
      const total = Math.max(
        0,
        subtotal + shippingFee - discount - rewardPointsDiscount
      );

      const summary = {
        subtotal,
        shippingFee,
        discount,
        rewardPointsDiscount,
        total,
      };

      console.log("📊 Final order summary:", summary);
      onOrderSummaryUpdate(summary);
    } catch (error) {
      console.error("Failed to calculate order summary:", error);
    }
  };

  // Recalculate when dependencies change
  useEffect(() => {
    console.log("🔄 Dependencies changed, recalculating...");
    calculateOrderSummary();
  }, [
    checkoutItems,
    selectedShipping,
    appliedCoupon,
    useRewardPoints,
    rewardPointsAmount,
  ]);

  // ✅ COUPON HANDLING
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setValidationErrors((prev) => ({ ...prev, coupon: null }));

    try {
      const result = await onApplyCoupon();
      if (!result.success) {
        setValidationErrors((prev) => ({
          ...prev,
          coupon: result.error || "Mã giảm giá không hợp lệ",
        }));
      }
    } catch (error) {
      console.error("Apply coupon failed:", error);
      setValidationErrors((prev) => ({
        ...prev,
        coupon: "Không thể áp dụng mã giảm giá",
      }));
    }
  };

  // ✅ REWARD POINTS HANDLING
  const handleRewardPointsChange = (checked) => {
    setUseRewardPoints(checked);
    if (checked && user?.points > 0) {
      const maxUsable = Math.min(user.points, orderSummary?.subtotal || 0);
      setRewardPointsAmount(maxUsable);
    } else {
      setRewardPointsAmount(0);
    }
  };

  // ✅ VALIDATION AND PROCEED
  const validateAndProceed = () => {
    const errors = {};

    if (!selectedAddress) {
      errors.address = "Vui lòng chọn địa chỉ giao hàng";
    }

    if (!selectedShipping) {
      errors.shipping = "Vui lòng chọn phương thức vận chuyển";
    }

    if (!checkoutItems?.length) {
      errors.items = "Không có sản phẩm để thanh toán";
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      // Pass checkout items to next step
      onNextStep({
        selectedAddress,
        selectedShipping,
        appliedCoupon,
        useRewardPoints,
        rewardPointsAmount,
        checkoutItems, // ✅ Pass checkout items instead of cart items
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content - Order Details */}
      <div className="lg:col-span-2 space-y-6">
        {/* Order Items with Edit Capability */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Chi tiết đơn hàng ({checkoutItems.length} sản phẩm)
            </h2>
            <button
              onClick={() => setShowCartDetails(!showCartDetails)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {showCartDetails ? "Thu gọn" : "Xem chi tiết"}
            </button>
          </div>

          {/* Item Update Status */}
          {validationErrors.itemUpdate && (
            <div
              className={`mb-4 p-3 rounded-lg border ${
                validationErrors.itemUpdate.includes("thành công")
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              <div className="text-sm">{validationErrors.itemUpdate}</div>
            </div>
          )}

          {/* ✅ CHECKOUT ITEMS WITH EDIT CONTROLS */}
          <div className="space-y-4 mb-6">
            {checkoutItems.map((item) => {
              // ✅ Ensure consistent ID usage
              const itemId = item.id || item.productId;

              return (
                <div
                  key={itemId}
                  className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                >
                  <img
                    src={item.productImage || "/placeholder-image.jpg"}
                    alt={item.productName}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 mb-1">
                      {item.productName}
                    </h3>
                    <div className="text-xs text-gray-500 mb-1">
                      SKU: {item.productSku}
                    </div>
                    {showCartDetails && (
                      <p className="text-sm text-gray-600 mb-2">
                        {item.productDescription || item.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Đơn giá: {formatPrice(item.unitPrice || item.price)}
                      </div>
                      <div className="font-semibold text-gray-800">
                        {formatPrice(
                          (item.unitPrice || item.price) * item.quantity
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ✅ QUANTITY CONTROLS */}
                  <div className="flex flex-col items-end space-y-3">
                    <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(itemId, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 py-1 text-center min-w-[40px] font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(itemId, item.quantity + 1)
                        }
                        className="p-2 hover:bg-gray-100 rounded-r-lg"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(itemId)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty items message */}
          {!checkoutItems.length && (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">Không có sản phẩm</div>
              <button
                onClick={() => (window.location.href = "/products")}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          )}

          {/* Coupon Section */}
          <div className="border-t pt-6">
            <h3 className="font-medium text-gray-800 mb-4">Mã giảm giá</h3>

            {appliedCoupon ? (
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div>
                  <div className="font-medium text-green-800">
                    {appliedCoupon.code}
                  </div>
                  <div className="text-sm text-green-600">
                    Giảm {formatPrice(appliedCoupon.discountAmount)}
                  </div>
                </div>
                <button
                  onClick={onRemoveCoupon}
                  className="text-green-600 hover:text-green-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    placeholder="Nhập mã giảm giá"
                    value={couponCode}
                    onChange={(e) =>
                      setCouponCode(e.target.value.toUpperCase())
                    }
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => e.key === "Enter" && handleApplyCoupon()}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim() || loading.coupon}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading.coupon ? "Đang kiểm tra..." : "Áp dụng"}
                  </button>
                </div>

                {validationErrors.coupon && (
                  <div className="flex items-center space-x-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{validationErrors.coupon}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Reward Points */}
          {user?.points > 0 && (
            <div className="border-t pt-6 mt-6">
              <h3 className="font-medium text-gray-800 mb-4">Điểm thưởng</h3>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="useRewardPoints"
                  checked={useRewardPoints}
                  onChange={(e) => handleRewardPointsChange(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="useRewardPoints"
                  className="text-sm text-gray-700"
                >
                  Sử dụng điểm thưởng (Có:{" "}
                  {user.points?.toLocaleString("vi-VN")} điểm)
                </label>
              </div>

              {useRewardPoints && (
                <div className="mt-3">
                  <input
                    type="number"
                    min="0"
                    max={Math.min(user.points, orderSummary?.subtotal || 0)}
                    value={rewardPointsAmount}
                    onChange={(e) =>
                      setRewardPointsAmount(parseInt(e.target.value) || 0)
                    }
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Số điểm"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    = {formatPrice(rewardPointsAmount)} giảm giá
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ✅ ENHANCED ORDER SUMMARY WITH FREE SHIPPING */}
          <div className="border-t pt-6 mt-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính</span>
                <span className="font-medium">
                  {formatPrice(orderSummary?.subtotal || 0)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span className="font-medium">
                  {orderSummary?.subtotal >= FREE_SHIPPING_THRESHOLD ? (
                    <span className="text-green-600">Miễn phí</span>
                  ) : orderSummary?.shippingFee === 0 ? (
                    "Miễn phí"
                  ) : (
                    formatPrice(orderSummary?.shippingFee || 0)
                  )}
                </span>
              </div>

              {/* Free shipping progress */}
              {orderSummary?.subtotal < FREE_SHIPPING_THRESHOLD && (
                <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                  Mua thêm{" "}
                  {formatPrice(
                    FREE_SHIPPING_THRESHOLD - (orderSummary?.subtotal || 0)
                  )}{" "}
                  để được miễn phí vận chuyển
                  <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          100,
                          ((orderSummary?.subtotal || 0) /
                            FREE_SHIPPING_THRESHOLD) *
                            100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá ({appliedCoupon.code})</span>
                  <span>-{formatPrice(orderSummary?.discount || 0)}</span>
                </div>
              )}

              {useRewardPoints && rewardPointsAmount > 0 && (
                <div className="flex justify-between text-blue-600">
                  <span>Điểm thưởng</span>
                  <span>-{formatPrice(rewardPointsAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-lg font-semibold border-t pt-3">
                <span>Tổng cộng</span>
                <span className="text-red-600">
                  {formatPrice(orderSummary?.total || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Address & Shipping */}
      <div className="lg:col-span-1 space-y-6">
        {/* ✅ SIMPLIFIED DELIVERY ADDRESS - chỉ hiển thị địa chỉ mặc định + button chọn lại */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Địa chỉ giao hàng</h3>
            <button
              onClick={() => setShowAddressModal(true)}
              className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
            >
              <MapPin className="w-4 h-4 mr-1" />
              Chọn lại
            </button>
          </div>

          {loading.addresses ? (
            <div className="text-center py-4 text-gray-500">
              Đang tải địa chỉ...
            </div>
          ) : selectedAddress ? (
            <div className="space-y-3 text-sm">
              <div>
                <div className="font-medium text-gray-800 flex items-center space-x-2">
                  <span>{selectedAddress.fullName}</span>
                  {selectedAddress.isDefault && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                      Mặc định
                    </span>
                  )}
                </div>
                <div className="text-gray-600">
                  {selectedAddress.phoneNumber}
                </div>
              </div>
              <div className="text-gray-600">
                <div>{selectedAddress.addressLine1}</div>
                {selectedAddress.addressLine2 && (
                  <div>{selectedAddress.addressLine2}</div>
                )}
                <div>
                  {selectedAddress.ward}, {selectedAddress.district},{" "}
                  {selectedAddress.city}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="text-gray-400 mb-2">
                Chưa có địa chỉ giao hàng
              </div>
              <button
                onClick={() => setShowAddressForm(true)}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Thêm địa chỉ đầu tiên
              </button>
            </div>
          )}

          {validationErrors.address && (
            <div className="mt-3 flex items-center space-x-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{validationErrors.address}</span>
            </div>
          )}
        </div>

        {/* Shipping Methods */}
        {selectedAddress && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="font-semibold text-gray-800 mb-4">
              Phương thức vận chuyển
            </h3>

            {loading.shipping ? (
              <div className="text-center py-4 text-gray-500">
                Đang tải phương thức...
              </div>
            ) : shippingMethods.length === 0 ? (
              <div className="text-center py-4 text-gray-400">
                Không có phương thức vận chuyển
              </div>
            ) : (
              <div className="space-y-3">
                {shippingMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedShipping?.id === method.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => onSelectShipping(method)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-800">
                          {method.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {method.description}
                        </div>
                        {method.estimatedDays && (
                          <div className="text-xs text-gray-500 mt-1">
                            Dự kiến: {method.estimatedDays} ngày
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-800">
                          {orderSummary?.subtotal >= FREE_SHIPPING_THRESHOLD ||
                          method.price === 0
                            ? "Miễn phí"
                            : formatPrice(method.price)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {validationErrors.shipping && (
              <div className="mt-3 flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{validationErrors.shipping}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ✅ CONTINUE BUTTON - ĐẶT Ở GIỮA */}
      <div className="lg:col-span-3 flex justify-center pt-6">
        <button
          onClick={validateAndProceed}
          disabled={
            !selectedAddress || !selectedShipping || !checkoutItems.length
          }
          className="px-12 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
        >
          Tiếp tục xác nhận
        </button>
      </div>

      {/* Address Selection Modal */}
      <AddressSelectionModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        addresses={addresses}
        selectedAddress={selectedAddress}
        onSelectAddress={onSelectAddress}
        onAddNewAddress={() => {
          setShowAddressModal(false);
          setShowAddressForm(true);
        }}
      />

      {/* Address Form Modal */}
      <AddressForm
        isOpen={showAddressForm}
        onClose={() => setShowAddressForm(false)}
        onSubmit={onAddAddress}
        loading={loading.addresses}
        user={user}
      />
    </div>
  );
};

export default Step1DeliveryInfo;
