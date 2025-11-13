import React from "react";
import {
  CheckCircle,
  Download,
  Eye,
  ShoppingBag,
  Phone,
  Mail,
} from "lucide-react";
import { formatPrice } from "../../../utils/dataTransform";
import { orderService } from "../../../services/orderService";

const Step3OrderSuccess = ({
  orderResult,
  onContinueShopping,
  onViewOrder,
}) => {
  const handleDownloadInvoice = async () => {
    try {
      await checkoutApi.downloadInvoice(orderResult.id);
    } catch (error) {
      console.error("Failed to download invoice:", error);
      alert("Không thể tải hóa đơn. Vui lòng thử lại sau.");
    }
  };

  const handleViewOrderDetails = () => {
    if (onViewOrder) {
      onViewOrder(orderResult.id);
    } else {
      window.location.href = `/orders/${orderResult.id}`;
    }
  };

  const handleContinueShoppingClick = () => {
    if (onContinueShopping) {
      onContinueShopping();
    } else {
      window.location.href = "/products";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          Đặt hàng thành công!
        </h1>

        <p className="text-lg text-gray-600 mb-2">
          Cảm ơn bạn đã tin tương và đặt hàng tại SakuraHome
        </p>
        <p className="text-gray-600">
          Chúng tôi đã nhận được đơn hàng và sẽ xử lý trong thời gian sớm nhất.
        </p>
      </div>

      {/* Order Information */}
      <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Thông tin đơn hàng
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Mã đơn hàng</div>
            <div className="font-semibold text-lg text-gray-800">
              {orderResult.orderNumber}
            </div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Tổng tiền</div>
            <div className="font-semibold text-lg text-red-600">
              {formatPrice(orderResult.totalAmount)}
            </div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Thanh toán</div>
            <div className="font-semibold text-lg text-yellow-600">COD</div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Dự kiến giao</div>
            <div className="font-semibold text-lg text-blue-600">
              {orderResult.estimatedDelivery
                ? new Date(orderResult.estimatedDelivery).toLocaleDateString(
                    "vi-VN"
                  )
                : "3-5 ngày"}
            </div>
          </div>
        </div>

        {/* Customer & Shipping Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">
              Thông tin khách hàng
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Họ tên:</span>
                  <span className="font-medium">
                    {orderResult.customer?.fullName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">
                    {orderResult.customer?.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Điện thoại:</span>
                  <span className="font-medium">
                    {orderResult.customer?.phoneNumber}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">
              Địa chỉ giao hàng
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm space-y-1">
                <div className="font-medium">
                  {orderResult.shippingAddress?.fullName}
                </div>
                <div className="text-gray-600">
                  {orderResult.shippingAddress?.phoneNumber}
                </div>
                <div className="text-gray-600">
                  {orderResult.shippingAddress?.addressLine1}
                  {orderResult.shippingAddress?.addressLine2 &&
                    `, ${orderResult.shippingAddress.addressLine2}`}
                </div>
                <div className="text-gray-600">
                  {orderResult.shippingAddress?.ward},{" "}
                  {orderResult.shippingAddress?.district},{" "}
                  {orderResult.shippingAddress?.city}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Sản phẩm đã đặt
        </h2>

        <div className="space-y-4 mb-6">
          {orderResult.items?.map((item) => (
            <div
              key={item.id}
              className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
            >
              <img
                src={item.productImage || "/placeholder-image.jpg"}
                alt={item.productName}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">
                  {item.productName}
                </h3>
                <p className="text-sm text-gray-600">
                  Số lượng: {item.quantity} × {formatPrice(item.unitPrice)}
                </p>
              </div>
              <div className="font-semibold text-gray-800">
                {formatPrice(item.totalPrice)}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Tổng cộng:</span>
            <span className="text-red-600">
              {formatPrice(orderResult.totalAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <button
          onClick={handleViewOrderDetails}
          className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center font-medium"
        >
          <Eye className="w-5 h-5 mr-2" />
          Xem chi tiết đơn hàng
        </button>

        <button
          onClick={handleDownloadInvoice}
          className="px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center font-medium"
        >
          <Download className="w-5 h-5 mr-2" />
          Tải hóa đơn
        </button>

        <button
          onClick={handleContinueShoppingClick}
          className="px-8 py-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all flex items-center justify-center font-medium"
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          Tiếp tục mua sắm
        </button>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-blue-800 mb-4">
          Những gì xảy ra tiếp theo?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: "Xác nhận đơn hàng",
                description:
                  "Chúng tôi sẽ xác nhận đơn hàng trong vòng 1-2 giờ",
              },
              {
                step: 2,
                title: "Chuẩn bị hàng",
                description: "Đóng gói và chuẩn bị giao hàng trong 24-48 giờ",
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {item.step}
                </div>
                <div>
                  <p className="font-medium text-blue-800">{item.title}</p>
                  <p className="text-sm text-blue-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {[
              {
                step: 3,
                title: "Giao hàng",
                description: "Shipper sẽ liên hệ và giao hàng theo lịch hẹn",
              },
              {
                step: 4,
                title: "Thanh toán COD",
                description: "Thanh toán tiền mặt khi nhận được hàng",
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {item.step}
                </div>
                <div>
                  <p className="font-medium text-blue-800">{item.title}</p>
                  <p className="text-sm text-blue-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Support */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-gray-800 mb-4 text-center">
          Cần hỗ trợ?
        </h3>

        <p className="text-center text-gray-600 mb-6">
          Đội ngũ hỗ trợ khách hàng luôn sẵn sàng giúp đỡ bạn
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <Phone className="w-4 h-4" />
            <span className="font-medium">Hotline: 1900 1234</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <Mail className="w-4 h-4" />
            <span className="font-medium">support@sakurahome.vn</span>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Thời gian hỗ trợ: 8:00 - 22:00 (Thứ 2 - Chủ nhật)
          </p>
        </div>
      </div>

      {/* Thank You Message */}
      <div className="text-center mt-8 mb-4">
        <p className="text-lg text-gray-600">
          Cảm ơn bạn đã lựa chọn SakuraHome!
        </p>
        <p className="text-gray-500">
          Chúng tôi hy vọng bạn sẽ hài lòng với sản phẩm và dịch vụ.
        </p>
      </div>
    </div>
  );
};

export default Step3OrderSuccess;
