import React, { useState, memo } from "react";
import { Star, Heart, Plus, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatPrice, getProductBadges } from "../../utils/dataTransform";
import { AddToCartButton } from "../Cart";

const ProductCard = memo(
  ({
    product,
    viewMode = "grid", // grid or list
    toggleWishlist,
    wishlistItems = [],
    isInWishlist,
    onQuickView,
    onNotification,
  }) => {
    const navigate = useNavigate();
    const badges = getProductBadges(product);
    const isWishlisted = isInWishlist ? isInWishlist(product.id) : false;
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Handle navigation to product detail
    const handleCardClick = () => {
      navigate(`/product/${product.id}`);
    };

    // Handle wishlist toggle
    const handleToggleWishlist = async (e) => {
      e.stopPropagation();
      e.preventDefault();
      console.log("Toggle wishlist clicked for:", product.name);
      if (toggleWishlist) {
        try {
          await toggleWishlist(product.id, product.name, onNotification);
        } catch (error) {
          console.error("Toggle wishlist error:", error);
          // Show error notification if available
          if (onNotification) {
            onNotification("Có lỗi xảy ra khi thêm vào wishlist", "error");
          }
        }
      }
    };

    // Handle quick view
    const handleQuickView = (e) => {
      e.stopPropagation();
      e.preventDefault();
      console.log("Quick view clicked for:", product.name);
      if (onQuickView) {
        onQuickView(product);
      }
    };

    // Handle image error
    const handleImageError = () => {
      setImageError(true);
      setImageLoaded(true);
    };

    // Get proper image source
    const getImageSrc = () => {
      if (imageError) {
        return "/images/placeholder-product.jpg"; // Fallback image
      }
      return (
        product.mainImage || product.image || "/images/placeholder-product.jpg"
      );
    };

    // Format rating
    const rating = product.rating || 4.5;
    const reviewCount = product.reviewCount || product.reviews || 0;

    // List View Layout
    if (viewMode === "list") {
      return (
        <div
          onClick={handleCardClick}
          className="cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100"
        >
          <div className="flex p-4">
            {/* Product Image */}
            <div className="w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden relative">
              {/* Image placeholder */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                  <div className="w-8 h-8 text-gray-400">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}

              <img
                src={getImageSrc()}
                alt={product.name}
                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={handleImageError}
                loading="lazy"
              />

              {/* Badges */}
              {badges.length > 0 && (
                <div className="absolute top-2 left-2 flex flex-col space-y-1">
                  {badges.slice(0, 2).map((badge, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 text-xs font-medium rounded-full ${badge.className}`}
                    >
                      {badge.text}
                    </span>
                  ))}
                </div>
              )}

              {/* Quick View Button */}
              <button
                onClick={handleQuickView}
                className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer"
                title="Xem nhanh"
              >
                <Eye className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Product Info */}
            <div className="flex-1 ml-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                  {product.name}
                </h3>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.shortDescription || product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    ({rating}) • {reviewCount} đánh giá
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-red-600">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice &&
                    product.originalPrice > product.price && (
                      <span className="text-lg text-gray-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 mt-4">
                <AddToCartButton
                  product={product}
                  quantity={1}
                  onSuccess={() => {
                    console.log("Added to cart successfully");
                    if (onNotification) {
                      onNotification(
                        "Đã thêm sản phẩm vào giỏ hàng",
                        "success"
                      );
                    }
                  }}
                  onError={(error) => {
                    console.error("Add to cart error:", error);
                    if (onNotification) {
                      onNotification(
                        "Có lỗi xảy ra khi thêm vào giỏ hàng",
                        "error"
                      );
                    }
                  }}
                >
                  <button
                    type="button"
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm vào giỏ</span>
                  </button>
                </AddToCartButton>

                <button
                  onClick={handleToggleWishlist}
                  className={`p-2 rounded-lg border-2 transition-colors cursor-pointer ${
                    isWishlisted
                      ? "border-pink-500 bg-pink-50 text-pink-500"
                      : "border-gray-300 text-gray-600 hover:border-pink-500 hover:text-pink-500"
                  }`}
                  title="Thêm vào yêu thích"
                >
                  <Heart
                    className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Grid View Layout
    return (
      <div
        onClick={handleCardClick}
        className="cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group relative will-change-transform h-full flex flex-col"
      >
        {/* Product Image */}
        <div className="relative overflow-hidden aspect-square bg-gray-100 flex-shrink-0">
          {/* Image placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="w-12 h-12 text-gray-400">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          )}

          <img
            src={getImageSrc()}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
            loading="lazy"
          />

          {/* Product Badges */}
          {badges.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-col space-y-1">
              {badges.slice(0, 2).map((badge, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded-full text-xs font-semibold shadow-lg ${badge.className}`}
                >
                  {badge.text}
                </span>
              ))}
            </div>
          )}

          {/* Hover Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transform translate-x-0 md:translate-x-4 md:group-hover:translate-x-0 transition-all duration-300 z-20">
            {/* Add to Cart */}
            <AddToCartButton
              product={product}
              quantity={1}
              onSuccess={() => {
                console.log("Added to cart successfully");
                if (onNotification) {
                  onNotification("Đã thêm sản phẩm vào giỏ hàng", "success");
                }
              }}
              onError={(error) => {
                console.error("Add to cart error:", error);
                if (onNotification) {
                  onNotification(
                    "Có lỗi xảy ra khi thêm vào giỏ hàng",
                    "error"
                  );
                }
              }}
            >
              <button
                type="button"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-red-500 hover:text-white group/btn disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                title="Thêm vào giỏ"
              >
                <Plus className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              </button>
            </AddToCartButton>

            {/* Add to Wishlist */}
            <button
              onClick={handleToggleWishlist}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-pink-500 hover:text-white group/btn cursor-pointer"
              title="Thêm vào yêu thích"
              type="button"
            >
              <Heart
                className={`w-4 h-4 group-hover/btn:scale-110 transition-transform ${
                  isWishlisted ? "text-red-500 fill-current" : ""
                }`}
              />
            </button>

            {/* Quick View */}
            <button
              onClick={handleQuickView}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-blue-500 hover:text-white group/btn cursor-pointer"
              title="Xem nhanh"
              type="button"
            >
              <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            </button>
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 pointer-events-none"></div>
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col flex-1 justify-between">
          {/* Product Name */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 group-hover:text-red-600 transition-colors min-h-[3rem] text-sm leading-6">
              {product.name}
            </h3>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-1 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 transition-colors ${
                    i < Math.floor(rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">({rating})</span>
            {reviewCount > 0 && (
              <span className="text-xs text-gray-500">
                • {reviewCount} đánh giá
              </span>
            )}
          </div>

          {/* Price Section */}
          <div className="mt-auto">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg font-bold text-red-500">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
            </div>

            {/* Savings and stock */}
            <div className="flex items-center justify-between">
              {product.originalPrice &&
              product.originalPrice > product.price ? (
                <span className="text-xs text-green-600 font-semibold">
                  Tiết kiệm {formatPrice(product.originalPrice - product.price)}
                </span>
              ) : (
                <div></div>
              )}

              {/* Stock Status */}
              <div className="text-xs">
                {product.isInStock !== false ? (
                  <span className="text-green-600">✓ Còn hàng</span>
                ) : (
                  <span className="text-red-600">✗ Hết hàng</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ProductCard.displayName = "ProductCard";

export default ProductCard;
