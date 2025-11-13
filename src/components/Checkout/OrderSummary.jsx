import React from "react";
import { Shield, Phone, Mail } from "lucide-react";
import { formatPrice } from "../../utils/dataTransform";

const OrderSummary = ({
  cart,
  orderSummary,
  appliedCoupon,
  selectedShipping,
  isVisible = true,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-xl border-l border-gray-200 z-40 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Tóm tắt đơn hàng
        </h2>

        {/* Items */}
        <div className="space-y-4 mb-6">
          {cart.items.map((item) => (
            <div key={item.productId} className="flex items-center space-x-3">
              <img
                src={item.product?.mainImage || "/placeholder-image.jpg"}
                alt={item.product?.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-800 truncate">
                  {item.product?.name}
                </h3>
                <p className="text-xs text-gray-600">x{item.quantity}</p>
              </div>
              <span className="text-sm font-semibold">
                {formatPrice(item.totalPrice)}
              </span>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-3 border-t border-gray-200 pt-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tạm tính</span>
            <span>{formatPrice(orderSummary.subtotal)}</span>
          </div>

          {selectedShipping && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Phí vận chuyển</span>
              <span>
                {orderSummary.shippingFee === 0
                  ? "Miễn phí"
                  : formatPrice(orderSummary.shippingFee)}
              </span>
            </div>
          )}

          {appliedCoupon && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Giảm giá ({appliedCoupon.code})</span>
              <span>-{formatPrice(orderSummary.discount)}</span>
            </div>
          )}

          {orderSummary.rewardPointsDiscount > 0 && (
            <div className="flex justify-between text-sm text-blue-600">
              <span>Điểm thưởng</span>
              <span>-{formatPrice(orderSummary.rewardPointsDiscount)}</span>
            </div>
          )}

          <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
            <span>Tổng cộng</span>
            <span className="text-red-600">
              {formatPrice(orderSummary.total)}
            </span>
          </div>
        </div>

        {/* Security notice */}
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2 text-green-700">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Thanh toán an toàn</span>
          </div>
          <p className="text-xs text-green-600 mt-1">
            Thông tin của bạn được bảo vệ bằng mã hóa SSL 256-bit
          </p>
        </div>

        {/* Customer support */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            Cần hỗ trợ?
          </h3>
          <div className="space-y-2 text-xs text-blue-600">
            <div className="flex items-center space-x-2">
              <Phone className="w-3 h-3" />
              <span>Hotline: 1900 1234</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-3 h-3" />
              <span>support@sakurahome.vn</span>
            </div>
          </div>
        </div>

        {/* COD Notice */}
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-800 mb-1">
            💵 Thanh toán khi nhận hàng
          </h3>
          <p className="text-xs text-yellow-600">
            Hiện tại chỉ hỗ trợ thanh toán COD. Các phương thức khác sẽ có trong
            thời gian tới.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
