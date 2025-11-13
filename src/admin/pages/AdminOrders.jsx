import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  DollarSign,
  RefreshCw,
} from "lucide-react";
import {
  adminOrderService,
  formatCurrency,
  formatDate,
} from "../services/AdminApiService.js";

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    paymentStatus: "",
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
    sortBy: "newest",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search
  const debouncedSearch = useDebounce(filters.search, 500);

  // Order status options
  const orderStatuses = [
    { value: "", label: "Tất cả trạng thái", icon: null },
    { value: "pending", label: "Chờ xử lý", icon: Clock, color: "yellow" },
    {
      value: "confirmed",
      label: "Đã xác nhận",
      icon: CheckCircle,
      color: "blue",
    },
    {
      value: "processing",
      label: "Đang xử lý",
      icon: Package,
      color: "purple",
    },
    { value: "shipped", label: "Đã giao hàng", icon: Truck, color: "orange" },
    {
      value: "delivered",
      label: "Đã nhận hàng",
      icon: CheckCircle,
      color: "green",
    },
    { value: "cancelled", label: "Đã hủy", icon: XCircle, color: "red" },
    { value: "returned", label: "Đã trả hàng", icon: XCircle, color: "gray" },
  ];

  // Payment status options
  const paymentStatuses = [
    { value: "", label: "Tất cả trạng thái thanh toán" },
    { value: "pending", label: "Chờ thanh toán", color: "yellow" },
    { value: "paid", label: "Đã thanh toán", color: "green" },
    { value: "failed", label: "Thanh toán thất bại", color: "red" },
    { value: "refunded", label: "Đã hoàn tiền", color: "blue" },
  ];

  // Sort options
  const sortOptions = [
    { value: "newest", label: "Mới nhất" },
    { value: "oldest", label: "Cũ nhất" },
    { value: "amount_desc", label: "Giá trị cao nhất" },
    { value: "amount_asc", label: "Giá trị thấp nhất" },
    { value: "status", label: "Theo trạng thái" },
  ];

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        status: filters.status,
        startDate: filters.startDate,
        endDate: filters.endDate,
        minAmount: filters.minAmount,
        maxAmount: filters.maxAmount,
        sortBy: filters.sortBy,
      };

      // Remove empty params
      Object.keys(params).forEach((key) => {
        if (params[key] === "" || params[key] === null) {
          delete params[key];
        }
      });

      const response = await adminOrderService.getOrders(params);

      if (response.success) {
        const ordersData = response.data.orders || [];
        setOrders(ordersData);
        setPagination((prev) => ({
          ...prev,
          totalItems:
            response.data.pagination?.totalItems ||
            response.data.totalCount ||
            0,
          totalPages:
            response.data.pagination?.totalPages ||
            Math.ceil((response.data.totalCount || 0) / pagination.pageSize) ||
            1,
        }));
      } else {
        setError(response.message || "Không thể tải danh sách đơn hàng");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Có lỗi xảy ra khi tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, debouncedSearch, filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: parseInt(newPageSize),
      page: 1,
    }));
  };

  // Handle order selection
  const handleOrderSelection = (orderId) => {
    setSelectedOrders((prev) => {
      if (prev.includes(orderId)) {
        return prev.filter((id) => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((order) => order.id));
    }
  };

  // Handle order status update
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await adminOrderService.updateOrderStatus(
        orderId,
        newStatus
      );
      if (response.success) {
        fetchOrders(); // Refresh orders
      } else {
        alert(response.message || "Không thể cập nhật trạng thái đơn hàng");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng");
    }
  };

  // Get order status info
  const getOrderStatusInfo = (status) => {
    return orderStatuses.find((s) => s.value === status) || orderStatuses[0];
  };

  // Get status color classes (not dynamic to work with Tailwind)
  const getStatusColorClasses = (color) => {
    const colorMap = {
      yellow: {
        text: "text-yellow-800",
        bg: "bg-yellow-100",
        icon: "text-yellow-500",
      },
      blue: {
        text: "text-blue-800",
        bg: "bg-blue-100",
        icon: "text-blue-500",
      },
      purple: {
        text: "text-purple-800",
        bg: "bg-purple-100",
        icon: "text-purple-500",
      },
      orange: {
        text: "text-orange-800",
        bg: "bg-orange-100",
        icon: "text-orange-500",
      },
      green: {
        text: "text-green-800",
        bg: "bg-green-100",
        icon: "text-green-500",
      },
      red: {
        text: "text-red-800",
        bg: "bg-red-100",
        icon: "text-red-500",
      },
      gray: {
        text: "text-gray-800",
        bg: "bg-gray-100",
        icon: "text-gray-500",
      },
    };
    return (
      colorMap[color] || {
        text: "text-gray-800",
        bg: "bg-gray-100",
        icon: "text-gray-500",
      }
    );
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      search: "",
      status: "",
      startDate: "",
      endDate: "",
      minAmount: "",
      maxAmount: "",
      sortBy: "newest",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Export orders
  const handleExport = async () => {
    try {
      const params = {
        search: debouncedSearch,
        status: filters.status,
        startDate: filters.startDate,
        endDate: filters.endDate,
        minAmount: filters.minAmount,
        maxAmount: filters.maxAmount,
        sortBy: filters.sortBy,
      };

      await adminOrderService.exportOrders(params);
    } catch (error) {
      console.error("Error exporting orders:", error);
      alert("Có lỗi xảy ra khi xuất danh sách đơn hàng");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title flex items-center gap-2">
              <Package className="w-6 h-6 text-primary" />
              Quản lý đơn hàng
            </h1>
            <p className="page-subtitle">
              Quản lý và xử lý đơn hàng của khách hàng
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchOrders()}
              className="btn btn-outline"
              disabled={loading}
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Làm mới
            </button>
            <button onClick={handleExport} className="btn btn-outline">
              <Download className="w-4 h-4" />
              Xuất Excel
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-sm font-medium text-gray-700">Bộ lọc</h3>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-sm btn-outline"
              >
                <Filter className="w-4 h-4" />
                {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
              </button>
              {(filters.search ||
                filters.status ||
                filters.startDate ||
                filters.endDate ||
                filters.minAmount ||
                filters.maxAmount) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="card-content border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tìm kiếm
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Mã đơn hàng, tên khách hàng..."
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                    className="input pl-10"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="select"
                >
                  {orderStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Từ ngày
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    handleFilterChange("startDate", e.target.value)
                  }
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đến ngày
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    handleFilterChange("endDate", e.target.value)
                  }
                  className="input"
                />
              </div>

              {/* Amount Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá trị từ (VND)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minAmount}
                  onChange={(e) =>
                    handleFilterChange("minAmount", e.target.value)
                  }
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá trị đến (VND)
                </label>
                <input
                  type="number"
                  placeholder="1000000"
                  value={filters.maxAmount}
                  onChange={(e) =>
                    handleFilterChange("maxAmount", e.target.value)
                  }
                  className="input"
                />
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sắp xếp theo
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="select"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Danh sách đơn hàng
              </h3>
              {selectedOrders.length > 0 && (
                <span className="text-sm text-gray-600">
                  Đã chọn {selectedOrders.length} đơn hàng
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Hiển thị</span>
              <select
                value={pagination.pageSize}
                onChange={(e) => handlePageSizeChange(e.target.value)}
                className="input w-20 text-sm"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span className="text-sm text-gray-600">kết quả</span>
            </div>
          </div>
        </div>

        <div className="card-content p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Không có đơn hàng
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Không tìm thấy đơn hàng nào phù hợp với bộ lọc.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={
                            selectedOrders.length === orders.length &&
                            orders.length > 0
                          }
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã đơn hàng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Khách hàng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tổng tiền
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày đặt
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => {
                      const statusInfo = getOrderStatusInfo(order.status);
                      const StatusIcon = statusInfo.icon;
                      const colorClasses = getStatusColorClasses(
                        statusInfo.color
                      );

                      return (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedOrders.includes(order.id)}
                              onChange={() => handleOrderSelection(order.id)}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              #{order.orderNumber || order.id}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                  <User className="h-4 w-4 text-gray-500" />
                                </div>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {order.customerName ||
                                    order.customer?.name ||
                                    "N/A"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {order.customerEmail ||
                                    order.customer?.email ||
                                    "N/A"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {StatusIcon && (
                                <StatusIcon
                                  className={`w-4 h-4 ${colorClasses.icon}`}
                                />
                              )}
                              <select
                                value={order.status}
                                onChange={(e) =>
                                  handleStatusUpdate(order.id, e.target.value)
                                }
                                className={`text-sm rounded-full px-3 py-1 border-0 ${colorClasses.text} ${colorClasses.bg}`}
                              >
                                {orderStatuses.slice(1).map((status) => (
                                  <option
                                    key={status.value}
                                    value={status.value}
                                  >
                                    {status.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(order.totalAmount || 0)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.itemCount || 0} sản phẩm
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(order.createdAt)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  /* Handle view order detail */
                                }}
                                className="text-primary hover:text-primary-dark"
                                title="Xem chi tiết"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Hiển thị{" "}
                      <span className="font-medium">
                        {(pagination.page - 1) * pagination.pageSize + 1}
                      </span>{" "}
                      đến{" "}
                      <span className="font-medium">
                        {Math.min(
                          pagination.page * pagination.pageSize,
                          pagination.totalItems
                        )}
                      </span>{" "}
                      trong tổng số{" "}
                      <span className="font-medium">
                        {pagination.totalItems}
                      </span>{" "}
                      kết quả
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="btn btn-outline btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Trước
                      </button>
                      <span className="text-sm text-gray-700">
                        Trang {pagination.page} / {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                        className="btn btn-outline btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Sau
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
