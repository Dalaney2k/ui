// components/Common/WishlistNotice.jsx - Wishlist Development Notice
import React from "react";

const WishlistNotice = () => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <span className="text-2xl">🚧</span>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Tính năng Wishlist đang phát triển
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              Chúng tôi đang hoàn thiện tính năng danh sách yêu thích. Frontend
              đã sẵn sàng, đang chờ backend team hoàn thành API.
            </p>
            <ul className="mt-2 list-disc list-inside">
              <li>✅ Giao diện đã hoàn thành</li>
              <li>✅ Tích hợp API đã sẵn sàng</li>
              <li>🔄 Đang chờ backend implement</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistNotice;
