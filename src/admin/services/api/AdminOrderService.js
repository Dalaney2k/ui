// 🛒 ADMIN ORDER SERVICE - Chuẩn hóa hoàn toàn
import { adminApiClient, apiUtils } from "./AdminApiClient.js";

/**
 * ✅ ADMIN ORDER SERVICE
 * - Centralized order management
 * - Order lifecycle management
 * - Statistics and reporting
 */
export const adminOrderService = {
  // Helper methods for status conversion
  getStatusText(statusCode) {
    const statusMap = {
      1: "pending",
      2: "confirmed",
      3: "processing",
      4: "shipped",
      5: "delivered",
      6: "cancelled",
      7: "returned",
    };
    return statusMap[statusCode] || "unknown";
  },

  getPaymentStatusText(statusCode) {
    const paymentStatusMap = {
      1: "pending",
      2: "paid",
      3: "failed",
      4: "refunded",
      5: "partially_refunded",
    };
    return paymentStatusMap[statusCode] || "unknown";
  },
  /**
   * 🛒 Get Orders with Filters
   * @param {Object} filters - Filter parameters
   * @returns {Promise<Object>} Orders with pagination
   */
  async getOrders(filters = {}) {
    try {
      console.log("🛒 [ORDER] Getting orders with filters:", filters);

      // Try simple query first, then add params
      const queryParams = {};

      // Basic pagination
      if (filters.page && filters.page > 1) queryParams.page = filters.page;
      if (filters.pageSize && filters.pageSize !== 20)
        queryParams.pageSize = filters.pageSize;

      // Only add sortBy if provided
      if (filters.sortBy) {
        queryParams.sortBy = filters.sortBy;
      }
      if (filters.sortDirection) {
        queryParams.sortDirection = filters.sortDirection;
      }

      // Add optional filter parameters
      if (filters.search) queryParams.search = filters.search;
      if (filters.status) queryParams.status = filters.status;
      if (filters.userId) queryParams.userId = filters.userId;
      if (filters.paymentStatus)
        queryParams.paymentStatus = filters.paymentStatus;
      if (filters.startDate) queryParams.startDate = filters.startDate;
      if (filters.endDate) queryParams.endDate = filters.endDate;
      if (filters.minAmount) queryParams.minAmount = filters.minAmount;
      if (filters.maxAmount) queryParams.maxAmount = filters.maxAmount;

      // Try admin orders endpoint first, fallback to recent orders
      let response;
      try {
        response = await adminApiClient.get("/admin/orders", queryParams);
      } catch {
        console.log(
          "🔄 [ORDER] Admin orders endpoint failed, trying recent orders..."
        );
        response = await adminApiClient.get("/order/recent", {
          ...queryParams,
          limit: queryParams.pageSize || 20,
        });
      }

      console.log("🔍 [ORDER DEBUG] Raw API response:", response);
      console.log("🔍 [ORDER DEBUG] Response data structure:", response.data);

      if (response.success) {
        // Handle API response structure - could be array or object
        let ordersData = [];
        let totalCount = 0;

        if (Array.isArray(response.data)) {
          // Direct array response
          ordersData = response.data;
          totalCount = ordersData.length;
        } else if (response.data && typeof response.data === "object") {
          // Single order object (from create) or nested data
          if (response.data.id && response.data.orderNumber) {
            // Single order response - convert to array
            ordersData = [response.data];
            totalCount = 1;
          } else {
            // Object with nested orders array
            ordersData =
              response.data.orders ||
              response.data.items ||
              response.data.data ||
              [];
            totalCount =
              response.data.totalCount ||
              response.data.total ||
              response.data.count ||
              ordersData.length;
          }
        }

        // Transform orders to match UI expectations
        const transformedOrders = ordersData.map((order) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone,
          status: order.statusText || this.getStatusText(order.status),
          statusCode: order.status,
          paymentStatus: this.getPaymentStatusText(order.paymentStatus),
          paymentMethod: order.paymentMethod,
          totalAmount: order.totalAmount,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          items: order.items || [],
          shippingAddress: order.shippingAddress,
          trackingNumber: order.trackingNumber,
          notes: order.orderNotes,
          canCancel: order.canCancel,
          isCompleted: order.isCompleted,
        }));

        console.log("✅ [ORDER] Orders retrieved:", {
          ordersCount: transformedOrders.length,
          totalCount: totalCount,
        });

        return {
          success: true,
          data: {
            orders: transformedOrders,
            items: transformedOrders,
            totalCount: totalCount,
            pagination: apiUtils.parsePagination(response),
          },
        };
      }

      console.log("❌ [ORDER] API returned unsuccessful response");
      return {
        success: false,
        data: { orders: [], items: [], totalCount: 0 },
        error: "Failed to retrieve orders",
      };
    } catch (error) {
      console.error("❌ [ORDER] Get orders error:", error);
      return {
        success: false,
        data: { orders: [], items: [], totalCount: 0 },
        error: apiUtils.formatErrorMessage(error),
      };
    }
  },

  /**
   * 🔍 Get Order by ID
   * @param {string|number} orderId - Order ID
   * @returns {Promise<Object>} Order details
   */
  async getOrderById(orderId) {
    try {
      console.log("🔍 [ORDER] Getting order by ID:", orderId);

      const response = await adminApiClient.get(`/order/${orderId}`);

      if (response.success && response.data) {
        console.log("✅ [ORDER] Order retrieved");
        return {
          success: true,
          data: response.data,
        };
      }

      console.log("❌ [ORDER] Order not found");
      return {
        success: false,
        data: null,
        error: "Order not found",
      };
    } catch (error) {
      console.error("❌ [ORDER] Get order by ID error:", error);
      return {
        success: false,
        data: null,
        error: apiUtils.formatErrorMessage(error),
      };
    }
  },

  /**
   * � Create New Order
   * @param {Object} orderData - Order data
   * @returns {Promise<Object>} Creation result
   */
  async createOrder(orderData) {
    try {
      console.log("📝 [ORDER] Creating new order:", orderData);

      const response = await adminApiClient.post("/order", orderData);

      if (response.success && response.data) {
        console.log("✅ [ORDER] Order created successfully");
        return {
          success: true,
          data: response.data,
          message: "Order created successfully",
        };
      }

      console.log("❌ [ORDER] Order creation failed");
      return {
        success: false,
        error: response.message || "Failed to create order",
      };
    } catch (error) {
      console.error("❌ [ORDER] Create order error:", error);
      return {
        success: false,
        error: apiUtils.formatErrorMessage(error),
      };
    }
  },

  /**
   * �🔄 Update Order Status
   * @param {string|number} orderId - Order ID
   * @param {string} status - New status
   * @param {string} notes - Optional notes
   * @returns {Promise<Object>} Update result
   */
  async updateOrderStatus(orderId, status, notes = "") {
    try {
      console.log("🔄 [ORDER] Updating order status:", orderId, status);

      const response = await adminApiClient.patch(`/order/${orderId}/status`, {
        status,
        note: notes,
      });

      if (response.success) {
        console.log("✅ [ORDER] Order status updated successfully");
        return {
          success: true,
          data: response.data,
          message: "Order status updated successfully",
        };
      }

      console.log("❌ [ORDER] Order status update failed");
      return {
        success: false,
        error: response.message || "Failed to update order status",
      };
    } catch (error) {
      console.error("❌ [ORDER] Update order status error:", error);
      return {
        success: false,
        error: apiUtils.formatErrorMessage(error),
      };
    }
  },

  /**
   * ✅ Confirm Order
   * @param {string|number} orderId - Order ID
   * @param {string} notes - Optional notes
   * @returns {Promise<Object>} Confirm result
   */
  async confirmOrder(orderId, notes = "") {
    try {
      console.log("✅ [ORDER] Confirming order:", orderId);

      const response = await adminApiClient.patch(`/order/${orderId}/confirm`, {
        notes,
      });

      if (response.success) {
        console.log("✅ [ORDER] Order confirmed successfully");
        return {
          success: true,
          data: response.data,
          message: "Order confirmed successfully",
        };
      }

      console.log("❌ [ORDER] Order confirmation failed");
      return {
        success: false,
        error: response.message || "Failed to confirm order",
      };
    } catch (error) {
      console.error("❌ [ORDER] Confirm order error:", error);
      return {
        success: false,
        error: apiUtils.formatErrorMessage(error),
      };
    }
  },

  /**
   * 🏭 Process Order
   * @param {string|number} orderId - Order ID
   * @param {string} notes - Optional notes
   * @returns {Promise<Object>} Process result
   */
  async processOrder(orderId, notes = "") {
    try {
      console.log("🏭 [ORDER] Processing order:", orderId);

      const response = await adminApiClient.patch(`/order/${orderId}/process`, {
        notes,
      });

      if (response.success) {
        console.log("✅ [ORDER] Order processed successfully");
        return {
          success: true,
          data: response.data,
          message: "Order processed successfully",
        };
      }

      console.log("❌ [ORDER] Order processing failed");
      return {
        success: false,
        error: response.message || "Failed to process order",
      };
    } catch (error) {
      console.error("❌ [ORDER] Process order error:", error);
      return {
        success: false,
        error: apiUtils.formatErrorMessage(error),
      };
    }
  },

  /**
   * 🚚 Ship Order
   * @param {string|number} orderId - Order ID
   * @param {Object} trackingInfo - Tracking information
   * @returns {Promise<Object>} Ship result
   */
  async shipOrder(orderId, trackingInfo) {
    try {
      console.log("🚚 [ORDER] Shipping order:", orderId);

      const response = await adminApiClient.patch(
        `/order/${orderId}/ship`,
        trackingInfo
      );

      if (response.success) {
        console.log("✅ [ORDER] Order shipped successfully");
        return {
          success: true,
          data: response.data,
          message: "Order shipped successfully",
        };
      }

      console.log("❌ [ORDER] Order shipping failed");
      return {
        success: false,
        error: response.message || "Failed to ship order",
      };
    } catch (error) {
      console.error("❌ [ORDER] Ship order error:", error);
      return {
        success: false,
        error: apiUtils.formatErrorMessage(error),
      };
    }
  },

  /**
   * 📦 Deliver Order
   * @param {string|number} orderId - Order ID
   * @param {Object} deliveryInfo - Delivery information
   * @returns {Promise<Object>} Deliver result
   */
  async deliverOrder(orderId, deliveryInfo) {
    try {
      console.log("📦 [ORDER] Delivering order:", orderId);

      const response = await adminApiClient.patch(
        `/order/${orderId}/deliver`,
        deliveryInfo
      );

      if (response.success) {
        console.log("✅ [ORDER] Order delivered successfully");
        return {
          success: true,
          data: response.data,
          message: "Order delivered successfully",
        };
      }

      console.log("❌ [ORDER] Order delivery failed");
      return {
        success: false,
        error: response.message || "Failed to deliver order",
      };
    } catch (error) {
      console.error("❌ [ORDER] Deliver order error:", error);
      return {
        success: false,
        error: apiUtils.formatErrorMessage(error),
      };
    }
  },

  /**
   * 📊 Get Order Statistics
   * @param {string} period - Time period
   * @returns {Promise<Object>} Order statistics
   */
  async getOrderStats(period = "month") {
    try {
      console.log("📊 [ORDER] Getting order statistics for period:", period);

      const response = await adminApiClient.get(
        `/order/stats?period=${period}`
      );

      if (response.success && response.data) {
        console.log("✅ [ORDER] Order statistics retrieved");
        return {
          success: true,
          data: response.data,
        };
      }

      console.log("❌ [ORDER] Order statistics not available");
      return {
        success: false,
        data: {
          totalOrders: 0,
          pendingOrders: 0,
          todayOrders: 0,
          monthlyOrders: 0,
          totalRevenue: 0,
          monthlyRevenue: 0,
        },
        error: "Order statistics not available",
      };
    } catch (error) {
      console.error("❌ [ORDER] Get order stats error:", error);
      return {
        success: false,
        data: {
          totalOrders: 0,
          pendingOrders: 0,
          todayOrders: 0,
          monthlyOrders: 0,
          totalRevenue: 0,
          monthlyRevenue: 0,
        },
        error: apiUtils.formatErrorMessage(error),
      };
    }
  },

  /**
   * 📝 Get Recent Orders
   * @param {number} limit - Number of orders to return
   * @returns {Promise<Object>} Recent orders
   */
  async getRecentOrders(limit = 10) {
    try {
      console.log("📝 [ORDER] Getting recent orders, limit:", limit);

      const response = await adminApiClient.get(`/order/recent?limit=${limit}`);

      if (response.success && response.data) {
        console.log("✅ [ORDER] Recent orders retrieved");
        return {
          success: true,
          data: response.data,
        };
      }

      console.log("❌ [ORDER] Recent orders not available");
      return {
        success: false,
        data: [],
        error: "Recent orders not available",
      };
    } catch (error) {
      console.error("❌ [ORDER] Get recent orders error:", error);
      return {
        success: false,
        data: [],
        error: apiUtils.formatErrorMessage(error),
      };
    }
  },

  /**
   * 📄 Add Staff Note
   * @param {string|number} orderId - Order ID
   * @param {string} note - Note content
   * @returns {Promise<Object>} Add note result
   */
  async addStaffNote(orderId, note) {
    try {
      console.log("📄 [ORDER] Adding staff note to order:", orderId);

      const response = await adminApiClient.post(
        `/order/${orderId}/staff-notes`,
        {
          note,
        }
      );

      if (response.success) {
        console.log("✅ [ORDER] Staff note added successfully");
        return {
          success: true,
          data: response.data,
          message: "Staff note added successfully",
        };
      }

      console.log("❌ [ORDER] Adding staff note failed");
      return {
        success: false,
        error: response.message || "Failed to add staff note",
      };
    } catch (error) {
      console.error("❌ [ORDER] Add staff note error:", error);
      return {
        success: false,
        error: apiUtils.formatErrorMessage(error),
      };
    }
  },

  /**
   * 🔄 Process Return Request
   * @param {string|number} orderId - Order ID
   * @param {Object} returnData - Return request data
   * @returns {Promise<Object>} Process return result
   */
  async processReturn(orderId, returnData) {
    try {
      console.log("🔄 [ORDER] Processing return for order:", orderId);

      const response = await adminApiClient.patch(`/order/${orderId}/return`, {
        approved: returnData.approved,
        reason: returnData.reason,
        refundAmount: returnData.refundAmount,
        note: returnData.note,
      });

      if (response.success) {
        console.log("✅ [ORDER] Return processed successfully");
        return {
          success: true,
          data: response.data,
          message: "Return processed successfully",
        };
      }

      console.log("❌ [ORDER] Return processing failed");
      return {
        success: false,
        error: response.message || "Failed to process return",
      };
    } catch (error) {
      console.error("❌ [ORDER] Process return error:", error);
      return {
        success: false,
        error: apiUtils.formatErrorMessage(error),
      };
    }
  },
};
