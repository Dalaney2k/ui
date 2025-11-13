// utils/checkout.js

export const validateAddress = (address) => {
  const errors = {};
  const required = [
    "fullName",
    "phoneNumber",
    "addressLine1",
    "ward",
    "district",
    "city",
  ];

  required.forEach((field) => {
    if (!address[field]?.trim()) {
      errors[field] = getFieldErrorMessage(field);
    }
  });

  // Phone validation
  if (
    address.phoneNumber &&
    !/^[0-9+\-\s()]{10,15}$/.test(address.phoneNumber.replace(/\s/g, ""))
  ) {
    errors.phoneNumber = "Số điện thoại không hợp lệ";
  }

  // Name validation
  if (address.fullName && address.fullName.trim().length < 2) {
    errors.fullName = "Họ tên phải có ít nhất 2 ký tự";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateOrderData = (orderData) => {
  const errors = {};

  if (!orderData.selectedAddress) {
    errors.address = "Vui lòng chọn địa chỉ giao hàng";
  }

  if (!orderData.selectedShipping) {
    errors.shipping = "Vui lòng chọn phương thức vận chuyển";
  }

  if (!orderData.cart?.items?.length) {
    errors.cart = "Giỏ hàng trống";
  }

  if (!orderData.agreeTerms) {
    errors.terms = "Vui lòng đồng ý với điều khoản sử dụng";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const calculateCartTotals = (cartItems) => {
  const subtotal = cartItems.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0
  );

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const totalWeight = cartItems.reduce(
    (total, item) => total + (item.product?.weight || 0) * item.quantity,
    0
  );

  return {
    subtotal,
    itemCount,
    totalWeight,
  };
};

export const formatOrderForApi = (checkoutData, cart, orderSummary, user) => {
  return {
    customerId: user?.id,
    customerInfo: {
      fullName: user?.name,
      email: user?.email,
      phoneNumber: user?.phone,
    },
    items: cart.items.map((item) => ({
      productId: item.productId,
      productName: item.product?.name,
      productImage: item.product?.mainImage,
      productSku: item.product?.sku,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      weight: item.product?.weight || 0,
      dimensions: item.product?.dimensions,
    })),
    shippingAddress: checkoutData.selectedAddress,
    shippingMethod: {
      id: checkoutData.selectedShipping?.id,
      name: checkoutData.selectedShipping?.name,
      price: checkoutData.selectedShipping?.price || 0,
      estimatedDays: checkoutData.selectedShipping?.estimatedDays,
    },
    paymentMethod: {
      type: "COD",
      name: "Thanh toán khi nhận hàng",
    },
    pricing: {
      subtotal: orderSummary.subtotal,
      shippingFee: orderSummary.shippingFee,
      discount: orderSummary.discount,
      rewardPointsDiscount: orderSummary.rewardPointsDiscount,
      total: orderSummary.total,
    },
    coupon: checkoutData.appliedCoupon
      ? {
          code: checkoutData.appliedCoupon.code,
          discountAmount: checkoutData.appliedCoupon.discountAmount,
          discountType: checkoutData.appliedCoupon.type,
        }
      : null,
    rewardPoints: checkoutData.useRewardPoints
      ? {
          used: checkoutData.rewardPointsAmount,
          remainingBalance:
            (user?.points || 0) - checkoutData.rewardPointsAmount,
        }
      : null,
    notes: checkoutData.orderNotes?.trim() || "",
    metadata: {
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      source: "web_checkout",
    },
  };
};

export const getFieldErrorMessage = (field) => {
  const errorMessages = {
    fullName: "Vui lòng nhập họ và tên",
    phoneNumber: "Vui lòng nhập số điện thoại",
    addressLine1: "Vui lòng nhập địa chỉ chi tiết",
    ward: "Vui lòng nhập phường/xã",
    district: "Vui lòng nhập quận/huyện",
    city: "Vui lòng nhập tỉnh/thành phố",
    email: "Vui lòng nhập email",
  };

  return errorMessages[field] || "Thông tin không hợp lệ";
};

export const handleApiError = (error, fallbackMessage = "Có lỗi xảy ra") => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return fallbackMessage;
};

export const formatPhoneNumber = (phone) => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, "");

  // Format Vietnamese phone numbers
  if (cleaned.startsWith("84")) {
    // International format
    return `+84 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(
      8
    )}`;
  } else if (cleaned.startsWith("0")) {
    // National format
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }

  return phone;
};

export const validateCouponCode = (code) => {
  // Basic coupon code validation
  const trimmed = code.trim().toUpperCase();

  if (trimmed.length < 3) {
    return { valid: false, error: "Mã giảm giá phải có ít nhất 3 ký tự" };
  }

  if (!/^[A-Z0-9]+$/.test(trimmed)) {
    return { valid: false, error: "Mã giảm giá chỉ được chứa chữ cái và số" };
  }

  return { valid: true, code: trimmed };
};

export const calculateRewardPointsValue = (points, conversionRate = 1) => {
  // 1 point = 1 VND by default
  return points * conversionRate;
};

export const getEstimatedDeliveryDate = (
  shippingMethod,
  orderDate = new Date()
) => {
  const estimatedDays = shippingMethod?.estimatedDays || 5;
  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(deliveryDate.getDate() + estimatedDays);

  return deliveryDate;
};

export const checkoutSteps = [
  {
    id: 1,
    name: "delivery_info",
    title: "Thông tin giao hàng",
    description: "Chọn địa chỉ và phương thức vận chuyển",
  },
  {
    id: 2,
    name: "order_confirmation",
    title: "Xác nhận đơn hàng",
    description: "Kiểm tra và xác nhận thông tin đặt hàng",
  },
  {
    id: 3,
    name: "order_success",
    title: "Hoàn tất",
    description: "Đơn hàng đã được tạo thành công",
  },
];

export default {
  validateAddress,
  validateOrderData,
  calculateCartTotals,
  formatOrderForApi,
  getFieldErrorMessage,
  handleApiError,
  formatPhoneNumber,
  validateCouponCode,
  calculateRewardPointsValue,
  getEstimatedDeliveryDate,
  checkoutSteps,
};
