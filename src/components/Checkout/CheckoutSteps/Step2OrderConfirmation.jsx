import React, { useState, useEffect } from "react";
import { Edit, AlertCircle } from "lucide-react";
import { formatPrice } from "../../../utils/dataTransform";
import checkoutService from "../../../services/checkoutService";
import { orderService } from "../../../services/orderService";

const Step2OrderConfirmation = ({
  cart,
  orderSummary,
  selectedAddress,
  selectedShipping,
  appliedCoupon,
  useRewardPoints,
  rewardPointsAmount,
  onPrevStep,
  onCreateOrder,
  user,
  // NEW PROPS FOR BETTER STATE MANAGEMENT
  orderNotes,
  setOrderNotes,
  agreeTerms,
  setAgreeTerms,
  loading = false,
}) => {
  const [validationErrors, setValidationErrors] = useState({});

  const handleCreateOrder = async () => {
    if (!validateOrder()) return;

    try {
      const result = await onCreateOrder();
      if (!result?.success) {
        setValidationErrors({
          general: result?.message || "Không thể tạo đơn hàng",
        });
      }
    } catch (error) {
      console.error("Order creation failed:", error);
      setValidationErrors({
        general: "Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.",
      });
    }
  };

  const validateOrder = () => {
    const errors = {};

    // ENSURE ADDRESS IS STILL SELECTED (fix address persistence issue)
    if (!selectedAddress) {
      errors.address = "Thiếu thông tin địa chỉ giao hàng";
    }

    if (!selectedShipping) {
      errors.shipping = "Thiếu thông tin phương thức vận chuyển";
    }

    if (!agreeTerms) {
      errors.terms = "Vui lòng đồng ý với điều khoản sử dụng";
    }

    if (!cart?.items?.length) {
      errors.cart = "Giỏ hàng trống";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Clear errors when dependencies change
  useEffect(() => {
    if (Object.keys(validationErrors).length > 0) {
      const newErrors = { ...validationErrors };

      if (selectedAddress && newErrors.address) {
        delete newErrors.address;
      }

      if (selectedShipping && newErrors.shipping) {
        delete newErrors.shipping;
      }

      if (agreeTerms && newErrors.terms) {
        delete newErrors.terms;
      }

      if (cart?.items?.length && newErrors.cart) {
        delete newErrors.cart;
      }

      setValidationErrors(newErrors);
    }
  }, [selectedAddress, selectedShipping, agreeTerms, cart?.items]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content - Final Order Review */}
      <div className="lg:col-span-2 space-y-6">
        {/* Order Items Review */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Xem lại đơn hàng
          </h2>

          <div className="space-y-4 mb-6">
            {cart?.items?.map((item, index) => (
              <div
                key={item.productId || item.id || index}
                className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
              >
                <img
                  src={item.productImage || "/placeholder-image.jpg"}
                  alt={item.productName || "Product"}
                  className="w-20 h-20 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = "/placeholder-image.jpg";
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 mb-1">
                    {item.productName || "Sản phẩm"}
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>SKU: {item.productSku || item.sku || "N/A"}</div>
                    <div>
                      Đơn giá: {formatPrice(item.unitPrice || item.price || 0)}
                    </div>
                    <div>Số lượng: {item.quantity || 0}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-800">
                    {formatPrice(
                      (item.unitPrice || item.price || 0) * (item.quantity || 0)
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show error if no items */}
          {(!cart?.items || cart.items.length === 0) && (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-2">
                Không có sản phẩm trong đơn hàng
              </div>
              <button
                onClick={() => onPrevStep(1)}
                className="text-blue-600 hover:text-blue-700"
              >
                Quay lại để chọn sản phẩm
              </button>
            </div>
          )}

          {/* Discounts Applied */}
          {(appliedCoupon || (useRewardPoints && rewardPointsAmount > 0)) && (
            <div className="border-t pt-4 mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Ưu đãi áp dụng</h4>

              {appliedCoupon && (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg mb-2">
                  <div>
                    <div className="font-medium text-green-800">
                      Mã giảm giá: {appliedCoupon.code}
                    </div>
                    <div className="text-sm text-green-600">
                      {appliedCoupon.description}
                    </div>
                  </div>
                  <div className="text-green-700 font-medium">
                    -{formatPrice(appliedCoupon.discountAmount || 0)}
                  </div>
                </div>
              )}

              {useRewardPoints && rewardPointsAmount > 0 && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <div className="font-medium text-blue-800">Điểm thưởng</div>
                    <div className="text-sm text-blue-600">
                      {rewardPointsAmount.toLocaleString("vi-VN")} điểm
                    </div>
                  </div>
                  <div className="text-blue-700 font-medium">
                    -{formatPrice(rewardPointsAmount)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Order Notes */}
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-700 mb-3">Ghi chú đơn hàng</h4>
            <textarea
              value={orderNotes || ""}
              onChange={(e) => setOrderNotes && setOrderNotes(e.target.value)}
              placeholder="Ghi chú cho người giao hàng (tùy chọn)..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-2">
              Ví dụ: Gọi điện trước khi giao, giao vào buổi chiều...
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="border-t pt-6">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="agreeTerms"
                checked={agreeTerms || false}
                onChange={(e) =>
                  setAgreeTerms && setAgreeTerms(e.target.checked)
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
              />
              <label htmlFor="agreeTerms" className="text-sm text-gray-700">
                Tôi đã đọc và đồng ý với{" "}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Điều khoản sử dụng
                </a>{" "}
                và{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Chính sách bảo mật
                </a>
              </label>
            </div>

            {validationErrors.terms && (
              <div className="mt-2 flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{validationErrors.terms}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={() => onPrevStep(1)}
            disabled={loading}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium disabled:opacity-50 transition-all"
          >
            Quay lại
          </button>
          <button
            onClick={handleCreateOrder}
            disabled={loading || !agreeTerms || !cart?.items?.length}
            className="flex-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all"
          >
            {loading
              ? "Đang xử lý..."
              : `Đặt hàng ${formatPrice(orderSummary?.total || 0)}`}
          </button>
        </div>

        {/* Validation Errors */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="space-y-2">
            {Object.entries(validationErrors).map(([key, message]) => (
              <div
                key={key}
                className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
              >
                <AlertCircle className="w-5 h-5" />
                <span>{message}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sidebar - Order Summary */}
      <div className="lg:col-span-1 space-y-6">
        {/* FIXED: Delivery Info - Show current selected address */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Thông tin giao hàng</h3>
            <button
              onClick={() => onPrevStep(1)}
              className="text-blue-600 hover:text-blue-700 text-sm flex items-center transition-colors"
              disabled={loading}
            >
              <Edit className="w-4 h-4 mr-1" />
              Sửa
            </button>
          </div>

          {selectedAddress ? (
            <div className="space-y-3 text-sm">
              <div>
                <div className="font-medium text-gray-800">
                  {selectedAddress.fullName}
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
                {selectedAddress.postalCode && (
                  <div>Mã bưu điện: {selectedAddress.postalCode}</div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-red-600 text-sm flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>Không có địa chỉ được chọn</span>
            </div>
          )}

          {selectedShipping ? (
            <div className="border-t pt-4 mt-4">
              <div className="text-sm">
                <div className="font-medium text-gray-800 mb-1">
                  {selectedShipping.name}
                </div>
                <div className="text-gray-600">
                  {selectedShipping.description}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="font-medium">
                    {/* Show free shipping if applicable */}
                    {orderSummary?.subtotal >= 500000 ||
                    selectedShipping.price === 0
                      ? "Miễn phí"
                      : formatPrice(selectedShipping.price)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-t pt-4 mt-4 text-red-600 text-sm flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>Không có phương thức vận chuyển được chọn</span>
            </div>
          )}
        </div>

        {/* Order Totals */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Tổng đơn hàng</h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">
                Tạm tính ({cart?.items?.length || 0} sản phẩm)
              </span>
              <span className="font-medium">
                {formatPrice(orderSummary?.subtotal || 0)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Phí vận chuyển</span>
              <span className="font-medium">
                {orderSummary?.subtotal >= 500000 ? (
                  <span className="text-green-600">Miễn phí</span>
                ) : orderSummary?.shippingFee === 0 ? (
                  "Miễn phí"
                ) : (
                  formatPrice(orderSummary?.shippingFee || 0)
                )}
              </span>
            </div>

            {/* Show free shipping benefit */}
            {orderSummary?.subtotal >= 500000 && (
              <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                Bạn được miễn phí vận chuyển cho đơn hàng trên 500k!
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

            <div className="border-t pt-3">
              <div className="flex justify-between text-lg font-semibold">
                <span>Tổng cộng</span>
                <span className="text-red-600">
                  {formatPrice(orderSummary?.total || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            Phương thức thanh toán
          </h3>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="font-medium text-yellow-800 mb-1">
              COD - Thanh toán khi nhận hàng
            </div>
            <div className="text-sm text-yellow-700">
              Thanh toán bằng tiền mặt khi nhận được sản phẩm
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-500">
            Các phương thức thanh toán online sẽ có sớm (VNPay, MoMo,
            ZaloPay...)
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm">
            <div className="font-medium text-green-800 mb-1">
              Thanh toán an toàn
            </div>
            <div className="text-green-700">
              Thông tin được bảo vệ bằng mã hóa SSL 256-bit
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2OrderConfirmation;
