import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Users } from "lucide-react";
import UserTypeSelector from "../components/UserTypeSelector";

const AdminUserSelectType = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("customer");

  const handleContinue = () => {
    navigate(`/admin/users/add?type=${selectedType}`);
  };

  return (
    <div className="min-h-screen bg-zen-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-sakura-100 text-sakura-600 rounded-full mb-4">
            <Users className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-zen-gray-900 mb-2">
            Thêm người dùng mới
          </h1>
          <p className="text-zen-gray-500 max-w-2xl mx-auto">
            Chọn loại tài khoản bạn muốn tạo. Mỗi loại sẽ có các tính năng và
            quyền hạn khác nhau phù hợp với vai trò trong hệ thống.
          </p>
        </div>

        {/* Type Selector Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-zen-gray-200 p-8">
          <UserTypeSelector
            userType={selectedType}
            onTypeChange={setSelectedType}
          />

          {/* Actions */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-zen-gray-200">
            <button
              onClick={() => navigate("/admin/users")}
              className="flex items-center space-x-2 text-zen-gray-600 hover:text-zen-gray-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Quay lại danh sách</span>
            </button>

            <button
              onClick={handleContinue}
              className="btn btn-sakura px-6 py-3"
            >
              <span>Tiếp tục</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-xl p-6 border border-zen-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-zen-gray-800">
                Quyền hạn linh hoạt
              </h3>
            </div>
            <p className="text-sm text-zen-gray-600">
              Bạn có thể dễ dàng thay đổi quyền hạn và vai trò của người dùng
              sau khi tạo tài khoản thông qua trang chỉnh sửa.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-zen-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <ArrowRight className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-zen-gray-800">
                Thiết lập nhanh chóng
              </h3>
            </div>
            <p className="text-sm text-zen-gray-600">
              Form sẽ được tự động cấu hình với các trường phù hợp dựa trên loại
              tài khoản bạn đã chọn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserSelectType;
