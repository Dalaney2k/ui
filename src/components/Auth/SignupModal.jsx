// SignupModal.jsx
import React, { useState } from "react";
import {
  X,
  Loader2,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  UserCheck,
} from "lucide-react";

const SignupModal = ({
  isOpen,
  onClose,
  signupForm,
  setSignupForm,
  handleSignup,
  setIsLoginModalOpen,
  isLoading = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!isOpen) return null;

  const onSubmit = (e) => {
    e.preventDefault();
    handleSignup(e);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm mx-auto shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Subtle gradient overlay */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500"></div>

        {/* Close button with larger click area */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 disabled:opacity-50 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              {isLoading ? (
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              ) : (
                <UserCheck className="w-8 h-8 text-white" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Đăng Ký</h2>
            <p className="text-gray-600 text-sm">
              {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản mới"}
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    disabled={isLoading}
                    value={signupForm.firstName}
                    onChange={(e) =>
                      setSignupForm({
                        ...signupForm,
                        firstName: e.target.value,
                      })
                    }
                    className="w-full pl-9 pr-3 py-3 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:shadow-sm transition-all duration-200 disabled:opacity-50"
                    placeholder="Nguyễn"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    disabled={isLoading}
                    value={signupForm.lastName}
                    onChange={(e) =>
                      setSignupForm({ ...signupForm, lastName: e.target.value })
                    }
                    className="w-full pl-9 pr-3 py-3 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:shadow-sm transition-all duration-200 disabled:opacity-50"
                    placeholder="Văn A"
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  disabled={isLoading}
                  value={signupForm.email}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, email: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:shadow-sm transition-all duration-200 disabled:opacity-50"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={isLoading}
                  value={signupForm.password}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, password: e.target.value })
                  }
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:shadow-sm transition-all duration-200 disabled:opacity-50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  disabled={isLoading}
                  value={signupForm.confirmPassword}
                  onChange={(e) =>
                    setSignupForm({
                      ...signupForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:shadow-sm transition-all duration-200 disabled:opacity-50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start space-x-3 pt-2">
              <input
                type="checkbox"
                required
                className="w-4 h-4 text-emerald-600 bg-gray-50 border-gray-300 rounded focus:ring-emerald-500 mt-0.5"
                disabled={isLoading}
              />
              <span className="text-sm text-gray-600 leading-relaxed">
                Tôi đồng ý với{" "}
                <button
                  type="button"
                  className={`font-medium text-emerald-600 hover:text-emerald-700 transition-colors duration-200 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isLoading}
                >
                  Điều khoản sử dụng
                </button>{" "}
                và{" "}
                <button
                  type="button"
                  className={`font-medium text-emerald-600 hover:text-emerald-700 transition-colors duration-200 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isLoading}
                >
                  Chính sách bảo mật
                </button>
              </span>
            </div>

            {/* Signup Button */}
            <button
              type="button"
              onClick={onSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.01] active:scale-[0.99]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Đang tạo tài khoản...
                </div>
              ) : (
                "Tạo Tài Khoản"
              )}
            </button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">hoặc</span>
              </div>
            </div>

            {/* Login link */}
            <div className="text-center">
              <span className="text-sm text-gray-600">
                Đã có tài khoản?{" "}
                <button
                  onClick={() => {
                    if (!isLoading) {
                      onClose();
                      setIsLoginModalOpen(true);
                    }
                  }}
                  disabled={isLoading}
                  className="font-medium text-emerald-600 hover:text-emerald-700 transition-colors duration-200 disabled:opacity-50"
                >
                  Đăng nhập
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
