import React from "react";
import { formatPrice } from "../../utils/dataTransform";

const CheckoutNavigation = ({
  step,
  loading = false,
  orderSummary,
  onPrevStep,
  onNextStep,
  onCreateOrder,
  canProceed = true,
}) => {
  if (step >= 4) return null; // Don't show on success page

  const getNextButtonText = () => {
    switch (step) {
      case 1:
        return "Tiếp tục";
      case 2:
        return `Đặt hàng ${formatPrice(orderSummary?.total || 0)}`;
      case 3:
        return "Hoàn tất";
      default:
        return "Tiếp tục";
    }
  };

  const getNextButtonAction = () => {
    return step === 2 ? onCreateOrder : onNextStep;
  };

  const getNextButtonStyle = () => {
    const baseStyle =
      "px-8 py-3 rounded-lg font-medium transition-all flex items-center disabled:opacity-50 disabled:cursor-not-allowed";

    if (step === 2) {
      return `${baseStyle} bg-green-600 text-white hover:bg-green-700`;
    }

    return `${baseStyle} bg-blue-600 text-white hover:bg-blue-700`;
  };

  return (
    <div className="flex justify-between items-center pt-6 border-t">
      <button
        onClick={onPrevStep}
        disabled={step === 1 || loading}
        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
      >
        Quay lại
      </button>

      <button
        onClick={getNextButtonAction()}
        disabled={loading || !canProceed}
        className={getNextButtonStyle()}
      >
        {loading && (
          <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        {getNextButtonText()}
      </button>
    </div>
  );
};

export default CheckoutNavigation;
