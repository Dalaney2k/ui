import React from "react";
import { X, Star, Plus, Minus, Heart, ShoppingCart } from "lucide-react";
import { formatPrice, getProductBadges } from "../../utils/dataTransform";

const QuickViewProduct = ({
  isOpen,
  onClose,
  product,
  quantity,
  setQuantity,
  addToCart,
  toggleWishlist,
  wishlistItems,
}) => {
  if (!isOpen || !product) return null;

  const handleQuantityChange = (change) => {
    const newQuantity = Math.max(
      1,
      Math.min(product.stock || 99, quantity + change)
    );
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    onClose();
  };

  const badges = getProductBadges(product);
  const productImage = product.mainImage || product.image;
  const isInWishlist = wishlistItems.includes(product.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="relative">
              <img
                src={productImage}
                alt={product.name}
                className="w-full h-96 object-cover rounded-xl"
              />
              {badges.length > 0 && (
                <div className="absolute top-4 left-4 flex flex-col space-y-1">
                  {badges.slice(0, 2).map((badge, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        badge.text.includes("-")
                          ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                          : "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                      }`}
                    >
                      {badge.text}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {product.name}
                </h2>

                {/* Brand */}
                {product.brand && (
                  <p className="text-gray-600 mb-2">
                    Thương hiệu:{" "}
                    <span className="font-medium">{product.brand.name}</span>
                  </p>
                )}

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">
                    {product.rating} ({product.reviewCount} đánh giá)
                  </span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl font-bold text-red-500">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice &&
                      product.originalPrice > product.price && (
                        <span className="text-lg text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                  </div>
                  {product.originalPrice &&
                    product.originalPrice > product.price && (
                      <span className="text-green-600 font-semibold">
                        Tiết kiệm{" "}
                        {formatPrice(product.originalPrice - product.price)}
                      </span>
                    )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Mô tả sản phẩm
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description ||
                    product.shortDescription ||
                    "Sản phẩm chính hãng nhập khẩu trực tiếp từ Nhật Bản. Chất lượng cao, thiết kế tinh tế và đảm bảo an toàn cho sức khỏe người sử dụng."}
                </p>
              </div>

              {/* Stock Status */}
              <div
                className={`p-3 rounded-lg ${
                  product.isInStock
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <span
                  className={`font-medium ${
                    product.isInStock ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {product.isInStock
                    ? `✓ Còn ${product.stock || "nhiều"} sản phẩm`
                    : "✗ Hết hàng"}
                </span>
              </div>

              {/* Quantity */}
              {product.isInStock && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Số lượng</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 font-medium min-w-[60px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= (product.stock || 99)}
                        className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-gray-600">
                      Tổng:{" "}
                      <span className="font-semibold text-red-500">
                        {formatPrice(product.price * quantity)}
                      </span>
                    </span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.isInStock}
                  className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{product.isInStock ? "Thêm Vào Giỏ" : "Hết hàng"}</span>
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`px-4 py-3 rounded-lg border-2 transition-colors flex items-center justify-center ${
                    isInWishlist
                      ? "border-red-500 text-red-500 bg-red-50"
                      : "border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${isInWishlist ? "fill-current" : ""}`}
                  />
                </button>
              </div>

              {/* Additional Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                {product.categoryInfo && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Danh mục:</span>
                    <span className="font-medium">
                      {product.categoryInfo.name}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tình trạng:</span>
                  <span
                    className={`font-medium ${
                      product.isInStock ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {product.isInStock ? "Còn hàng" : "Hết hàng"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Vận chuyển:</span>
                  <span className="font-medium">Miễn phí từ 500k</span>
                </div>
                {product.isGiftWrappingAvailable && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Gói quà:</span>
                    <span className="font-medium text-blue-600">Có sẵn</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewProduct;
