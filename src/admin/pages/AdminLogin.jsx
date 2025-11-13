import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, Mail, LogIn, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/AdminApiService";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [logoError, setLogoError] = useState(false);
  const navigate = useNavigate();

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setLoading(true);
    setError("");

    // Đăng nhập qua API
    const result = await authService.login(formData);

    if (result.success) {
      if (authService.checkAdminRole()) {
        navigate("/admin");
      } else {
        setError("Bạn không có quyền truy cập trang quản trị.");
        await authService.logout();
      }
    } else {
      setError(result.message || "Email hoặc mật khẩu không chính xác");
    }
    setLoading(false);
  };

  // Handle logo load error
  const handleLogoError = () => {
    setLogoError(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center p-4 relative overflow-hidden">
      <style jsx>{`
        @keyframes sakura-float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-8px) rotate(3deg);
          }
          75% {
            transform: translateY(-4px) rotate(-2deg);
          }
        }

        @keyframes petal-fall {
          0% {
            opacity: 0;
            transform: translateY(-20px) rotate(0deg);
          }
          50% {
            opacity: 0.6;
          }
          100% {
            opacity: 0;
            transform: translateY(40px) rotate(360deg);
          }
        }

        @keyframes logo-glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(236, 72, 153, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(236, 72, 153, 0.5),
              0 0 40px rgba(244, 63, 94, 0.3);
          }
        }

        @keyframes gradient-shift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .sakura-logo-container {
          position: relative;
          overflow: visible;
        }

        .sakura-logo-wrapper {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: linear-gradient(
            135deg,
            #ec4899 0%,
            #f43f5e 50%,
            #ec4899 100%
          );
          background-size: 200% 200%;
          border-radius: 20px;
          animation: sakura-float 3s ease-in-out infinite,
            logo-glow 2s ease-in-out infinite, gradient-shift 4s ease infinite;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
        }

        .sakura-logo-wrapper:hover {
          transform: scale(1.1) rotate(5deg);
          animation-play-state: paused;
          box-shadow: 0 0 40px rgba(236, 72, 153, 0.6),
            0 0 60px rgba(244, 63, 94, 0.4);
        }

        .sakura-logo-wrapper:active {
          transform: scale(0.95) rotate(-3deg);
        }

        .sakura-logo-svg {
          width: 50px;
          height: 50px;
          filter: drop-shadow(0 2px 4px rgba(255, 255, 255, 0.3));
          transition: all 0.3s ease;
          object-fit: contain;
        }

        .sakura-logo-wrapper:hover .sakura-logo-svg {
          filter: drop-shadow(0 4px 8px rgba(255, 255, 255, 0.5));
        }

        .logo-fallback {
          font-size: 2.5rem;
          color: white;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .sakura-title {
          background: linear-gradient(
            45deg,
            #ec4899,
            #f43f5e,
            #ec4899,
            #f43f5e
          );
          background-size: 300% 300%;
          animation: gradient-shift 3s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: all 0.3s ease;
          position: relative;
          cursor: pointer;
        }

        .sakura-title:hover {
          transform: translateY(-2px);
          filter: drop-shadow(0 4px 8px rgba(236, 72, 153, 0.3));
        }

        .floating-petals {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
          top: 0;
          left: 0;
        }

        .petal {
          position: absolute;
          font-size: 12px;
          animation: petal-fall 6s linear infinite;
          opacity: 0;
          color: #ec4899;
        }

        .petal:nth-child(1) {
          left: 10%;
          animation-delay: 0s;
        }
        .petal:nth-child(2) {
          left: 30%;
          animation-delay: 1s;
        }
        .petal:nth-child(3) {
          left: 50%;
          animation-delay: 2s;
        }
        .petal:nth-child(4) {
          left: 70%;
          animation-delay: 3s;
        }
        .petal:nth-child(5) {
          left: 90%;
          animation-delay: 4s;
        }

        .admin-subtitle {
          transition: all 0.3s ease;
          position: relative;
        }

        .admin-subtitle::after {
          content: "";
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -4px;
          left: 50%;
          background: linear-gradient(90deg, #ec4899, #f43f5e);
          transition: all 0.3s ease;
          transform: translateX(-50%);
          border-radius: 1px;
        }

        .sakura-logo-container:hover .admin-subtitle::after {
          width: 60px;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #ffffff;
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .fade-in {
          animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.75rem;
          background-color: #f9fafb;
          transition: all 0.2s;
          font-size: 0.875rem;
        }

        .form-input:focus {
          outline: none;
          border-color: #ec4899;
          background-color: white;
          box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 1.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          border-radius: 0.75rem;
          transition: all 0.2s;
          cursor: pointer;
          border: none;
        }

        .btn-primary {
          background: linear-gradient(135deg, #ec4899, #f43f5e);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #db2777, #e11d48);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
        }

        .btn-primary:active {
          transform: translateY(0);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-lg {
          padding: 0.875rem 2rem;
          font-size: 1rem;
        }
      `}</style>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-br from-pink-200/30 to-rose-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-gradient-to-tr from-pink-200/30 to-rose-200/30 rounded-full blur-3xl"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
          {/* Enhanced Header with SVG Logo */}
          <div className="sakura-logo-container text-center mb-8">
            {/* Floating Petals Background */}
            <div className="floating-petals">
              <div className="petal">🌸</div>
              <div className="petal">🌸</div>
              <div className="petal">🌸</div>
              <div className="petal">🌸</div>
              <div className="petal">🌸</div>
            </div>

            {/* Logo Container */}
            <div
              className="sakura-logo-wrapper mb-6"
              onClick={() => console.log("Logo clicked!")}
            >
              {!logoError ? (
                <img
                  src="/assets/sakura-home.svg"
                  alt="SakuraHome Logo"
                  className="sakura-logo-svg"
                  onError={handleLogoError}
                />
              ) : (
                // Fallback khi không load được SVG
                <div className="logo-fallback">🏠</div>
              )}
            </div>

            {/* Title */}
            <h1 className="sakura-title text-4xl font-bold mb-2">SakuraHome</h1>

            {/* Subtitle */}
            <p className="admin-subtitle text-gray-600 text-lg font-medium">
              Admin Panel
            </p>

            {/* Status Indicator */}
            <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>System Online</span>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 fade-in">
              <AlertCircle
                className="text-red-500 mt-0.5 flex-shrink-0"
                size={16}
              />
              <div className="text-red-700 text-sm">{error}</div>
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={18}
                />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input w-full h-12"
                  style={{ paddingLeft: "3rem" }}
                  placeholder="admin@sakurahome.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input pr-10 w-full h-12"
                  style={{ paddingLeft: "3rem" }}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full btn-lg relative overflow-hidden"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="spinner"></div>
                  <span>Đang đăng nhập...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn size={18} />
                  <span>Đăng nhập</span>
                </div>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              © 2025 SakuraHome. All rights reserved.
            </p>
          </div>
        </div>

        {/* Demo Credentials Info */}
        <div className="mt-6 p-4 bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 rounded-xl">
          <h3 className="font-semibold text-blue-800 mb-2">🔑 Demo Login</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p>
              <strong>Email:</strong> admin@sakurahome.com
            </p>
            <p>
              <strong>Password:</strong> Admin123!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
