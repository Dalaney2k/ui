import React from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Settings,
  Heart,
  Package,
  LogOut,
  UserPlus,
  LogIn,
} from "lucide-react";

const UserMenu = ({
  isOpen,
  user = null,
  onClose,
  setIsLoginModalOpen,
  setIsSignupModalOpen,
  handleLogout,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNavigateToProfile = () => {
    onClose();
    navigate("/profile");
  };

  const handleLogin = () => {
    onClose();
    setIsLoginModalOpen(true);
  };

  const handleSignup = () => {
    onClose();
    setIsSignupModalOpen(true);
  };

  const handleLogoutClick = () => {
    onClose();
    handleLogout();
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
      {user ? (
        // Logged in user menu
        <>
          {/* User Profile */}
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-red-50 to-pink-50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              className="w-full px-4 py-3 flex items-center space-x-3 text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={handleNavigateToProfile}
            >
              <User className="w-5 h-5" />
              <span>Thông tin cá nhân</span>
            </button>
            <button
              className="w-full px-4 py-3 flex items-center space-x-3 text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={onClose}
            >
              <Package className="w-5 h-5" />
              <span>Đơn hàng của tôi</span>
            </button>
            <button
              className="w-full px-4 py-3 flex items-center space-x-3 text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={onClose}
            >
              <Heart className="w-5 h-5" />
              <span>Sản phẩm yêu thích</span>
            </button>
            <button
              className="w-full px-4 py-3 flex items-center space-x-3 text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={onClose}
            >
              <Settings className="w-5 h-5" />
              <span>Cài đặt</span>
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100">
            <button
              onClick={handleLogoutClick}
              className="w-full px-4 py-3 flex items-center space-x-3 text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </>
      ) : (
        // Guest user menu
        <>
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Chào mừng!</h3>
              <p className="text-sm text-gray-600">
                Đăng nhập để trải nghiệm đầy đủ
              </p>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <button
              onClick={handleLogin}
              className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
            >
              <LogIn className="w-5 h-5" />
              <span>Đăng nhập</span>
            </button>
            <button
              onClick={handleSignup}
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Đăng ký</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;
