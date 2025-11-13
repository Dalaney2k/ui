// LoginModal.jsx
import React, { useState } from "react";
import { X, LogIn, Loader2, Eye, EyeOff, Mail, Lock } from "lucide-react";

const LoginModal = ({
  isOpen,
  onClose,
  loginForm,
  setLoginForm,
  handleLogin,
  setIsSignupModalOpen,
  isLoading = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const onSubmit = (e) => {
    e.preventDefault();
    handleLogin(e);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm mx-auto shadow-2xl relative overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500"></div>

        {/* Close button with larger click area */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              {isLoading ? (
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              ) : (
                <LogIn className="w-8 h-8 text-white" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Đăng Nhập</h2>
            <p className="text-gray-600 text-sm">
              {isLoading ? "Đang xử lý..." : "Chào mừng bạn trở lại"}
            </p>
          </div>

          {/* Form */}
          <div className="space-y-5">
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
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:shadow-sm transition-all duration-200 disabled:opacity-50"
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
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:shadow-sm transition-all duration-200 disabled:opacity-50"
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

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-indigo-600 bg-gray-50 border-gray-300 rounded focus:ring-indigo-500"
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-gray-600">Ghi nhớ</span>
              </label>
              <button
                type="button"
                className={`text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-200 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                Quên mật khẩu?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="button"
              onClick={onSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.01] active:scale-[0.99]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Đang đăng nhập...
                </div>
              ) : (
                "Đăng Nhập"
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">hoặc</span>
              </div>
            </div>

            {/* Sign up link */}
            <div className="text-center">
              <span className="text-sm text-gray-600">
                Chưa có tài khoản?{" "}
                <button
                  onClick={() => {
                    if (!isLoading) {
                      onClose();
                      setIsSignupModalOpen(true);
                    }
                  }}
                  disabled={isLoading}
                  className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-200 disabled:opacity-50"
                >
                  Đăng ký ngay
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
