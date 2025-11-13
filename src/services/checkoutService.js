// src/services/checkoutService.js
import { orderService } from "./orderService";
import { shippingService } from "./shippingService";
import { addressService } from "./addressService";
import { couponService } from "./couponService";
import { userService } from "./userService";
import { cartService } from "./api";
import apiClient from "./api";

class CheckoutService {
  constructor() {
    this.currentCheckoutSession = null;
    // ✅ FREE SHIPPING THRESHOLD
    this.FREE_SHIPPING_THRESHOLD = 500000; // 500k VND
  }

  // =========================
  // CHECKOUT INITIALIZATION
  // =========================

  async initializeCheckout() {
    try {
      console.log("🚀 Initializing checkout...");

      // Get cart data
      const cartResponse = await cartService.getCart();
      if (!cartResponse.success || !cartResponse.data?.items?.length) {
        throw new Error("Giỏ hàng trống hoặc không hợp lệ");
      }

      // Validate cart inventory
      const inventoryCheck = await this.validateCartInventory(
        cartResponse.data.items
      );
      if (!inventoryCheck.valid) {
        throw new Error(
          `Một số sản phẩm không còn đủ hàng: ${inventoryCheck.unavailableItems.join(
            ", "
          )}`
        );
      }

      // Get user addresses
      const addressResponse = await addressService.getAddresses();
      const addresses = addressResponse.success ? addressResponse.data : [];

      // Initialize checkout session
      this.currentCheckoutSession = {
        cart: cartResponse.data,
        addresses,
        selectedAddress: addresses.find((addr) => addr.isDefault) || null,
        selectedShipping: null,
        appliedCoupon: null,
        orderSummary: {
          subtotal: cartResponse.data.summary?.total || 0,
          shippingFee: 0,
          discount: 0,
          rewardPointsDiscount: 0,
          total: cartResponse.data.summary?.total || 0,
        },
      };

      console.log("✅ Checkout initialized:", this.currentCheckoutSession);
      return {
        success: true,
        data: this.currentCheckoutSession,
      };
    } catch (error) {
      console.error("❌ Checkout initialization failed:", error);
      return {
        success: false,
        error: error.message || "Không thể khởi tạo checkout",
      };
    }
  }

  async validateCartInventory(cartItems) {
    try {
      const response = await cartService.validateCart();
      return {
        valid: response.success,
        unavailableItems: response.data?.unavailableItems || [],
        updatedPrices: response.data?.updatedPrices || [],
      };
    } catch (error) {
      console.error("❌ Inventory validation failed:", error);
      // Don't block checkout for inventory check failure
      return { valid: true, unavailableItems: [], updatedPrices: [] };
    }
  }

  // =========================
  // ADDRESS MANAGEMENT
  // =========================

  async getAddresses() {
    try {
      const response = await addressService.getAddresses();
      return {
        success: response.success,
        addresses: response.data || [],
      };
    } catch (error) {
      console.error("❌ Get addresses failed:", error);
      return {
        success: false,
        error: "Không thể tải danh sách địa chỉ",
        addresses: [],
      };
    }
  }

  async addAddress(addressData) {
    try {
      const response = await addressService.addAddress(addressData);
      if (response.success) {
        // Update session if exists
        if (this.currentCheckoutSession) {
          this.currentCheckoutSession.addresses.push(response.data);
        }
        return {
          success: true,
          address: response.data,
          message: "Thêm địa chỉ thành công",
        };
      }
      throw new Error(response.message || "Không thể thêm địa chỉ");
    } catch (error) {
      console.error("❌ Add address failed:", error);
      return {
        success: false,
        error: error.message || "Không thể thêm địa chỉ",
      };
    }
  }

  // ✅ FIXED: Properly update selected address
  async setSelectedAddress(address) {
    if (this.currentCheckoutSession) {
      this.currentCheckoutSession.selectedAddress = address;
      // Clear shipping method when address changes
      this.currentCheckoutSession.selectedShipping = null;
      await this.recalculateOrderSummary();
    }
    return { success: true };
  }

  // =========================
  // SHIPPING METHODS
  // =========================

  async getShippingMethods(addressId) {
    try {
      const response = await shippingService.getMethods(addressId);
      return {
        success: response.success,
        methods: response.data || [],
      };
    } catch (error) {
      console.error("❌ Get shipping methods failed:", error);
      return {
        success: false,
        error: "Không thể tải phương thức vận chuyển",
        methods: [],
      };
    }
  }

  async setSelectedShipping(shippingMethod) {
    if (this.currentCheckoutSession) {
      this.currentCheckoutSession.selectedShipping = shippingMethod;
      await this.recalculateOrderSummary();
    }
    return { success: true };
  }

  async calculateShippingFee(addressId, cartItems) {
    try {
      const response = await shippingService.calculateFee(addressId, cartItems);
      return {
        success: response.success,
        fee: response.data?.fee || 0,
        estimatedDays: response.data?.estimatedDays || 3,
      };
    } catch (error) {
      console.error("❌ Calculate shipping fee failed:", error);
      return {
        success: false,
        fee: 0,
        error: "Không thể tính phí vận chuyển",
      };
    }
  }

  // =========================
  // COUPON MANAGEMENT
  // =========================

  async validateCoupon(couponCode, orderTotal) {
    try {
      const cartItems = this.currentCheckoutSession?.cart?.items || [];
      const response = await couponService.validate(couponCode, cartItems);

      if (response.success) {
        return {
          success: true,
          coupon: {
            code: couponCode,
            discountAmount: response.data?.discountAmount || 0,
            discountType: response.data?.discountType || "fixed",
            description: response.data?.description || "",
          },
        };
      }

      throw new Error(response.message || "Mã giảm giá không hợp lệ");
    } catch (error) {
      console.error("❌ Validate coupon failed:", error);
      return {
        success: false,
        error: error.message || "Mã giảm giá không hợp lệ",
      };
    }
  }

  async applyCoupon(couponCode) {
    try {
      const validation = await this.validateCoupon(couponCode);
      if (!validation.success) {
        return validation;
      }

      // Apply coupon to session
      if (this.currentCheckoutSession) {
        this.currentCheckoutSession.appliedCoupon = validation.coupon;
        await this.recalculateOrderSummary();
      }

      return {
        success: true,
        coupon: validation.coupon,
        message: "Áp dụng mã giảm giá thành công",
      };
    } catch (error) {
      console.error("❌ Apply coupon failed:", error);
      return {
        success: false,
        error: error.message || "Không thể áp dụng mã giảm giá",
      };
    }
  }

  async removeCoupon() {
    if (this.currentCheckoutSession) {
      this.currentCheckoutSession.appliedCoupon = null;
      await this.recalculateOrderSummary();
    }
    return { success: true };
  }

  // =========================
  // REWARD POINTS
  // =========================

  async applyRewardPoints(pointsAmount) {
    try {
      // Simple 1:1 conversion (1 point = 1 VND)
      const discountAmount = Math.min(
        pointsAmount,
        this.currentCheckoutSession?.orderSummary?.subtotal || 0
      );

      if (this.currentCheckoutSession) {
        this.currentCheckoutSession.rewardPointsDiscount = discountAmount;
        await this.recalculateOrderSummary();
      }

      return {
        success: true,
        discountAmount,
        message: "Áp dụng điểm thưởng thành công",
      };
    } catch (error) {
      console.error("❌ Apply reward points failed:", error);
      return {
        success: false,
        error: "Không thể áp dụng điểm thưởng",
      };
    }
  }

  // =========================
  // ORDER CALCULATION
  // =========================

  async calculateOrderTotal(orderData) {
    try {
      const response = await orderService.calculateTotal({
        items:
          orderData.items || this.currentCheckoutSession?.cart?.items || [],
        shippingMethodId: orderData.shippingMethodId,
        shippingAddress: orderData.shippingAddress,
        couponCode: orderData.couponCode,
        rewardPoints: orderData.rewardPoints || 0,
      });

      return {
        success: response.success,
        summary: response.data,
      };
    } catch (error) {
      console.error("❌ Calculate order total failed:", error);
      return {
        success: false,
        error: "Không thể tính tổng đơn hàng",
      };
    }
  }

  // ✅ ENHANCED: Recalculate with free shipping logic
  async recalculateOrderSummary() {
    if (!this.currentCheckoutSession) return;

    try {
      const { cart, selectedShipping, appliedCoupon, rewardPointsDiscount } =
        this.currentCheckoutSession;

      // Calculate subtotal
      const subtotal =
        cart.items?.reduce(
          (sum, item) => sum + (item.price || item.unitPrice) * item.quantity,
          0
        ) || 0;

      // ✅ Calculate shipping fee with free shipping logic
      let shippingFee = 0;
      if (selectedShipping) {
        shippingFee = selectedShipping.price || 0;
        // Apply free shipping if order total >= threshold
        if (subtotal >= this.FREE_SHIPPING_THRESHOLD) {
          shippingFee = 0;
        }
      }

      // Calculate discount
      let discount = 0;
      if (appliedCoupon) {
        if (appliedCoupon.discountType === "percentage") {
          discount = (subtotal * appliedCoupon.discountAmount) / 100;
        } else {
          discount = appliedCoupon.discountAmount;
        }
      }

      // Apply reward points discount
      const rewardDiscount = rewardPointsDiscount || 0;

      // Calculate total
      const total = Math.max(
        0,
        subtotal + shippingFee - discount - rewardDiscount
      );

      this.currentCheckoutSession.orderSummary = {
        subtotal,
        shippingFee,
        discount,
        rewardPointsDiscount: rewardDiscount,
        total,
      };

      console.log(
        "🧮 Order summary recalculated:",
        this.currentCheckoutSession.orderSummary
      );
    } catch (error) {
      console.error("❌ Recalculate order summary failed:", error);
    }
  }

  // =========================
  // ORDER CREATION
  // =========================

  async validateOrderData() {
    if (!this.currentCheckoutSession) {
      return {
        valid: false,
        errors: { general: "Phiên checkout không hợp lệ" },
      };
    }

    const errors = {};
    const { selectedAddress, selectedShipping, cart } =
      this.currentCheckoutSession;

    if (!selectedAddress) {
      errors.address = "Vui lòng chọn địa chỉ giao hàng";
    }

    if (!selectedShipping) {
      errors.shipping = "Vui lòng chọn phương thức vận chuyển";
    }

    if (!cart?.items?.length) {
      errors.cart = "Giỏ hàng trống";
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }

  // ✅ ENHANCED: Clear cart after successful order + better error handling
  async createOrder(additionalData = {}) {
    try {
      console.log("📝 Creating order...");

      // Validate order data
      const validation = await this.validateOrderData();
      if (!validation.valid) {
        return {
          success: false,
          errors: validation.errors,
        };
      }

      // Validate order on server
      const orderValidation = await orderService.validateOrder(
        this.formatOrderForApi(additionalData)
      );
      if (!orderValidation.success) {
        return {
          success: false,
          error: orderValidation.message || "Đơn hàng không hợp lệ",
        };
      }

      // Create order
      const orderResponse = await orderService.createOrder(
        this.formatOrderForApi(additionalData)
      );

      if (orderResponse.success) {
        // ✅ CLEAR CART AFTER SUCCESSFUL ORDER
        try {
          await cartService.clearCart();
          console.log("🛒 Cart cleared after successful order");
        } catch (clearError) {
          console.warn("⚠️ Failed to clear cart:", clearError);
          // Don't fail the order creation because of cart clear failure
        }

        // Clear checkout session
        this.currentCheckoutSession = null;

        return {
          success: true,
          order: orderResponse.data,
          message: "Đặt hàng thành công",
        };
      }

      throw new Error(orderResponse.message || "Không thể tạo đơn hàng");
    } catch (error) {
      console.error("❌ Create order failed:", error);
      return {
        success: false,
        error: error.message || "Có lỗi xảy ra khi tạo đơn hàng",
      };
    }
  }

  formatOrderForApi(additionalData = {}) {
    if (!this.currentCheckoutSession) return {};

    const {
      cart,
      selectedAddress,
      selectedShipping,
      appliedCoupon,
      orderSummary,
    } = this.currentCheckoutSession;
    const user = userService.getStoredUser();

    return {
      customerId: user?.id,
      customerInfo: {
        fullName: user?.name || selectedAddress?.fullName,
        email: user?.email,
        phoneNumber: user?.phone || selectedAddress?.phoneNumber,
      },
      items: cart.items.map((item) => ({
        productId: item.productId || item.id,
        productName: item.name,
        quantity: item.quantity,
        unitPrice: item.price || item.unitPrice,
        totalPrice: (item.price || item.unitPrice) * item.quantity,
        customOptions: item.customOptions || {},
      })),
      shippingAddress: selectedAddress,
      shippingMethod: {
        id: selectedShipping?.id,
        name: selectedShipping?.name,
        price: selectedShipping?.price || 0,
        estimatedDays: selectedShipping?.estimatedDays,
      },
      paymentMethod: {
        type: "COD",
        name: "Thanh toán khi nhận hàng",
      },
      pricing: orderSummary,
      coupon: appliedCoupon,
      notes: additionalData.notes || "",
      ...additionalData,
    };
  }

  // =========================
  // UTILITY METHODS
  // =========================

  getCurrentSession() {
    return this.currentCheckoutSession;
  }

  clearSession() {
    this.currentCheckoutSession = null;
  }

  getOrderSummary() {
    return (
      this.currentCheckoutSession?.orderSummary || {
        subtotal: 0,
        shippingFee: 0,
        discount: 0,
        rewardPointsDiscount: 0,
        total: 0,
      }
    );
  }

  getProgress() {
    if (!this.currentCheckoutSession) return 0;

    let progress = 25; // Initialized

    if (this.currentCheckoutSession.selectedAddress) progress += 25;
    if (this.currentCheckoutSession.selectedShipping) progress += 25;
    if (this.currentCheckoutSession.cart?.items?.length) progress += 25;

    return progress;
  }

  // ✅ NEW: Free shipping helper
  isEligibleForFreeShipping(subtotal) {
    return subtotal >= this.FREE_SHIPPING_THRESHOLD;
  }

  getFreeShippingThreshold() {
    return this.FREE_SHIPPING_THRESHOLD;
  }

  getRemainingForFreeShipping(subtotal) {
    if (subtotal >= this.FREE_SHIPPING_THRESHOLD) return 0;
    return this.FREE_SHIPPING_THRESHOLD - subtotal;
  }
}

// Create singleton instance
const checkoutService = new CheckoutService();

export { checkoutService };
export default checkoutService;
