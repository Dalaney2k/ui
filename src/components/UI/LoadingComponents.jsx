import React from "react";

// Loading component
export const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
  </div>
);

// Error component
export const ErrorMessage = ({ error, onRetry }) => (
  <div className="text-center py-8">
    <div className="text-red-600 mb-4">
      <p className="text-lg font-medium">Có lỗi xảy ra</p>
      <p className="text-sm text-gray-600">{error}</p>
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Thử lại
      </button>
    )}
  </div>
);
