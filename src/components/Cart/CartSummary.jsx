// components/Cart/CartSummary.jsx - Enhanced Version
import React from "react";
import { useCartManagement } from "../../hooks/useCartManagement";
import { useAuth } from "../../hooks/useAuth";

const CartSummary = ({
  showItemCount = true,
  showGuestNotice = true,
  className = "",
  compact = false,
  // ✅ NEW: Enhanced props
  showStats = false,
  showRecommendations = false,
  showShipping = false,
  showValidation = true,
}) => {
  const { cart, loading, utils, analytics } = useCartManagement();
  const { user } = useAuth();

  // ✅ NEW: Get enhanced cart summary
  const cartSummary = utils.getCartSummary ? utils.getCartSummary() : cart;
  const recommendations = utils.getRecommendations
    ? utils.getRecommendations()
    : [];

  if (loading) {
    return (
      <div className={`cart-summary ${className} loading`}>
        <div className="cart-summary__skeleton animate-pulse">
          <div className="skeleton-line h-4 bg-gray-200 rounded mb-2"></div>
          <div className="skeleton-line h-4 bg-gray-200 rounded mb-2"></div>
          <div className="skeleton-line h-6 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (cart.isEmpty) {
    return (
      <div className={`cart-summary ${className} empty`}>
        <div className="cart-summary__empty text-center py-4">
          <span className="cart-icon text-4xl block mb-2">🛒</span>
          <span className="text-gray-500">Giỏ hàng trống</span>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    return price?.toLocaleString("vi-VN") + "đ";
  };

  return (
    <div className={`cart-summary ${className} ${compact ? "compact" : ""}`}>
      {/* Enhanced Item count */}
      {showItemCount && (
        <div className="cart-summary__item-count mb-3">
          <div className="flex items-center space-x-2">
            <span className="cart-icon">🛒</span>
            <div className="flex-1">
              <div className="text-sm font-medium">
                {cart.itemCount} sản phẩm ({cart.totalItems} món)
              </div>
              {/* ✅ NEW: Additional stats */}
              {showStats && cartSummary.uniqueItems && (
                <div className="text-xs text-gray-500 space-x-2">
                  <span>{cartSummary.uniqueItems} loại sản phẩm</span>
                  <span>•</span>
                  <span>
                    TB: {formatPrice(cartSummary.averageItemPrice || 0)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ✅ NEW: Validation warnings */}
      {showValidation &&
        analytics?.validation &&
        !analytics.validation.isValid && (
          <div className="cart-summary__validation mb-3">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-red-500">⚠️</span>
                <span className="text-sm font-medium text-red-800">
                  Cần kiểm tra giỏ hàng
                </span>
              </div>
              <div className="text-xs text-red-600 space-y-1">
                {analytics.validation.hasStockIssues && (
                  <div>• Một số sản phẩm vượt quá kho</div>
                )}
                {analytics.validation.hasPriceIssues && (
                  <div>• Có sản phẩm với giá không hợp lệ</div>
                )}
                {analytics.validation.hasQuantityIssues && (
                  <div>• Có sản phẩm với số lượng không hợp lệ</div>
                )}
              </div>
            </div>
          </div>
        )}

      {/* Enhanced Price breakdown */}
      <div className="cart-summary__prices">
        {!compact && (
          <div className="cart-summary__line flex justify-between py-1">
            <span className="text-gray-600">Tạm tính:</span>
            <span className="font-medium">{formatPrice(cart.total)}</span>
          </div>
        )}

        {/* ✅ NEW: Enhanced shipping info */}
        {showShipping && analytics?.stats?.estimatedShipping && (
          <div className="cart-summary__line flex justify-between py-1 text-sm text-gray-600">
            <span>Phí vận chuyển (ước tính):</span>
            <span>{formatPrice(analytics.stats.estimatedShipping)}</span>
          </div>
        )}

        {/* Total */}
        <div className="cart-summary__total flex justify-between py-2 border-t border-gray-200 mt-2">
          <span className="font-semibold">Tổng cộng:</span>
          <span className="font-bold text-lg text-red-600">
            {formatPrice(
              cart.totalAmount +
                ((showShipping && analytics?.stats?.estimatedShipping) || 0)
            )}
          </span>
        </div>
      </div>

      {/* ✅ NEW: Category breakdown */}
      {showStats &&
        analytics?.stats?.categories &&
        Object.keys(analytics.stats.categories).length > 1 && (
          <div className="cart-summary__categories mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Danh mục sản phẩm:
            </h4>
            <div className="flex flex-wrap gap-1">
              {Object.entries(analytics.stats.categories).map(
                ([category, count]) => (
                  <span
                    key={category}
                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                  >
                    {category} ({count})
                  </span>
                )
              )}
            </div>
          </div>
        )}

      {/* ✅ NEW: Price range breakdown */}
      {showStats && analytics?.stats?.priceRanges && (
        <div className="cart-summary__price-ranges mt-3">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Phân bố giá:
          </h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {analytics.stats.priceRanges.under50k > 0 && (
              <div className="bg-green-50 text-green-700 px-2 py-1 rounded text-center">
                <div className="font-medium">
                  {analytics.stats.priceRanges.under50k}
                </div>
                <div>&lt;50k</div>
              </div>
            )}
            {analytics.stats.priceRanges.from50to100k > 0 && (
              <div className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded text-center">
                <div className="font-medium">
                  {analytics.stats.priceRanges.from50to100k}
                </div>
                <div>50-100k</div>
              </div>
            )}
            {analytics.stats.priceRanges.over100k > 0 && (
              <div className="bg-red-50 text-red-700 px-2 py-1 rounded text-center">
                <div className="font-medium">
                  {analytics.stats.priceRanges.over100k}
                </div>
                <div>&gt;100k</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ✅ NEW: Weight and shipping info */}
      {showStats && analytics?.stats?.totalWeight > 0 && (
        <div className="cart-summary__weight mt-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Thông tin vận chuyển:
            </h4>
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
              <div>
                <div className="font-medium">Khối lượng</div>
                <div>{analytics.stats.totalWeight}g</div>
              </div>
              <div>
                <div className="font-medium">Phí ước tính</div>
                <div>{formatPrice(analytics.stats.estimatedShipping)}</div>
              </div>
            </div>
            {analytics.stats.heaviestItem && (
              <div className="mt-2 text-xs text-gray-500">
                Nặng nhất: {analytics.stats.heaviestItem.product?.name || "N/A"}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ✅ NEW: Recommendations */}
      {showRecommendations && recommendations.length > 0 && (
        <div className="cart-summary__recommendations mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            💡 Gợi ý cho bạn:
          </h4>
          <div className="space-y-2">
            {recommendations.slice(0, 2).map((rec, index) => (
              <div
                key={index}
                className={`
                  text-xs p-3 rounded-lg border transition-all duration-200 hover:scale-105
                  ${
                    rec.type === "free_shipping"
                      ? "bg-green-50 border-green-200 text-green-800"
                      : rec.type === "almost_free_shipping"
                      ? "bg-orange-50 border-orange-200 text-orange-800"
                      : rec.type === "bulk_discount"
                      ? "bg-purple-50 border-purple-200 text-purple-800"
                      : "bg-blue-50 border-blue-200 text-blue-800"
                  }
                `}
              >
                <div className="flex items-start space-x-2">
                  <span className="flex-shrink-0">
                    {rec.type === "free_shipping"
                      ? "🚚"
                      : rec.type === "almost_free_shipping"
                      ? "📦"
                      : rec.type === "bulk_discount"
                      ? "💰"
                      : rec.type === "category_bundle"
                      ? "🛍️"
                      : "💡"}
                  </span>
                  <div className="flex-1">
                    <div className="font-medium">{rec.message}</div>
                    {rec.type === "almost_free_shipping" && (
                      <div className="mt-1 text-xs opacity-75">
                        Còn thiếu {formatPrice(rec.remaining)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {recommendations.length > 2 && (
              <div className="text-xs text-gray-500 text-center">
                +{recommendations.length - 2} gợi ý khác
              </div>
            )}
          </div>
        </div>
      )}

      {/* Enhanced Guest cart notice */}
      {showGuestNotice && cart.isGuestCart && !user && (
        <div className="cart-summary__guest-notice mt-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <span className="guest-icon">👤</span>
              <div className="flex-1">
                <span className="text-sm text-blue-800 font-medium">
                  Đăng nhập để lưu giỏ hàng
                </span>
              </div>
            </div>
            <div className="text-xs text-blue-600 space-y-1">
              <div>• Lưu giỏ hàng trên nhiều thiết bị</div>
              <div>• Nhận ưu đãi và điểm thưởng</div>
              <div>• Theo dõi đơn hàng dễ dàng</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartSummary;
