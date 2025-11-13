// src/hooks/useCheckout.js - Updated for 2-Step Flow
import { useState, useEffect, useCallback } from "react";
import { useCartManagement } from "./useCartManagement";
import { useAuth } from "./useAuth";
import { orderService } from "../services/orderService";
import { addressService } from "../services/addressService";
import { shippingService } from "../services/shippingService";
import { couponService } from "../services/couponService";

export const useCheckout = () => {
  const { cart, actions: cartActions } = useCartManagement();
  const { user } = useAuth();

  // States - Updated for 2-step flow
  const [step, setStep] = useState(1); // 1: Delivery Info, 2: Confirmation, 3: Success
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [orderResult, setOrderResult] = useState(null);

  // Data states
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [orderNotes, setOrderNotes] = useState("");
  const [useRewardPoints, setUseRewardPoints] = useState(false);
  const [rewardPointsAmount, setRewardPointsAmount] = useState(0);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");

  // Order summary
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shippingFee: 0,
    discount: 0,
    rewardPointsDiscount: 0,
    tax: 0,
    total: 0,
  });

  // Load initial data
  const loadInitialData = useCallback(async () => {
    if (!user || cart.isEmpty) return;

    try {
      setLoading(true);

      // Load addresses
      const addressesRes = await addressService.getAddresses();
      if (addressesRes.success) {
        setAddresses(addressesRes.data || []);
        // Auto-select default address
        const defaultAddress = addressesRes.data?.find(
          (addr) => addr.isDefault
        );
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
          loadShippingMethods(defaultAddress.id);
        }
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
      setErrors({ general: "Không thể tải dữ liệu. Vui lòng thử lại." });
    } finally {
      setLoading(false);
    }
  }, [user, cart.isEmpty]);

  // Load shipping methods - Always set COD
  const loadShippingMethods = useCallback(async (addressId) => {
    try {
      // For COD-optimized flow, always set COD as default
      const codMethod = {
        id: "cod",
        name: "Thanh toán khi nhận hàng (COD)",
        description: "3-5 ngày làm việc",
        price: 30000,
        icon: "📦",
      };
      setSelectedShipping(codMethod);

      // Optional: Try to get from API as fallback
      const response = await shippingService.getMethods(addressId);
      if (response.success && response.data?.length > 0) {
        // Keep COD as selected but update if needed
        const codFromAPI = response.data.find((method) => method.id === "cod");
        if (codFromAPI) {
          setSelectedShipping(codFromAPI);
        }
      }
    } catch (error) {
      console.error("Error loading shipping methods:", error);
      // Keep the fallback COD method
    }
  }, []);

  // Calculate order total
  const calculateOrderTotal = useCallback(async () => {
    if (!selectedAddress || !selectedShipping || cart.isEmpty) return;

    try {
      const items = cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }));

      const data = {
        items,
        shippingAddressId: selectedAddress?.id,
        couponCode: appliedCoupon?.code,
        useRewardPoints,
        rewardPointsAmount: useRewardPoints ? rewardPointsAmount : 0,
      };

      const response = await orderService.calculateTotal(data);

      if (response.success) {
        setOrderSummary({
          subtotal: response.data.subtotal || cart.total,
          shippingFee: response.data.shippingFee || selectedShipping.price,
          discount: response.data.discount || 0,
          rewardPointsDiscount: response.data.rewardPointsDiscount || 0,
          tax: response.data.tax || 0,
          total: response.data.total || cart.total + selectedShipping.price,
        });
      }
    } catch (error) {
      console.error("Error calculating total:", error);
      // Fallback calculation
      const shippingFee = selectedShipping?.price || 0;
      const discount = appliedCoupon?.discountAmount || 0;
      const rewardDiscount = useRewardPoints ? rewardPointsAmount : 0;

      setOrderSummary({
        subtotal: cart.total,
        shippingFee,
        discount,
        rewardPointsDiscount: rewardDiscount,
        tax: 0,
        total: Math.max(
          0,
          cart.total + shippingFee - discount - rewardDiscount
        ),
      });
    }
  }, [
    selectedAddress,
    selectedShipping,
    appliedCoupon,
    useRewardPoints,
    rewardPointsAmount,
    cart,
  ]);

  // Apply coupon
  const applyCoupon = useCallback(
    async (couponCode) => {
      if (!couponCode.trim())
        return { success: false, message: "Vui lòng nhập mã giảm giá" };

      try {
        setLoading(true);
        const response = await couponService.validate(couponCode, cart.items);

        if (response.success) {
          setAppliedCoupon(response.data);
          setErrors({ ...errors, coupon: null });
          return { success: true, message: "Áp dụng mã giảm giá thành công" };
        } else {
          return {
            success: false,
            message: response.message || "Mã giảm giá không hợp lệ",
          };
        }
      } catch (error) {
        return { success: false, message: "Không thể áp dụng mã giảm giá" };
      } finally {
        setLoading(false);
      }
    },
    [cart.items, errors]
  );

  // Add address
  const addAddress = useCallback(
    async (addressData) => {
      try {
        setLoading(true);
        const response = await addressService.addAddress(addressData);

        if (response.success) {
          const newAddress = response.data;
          setAddresses((prev) => [...prev, newAddress]);
          setSelectedAddress(newAddress);
          await loadShippingMethods(newAddress.id);
          return { success: true, address: newAddress };
        } else {
          return {
            success: false,
            message: response.message || "Không thể thêm địa chỉ",
          };
        }
      } catch (error) {
        return { success: false, message: "Lỗi khi thêm địa chỉ" };
      } finally {
        setLoading(false);
      }
    },
    [loadShippingMethods]
  );

  // Create order
  const createOrder = useCallback(async () => {
    try {
      setLoading(true);

      // Validate order first
      const items = cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      const validateData = {
        items,
        shippingAddressId: selectedAddress?.id,
        couponCode: appliedCoupon?.code,
      };

      const validateResponse = await orderService.validateOrder(validateData);
      if (!validateResponse.success || !validateResponse.data.isValid) {
        return {
          success: false,
          message: "Đơn hàng không hợp lệ. Vui lòng kiểm tra lại.",
        };
      }

      // Create order
      const orderData = {
        shippingAddressId: selectedAddress.id,
        billingAddressId: selectedAddress.id,
        paymentMethod: "COD", // Always COD for this flow
        shippingMethod: selectedShipping.id,
        couponCode: appliedCoupon?.code,
        notes: orderNotes,
        useRewardPoints,
        rewardPointsAmount: useRewardPoints ? rewardPointsAmount : 0,
        items: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          customOptions: item.customOptions || {},
        })),
      };

      const response = await orderService.createOrder(orderData);

      if (response.success) {
        setOrderResult(response.data);
        setStep(3); // Success step

        // Clear cart
        await cartActions.clearAll(true);

        return { success: true, order: response.data };
      } else {
        return {
          success: false,
          message: response.message || "Không thể tạo đơn hàng",
        };
      }
    } catch (error) {
      console.error("Create order error:", error);
      return {
        success: false,
        message: "Lỗi khi tạo đơn hàng. Vui lòng thử lại.",
      };
    } finally {
      setLoading(false);
    }
  }, [
    selectedAddress,
    selectedShipping,
    appliedCoupon,
    orderNotes,
    useRewardPoints,
    rewardPointsAmount,
    cart.items,
    cartActions,
  ]);

  // Step navigation for 2-step flow
  const nextStep = useCallback(() => {
    setErrors({});

    if (step === 1) {
      // Validate Step 1: Delivery Information
      if (!selectedAddress) {
        setErrors({ address: "Vui lòng chọn địa chỉ giao hàng" });
        return false;
      }
      if (!selectedShipping) {
        setErrors({ shipping: "Vui lòng chọn phương thức vận chuyển" });
        return false;
      }
      // Move to Step 2: Confirmation
      setStep(2);
      return true;
    }

    return false;
  }, [step, selectedAddress, selectedShipping]);

  const prevStep = useCallback((targetStep) => {
    if (targetStep) {
      setStep(targetStep);
    } else {
      setStep((prev) => Math.max(1, prev - 1));
    }
  }, []);

  // Effects
  useEffect(() => {
    if (user && cart.hasItems) {
      loadInitialData();
    }
  }, [user, cart.hasItems, loadInitialData]);

  useEffect(() => {
    calculateOrderTotal();
  }, [calculateOrderTotal]);

  return {
    // States
    step,
    loading,
    errors,
    orderResult,

    // Data
    addresses,
    selectedAddress,
    selectedShipping,
    appliedCoupon,
    orderNotes,
    useRewardPoints,
    rewardPointsAmount,
    orderSummary,
    couponCode,

    // Setters
    setSelectedAddress,
    setOrderNotes,
    setUseRewardPoints,
    setRewardPointsAmount,
    setAppliedCoupon,
    setErrors,
    setCouponCode,

    // Actions
    loadShippingMethods,
    applyCoupon,
    addAddress,
    createOrder,
    nextStep,
    prevStep,

    // Utils
    cart,
    user,
  };
};
