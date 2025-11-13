import React, { useState, useEffect } from "react";
import {
  Bell,
  Mail,
  Smartphone,
  Volume2,
  Check,
  X,
  Info,
  AlertCircle,
  Gift,
  Package,
  CreditCard,
  Star,
  Settings,
} from "lucide-react";

const NotificationsTab = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    categories: {
      orders: true,
      promotions: true,
      products: false,
      account: true,
      system: true,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await fetchNotifications();
      await fetchNotificationSettings();
    };
    fetchData();
  }, [user]); // Only depend on user since settings depend on user data

  const fetchNotifications = async () => {
    try {
      // Mock data - replace with actual API call
      const mockNotifications = [
        {
          id: 1,
          type: "order",
          title: "Đơn hàng đã được giao thành công",
          message:
            "Đơn hàng SKR-2024-001 đã được giao đến địa chỉ của bạn lúc 16:45 ngày 18/01/2024.",
          timestamp: new Date("2024-01-18T16:45:00"),
          read: false,
          icon: Package,
          color: "text-green-600 bg-green-50",
        },
        {
          id: 2,
          type: "promotion",
          title: "Khuyến mãi đặc biệt - Giảm 20%",
          message:
            "Ưu đãi đặc biệt cho thành viên VIP! Giảm giá 20% toàn bộ sản phẩm gốm sứ. Áp dụng đến 31/01/2024.",
          timestamp: new Date("2024-01-17T10:00:00"),
          read: true,
          icon: Gift,
          color: "text-purple-600 bg-purple-50",
        },
        {
          id: 3,
          type: "payment",
          title: "Thanh toán thành công",
          message:
            "Đã thanh toán thành công 2.850.000₫ cho đơn hàng SKR-2024-001.",
          timestamp: new Date("2024-01-15T11:30:00"),
          read: true,
          icon: CreditCard,
          color: "text-blue-600 bg-blue-50",
        },
        {
          id: 4,
          type: "product",
          title: "Sản phẩm yêu thích có hàng trở lại",
          message:
            "Bình hoa gốm Satsuma đã có hàng trở lại. Đặt hàng ngay để không bỏ lỡ!",
          timestamp: new Date("2024-01-14T14:20:00"),
          read: false,
          icon: Bell,
          color: "text-orange-600 bg-orange-50",
        },
        {
          id: 5,
          type: "account",
          title: "Cập nhật thông tin tài khoản",
          message: "Bạn đã cập nhật thông tin cá nhân thành công.",
          timestamp: new Date("2024-01-10T09:15:00"),
          read: true,
          icon: Settings,
          color: "text-gray-600 bg-gray-50",
        },
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotificationSettings = async () => {
    try {
      // In real app, this would fetch from API
      if (user) {
        setSettings({
          emailNotifications: user.emailNotifications ?? true,
          smsNotifications: user.smsNotifications ?? false,
          pushNotifications: user.pushNotifications ?? true,
          categories: {
            orders: true,
            promotions: true,
            products: false,
            account: true,
            system: true,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching notification settings:", error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      // API call would go here
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
      // API call would go here
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (window.confirm("Bạn có chắc muốn xóa thông báo này?")) {
      try {
        setNotifications((prev) =>
          prev.filter((notif) => notif.id !== notificationId)
        );
        // API call would go here
      } catch (error) {
        console.error("Error deleting notification:", error);
      }
    }
  };

  const handleUpdateSettings = async (newSettings) => {
    try {
      setSettings(newSettings);
      // API call would go here
      console.log("Updated notification settings:", newSettings);
    } catch (error) {
      console.error("Error updating notification settings:", error);
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) {
      return `${days} ngày trước`;
    } else if (hours > 0) {
      return `${hours} giờ trước`;
    } else if (minutes > 0) {
      return `${minutes} phút trước`;
    } else {
      return "Vừa xong";
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Cài đặt thông báo
        </h2>

        <div className="space-y-6">
          {/* Notification Methods */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Phương thức nhận thông báo
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-sm text-gray-600">
                      Nhận thông báo qua email
                    </div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) =>
                      handleUpdateSettings({
                        ...settings,
                        emailNotifications: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium">SMS</div>
                    <div className="text-sm text-gray-600">
                      Nhận thông báo qua tin nhắn
                    </div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.smsNotifications}
                    onChange={(e) =>
                      handleUpdateSettings({
                        ...settings,
                        smsNotifications: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Volume2 className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Push Notifications</div>
                    <div className="text-sm text-gray-600">
                      Thông báo đẩy trên trình duyệt
                    </div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) =>
                      handleUpdateSettings({
                        ...settings,
                        pushNotifications: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Notification Categories */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Loại thông báo
            </h3>
            <div className="space-y-4">
              {[
                {
                  key: "orders",
                  label: "Đơn hàng",
                  description: "Cập nhật về trạng thái đơn hàng",
                },
                {
                  key: "promotions",
                  label: "Khuyến mãi",
                  description: "Ưu đãi và chương trình khuyến mãi",
                },
                {
                  key: "products",
                  label: "Sản phẩm",
                  description: "Sản phẩm mới và có hàng trở lại",
                },
                {
                  key: "account",
                  label: "Tài khoản",
                  description: "Thay đổi thông tin tài khoản",
                },
                {
                  key: "system",
                  label: "Hệ thống",
                  description: "Thông báo bảo trì và cập nhật",
                },
              ].map((category) => (
                <div
                  key={category.key}
                  className="flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{category.label}</div>
                    <div className="text-sm text-gray-600">
                      {category.description}
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.categories[category.key]}
                      onChange={(e) =>
                        handleUpdateSettings({
                          ...settings,
                          categories: {
                            ...settings.categories,
                            [category.key]: e.target.checked,
                          },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Thông báo ({unreadCount} chưa đọc)
          </h2>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Đánh dấu tất cả là đã đọc
            </button>
          )}
        </div>

        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => {
              const IconComponent = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    notification.read
                      ? "border-gray-200 bg-white"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className={`p-2 rounded-full ${notification.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3
                          className={`font-medium ${
                            notification.read
                              ? "text-gray-900"
                              : "text-gray-900 font-semibold"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        {notification.message}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center space-x-3">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            <Check className="w-4 h-4" />
                            <span>Đánh dấu đã đọc</span>
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleDeleteNotification(notification.id)
                          }
                          className="flex items-center space-x-1 text-gray-500 hover:text-red-600 text-sm"
                        >
                          <X className="w-4 h-4" />
                          <span>Xóa</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <div className="text-xl font-medium text-gray-900 mb-2">
              Không có thông báo nào
            </div>
            <div className="text-gray-600">
              Tất cả thông báo sẽ hiển thị tại đây
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsTab;
