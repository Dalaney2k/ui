// components/Cart/QuantitySelector.jsx
import React, { useState, useEffect } from "react";
import { useCartManagement } from "../../hooks/useCartManagement";

const QuantitySelector = ({
  item,
  onUpdate = null,
  disabled = false,
  className = "",
  size = "medium", // small, medium, large
  showLabel = false,
  min = 1,
  max = null,
}) => {
  const [quantity, setQuantity] = useState(item?.quantity || 1);
  const [isUpdating, setIsUpdating] = useState(false);
  const { actions } = useCartManagement();

  // Update local state when item changes
  useEffect(() => {
    setQuantity(item?.quantity || 1);
  }, [item?.quantity]);

  // Get max quantity from stock if available
  const maxQuantity = max || item?.product?.stock || 999;

  const handleQuantityChange = async (newQuantity) => {
    if (
      isUpdating ||
      disabled ||
      newQuantity < min ||
      newQuantity > maxQuantity ||
      newQuantity === quantity
    ) {
      return;
    }

    try {
      setIsUpdating(true);
      setQuantity(newQuantity);

      console.log("🔄 QuantitySelector: Updating quantity", {
        productId: item?.productId,
        oldQuantity: quantity,
        newQuantity,
      });

      const result = await actions.updateItem(item.productId, newQuantity);

      if (result.success) {
        if (onUpdate) {
          onUpdate(result);
        }
      } else {
        // Revert quantity on error
        setQuantity(quantity);

        if (window.showNotification) {
          window.showNotification(
            result.message || "Không thể cập nhật số lượng",
            "error"
          );
        }
      }
    } catch (error) {
      console.error("❌ QuantitySelector error:", error);

      // Revert quantity on error
      setQuantity(quantity);

      if (window.showNotification) {
        window.showNotification("Có lỗi xảy ra khi cập nhật số lượng", "error");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      handleQuantityChange(value);
    }
  };

  const increment = () => {
    handleQuantityChange(quantity + 1);
  };

  const decrement = () => {
    handleQuantityChange(quantity - 1);
  };

  // Size classes
  const sizeClasses = {
    small: "quantity-selector--small",
    medium: "quantity-selector--medium",
    large: "quantity-selector--large",
  };

  return (
    <div
      className={`quantity-selector ${sizeClasses[size]} ${className} ${
        isUpdating ? "updating" : ""
      }`}
    >
      {showLabel && (
        <label className="quantity-selector__label">Số lượng:</label>
      )}

      <div className="quantity-selector__controls">
        <button
          type="button"
          className="quantity-selector__btn quantity-selector__btn--decrease"
          onClick={decrement}
          disabled={isUpdating || disabled || quantity <= min}
          aria-label="Giảm số lượng"
        >
          −
        </button>

        <input
          type="number"
          className="quantity-selector__input"
          value={quantity}
          onChange={handleInputChange}
          disabled={isUpdating || disabled}
          min={min}
          max={maxQuantity}
          aria-label="Số lượng sản phẩm"
        />

        <button
          type="button"
          className="quantity-selector__btn quantity-selector__btn--increase"
          onClick={increment}
          disabled={isUpdating || disabled || quantity >= maxQuantity}
          aria-label="Tăng số lượng"
        >
          +
        </button>
      </div>

      {isUpdating && (
        <div className="quantity-selector__loading">
          <span className="loading-spinner">⟳</span>
        </div>
      )}

      {/* Stock warning */}
      {item?.product?.stock && quantity >= item.product.stock && (
        <div className="quantity-selector__warning">
          Chỉ còn {item.product.stock} sản phẩm
        </div>
      )}
    </div>
  );
};

export default QuantitySelector;
