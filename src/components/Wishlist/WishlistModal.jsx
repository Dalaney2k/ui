import React, { useState, useEffect } from "react";
import { X, Heart, ShoppingCart, Star, Trash2 } from "lucide-react";
import { wishlistService, cartService } from "../../services";

const WishlistModal = ({ isOpen, onClose }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetchWishlist();
    }
  }, [isOpen]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);

      // First get all wishlists
      const wishlists = await wishlistService.getWishlists();
      console.log("❤️ WishlistModal: Raw wishlist response:", wishlists);

      // Then get detailed data for each wishlist (to get items)
      const allItems = [];
      if (Array.isArray(wishlists)) {
        for (const wishlist of wishlists) {
          console.log("❤️ Processing wishlist:", wishlist);

          if (wishlist.itemCount > 0) {
            try {
              // Get detailed wishlist with items
              const detailedWishlist = await wishlistService.getWishlist(
                wishlist.id
              );
              console.log("❤️ Detailed wishlist:", detailedWishlist);

              if (
                detailedWishlist &&
                detailedWishlist.items &&
                Array.isArray(detailedWishlist.items)
              ) {
                allItems.push(...detailedWishlist.items);
              }
            } catch (error) {
              console.warn(
                "❤️ Could not fetch details for wishlist",
                wishlist.id,
                error
              );
            }
          }
        }
      }

      console.log("❤️ All wishlist items extracted:", allItems);
      setWishlistItems(allItems);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setError("Không thể tải danh sách yêu thích");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const response = await wishlistService.removeFromWishlist(productId);

      if (response.success) {
        setWishlistItems((prev) =>
          prev.filter((item) => item.productId !== productId)
        );
        // Refresh wishlist to update counts
        setTimeout(() => fetchWishlist(), 200);
      } else {
        console.error("Failed to remove from wishlist:", response.message);
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      setAddingToCart((prev) => ({
        ...prev,
        [product.productId || product.id]: true,
      }));

      const response = await cartService.addToCart({
        productId: product.productId || product.id,
        quantity: 1,
        variantId: product.variantId || null,
      });

      if (response.success) {
        // Remove from wishlist after adding to cart and refresh
        await handleRemoveFromWishlist(product.productId || product.id);
        // Refresh the wishlist
        setTimeout(() => fetchWishlist(), 200);
      } else {
        console.error("Failed to add to cart:", response.message);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setAddingToCart((prev) => ({
        ...prev,
        [product.productId || product.id]: false,
      }));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Heart className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Danh sách yêu thích
            </h2>
            <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm">
              {wishlistItems.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <span className="ml-3 text-gray-600">Đang tải...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">{error}</div>
              <button
                onClick={fetchWishlist}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Thử lại
              </button>
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Danh sách yêu thích trống
              </h3>
              <p className="text-gray-500 mb-6">
                Hãy thêm những sản phẩm bạn yêu thích vào đây
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={
                        item.productImage ||
                        item.product?.imageUrl ||
                        item.imageUrl ||
                        "/placeholder-product.jpg"
                      }
                      alt={
                        item.productName ||
                        item.product?.name ||
                        item.name ||
                        "Product"
                      }
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-medium text-gray-900 truncate">
                      {item.productName ||
                        item.product?.name ||
                        item.name ||
                        "Tên sản phẩm"}
                    </h4>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {item.productDescription ||
                        item.product?.description ||
                        item.description ||
                        "Mô tả sản phẩm"}
                    </p>

                    {/* Rating */}
                    {(item.rating || item.product?.rating) && (
                      <div className="flex items-center mt-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i <
                                Math.floor(item.rating || item.product?.rating)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-1">
                          ({item.reviewCount || item.product?.reviewCount || 0})
                        </span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-lg font-semibold text-red-600">
                        {formatPrice(
                          item.unitPrice ||
                            item.price ||
                            item.product?.price ||
                            0
                        )}
                      </span>
                      {(item.originalPrice || item.product?.originalPrice) &&
                        (item.originalPrice || item.product?.originalPrice) >
                          (item.unitPrice ||
                            item.price ||
                            item.product?.price ||
                            0) && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(
                              item.originalPrice || item.product?.originalPrice
                            )}
                          </span>
                        )}
                    </div>

                    {/* SKU */}
                    {(item.productSku || item.sku) && (
                      <p className="text-xs text-gray-400 mt-1">
                        SKU: {item.productSku || item.sku}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={addingToCart[item.productId || item.id]}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>
                        {addingToCart[item.productId || item.id]
                          ? "Đang thêm..."
                          : "Thêm vào giỏ"}
                      </span>
                    </button>

                    <button
                      onClick={() =>
                        handleRemoveFromWishlist(item.productId || item.id)
                      }
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {wishlistItems.length > 0 && (
          <div className="border-t p-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">
                Tổng cộng: {wishlistItems.length} sản phẩm
              </span>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistModal;
