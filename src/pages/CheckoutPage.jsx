import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Package, AlertCircle, X } from "lucide-react";
import { addressService } from "../services/addressService";
import { shippingService } from "../services/shippingService";
import { couponService } from "../services/couponService";
import { orderService } from "../services/orderService";
import { cartService } from "../services/api";
import CartContext from "../contexts/CartContext";

// Import components
import CheckoutHeader from "../components/Checkout/CheckoutHeader";
import Step1DeliveryInfo from "../components/Checkout/CheckoutSteps/Step1DeliveryInfo";
import Step2OrderConfirmation from "../components/Checkout/CheckoutSteps/Step2OrderConfirmation";
import Step3OrderSuccess from "../components/Checkout/CheckoutSteps/Step3OrderSuccess";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // FIXED: Sử dụng method mới để xóa chỉ checkout items
  const { removeSpecificItemsFromCart, clearSelection, loadCart } =
    useContext(CartContext);

  // Main states
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState({
    init: true,
    addresses: false,
    shipping: false,
    coupon: false,
    order: false,
  });
  const [errors, setErrors] = useState({});

  const FREE_SHIPPING_THRESHOLD = 500000;

  // Checkout data that includes checkoutItems from navigation
  const [checkoutData, setCheckoutData] = useState({
    cart: null,
    checkoutItems: [], // These are the selected items from cart
    addresses: [],
    selectedAddress: null,
    selectedShipping: null,
    shippingMethods: [],
    appliedCoupon: null,
    orderSummary: {
      subtotal: 0,
      shippingFee: 0,
      discount: 0,
      rewardPointsDiscount: 0,
      total: 0,
    },
  });

  // Step 2 specific states
  const [orderNotes, setOrderNotes] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Step 3 state
  const [orderResult, setOrderResult] = useState(null);

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [useRewardPoints, setUseRewardPoints] = useState(false);
  const [rewardPointsAmount, setRewardPointsAmount] = useState(0);

  // Initialize checkout items from navigation state
  useEffect(() => {
    const { checkoutItems: navCheckoutItems, source } = location.state || {};

    console.log("🚀 Navigation state:", location.state);

    if (navCheckoutItems && navCheckoutItems.length > 0) {
      console.log("✅ Found checkout items from navigation:", navCheckoutItems);
      console.log("📦 Source:", source);

      setCheckoutData((prev) => ({
        ...prev,
        checkoutItems: navCheckoutItems,
      }));
    } else {
      console.warn("⚠️ No checkout items found, redirecting to cart");
      navigate("/cart");
      return;
    }
  }, [location.state, navigate]);

  const calculateInitialSummary = (checkoutItems) => {
    if (!checkoutItems?.length)
      return {
        subtotal: 0,
        shippingFee: 0,
        discount: 0,
        rewardPointsDiscount: 0,
        total: 0,
      };

    const subtotal = checkoutItems.reduce(
      (total, item) =>
        total + (item.price || item.unitPrice || 0) * (item.quantity || 0),
      0
    );

    return {
      subtotal,
      shippingFee: 0,
      discount: 0,
      rewardPointsDiscount: 0,
      total: subtotal,
    };
  };

  const initializeCheckout = async () => {
    setLoading((prev) => ({ ...prev, init: true }));
    try {
      console.log(
        "Initializing checkout with items:",
        checkoutData.checkoutItems
      );

      if (!checkoutData.checkoutItems?.length) {
        console.warn("No checkout items available for initialization");
        return;
      }

      const addressResponse = await addressService.getAddresses();
      console.log("Address response:", addressResponse);

      const addresses = addressResponse.success
        ? addressResponse.data || []
        : [];
      const defaultAddress =
        addresses.find((addr) => addr.isDefault) || addresses[0] || null;

      const initialSummary = calculateInitialSummary(
        checkoutData.checkoutItems
      );

      setCheckoutData((prev) => ({
        ...prev,
        addresses,
        selectedAddress: defaultAddress,
        selectedShipping: null,
        shippingMethods: [],
        appliedCoupon: null,
        orderSummary: initialSummary,
      }));

      setErrors({});
      console.log(
        "Checkout initialized successfully with",
        checkoutData.checkoutItems.length,
        "items"
      );
    } catch (error) {
      console.error("Checkout initialization failed:", error);
      setErrors({
        general:
          error.message || "Không thể khởi tạo checkout. Vui lòng thử lại.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, init: false }));
    }
  };

  // Initialize checkout when checkoutItems are available
  useEffect(() => {
    if (checkoutData.checkoutItems.length > 0) {
      initializeCheckout();
    }
  }, [checkoutData.checkoutItems.length]);

  // Handle quantity changes in checkout
  const handleUpdateCheckoutItems = (updatedItems) => {
    console.log("🔄 Updating checkout items:", updatedItems);
    setCheckoutData((prev) => ({
      ...prev,
      checkoutItems: updatedItems,
    }));
  };

  // Remove item from checkout
  const handleRemoveFromCheckout = (productId, productVariantId) => {
    const newCheckoutItems = checkoutData.checkoutItems.filter(
      (item) =>
        !(
          item.productId === productId &&
          (item.productVariantId || null) === (productVariantId || null)
        )
    );

    console.log(
      "🗑️ Removing item from checkout. Remaining items:",
      newCheckoutItems.length
    );

    if (newCheckoutItems.length === 0) {
      console.log("⬅️ No items left, redirecting to cart");
      navigate("/cart");
      return;
    }

    setCheckoutData((prev) => ({
      ...prev,
      checkoutItems: newCheckoutItems,
    }));

    updateOrderSummary();
  };

  const loadShippingMethods = async (addressId) => {
    if (!addressId) return;

    setLoading((prev) => ({ ...prev, shipping: true }));
    try {
      console.log("Loading shipping methods for address:", addressId);

      const result = await shippingService.getMethods(addressId);
      console.log("Shipping methods result:", result);

      if (result.success) {
        setCheckoutData((prev) => ({
          ...prev,
          shippingMethods: result.data || [],
          selectedShipping: result.data?.[0] || null,
        }));

        updateOrderSummary(result.data?.[0]);
      } else {
        setErrors((prev) => ({
          ...prev,
          shipping: result.message || "Không thể tải phương thức vận chuyển",
        }));
      }
    } catch (error) {
      console.error("Load shipping methods failed:", error);
      setErrors((prev) => ({
        ...prev,
        shipping: "Không thể tải phương thức vận chuyển",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, shipping: false }));
    }
  };

  // Enhanced order summary calculation
  const updateOrderSummary = (shippingMethod = null) => {
    const shipping = shippingMethod || checkoutData.selectedShipping;
    const { checkoutItems, appliedCoupon } = checkoutData;

    if (!checkoutItems?.length) return;

    const subtotal = checkoutItems.reduce(
      (total, item) =>
        total + (item.price || item.unitPrice || 0) * (item.quantity || 0),
      0
    );

    let shippingFee = shipping?.price || 0;
    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      shippingFee = 0;
    }

    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.type === "percentage") {
        discount = (subtotal * (appliedCoupon.discountAmount || 0)) / 100;
      } else {
        discount = appliedCoupon.discountAmount || 0;
      }
    }

    const rewardPointsDiscount = useRewardPoints ? rewardPointsAmount : 0;
    const total = Math.max(
      0,
      subtotal + shippingFee - discount - rewardPointsDiscount
    );

    const newSummary = {
      subtotal,
      shippingFee,
      discount,
      rewardPointsDiscount,
      total,
    };

    setCheckoutData((prev) => ({
      ...prev,
      orderSummary: newSummary,
    }));

    console.log("Order summary updated:", newSummary);
  };

  // Load shipping methods when address changes
  useEffect(() => {
    if (checkoutData.selectedAddress?.id) {
      loadShippingMethods(checkoutData.selectedAddress.id);
    }
  }, [checkoutData.selectedAddress]);

  // Recalculate when dependencies change
  useEffect(() => {
    updateOrderSummary();
  }, [
    checkoutData.selectedShipping,
    checkoutData.appliedCoupon,
    useRewardPoints,
    rewardPointsAmount,
    checkoutData.checkoutItems,
  ]);

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Cần đăng nhập
          </h2>
          <p className="text-gray-600 mb-6">
            Vui lòng đăng nhập để tiếp tục thanh toán
          </p>
          <button
            onClick={() => navigate("/login?redirect=/checkout")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  // Address and shipping handlers
  const handleSelectAddress = (address) => {
    console.log("Address selected:", address);
    setCheckoutData((prev) => ({
      ...prev,
      selectedAddress: address,
      selectedShipping: null,
      shippingMethods: [],
    }));
  };

  const handleAddAddress = async (addressData) => {
    setLoading((prev) => ({ ...prev, addresses: true }));
    try {
      const result = await addressService.addAddress(addressData);

      if (result.success) {
        setCheckoutData((prev) => ({
          ...prev,
          addresses: [...prev.addresses, result.data],
          selectedAddress: result.data,
        }));

        return { success: true, address: result.data };
      } else {
        return {
          success: false,
          error: result.message || "Không thể thêm địa chỉ",
        };
      }
    } catch (error) {
      return { success: false, error: "Không thể thêm địa chỉ" };
    } finally {
      setLoading((prev) => ({ ...prev, addresses: false }));
    }
  };

  const handleSelectShipping = (shippingMethod) => {
    console.log("Shipping method selected:", shippingMethod);
    setCheckoutData((prev) => ({ ...prev, selectedShipping: shippingMethod }));
  };

  // Coupon handlers
  const handleApplyCoupon = async () => {
    if (!couponCode.trim())
      return { success: false, error: "Vui lòng nhập mã giảm giá" };

    setLoading((prev) => ({ ...prev, coupon: true }));
    try {
      const result = await couponService.validate(
        couponCode,
        checkoutData.checkoutItems || []
      );

      if (result.success) {
        const coupon = {
          code: couponCode,
          discountAmount: result.data?.discountAmount || 0,
          type: result.data?.discountType || "fixed",
          description: result.data?.description || "",
        };

        setCheckoutData((prev) => ({ ...prev, appliedCoupon: coupon }));
        setCouponCode("");
        return { success: true, message: "Áp dụng mã giảm giá thành công" };
      } else {
        return {
          success: false,
          error: result.message || "Mã giảm giá không hợp lệ",
        };
      }
    } catch (error) {
      return { success: false, error: "Không thể áp dụng mã giảm giá" };
    } finally {
      setLoading((prev) => ({ ...prev, coupon: false }));
    }
  };

  const handleRemoveCoupon = () => {
    setCheckoutData((prev) => ({ ...prev, appliedCoupon: null }));
  };

  // Reward points handlers
  const handleRewardPointsChange = (checked) => {
    setUseRewardPoints(checked);

    if (checked && user?.points > 0) {
      const maxPoints = Math.min(
        user.points,
        checkoutData.orderSummary.subtotal
      );
      setRewardPointsAmount(maxPoints);
    } else {
      setRewardPointsAmount(0);
    }
  };

  const handleRewardPointsAmountChange = (amount) => {
    setRewardPointsAmount(amount);
  };

  // Navigation handlers
  const handleNextStep = (stepData = {}) => {
    const errors = {};

    if (step === 1) {
      if (!checkoutData.selectedAddress) {
        errors.address = "Vui lòng chọn địa chỉ giao hàng";
      }
      if (!checkoutData.selectedShipping) {
        errors.shipping = "Vui lòng chọn phương thức vận chuyển";
      }
      if (!checkoutData.checkoutItems?.length) {
        errors.items = "Không có sản phẩm để thanh toán";
      }

      if (stepData.checkoutItems) {
        setCheckoutData((prev) => ({
          ...prev,
          checkoutItems: stepData.checkoutItems,
        }));
      }
    }

    if (step === 2) {
      if (!agreeTerms) {
        errors.terms = "Vui lòng đồng ý với điều khoản sử dụng";
      }
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return false;
    }

    setErrors({});
    setStep((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return true;
  };

  const handlePrevStep = (targetStep) => {
    setStep(targetStep || step - 1);
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // FIXED: Order creation với selective cart removal
  const handleCreateOrder = async () => {
    setLoading((prev) => ({ ...prev, order: true }));
    try {
      console.log("Bắt đầu tạo đơn hàng với checkout items...");

      // Validation
      if (!checkoutData.selectedAddress) {
        setErrors({ general: "Thiếu thông tin địa chỉ giao hàng" });
        return { success: false, message: "Thiếu thông tin địa chỉ giao hàng" };
      }

      if (!checkoutData.selectedShipping) {
        setErrors({ general: "Thiếu thông tin phương thức vận chuyển" });
        return {
          success: false,
          message: "Thiếu thông tin phương thức vận chuyển",
        };
      }

      if (!checkoutData.checkoutItems?.length) {
        setErrors({ general: "Không có sản phẩm để thanh toán" });
        return { success: false, message: "Không có sản phẩm để thanh toán" };
      }

      if (!agreeTerms) {
        setErrors({ general: "Vui lòng đồng ý với điều khoản sử dụng" });
        return {
          success: false,
          message: "Vui lòng đồng ý với điều khoản sử dụng",
        };
      }

      // Create order payload with ONLY checkout items
      const orderData = {
        items: checkoutData.checkoutItems.map((item) => ({
          productId: parseInt(item.productId || item.id),
          quantity: parseInt(item.quantity),
          productVariantId: item.productVariantId
            ? parseInt(item.productVariantId)
            : undefined,
          customOptions: item.customOptions || "{}",
        })),
        shippingAddressId: parseInt(checkoutData.selectedAddress.id),
        paymentMethod: "COD",
        billingAddressId: parseInt(checkoutData.selectedAddress.id),
        couponCode: checkoutData.appliedCoupon?.code || undefined,
        orderNotes: orderNotes.trim() || undefined,
        savePaymentInfo: false,
        expressDelivery:
          checkoutData.selectedShipping?.name
            ?.toLowerCase()
            .includes("express") || false,
        giftWrap: false,
      };

      console.log("Final order payload:", JSON.stringify(orderData, null, 2));

      // Create order
      const result = await orderService.createOrder(orderData);
      console.log("Order creation result:", result);

      if (result.success) {
        console.log("✅ Đơn hàng được tạo thành công:", result.data);

        // FIXED: Xóa chỉ checkout items khỏi cart, không phải toàn bộ cart
        try {
          console.log("🗑️ Đang xóa checkout items khỏi giỏ hàng...");

          const removeResult = await removeSpecificItemsFromCart(
            checkoutData.checkoutItems
          );

          if (removeResult.success) {
            console.log(
              "✅ Đã xóa checkout items khỏi giỏ hàng:",
              removeResult.message
            );
          } else {
            console.warn(
              "⚠️ Không thể xóa một số items:",
              removeResult.message
            );
            // Không fail toàn bộ checkout vì order đã tạo thành công
          }
        } catch (cartError) {
          console.warn("⚠️ Lỗi khi cập nhật cart:", cartError);
          // Không fail toàn bộ checkout vì order đã tạo thành công
        }

        // Clear selection in context (nếu có)
        if (clearSelection) {
          clearSelection();
        }

        // Go to success step
        setOrderResult(result.data);
        setStep(3);
        window.scrollTo({ top: 0, behavior: "smooth" });
        setErrors({});

        return { success: true };
      } else {
        const errorMsg = result.message || "Không thể tạo đơn hàng";
        console.error("Order creation failed:", errorMsg);
        setErrors({ general: errorMsg });
        return { success: false, message: errorMsg };
      }
    } catch (error) {
      console.error("Create order failed:", error);

      let errorMsg = "Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.";

      if (
        error.message.includes("validation") ||
        error.message.includes("dữ liệu")
      ) {
        errorMsg = error.message;
      } else if (error.message.includes("đăng nhập")) {
        errorMsg = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
      } else if (error.message.includes("quyền")) {
        errorMsg = "Bạn không có quyền thực hiện thao tác này.";
      } else if (error.message.includes("kết nối")) {
        errorMsg = "Lỗi kết nối. Vui lòng kiểm tra internet và thử lại.";
      } else if (error.message) {
        errorMsg = error.message;
      }

      setErrors({ general: errorMsg });
      return { success: false, message: errorMsg };
    } finally {
      setLoading((prev) => ({ ...prev, order: false }));
    }
  };

  const handleBackToProducts = () => {
    navigate("/products");
  };

  // Show loading screen
  if (loading.init) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600">Đang khởi tạo checkout...</div>
        </div>
      </div>
    );
  }

  // Redirect if no checkout items
  if (!checkoutData.checkoutItems?.length && step < 3) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Không có sản phẩm
          </h2>
          <p className="text-gray-600 mb-6">
            Chọn sản phẩm từ giỏ hàng để tiếp tục thanh toán
          </p>
          <button
            onClick={() => navigate("/cart")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all mr-4"
          >
            Quay lại giỏ hàng
          </button>
          <button
            onClick={handleBackToProducts}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <CheckoutHeader
        step={step}
        onBackToProducts={handleBackToProducts}
        cart={{ items: checkoutData.checkoutItems }}
        orderSummary={checkoutData.orderSummary}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Global Error Display */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <div className="font-medium">Có lỗi xảy ra:</div>
              <div>{errors.general}</div>
            </div>
          </div>
        )}

        {/* Step Components */}
        {step === 1 && (
          <Step1DeliveryInfo
            cart={{ items: checkoutData.checkoutItems }}
            user={user}
            orderSummary={checkoutData.orderSummary}
            onOrderSummaryUpdate={(summary) =>
              setCheckoutData((prev) => ({ ...prev, orderSummary: summary }))
            }
            onNextStep={handleNextStep}
            onUpdateCheckoutItems={handleUpdateCheckoutItems}
            addresses={checkoutData.addresses}
            selectedAddress={checkoutData.selectedAddress}
            onSelectAddress={handleSelectAddress}
            onAddAddress={handleAddAddress}
            selectedShipping={checkoutData.selectedShipping}
            shippingMethods={checkoutData.shippingMethods}
            onSelectShipping={handleSelectShipping}
            onLoadShippingMethods={loadShippingMethods}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            appliedCoupon={checkoutData.appliedCoupon}
            onApplyCoupon={handleApplyCoupon}
            onRemoveCoupon={handleRemoveCoupon}
            useRewardPoints={useRewardPoints}
            setUseRewardPoints={handleRewardPointsChange}
            rewardPointsAmount={rewardPointsAmount}
            setRewardPointsAmount={handleRewardPointsAmountChange}
            errors={errors}
            loading={loading}
          />
        )}

        {step === 2 && (
          <Step2OrderConfirmation
            selectedAddress={checkoutData.selectedAddress}
            selectedShipping={checkoutData.selectedShipping}
            appliedCoupon={checkoutData.appliedCoupon}
            orderNotes={orderNotes}
            setOrderNotes={setOrderNotes}
            agreeTerms={agreeTerms}
            setAgreeTerms={setAgreeTerms}
            cart={{ items: checkoutData.checkoutItems }}
            orderSummary={checkoutData.orderSummary}
            useRewardPoints={useRewardPoints}
            rewardPointsAmount={rewardPointsAmount}
            onPrevStep={handlePrevStep}
            onCreateOrder={handleCreateOrder}
            loading={loading.order}
            user={user}
          />
        )}

        {step === 3 && orderResult && (
          <Step3OrderSuccess
            orderResult={orderResult}
            onContinueShopping={() => navigate("/products")}
            onViewOrder={(orderId) => navigate(`/orders/${orderId}`)}
          />
        )}
      </div>

      {/* Mobile Navigation */}
      {step === 1 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
          <button
            onClick={handleNextStep}
            disabled={
              !checkoutData.selectedAddress ||
              !checkoutData.selectedShipping ||
              !checkoutData.checkoutItems?.length ||
              loading.shipping
            }
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading.shipping ? "Đang tải..." : "Tiếp tục"}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
          <div className="flex space-x-3">
            <button
              onClick={() => handlePrevStep(1)}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium"
            >
              Quay lại
            </button>
            <button
              onClick={handleCreateOrder}
              disabled={loading.order || !agreeTerms}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading.order ? "Đang xử lý..." : "Đặt hàng"}
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Padding */}
      {(step === 1 || step === 2) && <div className="lg:hidden h-20"></div>}

      {/* Loading Overlay */}
      {loading.order && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-700">Đang xử lý đơn hàng...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
