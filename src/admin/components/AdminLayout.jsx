import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  Bell,
  Settings,
  User,
  ChevronDown,
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  Tag,
  FolderTree,
  CreditCard,
  MessageSquare,
  LogOut,
  Home,
} from "lucide-react";
import { authService } from "../services/adminApi";
import { adminDashboardService } from "../services/api/AdminDashboardService";
import "../styles/admin.css";

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [badges, setBadges] = useState({
    pendingOrders: 0,
    unreadNotifications: 0,
  });

  const location = useLocation();
  const navigate = useNavigate();

  // Navigation items with real API integration
  const getNavigationItems = () => [
    {
      section: "Tổng quan",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: Home,
          path: "/admin",
          badge: null,
        },
      ],
    },
    {
      section: "Quản lý",
      items: [
        {
          id: "users",
          label: "Người dùng",
          icon: Users,
          path: "/admin/users",
          badge: null,
        },
        {
          id: "products",
          label: "Sản phẩm",
          icon: Package,
          path: "/admin/products",
          badge: null,
        },
        {
          id: "orders",
          label: "Đơn hàng",
          icon: ShoppingCart,
          path: "/admin/orders",
          badge: badges.pendingOrders > 0 ? badges.pendingOrders : null,
        },
        {
          id: "brands",
          label: "Thương hiệu",
          icon: Tag,
          path: "/admin/brands",
          badge: null,
        },
        {
          id: "categories",
          label: "Danh mục",
          icon: FolderTree,
          path: "/admin/categories",
          badge: null,
        },
      ],
    },
    {
      section: "Hệ thống",
      items: [
        {
          id: "payments",
          label: "Thanh toán",
          icon: CreditCard,
          path: "/admin/payments",
          badge: null,
        },
        {
          id: "notifications",
          label: "Thông báo",
          icon: MessageSquare,
              path: "/admin/notifications",
          badge:
            badges.unreadNotifications > 0 ? badges.unreadNotifications : null,
        },
            {
              id: "messages",
              label: "Tin nhắn",
              icon: MessageSquare,
              path: "/admin/messages",
              badge: null,
            },
        {
          id: "settings",
          label: "Cài đặt",
          icon: Settings,
          path: "/admin/settings",
          badge: null,
        },
      ],
    },
  ];

  // Check authentication and load admin data
  useEffect(() => {
    const checkAuth = async () => {
      if (!authService.isLoggedIn()) {
        navigate("/admin/login");
        return;
      }

      try {
        const adminData = await authService.getCurrentAdmin();
        if (adminData) {
          setCurrentAdmin(adminData);
        } else {
          // Fallback to stored admin info
          const storedAdmin = JSON.parse(
            localStorage.getItem("adminInfo") || "{}"
          );
          setCurrentAdmin(storedAdmin);
        }
      } catch (error) {
        console.error("Error loading admin data:", error);
        navigate("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Load badge counts from API
  useEffect(() => {
    const loadBadgeCounts = async () => {
      if (!authService.isLoggedIn()) {
        return;
      }

      try {
        // Get order stats for pending orders count
        const dashboardData =
          await adminDashboardService.getDashboardOverview();
        if (dashboardData.success && dashboardData.data) {
          const pendingOrders = dashboardData.data.orders?.pendingOrders || 0;

          setBadges({
            pendingOrders: pendingOrders,
            unreadNotifications: 0, // TODO: Add notification API when available
          });
        }
      } catch (error) {
        console.error("Error loading badge counts:", error);
      }
    };

    loadBadgeCounts();

    // Refresh badge counts every 30 seconds
    const interval = setInterval(loadBadgeCounts, 30000);

    return () => clearInterval(interval);
  }, []);

  // Get page title from current path
  const getPageTitle = () => {
    const currentPath = location.pathname;
    const navigationItems = getNavigationItems();
    for (const section of navigationItems) {
      const item = section.items.find((item) => item.path === currentPath);
      if (item) return item.label;
    }
    return "Dashboard";
  };

  // Get breadcrumb
  const getBreadcrumb = () => {
    const currentPath = location.pathname;
    const pathSegments = currentPath.split("/").filter(Boolean);

    const breadcrumb = [{ label: "Admin", path: "/admin" }];

    if (pathSegments.length > 1) {
      const pageTitle = getPageTitle();
      breadcrumb.push({ label: pageTitle, path: currentPath });
    }

    return breadcrumb;
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if API call fails
      navigate("/admin/login");
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="spinner"></div>
          <span className="text-gray-600">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">🌸</div>
          {!sidebarCollapsed && <div className="sidebar-title">SakuraHome</div>}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {getNavigationItems().map((section, sectionIndex) => (
            <div key={sectionIndex} className="nav-section">
              {!sidebarCollapsed && (
                <div className="nav-section-title">{section.section}</div>
              )}

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <div key={item.id} className="nav-item">
                    <a
                      href={item.path}
                      className={`nav-link ${isActive ? "active" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(item.path);
                      }}
                      title={sidebarCollapsed ? item.label : ""}
                    >
                      <Icon className="nav-icon" />
                      {!sidebarCollapsed && (
                        <>
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className="nav-badge">{item.badge}</span>
                          )}
                        </>
                      )}
                    </a>
                  </div>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`admin-main ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}
      >
        {/* Header */}
        <header className="admin-header">
          <div className="header-left">
            <button
              className="header-toggle"
              onClick={toggleSidebar}
              title={sidebarCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
            >
              <Menu size={20} />
            </button>

            <nav className="header-breadcrumb">
              {getBreadcrumb().map((item, index) => (
                <div key={index} className="breadcrumb-item">
                  {index > 0 && <span className="breadcrumb-separator">/</span>}
                  <span>{item.label}</span>
                </div>
              ))}
            </nav>
          </div>

          <div className="header-right">
            {/* Search */}
            <div className="header-search">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="search-input"
              />
            </div>

            {/* Actions */}
            <div className="header-actions">
              <button className="action-button" title="Thông báo">
                <Bell size={20} />
                {badges.unreadNotifications > 0 && (
                  <div className="notification-badge">
                    {badges.unreadNotifications}
                  </div>
                )}
              </button>

              <button className="action-button" title="Cài đặt">
                <Settings size={20} />
              </button>

              {/* User Menu */}
              <div
                className="user-menu"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <img
                  src={
                    currentAdmin?.avatar ||
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                  }
                  alt="Admin Avatar"
                  className="user-avatar"
                />
                <div className="user-info">
                  <div className="user-name">
                    {currentAdmin?.fullName ||
                      currentAdmin?.firstName ||
                      "Admin"}
                  </div>
                  <div className="user-role">
                    {currentAdmin?.role || "Administrator"}
                  </div>
                </div>
                <ChevronDown size={16} />
              </div>

              {/* User Dropdown */}
              {userMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-2">
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      onClick={() => navigate("/admin/profile")}
                    >
                      <User size={16} />
                      Hồ sơ
                    </button>
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      onClick={() => navigate("/admin/settings")}
                    >
                      <Settings size={16} />
                      Cài đặt
                    </button>
                    <hr className="my-2" />
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
