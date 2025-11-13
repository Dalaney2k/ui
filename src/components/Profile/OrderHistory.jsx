import React, { useState, useEffect, useCallback } from "react";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  RotateCcw,
  Eye,
  Star,
  Filter,
  Search,
  Calendar,
} from "lucide-react";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    dateFrom: "",
    dateTo: "",
    search: "",
  });

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockOrders = [
        {
          id: "ORD001",
          orderNumber: "SKR-2024-001",
          date: new Date("2024-01-15"),
          status: "delivered",
          total: 2850000,
          itemCount: 3,
          shippingAddress: {
            name: "Nguyễn Văn A",
            address: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
          },
          items: [
            {
              id: 1,
              name: "Bộ chén dĩa gốm sứ Nhật Bản",
              image: "/images/product1.jpg",
              price: 1200000,
              quantity: 1,
              sku: "CHE001",
            },
            {
              id: 2,
              name: "Ấm trà Kyusu truyền thống",
              image: "/images/product2.jpg",
              price: 850000,
              quantity: 1,
              sku: "TEA001",
            },
            {
              id: 3,
              name: "Đũa gỗ cao cấp (5 đôi)",
              image: "/images/product3.jpg",
              price: 400000,
              quantity: 2,
              sku: "CHO001",
            },
          ],
        },
        {
          id: "ORD002",
          orderNumber: "SKR-2024-002",
          date: new Date("2024-01-20"),
          status: "shipping",
          total: 1580000,
          itemCount: 2,
          shippingAddress: {
            name: "Nguyễn Văn A",
            address: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
          },
          items: [
            {
              id: 4,
              name: "Nồi cơm điện Zojirushi",
              image: "/images/product4.jpg",
              price: 980000,
              quantity: 1,
              sku: "KIT001",
            },
            {
              id: 5,
              name: "Bộ dao nhật Santoku",
              image: "/images/product5.jpg",
              price: 600000,
              quantity: 1,
              sku: "KNI001",
            },
          ],
        },
      ];

      // Apply filters
      let filteredOrders = mockOrders;

      if (filters.status !== "all") {
        filteredOrders = filteredOrders.filter(
          (order) => order.status === filters.status
        );
      }

      if (filters.search) {
        filteredOrders = filteredOrders.filter(
          (order) =>
            order.orderNumber
              .toLowerCase()
              .includes(filters.search.toLowerCase()) ||
            order.items.some((item) =>
              item.name.toLowerCase().includes(filters.search.toLowerCase())
            )
        );
      }

      if (filters.dateFrom) {
        filteredOrders = filteredOrders.filter(
          (order) => new Date(order.date) >= new Date(filters.dateFrom)
        );
      }

      if (filters.dateTo) {
        filteredOrders = filteredOrders.filter(
          (order) => new Date(order.date) <= new Date(filters.dateTo)
        );
      }

      setOrders(filteredOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const getStatusColor = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      confirmed: "bg-blue-100 text-blue-800 border-blue-200",
      shipping: "bg-purple-100 text-purple-800 border-purple-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      returned: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="w-4 h-4" />,
      confirmed: <Package className="w-4 h-4" />,
      shipping: <Truck className="w-4 h-4" />,
      delivered: <CheckCircle className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />,
      returned: <RotateCcw className="w-4 h-4" />,
    };
    return icons[status] || <Package className="w-4 h-4" />;
  };

  const getStatusText = (status) => {
    const statusTexts = {
      pending: "Chờ xử lý",
      confirmed: "Đã xác nhận",
      shipping: "Đang giao",
      delivered: "Đã giao",
      cancelled: "Đã hủy",
      returned: "Đã trả hàng",
    };
    return statusTexts[status] || "Không xác định";
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        <span className="ml-2 text-gray-600">Đang tải lịch sử đơn hàng...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lịch sử đơn hàng</h2>
          <p className="text-gray-600 mt-1">
            Theo dõi và quản lý các đơn hàng của bạn
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Bộ lọc</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">Tất cả</option>
              <option value="pending">Chờ xử lý</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="shipping">Đang giao</option>
              <option value="delivered">Đã giao</option>
              <option value="cancelled">Đã hủy</option>
              <option value="returned">Đã trả hàng</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Mã đơn hàng hoặc tên sản phẩm"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Từ ngày
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) =>
                setFilters({ ...filters, dateFrom: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đến ngày
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) =>
                setFilters({ ...filters, dateTo: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            {/* Order Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {order.orderNumber}
                    </h3>
                    <span
                      className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      <span>{getStatusText(order.status)}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(order.date)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Package className="w-4 h-4" />
                      <span>{order.itemCount} sản phẩm</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600">
                    {formatPrice(order.total)}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowOrderDetail(true);
                    }}
                    className="mt-2 inline-flex items-center space-x-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Xem chi tiết</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="p-6">
              <h4 className="font-medium text-gray-900 mb-3">
                Sản phẩm trong đơn hàng
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {order.items.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <span className="text-sm text-gray-600">
                      +{order.items.length - 3} sản phẩm khác
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy đơn hàng nào
          </h3>
          <p className="text-gray-600">
            Thử thay đổi bộ lọc hoặc tạo đơn hàng mới
          </p>
        </div>
      )}

      {/* Order Detail Modal */}
      {showOrderDetail && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  Chi tiết đơn hàng {selectedOrder.orderNumber}
                </h2>
                <button
                  onClick={() => setShowOrderDetail(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Thông tin đơn hàng
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mã đơn hàng:</span>
                      <span className="font-medium">
                        {selectedOrder.orderNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày đặt:</span>
                      <span>{formatDate(selectedOrder.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trạng thái:</span>
                      <span
                        className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          selectedOrder.status
                        )}`}
                      >
                        {getStatusIcon(selectedOrder.status)}
                        <span>{getStatusText(selectedOrder.status)}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Địa chỉ giao hàng
                  </h3>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-900">
                      {selectedOrder.shippingAddress.name}
                    </p>
                    <p>{selectedOrder.shippingAddress.address}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Sản phẩm đã đặt
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                        <p className="text-sm text-gray-600">
                          Số lượng: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatPrice(item.price)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      Tổng cộng:
                    </span>
                    <span className="text-2xl font-bold text-red-600">
                      {formatPrice(selectedOrder.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
