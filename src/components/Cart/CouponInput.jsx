// components/Cart/CouponInput.jsx
import React, { useState } from "react";
import { useCartManagement } from "../../hooks/useCartManagement";

const CouponInput = ({
  onApplied = null,
  onRemoved = null,
  className = "",
  placeholder = "Nhập mã giảm giá",
  disabled = false,
}) => {
  const [couponCode, setCouponCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const { cart, actions } = useCartManagement();

  const handleApply = async (e) => {
    e.preventDefault();

    if (!couponCode.trim() || isApplying || disabled) return;

    try {
      setIsApplying(true);

      console.log("🎫 CouponInput: Applying coupon", couponCode.trim());

      const result = await actions.applyCouponCode(couponCode.trim());

      if (result.success) {
        setCouponCode("");

        if (window.showNotification) {
          window.showNotification(
            result.message || "Áp dụng mã giảm giá thành công",
            "success"
          );
        }

        if (onApplied) {
          onApplied(result);
        }
      } else {
        if (window.showNotification) {
          window.showNotification(
            result.message || "Mã giảm giá không hợp lệ",
            "error"
          );
        }
      }
    } catch (error) {
      console.error("❌ CouponInput apply error:", error);

      if (window.showNotification) {
        window.showNotification(
          "Có lỗi xảy ra khi áp dụng mã giảm giá",
          "error"
        );
      }
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemove = async () => {
    if (isRemoving || disabled) return;

    try {
      setIsRemoving(true);

      console.log("🗑️ CouponInput: Removing coupon", cart.coupon?.code);

      const result = await actions.removeCouponCode();

      if (result.success) {
        if (window.showNotification) {
          window.showNotification(
            result.message || "Đã xóa mã giảm giá",
            "success"
          );
        }

        if (onRemoved) {
          onRemoved(result);
        }
      } else {
        if (window.showNotification) {
          window.showNotification(
            result.message || "Không thể xóa mã giảm giá",
            "error"
          );
        }
      }
    } catch (error) {
      console.error("❌ CouponInput remove error:", error);

      if (window.showNotification) {
        window.showNotification("Có lỗi xảy ra khi xóa mã giảm giá", "error");
      }
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className={`coupon-input ${className}`}>
      {/* Current applied coupon */}
      {cart.coupon && (
        <div className="coupon-input__applied">
          <div className="applied-coupon">
            <span className="coupon-icon">🎫</span>
            <div className="coupon-details">
              <span className="coupon-code">{cart.coupon.code}</span>
              <span className="coupon-discount">
                Giảm {cart.coupon.discountAmount?.toLocaleString("vi-VN")}đ
              </span>
            </div>
            <button
              type="button"
              className="remove-coupon-btn"
              onClick={handleRemove}
              disabled={isRemoving || disabled}
              aria-label="Xóa mã giảm giá"
            >
              {isRemoving ? "⟳" : "✕"}
            </button>
          </div>
        </div>
      )}

      {/* Coupon input form */}
      {!cart.coupon && (
        <form onSubmit={handleApply} className="coupon-input__form">
          <div className="input-group">
            <input
              type="text"
              className="coupon-input__field"
              placeholder={placeholder}
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              disabled={isApplying || disabled}
              maxLength={20}
              autoComplete="off"
            />
            <button
              type="submit"
              className="coupon-input__submit"
              disabled={!couponCode.trim() || isApplying || disabled}
            >
              {isApplying ? (
                <span className="loading-spinner">⟳</span>
              ) : (
                "Áp dụng"
              )}
            </button>
          </div>
        </form>
      )}

      {/* Tips for users */}
      {!cart.coupon && cart.isEmpty && (
        <div className="coupon-input__tip">
          Thêm sản phẩm vào giỏ để sử dụng mã giảm giá
        </div>
      )}
    </div>
  );
};

export default CouponInput;
