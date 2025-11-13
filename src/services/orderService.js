import apiClient from "./api";

export const orderService = {
  // Tính tổng tiền đơn hàng
  calculateTotal: async (data) => {
    try {
      console.log("Calculating order total...", data);

      if (!data || typeof data !== "object") {
        throw new Error("Invalid data provided for total calculation");
      }

      if (
        !data.items ||
        !Array.isArray(data.items) ||
        data.items.length === 0
      ) {
        throw new Error("Items are required for total calculation");
      }

      const response = await apiClient.post("/order/calculate-total", data);
      return response;
    } catch (error) {
      console.error("Calculate total error:", error);
      throw error;
    }
  },

  // Validate đơn hàng trước khi tạo
  validateOrder: async (data) => {
    try {
      console.log("Validating order...", data);

      if (!data || typeof data !== "object") {
        throw new Error("Invalid order data provided");
      }

      const response = await apiClient.post("/order/validate", data);
      return response;
    } catch (error) {
      console.error("Validate order error:", error);
      throw error;
    }
  },

  // FIXED: Tạo đơn hàng mới với payload đúng theo backend CreateOrderRequestDto
  createOrder: async (orderData) => {
    try {
      console.log("Creating order with payload:", orderData);

      // CLIENT-SIDE VALIDATION
      if (!orderData || typeof orderData !== "object") {
        throw new Error("Dữ liệu đơn hàng không hợp lệ");
      }

      if (
        !orderData.items ||
        !Array.isArray(orderData.items) ||
        orderData.items.length === 0
      ) {
        throw new Error("Đơn hàng phải có ít nhất một sản phẩm");
      }

      if (!orderData.shippingAddressId) {
        throw new Error("Thiếu địa chỉ giao hàng");
      }

      if (
        !orderData.paymentMethod ||
        typeof orderData.paymentMethod !== "string"
      ) {
        throw new Error("Thiếu phương thức thanh toán");
      }

      // Validate từng item
      for (const item of orderData.items) {
        if (!item.productId) {
          throw new Error("Thiếu ID sản phẩm");
        }
        if (!item.quantity || item.quantity <= 0) {
          throw new Error("Số lượng sản phẩm phải lớn hơn 0");
        }
      }

      // FIXED: Tạo payload đúng theo CreateOrderRequestDto với PascalCase
      const cleanPayload = {
        // FIXED: Items với chữ hoa I theo C# convention
        Items: orderData.items
          .map((item) => {
            const cleanItem = {
              ProductId: parseInt(item.productId),
              Quantity: parseInt(item.quantity),
            };

            // Thêm ProductVariantId nếu có
            if (item.productVariantId) {
              cleanItem.ProductVariantId = parseInt(item.productVariantId);
            }

            // FIXED: Xử lý CustomOptions đúng cách
            if (item.customOptions) {
              if (typeof item.customOptions === "string") {
                // Nếu đã là string, kiểm tra xem có phải JSON hợp lệ không
                try {
                  JSON.parse(item.customOptions);
                  cleanItem.CustomOptions = item.customOptions;
                } catch {
                  // Nếu không phải JSON hợp lệ, stringify
                  cleanItem.CustomOptions = JSON.stringify(item.customOptions);
                }
              } else if (typeof item.customOptions === "object") {
                cleanItem.CustomOptions = JSON.stringify(item.customOptions);
              }
            } else {
              // Mặc định là empty object JSON
              cleanItem.CustomOptions = "{}";
            }

            // Thêm Notes nếu có
            if (item.notes && typeof item.notes === "string") {
              cleanItem.Notes = item.notes.trim();
            }

            return cleanItem;
          })
          .filter((item) => item.ProductId && item.Quantity > 0),

        // FIXED: Các field đúng theo DTO với PascalCase
        ShippingAddressId: parseInt(orderData.shippingAddressId),
        PaymentMethod: String(orderData.paymentMethod).trim(),
      };

      // Thêm các field optional với PascalCase
      if (orderData.billingAddressId) {
        cleanPayload.BillingAddressId = parseInt(orderData.billingAddressId);
      }

      if (orderData.couponCode && orderData.couponCode.trim()) {
        cleanPayload.CouponCode = String(orderData.couponCode).trim();
      }

      if (orderData.orderNotes && orderData.orderNotes.trim()) {
        cleanPayload.OrderNotes = String(orderData.orderNotes).trim();
      }

      if (orderData.giftMessage && orderData.giftMessage.trim()) {
        cleanPayload.GiftMessage = String(orderData.giftMessage).trim();
      }

      // Boolean fields với PascalCase
      cleanPayload.SavePaymentInfo = Boolean(
        orderData.savePaymentInfo || false
      );
      cleanPayload.ExpressDelivery = Boolean(
        orderData.expressDelivery || false
      );
      cleanPayload.GiftWrap = Boolean(orderData.giftWrap || false);

      console.log(
        "Clean order payload:",
        JSON.stringify(cleanPayload, null, 2)
      );

      const response = await apiClient.post("/order", cleanPayload);

      console.log("Order created successfully:", response);
      return response;
    } catch (error) {
      console.error("Create order error:", error);

      // Xử lý các loại lỗi cụ thể
      if (
        error.message.includes("validation") ||
        error.message.includes("400") ||
        error.response?.status === 400
      ) {
        console.error("Validation error details:", error.response?.data);

        // Nếu có chi tiết lỗi từ backend
        if (error.response?.data?.errors) {
          const errorDetails = Array.isArray(error.response.data.errors)
            ? error.response.data.errors.join(", ")
            : JSON.stringify(error.response.data.errors);
          throw new Error(`Lỗi dữ liệu: ${errorDetails}`);
        }

        // FIXED: Xử lý ModelState errors từ ASP.NET Core
        if (
          error.response?.data?.title ===
          "One or more validation errors occurred."
        ) {
          const validationErrors = [];
          if (error.response.data.errors) {
            Object.entries(error.response.data.errors).forEach(
              ([field, messages]) => {
                if (Array.isArray(messages)) {
                  validationErrors.push(`${field}: ${messages.join(", ")}`);
                }
              }
            );
          }
          if (validationErrors.length > 0) {
            throw new Error(`Lỗi validation: ${validationErrors.join("; ")}`);
          }
        }

        throw new Error(
          "Thông tin đơn hàng không hợp lệ. Vui lòng kiểm tra lại."
        );
      }

      if (
        error.message.includes("401") ||
        error.message.includes("Unauthorized") ||
        error.response?.status === 401
      ) {
        throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      }

      if (
        error.message.includes("403") ||
        error.message.includes("Forbidden") ||
        error.response?.status === 403
      ) {
        throw new Error("Bạn không có quyền thực hiện thao tác này.");
      }

      if (error.message.includes("404") || error.response?.status === 404) {
        throw new Error("Không tìm thấy thông tin cần thiết để tạo đơn hàng.");
      }

      if (
        error.message.includes("409") ||
        error.message.includes("Conflict") ||
        error.response?.status === 409
      ) {
        throw new Error("Đơn hàng đã tồn tại hoặc có xung đột dữ liệu.");
      }

      if (error.response?.status === 500) {
        throw new Error("Lỗi server. Vui lòng thử lại sau ít phút.");
      }

      if (
        error.message.includes("Network Error") ||
        error.message.includes("timeout") ||
        error.code === "NETWORK_ERROR"
      ) {
        throw new Error("Lỗi kết nối. Vui lòng kiểm tra internet và thử lại.");
      }

      // Lỗi mặc định
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Không thể tạo đơn hàng. Vui lòng thử lại."
      );
    }
  },

  // Lấy chi tiết đơn hàng
  getOrderById: async (orderId) => {
    try {
      console.log("Getting order details for:", orderId);

      if (!orderId) {
        throw new Error("Order ID is required");
      }

      const sanitizedOrderId = String(orderId).replace(/[^a-zA-Z0-9-_]/g, "");
      if (!sanitizedOrderId) {
        throw new Error("Invalid order ID format");
      }

      const response = await apiClient.get(`/order/${sanitizedOrderId}`);
      return response;
    } catch (error) {
      console.error("Get order error:", error);

      if (error.message.includes("404") || error.response?.status === 404) {
        throw new Error("Không tìm thấy đơn hàng");
      }

      if (error.message.includes("403") || error.response?.status === 403) {
        throw new Error("Bạn không có quyền xem đơn hàng này");
      }

      throw error;
    }
  },

  // Lấy danh sách đơn hàng của user
  getUserOrders: async (params = {}) => {
    try {
      const {
        page = 1,
        limit = 10,
        status = null,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = params;
      console.log("Getting user orders:", params);

      const validatedPage = Math.max(1, parseInt(page) || 1);
      const validatedLimit = Math.min(100, Math.max(1, parseInt(limit) || 10));
      const validSortOrders = ["asc", "desc"];
      const validatedSortOrder = validSortOrders.includes(sortOrder)
        ? sortOrder
        : "desc";

      let endpoint = `/orders?page=${validatedPage}&limit=${validatedLimit}&sortBy=${sortBy}&sortOrder=${validatedSortOrder}`;

      if (status && typeof status === "string") {
        const validStatuses = [
          "pending",
          "confirmed",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
          "refunded",
        ];
        if (validStatuses.includes(status.toLowerCase())) {
          endpoint += `&status=${status.toLowerCase()}`;
        }
      }

      const response = await apiClient.get(endpoint);
      return response;
    } catch (error) {
      console.error("Get user orders error:", error);
      throw error;
    }
  },

  // Hủy đơn hàng
  cancelOrder: async (orderId, reason = "") => {
    try {
      console.log("Cancelling order:", orderId, reason);

      if (!orderId) {
        throw new Error("Order ID is required");
      }

      const sanitizedOrderId = String(orderId).replace(/[^a-zA-Z0-9-_]/g, "");
      if (!sanitizedOrderId) {
        throw new Error("Invalid order ID format");
      }

      const payload = {
        reason: String(reason || "Khách hàng hủy đơn"),
      };

      const response = await apiClient.delete(`/order/${sanitizedOrderId}`, {
        data: payload,
      });
      return response;
    } catch (error) {
      console.error("Cancel order error:", error);

      if (error.message.includes("400") || error.response?.status === 400) {
        throw new Error(
          "Không thể hủy đơn hàng này. Đơn hàng có thể đã được xử lý."
        );
      }

      if (error.message.includes("404") || error.response?.status === 404) {
        throw new Error("Không tìm thấy đơn hàng cần hủy");
      }

      if (error.message.includes("403") || error.response?.status === 403) {
        throw new Error("Bạn không có quyền hủy đơn hàng này");
      }

      throw error;
    }
  },
};
