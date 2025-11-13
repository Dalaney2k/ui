import React, { useState, useEffect, useRef } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Eye,
  Download,
  Filter,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  Package,
  Target,
  Globe,
  Zap,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
} from "lucide-react";
import Chart from "chart.js/auto";
import AdvancedAnalyticsDashboard from "../components/AdvancedAnalyticsDashboard.jsx";
import PerformanceMetrics from "../components/PerformanceMetrics.jsx";
import "../styles/analytics-scoped.css";

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [realTimeData, setRealTimeData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [chartType, setChartType] = useState("line");

  // Chart references
  const revenueChartRef = useRef(null);
  const categoryChartRef = useRef(null);
  const revenueChart = useRef(null);
  const categoryChart = useRef(null);

  // Load analytics data
  useEffect(() => {
    const sampleData = {
      overview: {
        summary: {
          totalRevenue: 125800000,
          totalOrders: 1248,
          newCustomers: 342,
          conversionRate: 3.42,
          averageOrderValue: 100800,
          returnRate: 2.1,
          growth: {
            revenue: 12.5,
            orders: 8.3,
            customers: -2.1,
            conversion: 0.5,
          },
        },
        period: "week",
      },
      revenue: {
        breakdown: [
          { date: "2024-12-19", revenue: 15600000, orders: 156, customers: 89 },
          {
            date: "2024-12-20",
            revenue: 18900000,
            orders: 189,
            customers: 112,
          },
          {
            date: "2024-12-21",
            revenue: 22100000,
            orders: 221,
            customers: 134,
          },
          { date: "2024-12-22", revenue: 19800000, orders: 198, customers: 98 },
          {
            date: "2024-12-23",
            revenue: 25400000,
            orders: 254,
            customers: 156,
          },
          {
            date: "2024-12-24",
            revenue: 31200000,
            orders: 312,
            customers: 189,
          },
          {
            date: "2024-12-25",
            revenue: 28700000,
            orders: 287,
            customers: 167,
          },
        ],
      },
      products: {
        topSelling: [
          {
            id: 1,
            name: "Kem dưỡng da Shiseido Ultimune",
            revenue: 15600000,
            units: 124,
            growth: 23.5,
          },
          {
            id: 2,
            name: "Serum Vitamin C SK-II",
            revenue: 12800000,
            units: 96,
            growth: 18.2,
          },
          {
            id: 3,
            name: "Mặt nạ Lululun Premium",
            revenue: 9200000,
            units: 184,
            growth: 15.7,
          },
        ],
        categoryPerformance: [
          { name: "Skincare", revenue: 45200000, percentage: 36, growth: 18.7 },
          { name: "Makeup", revenue: 32100000, percentage: 25, growth: 12.3 },
          { name: "Haircare", revenue: 28900000, percentage: 23, growth: 8.9 },
          {
            name: "Fragrance",
            revenue: 19800000,
            percentage: 16,
            growth: 22.1,
          },
        ],
      },
      customers: {
        segments: [
          { tier: "Diamond", count: 156, revenue: 89000000, percentage: 12.3 },
          { tier: "Platinum", count: 289, revenue: 67000000, percentage: 23.2 },
          { tier: "Gold", count: 456, revenue: 45000000, percentage: 36.7 },
          { tier: "Silver", count: 347, revenue: 23000000, percentage: 27.8 },
        ],
      },
      realTime: {
        activeUsers: 1247,
        todayOrders: 89,
        todayRevenue: 8950000,
        conversionRate: 3.8,
      },
    };

    const loadAnalytics = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setAnalyticsData(sampleData);
        setRealTimeData(sampleData.realTime);
      } catch (error) {
        console.error("Error loading analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [selectedPeriod]);

  // Initialize charts
  useEffect(() => {
    if (!analyticsData || loading) return;

    // Revenue Chart
    if (revenueChartRef.current) {
      const ctx = revenueChartRef.current.getContext("2d");

      if (revenueChart.current) {
        revenueChart.current.destroy();
      }

      revenueChart.current = new Chart(ctx, {
        type: chartType,
        data: {
          labels: analyticsData.revenue.breakdown.map((item) =>
            new Date(item.date).toLocaleDateString("vi-VN", {
              month: "short",
              day: "numeric",
            })
          ),
          datasets: [
            {
              label: "Doanh thu",
              data: analyticsData.revenue.breakdown.map((item) => item.revenue),
              borderColor: "#ff6b9d",
              backgroundColor:
                chartType === "line"
                  ? "rgba(255, 107, 157, 0.1)"
                  : "rgba(255, 107, 157, 0.8)",
              tension: 0.4,
              fill: chartType === "area",
            },
            {
              label: "Đơn hàng",
              data: analyticsData.revenue.breakdown.map((item) => item.orders),
              borderColor: "#3b82f6",
              backgroundColor:
                chartType === "line"
                  ? "rgba(59, 130, 246, 0.1)"
                  : "rgba(59, 130, 246, 0.8)",
              yAxisID: "y1",
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              mode: "index",
              intersect: false,
              callbacks: {
                label: function (context) {
                  if (context.datasetIndex === 0) {
                    return `Doanh thu: ${new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(context.raw)}`;
                  }
                  return `Đơn hàng: ${context.raw}`;
                },
              },
            },
          },
          scales: {
            y: {
              type: "linear",
              display: true,
              position: "left",
              ticks: {
                callback: function (value) {
                  return new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    notation: "compact",
                  }).format(value);
                },
              },
            },
            y1: {
              type: "linear",
              display: true,
              position: "right",
              grid: {
                drawOnChartArea: false,
              },
            },
          },
          interaction: {
            mode: "nearest",
            axis: "x",
            intersect: false,
          },
        },
      });
    }

    // Category Performance Chart
    if (categoryChartRef.current) {
      const ctx = categoryChartRef.current.getContext("2d");

      if (categoryChart.current) {
        categoryChart.current.destroy();
      }

      categoryChart.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: analyticsData.products.categoryPerformance.map(
            (item) => item.name
          ),
          datasets: [
            {
              data: analyticsData.products.categoryPerformance.map(
                (item) => item.percentage
              ),
              backgroundColor: [
                "#ff6b9d",
                "#ffa8cc",
                "#ff85a2",
                "#d63384",
                "#f59e0b",
                "#22c55e",
              ],
              borderWidth: 2,
              borderColor: "#ffffff",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const category =
                    analyticsData.products.categoryPerformance[
                      context.dataIndex
                    ];
                  return `${category.name}: ${
                    category.percentage
                  }% (${new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    notation: "compact",
                  }).format(category.revenue)})`;
                },
              },
            },
          },
        },
      });
    }

    return () => {
      if (revenueChart.current) {
        revenueChart.current.destroy();
      }
      if (categoryChart.current) {
        categoryChart.current.destroy();
      }
    };
  }, [analyticsData, chartType, loading]);

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Simulate real-time data updates
        setRealTimeData((prev) => ({
          ...prev,
          activeUsers: Math.floor(Math.random() * 100) + 1200,
          todayOrders: Math.floor(Math.random() * 20) + 80,
          todayRevenue: Math.floor(Math.random() * 2000000) + 8000000,
        }));
      } catch (error) {
        console.error("Error updating real-time data:", error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      notation: "compact",
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat("vi-VN").format(number);
  };

  const exportReports = async () => {
    try {
      // Simulate export
      const exportData = {
        reportType: "complete_analytics",
        format: "excel",
        period: selectedPeriod,
        timestamp: new Date().toISOString(),
      };

      console.log("Exporting analytics report:", exportData);

      // Show success notification
      const notification = document.createElement("div");
      notification.className = "export-notification";
      notification.innerHTML = `
        <div class="notification-content">
          <CheckCircle size={20} />
          <span>Báo cáo đã được xuất thành công!</span>
        </div>
      `;
      document.body.appendChild(notification);

      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    } catch (error) {
      console.error("Error exporting report:", error);
    }
  };

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="loading-spinner">
          <RefreshCw className="animate-spin" size={32} />
        </div>
        <p>Đang tải dữ liệu phân tích...</p>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      {/* Header */}
      <div className="analytics-header">
        <div className="header-left">
          <h1 className="page-title">
            <BarChart3 className="title-icon" />
            Analytics Dashboard
          </h1>
          <p className="page-subtitle">
            Phân tích dữ liệu kinh doanh và hiệu suất bán hàng
          </p>
        </div>

        <div className="header-actions">
          {/* Real-time indicator */}
          <div className="realtime-indicator">
            <div className="pulse-dot"></div>
            <span>Live</span>
          </div>

          {/* Period selector */}
          <div className="period-selector">
            <button
              className={`period-btn ${
                selectedPeriod === "day" ? "active" : ""
              }`}
              onClick={() => setSelectedPeriod("day")}
            >
              Hôm nay
            </button>
            <button
              className={`period-btn ${
                selectedPeriod === "week" ? "active" : ""
              }`}
              onClick={() => setSelectedPeriod("week")}
            >
              7 ngày
            </button>
            <button
              className={`period-btn ${
                selectedPeriod === "month" ? "active" : ""
              }`}
              onClick={() => setSelectedPeriod("month")}
            >
              30 ngày
            </button>
            <button
              className={`period-btn ${
                selectedPeriod === "quarter" ? "active" : ""
              }`}
              onClick={() => setSelectedPeriod("quarter")}
            >
              3 tháng
            </button>
          </div>

          {/* Export button */}
          <button className="export-btn" onClick={exportReports}>
            <Download size={18} />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Real-time Stats Bar */}
      {realTimeData && (
        <div className="realtime-stats">
          <div className="stat-item">
            <Eye className="stat-icon" />
            <div className="stat-content">
              <span className="stat-label">Đang online</span>
              <span className="stat-value">
                {formatNumber(realTimeData.activeUsers)}
              </span>
            </div>
          </div>
          <div className="stat-item">
            <ShoppingBag className="stat-icon" />
            <div className="stat-content">
              <span className="stat-label">Đơn hàng hôm nay</span>
              <span className="stat-value">{realTimeData.todayOrders}</span>
            </div>
          </div>
          <div className="stat-item">
            <DollarSign className="stat-icon" />
            <div className="stat-content">
              <span className="stat-label">Doanh thu hôm nay</span>
              <span className="stat-value">
                {formatCurrency(realTimeData.todayRevenue)}
              </span>
            </div>
          </div>
          <div className="stat-item">
            <Target className="stat-icon" />
            <div className="stat-content">
              <span className="stat-label">Tỷ lệ chuyển đổi</span>
              <span className="stat-value">{realTimeData.conversionRate}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard Grid */}
      <div className="analytics-grid">
        {/* Overview Cards */}
        <div className="overview-cards">
          {analyticsData && (
            <>
              {/* Revenue Card */}
              <div className="metric-card revenue">
                <div className="card-header">
                  <div className="card-icon">
                    <DollarSign size={24} />
                  </div>
                  <div className="card-title">
                    <h3>Doanh thu</h3>
                    <span className="card-period">
                      {selectedPeriod === "week" ? "7 ngày qua" : "30 ngày qua"}
                    </span>
                  </div>
                </div>
                <div className="card-content">
                  <div className="metric-value">
                    {formatCurrency(
                      analyticsData.overview.summary.totalRevenue
                    )}
                  </div>
                  <div
                    className={`metric-change ${
                      analyticsData.overview.summary.growth.revenue >= 0
                        ? "positive"
                        : "negative"
                    }`}
                  >
                    {analyticsData.overview.summary.growth.revenue >= 0 ? (
                      <ArrowUpRight size={16} />
                    ) : (
                      <ArrowDownRight size={16} />
                    )}
                    <span>
                      {Math.abs(analyticsData.overview.summary.growth.revenue)}%
                    </span>
                  </div>
                </div>
                <div className="card-sparkline">
                  {/* Mini sparkline chart would go here */}
                  <div className="sparkline-placeholder"></div>
                </div>
              </div>

              {/* Orders Card */}
              <div className="metric-card orders">
                <div className="card-header">
                  <div className="card-icon">
                    <ShoppingBag size={24} />
                  </div>
                  <div className="card-title">
                    <h3>Đơn hàng</h3>
                    <span className="card-period">
                      {selectedPeriod === "week" ? "7 ngày qua" : "30 ngày qua"}
                    </span>
                  </div>
                </div>
                <div className="card-content">
                  <div className="metric-value">
                    {formatNumber(analyticsData.overview.summary.totalOrders)}
                  </div>
                  <div
                    className={`metric-change ${
                      analyticsData.overview.summary.growth.orders >= 0
                        ? "positive"
                        : "negative"
                    }`}
                  >
                    {analyticsData.overview.summary.growth.orders >= 0 ? (
                      <ArrowUpRight size={16} />
                    ) : (
                      <ArrowDownRight size={16} />
                    )}
                    <span>
                      {Math.abs(analyticsData.overview.summary.growth.orders)}%
                    </span>
                  </div>
                </div>
                <div className="card-sparkline">
                  <div className="sparkline-placeholder"></div>
                </div>
              </div>

              {/* Customers Card */}
              <div className="metric-card customers">
                <div className="card-header">
                  <div className="card-icon">
                    <Users size={24} />
                  </div>
                  <div className="card-title">
                    <h3>Khách hàng mới</h3>
                    <span className="card-period">
                      {selectedPeriod === "week" ? "7 ngày qua" : "30 ngày qua"}
                    </span>
                  </div>
                </div>
                <div className="card-content">
                  <div className="metric-value">
                    {formatNumber(analyticsData.overview.summary.newCustomers)}
                  </div>
                  <div
                    className={`metric-change ${
                      analyticsData.overview.summary.growth.customers >= 0
                        ? "positive"
                        : "negative"
                    }`}
                  >
                    {analyticsData.overview.summary.growth.customers >= 0 ? (
                      <ArrowUpRight size={16} />
                    ) : (
                      <ArrowDownRight size={16} />
                    )}
                    <span>
                      {Math.abs(
                        analyticsData.overview.summary.growth.customers
                      )}
                      %
                    </span>
                  </div>
                </div>
                <div className="card-sparkline">
                  <div className="sparkline-placeholder"></div>
                </div>
              </div>

              {/* Conversion Rate Card */}
              <div className="metric-card conversion">
                <div className="card-header">
                  <div className="card-icon">
                    <Target size={24} />
                  </div>
                  <div className="card-title">
                    <h3>Tỷ lệ chuyển đổi</h3>
                    <span className="card-period">
                      {selectedPeriod === "week" ? "7 ngày qua" : "30 ngày qua"}
                    </span>
                  </div>
                </div>
                <div className="card-content">
                  <div className="metric-value">
                    {analyticsData.overview.summary.conversionRate}%
                  </div>
                  <div
                    className={`metric-change ${
                      analyticsData.overview.summary.growth.conversion >= 0
                        ? "positive"
                        : "negative"
                    }`}
                  >
                    {analyticsData.overview.summary.growth.conversion >= 0 ? (
                      <ArrowUpRight size={16} />
                    ) : (
                      <ArrowDownRight size={16} />
                    )}
                    <span>
                      {Math.abs(
                        analyticsData.overview.summary.growth.conversion
                      )}
                      %
                    </span>
                  </div>
                </div>
                <div className="card-sparkline">
                  <div className="sparkline-placeholder"></div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Revenue Chart */}
        <div className="chart-container main-chart">
          <div className="chart-header">
            <h3>Biểu đồ doanh thu & đơn hàng</h3>
            <div className="chart-controls">
              <div className="chart-type-selector">
                <button
                  className={`chart-type-btn ${
                    chartType === "line" ? "active" : ""
                  }`}
                  onClick={() => setChartType("line")}
                >
                  <Activity size={16} />
                </button>
                <button
                  className={`chart-type-btn ${
                    chartType === "bar" ? "active" : ""
                  }`}
                  onClick={() => setChartType("bar")}
                >
                  <BarChart3 size={16} />
                </button>
              </div>
            </div>
          </div>
          <div className="chart-wrapper">
            <canvas ref={revenueChartRef}></canvas>
          </div>
        </div>

        {/* Product Analytics */}
        <div className="analytics-section products-analytics">
          <div className="section-header">
            <h3>
              <Package className="section-icon" />
              Phân tích sản phẩm
            </h3>
          </div>
          <div className="products-grid">
            {/* Top Selling Products */}
            <div className="product-list">
              <h4>Sản phẩm bán chạy</h4>
              {analyticsData?.products.topSelling.map((product, index) => (
                <div key={product.id} className="product-item">
                  <div className="product-rank">#{index + 1}</div>
                  <div className="product-info">
                    <div className="product-name">{product.name}</div>
                    <div className="product-stats">
                      <span className="revenue">
                        {formatCurrency(product.revenue)}
                      </span>
                      <span className="units">{product.units} đã bán</span>
                    </div>
                  </div>
                  <div
                    className={`product-growth ${
                      product.growth >= 0 ? "positive" : "negative"
                    }`}
                  >
                    {product.growth >= 0 ? (
                      <TrendingUp size={16} />
                    ) : (
                      <TrendingDown size={16} />
                    )}
                    <span>{product.growth}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Category Performance Chart */}
            <div className="category-chart">
              <h4>Hiệu suất theo danh mục</h4>
              <div className="chart-wrapper">
                <canvas ref={categoryChartRef}></canvas>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Analytics */}
        <div className="analytics-section customer-analytics">
          <div className="section-header">
            <h3>
              <Users className="section-icon" />
              Phân tích khách hàng
            </h3>
          </div>
          <div className="customer-segments">
            {analyticsData?.customers.segments.map((segment) => (
              <div
                key={segment.tier}
                className={`segment-card ${segment.tier.toLowerCase()}`}
              >
                <div className="segment-header">
                  <h4>{segment.tier}</h4>
                  <span className="segment-percentage">
                    {segment.percentage}%
                  </span>
                </div>
                <div className="segment-stats">
                  <div className="stat">
                    <span className="stat-label">Khách hàng</span>
                    <span className="stat-value">
                      {formatNumber(segment.count)}
                    </span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Doanh thu</span>
                    <span className="stat-value">
                      {formatCurrency(segment.revenue)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Insights */}
        <div className="analytics-section quick-insights">
          <div className="section-header">
            <h3>
              <Zap className="section-icon" />
              Thông tin nhanh
            </h3>
          </div>
          <div className="insights-grid">
            <div className="insight-item">
              <div className="insight-icon success">
                <CheckCircle size={20} />
              </div>
              <div className="insight-content">
                <h4>Tăng trưởng doanh thu</h4>
                <p>Doanh thu tăng 12.5% so với kỳ trước</p>
              </div>
            </div>
            <div className="insight-item">
              <div className="insight-icon warning">
                <AlertTriangle size={20} />
              </div>
              <div className="insight-content">
                <h4>Giảm khách hàng mới</h4>
                <p>Số khách hàng mới giảm 2.1% cần chú ý</p>
              </div>
            </div>
            <div className="insight-item">
              <div className="insight-icon info">
                <Info size={20} />
              </div>
              <div className="insight-content">
                <h4>Giờ cao điểm</h4>
                <p>14:00 - 16:00 có lượng truy cập cao nhất</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Analytics Section */}
      <AdvancedAnalyticsDashboard />

      {/* Performance Metrics Section */}
      <PerformanceMetrics />
    </div>
  );
};

export default AdminAnalytics;
