// src/services/shippingService.js - Enhanced with better error handling
import apiClient from "./api";

export const shippingService = {
  // Lấy phương thức vận chuyển theo địa chỉ
  getMethods: async (addressId) => {
    try {
      console.log("Getting shipping methods for addressId:", addressId);

      // VALIDATE INPUT
      if (!addressId) {
        throw new Error("Address ID is required");
      }

      const response = await apiClient.get(
        `/shipping/methods?addressId=${addressId}`
      );

      console.log("Shipping methods response:", response);
      return response;
    } catch (error) {
      console.error("Get shipping methods error:", error);

      // HANDLE SPECIFIC ERROR CASES
      if (
        error.message.includes("403") ||
        error.message.includes("Forbidden")
      ) {
        console.warn("403 Forbidden - Using fallback shipping methods");

        // Return fallback data for 403 errors
        return {
          success: true,
          data: [
            {
              id: "standard",
              name: "Giao hàng tiêu chuẩn",
              description: "3-5 ngày làm việc",
              price: 30000,
              estimatedDays: 4,
              icon: "📦",
              isAvailable: true,
            },
            {
              id: "express",
              name: "Giao hàng nhanh",
              description: "1-2 ngày làm việc",
              price: 50000,
              estimatedDays: 1,
              icon: "🚀",
              isAvailable: true,
            },
          ],
          message: "Fallback shipping methods loaded",
        };
      }

      // HANDLE OTHER API ERRORS
      if (error.message.includes("404")) {
        console.warn("404 Not Found - Address may not exist");
        return {
          success: false,
          message: "Không tìm thấy phương thức vận chuyển cho địa chỉ này",
          data: [],
        };
      }

      if (error.message.includes("401")) {
        console.warn("401 Unauthorized - Authentication required");
        return {
          success: false,
          message: "Cần đăng nhập để xem phương thức vận chuyển",
          data: [],
        };
      }

      // NETWORK/CONNECTION ERRORS
      if (
        error.message.includes("Network Error") ||
        error.message.includes("timeout")
      ) {
        console.warn("Network error - Using fallback shipping methods");

        return {
          success: true,
          data: [
            {
              id: "cod",
              name: "Thanh toán khi nhận hàng (COD)",
              description: "3-5 ngày làm việc",
              price: 30000,
              estimatedDays: 4,
              icon: "💰",
              isAvailable: true,
            },
          ],
          message: "Fallback shipping methods (network error)",
        };
      }

      // DEFAULT FALLBACK for any other errors
      console.warn("Unknown error - Using default fallback");
      return {
        success: true,
        data: [
          {
            id: "default",
            name: "Giao hàng cơ bản",
            description: "3-7 ngày làm việc",
            price: 25000,
            estimatedDays: 5,
            icon: "📮",
            isAvailable: true,
          },
        ],
        message: "Default shipping method loaded",
      };
    }
  },

  // Tính phí vận chuyển
  calculateFee: async (addressId, items) => {
    try {
      console.log("Calculating shipping fee for:", {
        addressId,
        items: items?.length,
      });

      if (!addressId) {
        throw new Error("Address ID is required");
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        throw new Error("Items array is required");
      }

      const response = await apiClient.post("/shipping/calculate", {
        addressId,
        items,
      });
      return response;
    } catch (error) {
      console.error("Calculate shipping fee error:", error);

      // FALLBACK CALCULATION based on items
      const totalWeight =
        items?.reduce((weight, item) => {
          return weight + (item.weight || 0.5) * item.quantity; // Default 0.5kg per item
        }, 0) || 1;

      const totalValue =
        items?.reduce((value, item) => {
          return value + (item.price || item.unitPrice || 0) * item.quantity;
        }, 0) || 0;

      const baseFee = 25000; // Base fee 25k
      const weightFee = totalWeight > 1 ? (totalWeight - 1) * 10000 : 0; // 10k per additional kg
      const valueFee = totalValue > 1000000 ? 15000 : 0; // Extra fee for expensive items
      const calculatedFee = baseFee + weightFee + valueFee;

      return {
        success: true,
        data: {
          fee: Math.min(calculatedFee, 100000), // Cap at 100k
          estimatedDays: totalWeight > 5 ? 5 : 3, // Longer for heavy packages
          breakdown: {
            baseFee,
            weightFee,
            valueFee,
            totalWeight,
            totalValue,
          },
        },
        message: "Calculated using fallback method",
      };
    }
  },

  // Lấy thông tin tracking
  trackShipment: async (trackingNumber) => {
    try {
      console.log("Tracking shipment:", trackingNumber);

      if (!trackingNumber || typeof trackingNumber !== "string") {
        throw new Error("Valid tracking number is required");
      }

      const response = await apiClient.get(`/shipping/track/${trackingNumber}`);
      return response;
    } catch (error) {
      console.error("Track shipment error:", error);

      // RETURN MEANINGFUL ERROR for tracking
      if (error.message.includes("404")) {
        return {
          success: false,
          message: "Không tìm thấy thông tin vận chuyển với mã này",
          data: null,
        };
      }

      if (error.message.includes("400")) {
        return {
          success: false,
          message: "Mã vận chuyển không hợp lệ",
          data: null,
        };
      }

      return {
        success: false,
        message:
          "Không thể theo dõi đơn hàng tại thời điểm này. Vui lòng thử lại sau.",
        data: null,
      };
    }
  },

  // NEW: Validate shipping method for address
  validateShippingMethod: async (addressId, shippingMethodId) => {
    try {
      console.log("Validating shipping method:", {
        addressId,
        shippingMethodId,
      });

      if (!addressId || !shippingMethodId) {
        return {
          success: false,
          message: "Address ID and shipping method ID are required",
        };
      }

      const methods = await this.getMethods(addressId);

      if (!methods.success) {
        return { success: false, message: methods.message };
      }

      const isValid = methods.data.some(
        (method) => method.id === shippingMethodId && method.isAvailable
      );

      return {
        success: isValid,
        message: isValid
          ? "Shipping method is valid"
          : "Invalid shipping method for this address",
        data: isValid
          ? methods.data.find((m) => m.id === shippingMethodId)
          : null,
      };
    } catch (error) {
      console.error("Validate shipping method error:", error);
      return {
        success: false,
        message: "Không thể xác minh phương thức vận chuyển",
      };
    }
  },

  // NEW: Get shipping zones/regions
  getShippingZones: async () => {
    try {
      console.log("Getting shipping zones...");
      const response = await apiClient.get("/shipping/zones");
      return response;
    } catch (error) {
      console.error("Get shipping zones error:", error);

      // Fallback with common Vietnam shipping zones
      return {
        success: true,
        data: [
          {
            id: "zone1",
            name: "Nội thành Hà Nội, TP.HCM",
            description: "Giao hàng trong ngày",
            baseFee: 25000,
            cities: ["Hà Nội", "TP. Hồ Chí Minh"],
          },
          {
            id: "zone2",
            name: "Các tỉnh thành khác",
            description: "2-3 ngày làm việc",
            baseFee: 35000,
            cities: [],
          },
          {
            id: "zone3",
            name: "Vùng sâu, vùng xa",
            description: "3-7 ngày làm việc",
            baseFee: 50000,
            cities: [],
          },
        ],
        message: "Fallback shipping zones",
      };
    }
  },

  // NEW: Estimate delivery time
  estimateDeliveryTime: async (fromAddress, toAddress, shippingMethodId) => {
    try {
      console.log("Estimating delivery time:", {
        fromAddress,
        toAddress,
        shippingMethodId,
      });

      const response = await apiClient.post("/shipping/estimate-delivery", {
        fromAddress,
        toAddress,
        shippingMethodId,
      });
      return response;
    } catch (error) {
      console.error("Estimate delivery time error:", error);

      // Simple fallback estimation based on method
      let estimatedDays = 3; // default
      if (shippingMethodId === "express") {
        estimatedDays = 1;
      } else if (shippingMethodId === "standard") {
        estimatedDays = 4;
      } else if (shippingMethodId === "economy") {
        estimatedDays = 7;
      }

      const estimatedDate = new Date();
      estimatedDate.setDate(estimatedDate.getDate() + estimatedDays);

      return {
        success: true,
        data: {
          estimatedDays,
          estimatedDate: estimatedDate.toISOString().split("T")[0],
          confidence: "medium", // low/medium/high
        },
        message: "Fallback delivery estimation",
      };
    }
  },

  // NEW: Check service availability
  checkServiceAvailability: async (addressId) => {
    try {
      console.log("Checking service availability for address:", addressId);

      const response = await apiClient.get(
        `/shipping/availability?addressId=${addressId}`
      );
      return response;
    } catch (error) {
      console.error("Check service availability error:", error);

      // Fallback - assume all services available
      return {
        success: true,
        data: {
          standardDelivery: true,
          expressDelivery: true,
          codAvailable: true,
          installmentAvailable: false,
          restrictions: [],
        },
        message: "Fallback availability check",
      };
    }
  },
};
