import React, { useState, useEffect, useCallback } from "react";
import {
  User,
  Settings,
  Shield,
  Bell,
  CreditCard,
  MapPin,
  Heart,
  Package,
  Activity,
  Edit3,
  Camera,
  Save,
  X,
  Eye,
  EyeOff,
  Calendar,
  Mail,
  Phone,
  Globe,
  Award,
  Star,
} from "lucide-react";
import { userService, addressService } from "../services";
import AddressManager from "../components/Profile/AddressManager";
import OrderHistory from "../components/Profile/OrderHistory";
import WishlistTab from "../components/Profile/WishlistTab";
import NotificationsTab from "../components/Profile/NotificationsTab";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [userActivities, setUserActivities] = useState([]);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  });

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await userService.getCurrentUser();
      if (response.success && response.user) {
        setUser(response.user);
        setEditForm(response.user);
      } else {
        addNotification(
          "error",
          "Lỗi",
          response.message || "Không thể tải thông tin cá nhân"
        );
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      addNotification("error", "Lỗi", "Không thể tải thông tin cá nhân");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserActivities = useCallback(async () => {
    try {
      const response = await userService.getUserActivities();
      if (response.success) {
        setUserActivities(response.activities || []);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
      // Keep mock data as fallback
      setUserActivities([
        {
          id: 1,
          activityType: "Login",
          description: "Đăng nhập hệ thống",
          ipAddress: "192.168.1.1",
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          activityType: "ChangePassword",
          description: "Thay đổi mật khẩu",
          ipAddress: "192.168.1.1",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ]);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
    fetchUserActivities();
  }, [fetchUserProfile, fetchUserActivities]);

  const addNotification = (type, title, message) => {
    const notification = {
      id: Date.now(),
      type,
      title,
      message,
    };
    setNotifications((prev) => [...prev, notification]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    }, 5000);
  };

  const handleEditProfile = async () => {
    try {
      const response = await userService.updateProfile(editForm);
      if (response.success && response.user) {
        setUser(response.user);
        setIsEditing(false);
        addNotification(
          "success",
          "Thành công",
          response.message || "Cập nhật thông tin thành công"
        );
      } else {
        addNotification(
          "error",
          "Lỗi",
          response.message || "Không thể cập nhật thông tin"
        );
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      addNotification("error", "Lỗi", "Không thể cập nhật thông tin");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      addNotification("error", "Lỗi", "Mật khẩu mới không khớp");
      return;
    }

    try {
      const response = await userService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });

      if (response.success) {
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
          showCurrentPassword: false,
          showNewPassword: false,
          showConfirmPassword: false,
        });
        addNotification("success", "Thành công", "Đổi mật khẩu thành công");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      addNotification(
        "error",
        "Lỗi",
        error.message || "Không thể đổi mật khẩu"
      );
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case "Bronze":
        return "text-amber-600 bg-amber-50";
      case "Silver":
        return "text-gray-600 bg-gray-50";
      case "Gold":
        return "text-yellow-600 bg-yellow-50";
      case "Platinum":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: "profile", label: "Thông tin cá nhân", icon: User },
    { id: "security", label: "Bảo mật", icon: Shield },
    { id: "notifications", label: "Thông báo", icon: Bell },
    { id: "addresses", label: "Địa chỉ", icon: MapPin },
    { id: "orders", label: "Đơn hàng", icon: Package },
    { id: "wishlist", label: "Yêu thích", icon: Heart },
    { id: "activities", label: "Hoạt động", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg max-w-md ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            <div className="font-semibold">{notification.title}</div>
            <div className="text-sm">{notification.message}</div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <span>
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
                    </span>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold ">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-gray-600">{user?.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(
                      user?.tier
                    )}`}
                  >
                    <Award className="w-4 h-4 inline-block mr-1" />
                    {user?.tier}
                  </span>
                  <span className="text-sm text-gray-500">
                    {user?.points} điểm tích lũy
                  </span>
                  <span className="text-sm text-gray-500">
                    {user?.totalOrders} đơn hàng
                  </span>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="hidden lg:flex space-x-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg text-center min-w-[100px]">
                  <div className="text-2xl font-bold text-blue-600">
                    {user?.points || 0}
                  </div>
                  <div className="text-sm text-blue-600">Điểm tích lũy</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg text-center min-w-[100px]">
                  <div className="text-2xl font-bold text-green-600">
                    {user?.totalOrders || 0}
                  </div>
                  <div className="text-sm text-green-600">Đơn hàng</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg text-center min-w-[100px]">
                  <div className="text-2xl font-bold text-purple-600">
                    {new Intl.NumberFormat("vi-VN").format(
                      user?.totalSpent || 0
                    )}
                    ₫
                  </div>
                  <div className="text-sm text-purple-600">Tổng chi tiêu</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "profile" && (
          <ProfileTab
            user={user}
            isEditing={isEditing}
            editForm={editForm}
            setEditForm={setEditForm}
            setIsEditing={setIsEditing}
            handleEditProfile={handleEditProfile}
          />
        )}

        {activeTab === "security" && (
          <SecurityTab
            user={user}
            passwordForm={passwordForm}
            setPasswordForm={setPasswordForm}
            handleChangePassword={handleChangePassword}
          />
        )}

        {activeTab === "activities" && (
          <ActivitiesTab activities={userActivities} />
        )}

        {activeTab === "addresses" && <AddressManager />}

        {activeTab === "orders" && <OrderHistory />}

        {activeTab === "wishlist" && <WishlistTab />}

        {activeTab === "notifications" && <NotificationsTab user={user} />}
      </div>
    </div>
  );
};

// Profile Tab Component
const ProfileTab = ({
  user,
  isEditing,
  editForm,
  setEditForm,
  setIsEditing,
  handleEditProfile,
}) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-900">Thông tin cá nhân</h2>
      {!isEditing ? (
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Edit3 className="w-4 h-4" />
          <span>Chỉnh sửa</span>
        </button>
      ) : (
        <div className="flex space-x-2">
          <button
            onClick={handleEditProfile}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Lưu</span>
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Hủy</span>
          </button>
        </div>
      )}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Thông tin cơ bản
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Họ
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editForm.firstName || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, firstName: e.target.value })
              }
              className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white placeholder-gray-500"
              placeholder="Nhập họ của bạn"
            />
          ) : (
            <p className="text-gray-900">
              {user?.firstName || "Chưa cập nhật"}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editForm.lastName || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, lastName: e.target.value })
              }
              className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white placeholder-gray-500"
              placeholder="Nhập tên của bạn"
            />
          ) : (
            <p className="text-gray-900">{user?.lastName || "Chưa cập nhật"}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <p className="text-gray-900">{user?.email}</p>
            {user?.emailVerified && (
              <span className="text-green-600 text-sm">✓ Đã xác thực</span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số điện thoại
          </label>
          {isEditing ? (
            <input
              type="tel"
              value={editForm.phoneNumber || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, phoneNumber: e.target.value })
              }
              className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white placeholder-gray-500"
              placeholder="Nhập số điện thoại"
            />
          ) : (
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <p className="text-gray-900">
                {user?.phoneNumber || "Chưa cập nhật"}
              </p>
              {user?.phoneVerified && (
                <span className="text-green-600 text-sm">✓ Đã xác thực</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Thông tin bổ sung
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ngày sinh
          </label>
          {isEditing ? (
            <input
              type="date"
              value={
                editForm.dateOfBirth ? editForm.dateOfBirth.split("T")[0] : ""
              }
              onChange={(e) =>
                setEditForm({ ...editForm, dateOfBirth: e.target.value })
              }
              className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white"
            />
          ) : (
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <p className="text-gray-900">
                {user?.dateOfBirth
                  ? new Date(user.dateOfBirth).toLocaleDateString("vi-VN")
                  : "Chưa cập nhật"}
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Giới tính
          </label>
          {isEditing ? (
            <select
              value={editForm.gender || 0}
              onChange={(e) =>
                setEditForm({ ...editForm, gender: parseInt(e.target.value) })
              }
              className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white"
            >
              <option value={0} className="text-gray-900">
                Không xác định
              </option>
              <option value={1} className="text-gray-900">
                Nam
              </option>
              <option value={2} className="text-gray-900">
                Nữ
              </option>
              <option value={3} className="text-gray-900">
                Khác
              </option>
              <option value={4} className="text-gray-900">
                Không muốn tiết lộ
              </option>
            </select>
          ) : (
            <p className="text-gray-900">
              {user?.gender === 0
                ? "Không xác định"
                : user?.gender === 1
                ? "Nam"
                : user?.gender === 2
                ? "Nữ"
                : user?.gender === 3
                ? "Khác"
                : user?.gender === 4
                ? "Không muốn tiết lộ"
                : "Chưa cập nhật"}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ngôn ngữ ưa thích
          </label>
          {isEditing ? (
            <select
              value={editForm.preferredLanguage || "vi"}
              onChange={(e) =>
                setEditForm({ ...editForm, preferredLanguage: e.target.value })
              }
              className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white"
            >
              <option value="vi" className="text-gray-900">
                Tiếng Việt
              </option>
              <option value="en" className="text-gray-900">
                English
              </option>
              <option value="ja" className="text-gray-900">
                日本語
              </option>
            </select>
          ) : (
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-400" />
              <p className="text-gray-900">
                {user?.preferredLanguage === "vi"
                  ? "Tiếng Việt"
                  : user?.preferredLanguage === "en"
                  ? "English"
                  : user?.preferredLanguage === "ja"
                  ? "日本語"
                  : "Tiếng Việt"}
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tiền tệ ưa thích
          </label>
          {isEditing ? (
            <select
              value={editForm.preferredCurrency || "VND"}
              onChange={(e) =>
                setEditForm({ ...editForm, preferredCurrency: e.target.value })
              }
              className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white"
            >
              <option value="VND" className="text-gray-900">
                VND - Việt Nam Đồng
              </option>
              <option value="USD" className="text-gray-900">
                USD - US Dollar
              </option>
              <option value="JPY" className="text-gray-900">
                JPY - Japanese Yen
              </option>
            </select>
          ) : (
            <p className="text-gray-900">{user?.preferredCurrency || "VND"}</p>
          )}
        </div>
      </div>
    </div>

    {/* Account Stats */}
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Thống kê tài khoản
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {user?.points || 0}
          </div>
          <div className="text-sm text-blue-600">Điểm tích lũy</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {user?.totalOrders || 0}
          </div>
          <div className="text-sm text-green-600">Tổng đơn hàng</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {new Intl.NumberFormat("vi-VN").format(user?.totalSpent || 0)}₫
          </div>
          <div className="text-sm text-purple-600">Tổng chi tiêu</div>
        </div>
        <div
          className={`p-4 rounded-lg ${
            user?.tier === "Bronze"
              ? "text-amber-600 bg-amber-50"
              : user?.tier === "Silver"
              ? "text-gray-600 bg-gray-50"
              : user?.tier === "Gold"
              ? "text-yellow-600 bg-yellow-50"
              : user?.tier === "Platinum"
              ? "text-purple-600 bg-purple-50"
              : "text-gray-600 bg-gray-50"
          }`}
        >
          <div className="text-2xl font-bold">{user?.tier || "Bronze"}</div>
          <div className="text-sm">Hạng thành viên</div>
        </div>
      </div>
    </div>
  </div>
);

// Security Tab Component
const SecurityTab = ({
  user,
  passwordForm,
  setPasswordForm,
  handleChangePassword,
}) => (
  <div className="space-y-6">
    {/* Change Password */}
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Đổi mật khẩu</h2>

      <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mật khẩu hiện tại
          </label>
          <div className="relative">
            <input
              type={passwordForm.showCurrentPassword ? "text" : "password"}
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  currentPassword: e.target.value,
                })
              }
              className="w-full px-3 py-2 pr-10 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white placeholder-gray-500"
              placeholder="Nhập mật khẩu hiện tại"
              required
            />
            <button
              type="button"
              onClick={() =>
                setPasswordForm({
                  ...passwordForm,
                  showCurrentPassword: !passwordForm.showCurrentPassword,
                })
              }
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {passwordForm.showCurrentPassword ? (
                <EyeOff className="w-4 h-4 text-gray-400" />
              ) : (
                <Eye className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mật khẩu mới
          </label>
          <div className="relative">
            <input
              type={passwordForm.showNewPassword ? "text" : "password"}
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  newPassword: e.target.value,
                })
              }
              className="w-full px-3 py-2 pr-10 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white placeholder-gray-500"
              placeholder="Nhập mật khẩu mới"
              required
            />
            <button
              type="button"
              onClick={() =>
                setPasswordForm({
                  ...passwordForm,
                  showNewPassword: !passwordForm.showNewPassword,
                })
              }
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {passwordForm.showNewPassword ? (
                <EyeOff className="w-4 h-4 text-gray-400" />
              ) : (
                <Eye className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Xác nhận mật khẩu mới
          </label>
          <div className="relative">
            <input
              type={passwordForm.showConfirmPassword ? "text" : "password"}
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full px-3 py-2 pr-10 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white placeholder-gray-500"
              placeholder="Nhập lại mật khẩu mới"
              required
            />
            <button
              type="button"
              onClick={() =>
                setPasswordForm({
                  ...passwordForm,
                  showConfirmPassword: !passwordForm.showConfirmPassword,
                })
              }
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {passwordForm.showConfirmPassword ? (
                <EyeOff className="w-4 h-4 text-gray-400" />
              ) : (
                <Eye className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Đổi mật khẩu
        </button>
      </form>
    </div>

    {/* Account Security Info */}
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Thông tin bảo mật
      </h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <div className="font-medium">Email xác thực</div>
              <div className="text-sm text-gray-500">{user?.email}</div>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm ${
              user?.emailVerified
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {user?.emailVerified ? "Đã xác thực" : "Chưa xác thực"}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <div>
              <div className="font-medium">Số điện thoại</div>
              <div className="text-sm text-gray-500">
                {user?.phoneNumber || "Chưa cập nhật"}
              </div>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm ${
              user?.phoneVerified
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {user?.phoneVerified ? "Đã xác thực" : "Chưa xác thực"}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <div className="font-medium">Lần đăng nhập cuối</div>
              <div className="text-sm text-gray-500">
                {user?.lastLoginAt
                  ? new Date(user.lastLoginAt).toLocaleString("vi-VN")
                  : "Chưa có thông tin"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Activities Tab Component
const ActivitiesTab = ({ activities }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-6">
      Lịch sử hoạt động
    </h2>

    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
        >
          <div
            className={`p-2 rounded-full ${
              activity.activityType === "Login"
                ? "bg-green-100"
                : activity.activityType === "ChangePassword"
                ? "bg-blue-100"
                : "bg-gray-100"
            }`}
          >
            <Activity
              className={`w-4 h-4 ${
                activity.activityType === "Login"
                  ? "text-green-600"
                  : activity.activityType === "ChangePassword"
                  ? "text-blue-600"
                  : "text-gray-600"
              }`}
            />
          </div>

          <div className="flex-1">
            <div className="font-medium text-gray-900">
              {activity.description}
            </div>
            <div className="text-sm text-gray-500">
              IP: {activity.ipAddress} •{" "}
              {new Date(activity.createdAt).toLocaleString("vi-VN")}
            </div>
          </div>
        </div>
      ))}

      {activities.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <div>Chưa có hoạt động nào được ghi nhận</div>
        </div>
      )}
    </div>
  </div>
);

export default UserProfile;
