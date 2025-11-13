import React, { useState, useEffect, useCallback } from "react";
import {
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  Eye,
  MoreVertical,
  ArrowUpRight,
  Calendar,
  Filter,
} from "lucide-react";
import {
  dashboardService,
  orderService,
  userService,
  formatCurrency,
  formatDate,
  getStatusColor,
} from "../services/AdminApiService";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  // Load dashboard data
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch all dashboard data in parallel
      const [overviewData, ordersData, topProductsData, userStats, orderStats] =
        await Promise.all([
          dashboardService.getDashboardOverview().catch(() => null),
          orderService.getRecentOrders(10).catch(() => []),
          dashboardService
            .getTopProducts(5, selectedPeriod)
            .catch(() => ({ success: false, data: [] })),
          userService
            .getUserStats()
            .catch(() => ({ success: false, data: null })),
          orderService
            .getOrderStats()
            .catch(() => ({ success: false, data: null })),
        ]);

      // Process API responses with proper error handling
      const processedOrderStats = orderStats?.success
        ? orderStats.data
        : orderStats || {};
      const processedUserStats = userStats?.success
        ? userStats.data
        : userStats || {};
      const processedOrdersData = ordersData?.success
        ? ordersData.data
        : Array.isArray(ordersData)
        ? ordersData
        : [];
      const processedTopProducts = topProductsData?.success
        ? topProductsData.data
        : Array.isArray(topProductsData)
        ? topProductsData
        : [];

      // Combine data from different sources
      const combinedStats = {
        // Orders data
        totalOrders: processedOrderStats?.totalOrders || 0,
        todayOrders: processedOrderStats?.todayOrders || 0,
        pendingOrders: processedOrderStats?.pendingOrders || 0,
        processingOrders: processedOrderStats?.processingOrders || 0,

        // Revenue data
        totalRevenue: processedOrderStats?.totalRevenue || 0,
        todayRevenue: processedOrderStats?.todayRevenue || 0,
        averageOrderValue: processedOrderStats?.averageOrderValue || 0,
        monthlyGrowth: processedOrderStats?.monthlyGrowth || 0,

        // Users data
        totalUsers: processedUserStats?.totalUsers || 0,
        activeUsers: processedUserStats?.activeUsers || 0,
        newUsersThisMonth: processedUserStats?.newUsersThisMonth || 0,

        // Products data
        totalProducts: 0,
        lowStockProducts: 0,

        // Use overview data if available (prioritize overview data)
        ...(overviewData?.success ? overviewData.data : overviewData || {}),
      };

      setStats(combinedStats);
      setRecentOrders(processedOrdersData);
      setTopProducts(processedTopProducts);
    } catch (error) {
      console.error("Dashboard data loading error:", error);
      setError("Không thể tải dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="spinner"></div>
          <span className="text-gray-600">Đang tải dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">❌ Lỗi tải dữ liệu</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={loadDashboardData} className="btn btn-primary">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">
              Tổng quan hoạt động kinh doanh SakuraHome
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="form-input w-auto"
            >
              <option value="7d">7 ngày qua</option>
              <option value="30d">30 ngày qua</option>
              <option value="90d">90 ngày qua</option>
              <option value="1y">1 năm qua</option>
            </select>

            <button className="btn btn-outline">
              <Filter size={16} />
              Bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {/* Total Revenue */}
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon bg-gradient-to-br from-green-500 to-emerald-500">
              <DollarSign size={24} />
            </div>
            <div className="stat-trend trend-up">
              <TrendingUp size={16} />+{stats?.monthlyGrowth || 0}%
            </div>
          </div>
          <div className="stat-value">
            {formatCurrency(stats?.totalRevenue || 0)}
          </div>
          <div className="stat-label">Tổng doanh thu</div>
        </div>

        {/* Total Orders */}
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon bg-gradient-to-br from-blue-500 to-cyan-500">
              <ShoppingCart size={24} />
            </div>
            <div className="stat-trend trend-up">
              <TrendingUp size={16} />
              +12%
            </div>
          </div>
          <div className="stat-value">
            {(stats?.totalOrders || 0).toLocaleString()}
          </div>
          <div className="stat-label">Tổng đơn hàng</div>
        </div>

        {/* Total Users */}
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon bg-gradient-to-br from-purple-500 to-pink-500">
              <Users size={24} />
            </div>
            <div className="stat-trend trend-up">
              <TrendingUp size={16} />
              +8%
            </div>
          </div>
          <div className="stat-value">
            {(stats?.totalUsers || 0).toLocaleString()}
          </div>
          <div className="stat-label">Tổng người dùng</div>
        </div>

        {/* Average Order Value */}
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon bg-gradient-to-br from-orange-500 to-red-500">
              <TrendingUp size={24} />
            </div>
            <div className="stat-trend trend-up">
              <TrendingUp size={16} />
              +5%
            </div>
          </div>
          <div className="stat-value">
            {formatCurrency(stats?.averageOrderValue || 0)}
          </div>
          <div className="stat-label">Giá trị đơn hàng TB</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Đơn hàng gần đây</h3>
                <p className="card-subtitle">
                  {recentOrders.length} đơn hàng mới nhất
                </p>
              </div>
              <button className="btn btn-outline btn-sm">
                <Eye size={16} />
                Xem tất cả
              </button>
            </div>

            <div className="card-content p-0">
              {recentOrders.length > 0 ? (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Mã đơn hàng</th>
                        <th>Khách hàng</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th>Ngày tạo</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="font-medium">
                            #{order.orderNumber || order.id}
                          </td>
                          <td>
                            <div>
                              <div className="font-medium">
                                {order.customerName || "N/A"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {order.customerEmail || ""}
                              </div>
                            </div>
                          </td>
                          <td className="font-medium">
                            {formatCurrency(order.totalAmount || 0)}
                          </td>
                          <td>
                            <span
                              className="badge"
                              style={{
                                backgroundColor: `${getStatusColor(
                                  order.status
                                )}15`,
                                color: getStatusColor(order.status),
                              }}
                            >
                              {order.status || "Unknown"}
                            </span>
                          </td>
                          <td className="text-sm text-gray-600">
                            {formatDate(order.createdAt || new Date())}
                          </td>
                          <td>
                            <button className="action-button">
                              <MoreVertical size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <ShoppingCart
                    size={48}
                    className="mx-auto mb-4 text-gray-300"
                  />
                  <p>Chưa có đơn hàng nào</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats & Top Products */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Thống kê nhanh</h3>
            </div>
            <div className="card-content space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-600">Đơn hàng hôm nay</div>
                  <div className="text-xl font-bold text-blue-600">
                    {stats?.todayOrders || 0}
                  </div>
                </div>
                <div className="text-blue-500">
                  <ShoppingCart size={24} />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-600">Chờ xử lý</div>
                  <div className="text-xl font-bold text-orange-600">
                    {stats?.pendingOrders || 0}
                  </div>
                </div>
                <div className="text-orange-500">
                  <Calendar size={24} />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-600">Doanh thu hôm nay</div>
                  <div className="text-xl font-bold text-green-600">
                    {formatCurrency(stats?.todayRevenue || 0)}
                  </div>
                </div>
                <div className="text-green-500">
                  <DollarSign size={24} />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-600">
                    User mới tháng này
                  </div>
                  <div className="text-xl font-bold text-purple-600">
                    {stats?.newUsersThisMonth || 0}
                  </div>
                </div>
                <div className="text-purple-500">
                  <Users size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Sản phẩm bán chạy</h3>
              <button className="btn btn-outline btn-sm">
                <ArrowUpRight size={16} />
              </button>
            </div>
            <div className="card-content space-y-3">
              {topProducts.length > 0 ? (
                topProducts.map((product, index) => (
                  <div
                    key={product.id || index}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package size={20} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {product.name || "Unknown Product"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.soldCount || 0} đã bán
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatCurrency(product.revenue || 0)}
                      </div>
                      <div className="text-sm text-gray-500">#{index + 1}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>Chưa có dữ liệu sản phẩm</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
