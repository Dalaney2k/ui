import React from "react";
import { ArrowLeft } from "lucide-react";
import { formatPrice } from "../../utils/dataTransform";

const CheckoutHeader = ({ step, onBackToProducts, cart, orderSummary }) => {
  const steps = [
    { num: 1, title: "Thông tin giao hàng" },
    { num: 2, title: "Xác nhận đơn hàng" },
    { num: 3, title: "Hoàn tất" },
  ];

  // ✅ Fix: Calculate total items from cart items array
  const getTotalItems = () => {
    if (!cart?.items?.length) return 0;

    return cart.items.reduce((total, item) => {
      return total + (item.quantity || 0);
    }, 0);
  };

  // ✅ Fix: Get total products count (number of different products)
  const getTotalProducts = () => {
    return cart?.items?.length || 0;
  };

  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBackToProducts}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Tiếp tục mua sắm
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-2xl font-semibold text-gray-800">Thanh toán</h1>
          </div>

          {/* Cart Info - Fixed */}
          <div className="text-right">
            <div className="text-sm text-gray-600">
              {getTotalProducts()} sản phẩm ({getTotalItems()} món)
            </div>
            <div className="text-lg font-semibold text-gray-800">
              {formatPrice(orderSummary?.total || 0)}
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        {step < 4 && (
          <div className="flex items-center justify-center space-x-4">
            {steps.map((stepItem, index) => (
              <React.Fragment key={stepItem.num}>
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      step >= stepItem.num
                        ? "bg-blue-600 text-white"
                        : step === stepItem.num - 1
                        ? "bg-blue-100 text-blue-600 border-2 border-blue-600"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {stepItem.num}
                  </div>
                  <span
                    className={`ml-3 text-sm font-medium hidden md:block ${
                      step >= stepItem.num ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {stepItem.title}
                  </span>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 transition-colors ${
                      step > stepItem.num ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Mobile Progress */}
        <div className="md:hidden mt-4 text-center">
          <div className="text-sm text-gray-600">
            Bước {step} / {steps.length}: {steps[step - 1]?.title}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutHeader;
