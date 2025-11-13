import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Briefcase,
  Shield,
  Star,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const UserAddDemo = () => {
  const [activeDemo, setActiveDemo] = useState("overview");

  const demoSections = {
    overview: {
      title: "Tổng quan tính năng",
      icon: Users,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-sakura-100 text-sakura-600 rounded-full mb-4">
              <UserPlus className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-bold text-zen-gray-900 mb-2">
              Hệ thống thêm người dùng thông minh
            </h3>
            <p className="text-zen-gray-600 max-w-2xl mx-auto">
              Tạo tài khoản khách hàng và nhân viên với giao diện hiện đại,
              validation thông minh và trải nghiệm người dùng tối ưu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-xl border border-zen-gray-200">
              <div className="w-12 h-12 bg-sakura-100 text-sakura-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <UserPlus className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-zen-gray-800 mb-2">
                Khách hàng
              </h4>
              <p className="text-sm text-zen-gray-600">
                Tài khoản mua sắm với tích điểm và quản lý đơn hàng
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl border border-zen-gray-200">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Briefcase className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-zen-gray-800 mb-2">
                Nhân viên
              </h4>
              <p className="text-sm text-zen-gray-600">
                Tài khoản quản trị với quyền hạn tuỳ chỉnh
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl border border-zen-gray-200">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-zen-gray-800 mb-2">Bảo mật</h4>
              <p className="text-sm text-zen-gray-600">
                Validation thông minh và mã hoá an toàn
              </p>
            </div>
          </div>
        </div>
      ),
    },

    features: {
      title: "Tính năng nổi bật",
      icon: Star,
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-zen-gray-900 mb-4">
                🎯 Smart Validation
              </h3>
              <ul className="space-y-3">
                {[
                  "Real-time kiểm tra username/email",
                  "Password strength indicator",
                  "File upload validation",
                  "Form validation thông minh",
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    <span className="text-zen-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-zen-gray-900 mb-4">
                🎨 Modern UI/UX
              </h3>
              <ul className="space-y-3">
                {[
                  "Sakura theme design",
                  "Responsive cho mọi thiết bị",
                  "Drag & drop avatar upload",
                  "Multi-step wizard",
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    <span className="text-zen-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-br from-sakura-50 to-pink-50 rounded-xl p-6 border border-sakura-200">
            <div className="flex items-center space-x-3 mb-4">
              <Sparkles className="h-6 w-6 text-sakura-600" />
              <h3 className="text-lg font-semibold text-zen-gray-900">
                Trải nghiệm Premium
              </h3>
            </div>
            <p className="text-zen-gray-700 mb-4">
              Được thiết kế theo chuẩn UI/UX Nhật Bản với sự chú ý đến từng chi
              tiết, mang lại trải nghiệm mượt mà và chuyên nghiệp.
            </p>
            <div className="flex items-center text-sm text-sakura-600 font-medium">
              <span>Khám phá ngay</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </div>
          </div>
        </div>
      ),
    },

    workflow: {
      title: "Quy trình sử dụng",
      icon: ArrowRight,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-zen-gray-900 mb-2">
              Quy trình tạo người dùng trong 5 bước
            </h3>
            <p className="text-zen-gray-600">
              Đơn giản, nhanh chóng và thông minh
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-zen-gray-200"></div>

            <div className="space-y-8">
              {[
                {
                  step: 1,
                  title: "Chọn loại người dùng",
                  description:
                    "Khách hàng hoặc Nhân viên với preview tính năng",
                  color: "bg-sakura-500",
                },
                {
                  step: 2,
                  title: "Thông tin cơ bản",
                  description:
                    "Họ tên, email, username với validation real-time",
                  color: "bg-blue-500",
                },
                {
                  step: 3,
                  title: "Bảo mật & Quyền hạn",
                  description: "Mật khẩu mạnh và phân quyền chi tiết",
                  color: "bg-green-500",
                },
                {
                  step: 4,
                  title: "Tùy chỉnh tài khoản",
                  description: "Avatar, địa chỉ, preferences cá nhân",
                  color: "bg-purple-500",
                },
                {
                  step: 5,
                  title: "Hoàn thành",
                  description: "Tạo tài khoản và gửi thông báo welcome",
                  color: "bg-orange-500",
                },
              ].map((item, idx) => (
                <div key={idx} className="relative flex items-start space-x-4">
                  <div
                    className={`w-16 h-16 ${item.color} text-white rounded-full flex items-center justify-center font-bold text-lg z-10`}
                  >
                    {item.step}
                  </div>
                  <div className="flex-1 pt-2">
                    <h4 className="font-semibold text-zen-gray-900 mb-1">
                      {item.title}
                    </h4>
                    <p className="text-zen-gray-600 text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  };

  return (
    <div className="min-h-screen bg-zen-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-zen-gray-900 mb-4">
            🌸 Tính năng thêm người dùng
          </h1>
          <p className="text-xl text-zen-gray-600">
            SakuraHome E-commerce Admin Panel
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-white rounded-lg p-1 border border-zen-gray-200">
            {Object.entries(demoSections).map(([key, section]) => {
              const IconComponent = section.icon;
              const isActive = activeDemo === key;

              return (
                <button
                  key={key}
                  onClick={() => setActiveDemo(key)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-sakura-primary text-white shadow-md"
                        : "text-zen-gray-600 hover:text-zen-gray-800 hover:bg-zen-gray-50"
                    }
                  `}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="hidden sm:inline">{section.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-zen-gray-200 p-8">
          {demoSections[activeDemo].content}
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <div className="bg-gradient-to-r from-sakura-primary to-sakura-accent rounded-xl p-6 text-white">
            <h3 className="text-xl font-semibold mb-2">Sẵn sàng khám phá?</h3>
            <p className="mb-4 opacity-90">
              Truy cập Admin Panel để trải nghiệm tính năng thêm người dùng mới
            </p>
            <button className="bg-white text-sakura-primary px-6 py-2 rounded-lg font-medium hover:bg-zen-gray-50 transition-colors">
              Vào Admin Panel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAddDemo;
