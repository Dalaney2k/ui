import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  CreditCard,
  Shield,
  Eye,
  EyeOff,
  Edit,
  MoreVertical,
} from "lucide-react";

function formatDate(dateString) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelativeTime(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  if (diffInHours < 1) return "Vừa xong";
  if (diffInHours < 24) return `${diffInHours} giờ trước`;
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} ngày trước`;
  return formatDate(dateString);
}

function UserDetailModal({ user, onClose, onEdit, onToggleStatus }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showActions, setShowActions] = useState(false);

  if (!user) return null;

  const getRoleConfig = (role) => {
    const configs = {
      SuperAdmin: {
        color: "bg-gradient-to-r from-purple-600 to-purple-700",
        icon: Shield,
      },
      Admin: {
        color: "bg-gradient-to-r from-red-500 to-red-600",
        icon: Shield,
      },
      Staff: {
        color: "bg-gradient-to-r from-yellow-500 to-yellow-600",
        icon: User,
      },
      Customer: {
        color: "bg-gradient-to-r from-blue-500 to-blue-600",
        icon: User,
      },
    };
    return configs[role] || configs.Customer;
  };

  const getTierConfig = (tier) => {
    // Handle both string and number tier values
    const tierValue =
      typeof tier === "number"
        ? tier === 5
          ? "Diamond"
          : tier === 4
          ? "Platinum"
          : tier === 3
          ? "Gold"
          : tier === 2
          ? "Silver"
          : "Bronze"
        : tier;

    const configs = {
      Diamond: {
        color: "bg-gradient-to-r from-cyan-400 to-blue-500",
        textColor: "text-white",
      },
      Platinum: {
        color: "bg-gradient-to-r from-slate-400 to-slate-500",
        textColor: "text-white",
      },
      Gold: {
        color: "bg-gradient-to-r from-yellow-400 to-amber-500",
        textColor: "text-gray-900",
      },
      Silver: {
        color: "bg-gradient-to-r from-slate-300 to-slate-400",
        textColor: "text-gray-900",
      },
      Bronze: {
        color: "bg-gradient-to-r from-amber-600 to-orange-600",
        textColor: "text-white",
      },
    };
    return configs[tierValue] || configs.Bronze;
  };

  const getStatusConfig = (status) => {
    const configs = {
      Active: {
        color: "bg-green-100 text-green-800 border-green-200",
        dot: "bg-green-500",
      },
      Suspended: {
        color: "bg-red-100 text-red-800 border-red-200",
        dot: "bg-red-500",
      },
      Banned: {
        color: "bg-red-100 text-red-800 border-red-200",
        dot: "bg-red-700",
      },
      Inactive: {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        dot: "bg-gray-500",
      },
      Pending: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        dot: "bg-yellow-500",
      },
    };
    return configs[status] || configs.Active;
  };

  const roleConfig = getRoleConfig(user.role);
  const tierConfig = getTierConfig(user.tier);
  const statusConfig = getStatusConfig(user.status);
  const RoleIcon = roleConfig.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 text-white">
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
            onClick={onClose}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="relative">
            <button
              className="absolute top-0 right-8 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
              onClick={() => setShowActions(!showActions)}
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showActions && (
              <div className="absolute top-12 right-8 bg-white rounded-lg shadow-lg py-2 min-w-[150px] z-10">
                <button
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => {
                    onEdit?.(user);
                    setShowActions(false);
                  }}
                >
                  <Edit className="w-4 h-4" />
                  Chỉnh sửa
                </button>
                <button
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  onClick={() => {
                    onToggleStatus?.(user);
                    setShowActions(false);
                  }}
                >
                  {user.status === "Active" ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                  {user.status === "Active" ? "Vô hiệu hóa" : "Kích hoạt"}
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative mb-4">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white/30">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  (
                    user.fullName?.charAt(0) ||
                    user.email?.charAt(0) ||
                    "U"
                  ).toUpperCase()
                )}
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-8 h-8 ${roleConfig.color} rounded-full flex items-center justify-center shadow-lg`}
              >
                <RoleIcon className="w-4 h-4 text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-1">
              {user.fullName || user.userName}
            </h2>
            <p className="text-white/80 mb-4">{user.email}</p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 justify-center">
              <span
                className={`${roleConfig.color} px-3 py-1 rounded-full text-sm font-semibold text-white shadow-lg`}
              >
                {user.role}
              </span>
              <span
                className={`${tierConfig.color} ${tierConfig.textColor} px-3 py-1 rounded-full text-sm font-semibold shadow-lg`}
              >
                {typeof user.tier === "number"
                  ? user.tier === 5
                    ? "Diamond"
                    : user.tier === 4
                    ? "Platinum"
                    : user.tier === 3
                    ? "Gold"
                    : user.tier === 2
                    ? "Silver"
                    : "Bronze"
                  : user.tier}
              </span>
              <span
                className={`${statusConfig.color} border px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1`}
              >
                <div
                  className={`w-2 h-2 ${statusConfig.dot} rounded-full`}
                ></div>
                {user.status}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "overview"
                  ? "border-indigo-500 text-indigo-600 bg-indigo-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Tổng quan
            </button>
            <button
              className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "activity"
                  ? "border-indigo-500 text-indigo-600 bg-indigo-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("activity")}
            >
              Hoạt động
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === "overview" && (
            <div className="space-y-4">
              {/* Contact Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-500" />
                  Thông tin liên hệ
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{user.email}</span>
                      {user.emailConfirmed ? (
                        <span className="text-green-600 text-xs bg-green-100 px-2 py-1 rounded-full">
                          Đã xác thực
                        </span>
                      ) : (
                        <span className="text-orange-600 text-xs bg-orange-100 px-2 py-1 rounded-full">
                          Chưa xác thực
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Số điện thoại
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {user.phone || "Chưa cập nhật"}
                      </span>
                      {user.phoneNumberConfirmed ? (
                        <span className="text-green-600 text-xs bg-green-100 px-2 py-1 rounded-full">
                          Đã xác thực
                        </span>
                      ) : (
                        <span className="text-orange-600 text-xs bg-orange-100 px-2 py-1 rounded-full">
                          Chưa xác thực
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  Thông tin tài khoản
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tên đăng nhập</span>
                    <span className="font-medium">{user.userName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Ngày tham gia</span>
                    <span className="font-medium">
                      {formatDate(user.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tổng chi tiêu</span>
                    <span className="font-bold text-green-600">
                      {(() => {
                        const spent =
                          user.TotalSpent ||
                          user.totalSpent ||
                          user.total_spent ||
                          0;
                        return spent > 0
                          ? `${Number(spent).toLocaleString("vi-VN")} ₫`
                          : "0 ₫";
                      })()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tổng đơn hàng</span>
                    <span className="font-medium text-blue-600">
                      {user.TotalOrders || user.totalOrders || 0} đơn
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Điểm tích lũy</span>
                    <span className="font-medium text-purple-600">
                      {user.Points || user.points || 0} điểm
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  Hoạt động gần đây
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                    <span className="text-gray-600">Lần đăng nhập cuối</span>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatRelativeTime(user.lastLoginAt)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(user.lastLoginAt)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                    <span className="text-gray-600">Trạng thái hoạt động</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${statusConfig.color} border`}
                    >
                      {user.isActive ? "Đang hoạt động" : "Không hoạt động"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {typeof user.tier === "number"
                      ? user.tier === 5
                        ? "Diamond"
                        : user.tier === 4
                        ? "Platinum"
                        : user.tier === 3
                        ? "Gold"
                        : user.tier === 2
                        ? "Silver"
                        : "Bronze"
                      : user.tier}
                  </div>
                  <div className="text-xs text-blue-800 mt-1">
                    Hạng thành viên
                  </div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {(() => {
                      const spent =
                        user.TotalSpent ||
                        user.totalSpent ||
                        user.total_spent ||
                        0;
                      return spent > 0 ? Math.floor(spent / 1000000) : 0;
                    })()}
                    M
                  </div>
                  <div className="text-xs text-green-800 mt-1">
                    Tổng chi tiêu
                  </div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {user.Points || user.points || 0}
                  </div>
                  <div className="text-xs text-purple-800 mt-1">
                    Điểm tích lũy
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDetailModal;
