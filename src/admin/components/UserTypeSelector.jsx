import React from "react";
import { User, Briefcase, Crown } from "lucide-react";

const UserTypeSelector = ({ userType, onTypeChange }) => {
  const userTypes = [
    {
      value: "customer",
      label: "Khách hàng",
      icon: User,
      color: "sakura",
      bgColor: "bg-sakura-100",
      textColor: "text-sakura-600",
      description: "Tạo tài khoản khách hàng mới cho việc mua sắm",
      features: [
        "Quản lý đơn hàng cá nhân",
        "Tích điểm thành viên",
        "Lịch sử mua hàng",
        "Wishlist và giỏ hàng",
      ],
    },
    {
      value: "staff",
      label: "Nhân viên",
      icon: Briefcase,
      color: "info",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      description: "Tạo tài khoản nhân viên với quyền quản trị hệ thống",
      features: [
        "Quản lý sản phẩm",
        "Xử lý đơn hàng",
        "Hỗ trợ khách hàng",
        "Truy cập báo cáo",
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-zen-gray-800 mb-2">
          Chọn loại người dùng
        </h2>
        <p className="text-zen-gray-500">
          Chọn loại tài khoản bạn muốn tạo để cấu hình phù hợp
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {userTypes.map((type) => {
          const IconComponent = type.icon;
          const isSelected = userType === type.value;

          return (
            <div
              key={type.value}
              className={`
                relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-200
                ${
                  isSelected
                    ? "border-sakura-primary bg-sakura-50 shadow-md"
                    : "border-zen-gray-200 hover:border-zen-gray-300 hover:shadow-sm"
                }
              `}
              onClick={() => onTypeChange(type.value)}
            >
              {/* Selection Radio */}
              <div className="absolute top-4 right-4">
                <div
                  className={`
                  w-5 h-5 rounded-full border-2 transition-all duration-200
                  ${
                    isSelected
                      ? "border-sakura-primary bg-sakura-primary"
                      : "border-zen-gray-300"
                  }
                `}
                >
                  {isSelected && (
                    <div className="w-full h-full rounded-full bg-white scale-50 transform" />
                  )}
                </div>
              </div>

              {/* Icon */}
              <div
                className={`
                inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4
                ${isSelected ? type.bgColor : "bg-zen-gray-100"}
              `}
              >
                <IconComponent
                  className={`h-6 w-6 ${
                    isSelected ? type.textColor : "text-zen-gray-500"
                  }`}
                />
              </div>

              {/* Title & Description */}
              <div className="mb-4">
                <h3
                  className={`
                  text-lg font-semibold mb-2
                  ${isSelected ? "text-zen-gray-900" : "text-zen-gray-700"}
                `}
                >
                  {type.label}
                </h3>
                <p className="text-sm text-zen-gray-500">{type.description}</p>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-zen-gray-700 mb-2">
                  Tính năng chính:
                </h4>
                <ul className="space-y-1">
                  {type.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center text-sm text-zen-gray-600"
                    >
                      <div
                        className={`
                        w-1.5 h-1.5 rounded-full mr-2
                        ${isSelected ? "bg-sakura-primary" : "bg-zen-gray-400"}
                      `}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute -top-2 -left-2 bg-sakura-primary text-white px-3 py-1 rounded-full text-xs font-medium">
                  Đã chọn
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserTypeSelector;
