// components/Cart/AddToCartButton.jsx
import React, { useState } from "react";
import { useCartManagement } from "../../hooks/useCartManagement";

const AddToCartButton = ({
  product,
  quantity = 1,
  customOptions = {},
  className = "",
  disabled = false,
  showSuccessMessage = true,
  onSuccess = null,
  onError = null,
  children = null,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const { actions, utils } = useCartManagement();

  const handleAddToCart = async (e) => {
    // Prevent event bubbling to parent elements
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    if (!product || !product.id || disabled || isAdding) return;

    try {
      setIsAdding(true);

      console.log("🛒 AddToCartButton: Adding to cart", {
        product: product.name,
        quantity,
        customOptions,
      });

      const result = await actions.addItem(product, quantity, customOptions);

      if (result.success) {
        if (showSuccessMessage && window.showNotification) {
          window.showNotification(
            result.message || "Đã thêm sản phẩm vào giỏ hàng",
            "success"
          );
        }

        if (onSuccess) {
          onSuccess(result);
        }
      } else {
        if (window.showNotification) {
          window.showNotification(
            result.message || "Không thể thêm sản phẩm vào giỏ hàng",
            "error"
          );
        }

        if (onError) {
          onError(result);
        }
      }
    } catch (error) {
      console.error("❌ AddToCartButton error:", error);

      if (window.showNotification) {
        window.showNotification("Có lỗi xảy ra khi thêm vào giỏ hàng", "error");
      }

      if (onError) {
        onError({ success: false, message: error.message });
      }
    } finally {
      setIsAdding(false);
    }
  };

  // Check if product is already in cart
  const { isInCart, quantity: cartQuantity } = utils.getProductCartInfo(
    product?.id
  );

  // Determine button state
  const isOutOfStock = product?.stock !== undefined && product.stock <= 0;
  const isOverStock = product?.stock !== undefined && quantity > product.stock;
  const isButtonDisabled = disabled || isAdding || isOutOfStock || isOverStock;

  // Button text logic
  const getButtonText = () => {
    if (isAdding) return "Đang thêm...";
    if (isOutOfStock) return "Hết hàng";
    if (isOverStock) return `Chỉ còn ${product.stock}`;
    if (isInCart) return `Thêm nữa (${cartQuantity} trong giỏ)`;
    return "Thêm vào giỏ";
  };

  // Custom children or default button
  if (children) {
    // If children is a React element, clone it with additional props
    if (React.isValidElement(children)) {
      return React.cloneElement(children, {
        onClick: handleAddToCart,
        disabled: isButtonDisabled,
        "data-adding": isAdding,
        "data-in-cart": isInCart,
        "data-cart-quantity": cartQuantity,
      });
    }

    // If children is a function, call it with state
    if (typeof children === "function") {
      return children({
        onClick: handleAddToCart,
        disabled: isButtonDisabled,
        isAdding,
        isInCart,
        cartQuantity,
        buttonText: getButtonText(),
      });
    }

    // If children is just text/elements, wrap in a button
    return (
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isButtonDisabled}
        className={`add-to-cart-btn cursor-pointer disabled:cursor-not-allowed ${className} ${
          isAdding ? "loading" : ""
        } ${isInCart ? "in-cart" : ""}`}
        aria-label={`Thêm ${product?.name || "sản phẩm"} vào giỏ hàng`}
      >
        {isAdding && (
          <span className="loading-spinner" aria-hidden="true">
            ⟳
          </span>
        )}
        {children}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={isButtonDisabled}
      className={`add-to-cart-btn cursor-pointer disabled:cursor-not-allowed ${className} ${
        isAdding ? "loading" : ""
      } ${isInCart ? "in-cart" : ""}`}
      aria-label={`Thêm ${product?.name || "sản phẩm"} vào giỏ hàng`}
    >
      {isAdding && (
        <span className="loading-spinner" aria-hidden="true">
          ⟳
        </span>
      )}
      <span>{getButtonText()}</span>
    </button>
  );
};

export default AddToCartButton;
