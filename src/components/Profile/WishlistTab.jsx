import React, { useState, useEffect } from "react";
import {
  Heart,
  ShoppingCart,
  Eye,
  Trash2,
  Filter,
  Grid,
  List,
  Star,
} from "lucide-react";

const WishlistTab = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [sortBy, setSortBy] = useState("dateAdded"); // dateAdded, name, price
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockWishlist = [
        {
          id: 1,
          product: {
            id: "PROD001",
            name: "Bộ chén dĩa gốm sứ Nhật Bản",
            price: 1200000,
            originalPrice: 1500000,
            image: "/images/product1.jpg",
            category: "Chén dĩa",
            rating: 4.8,
            reviewCount: 124,
            availability: "in_stock",
            description:
              "Bộ chén dĩa gốm sứ cao cấp được nhập khẩu trực tiếp từ Nhật Bản",
          },
          dateAdded: new Date("2024-01-10"),
          notes: "Để dành mua trong dịp tết",
        },
        {
          id: 2,
          product: {
            id: "PROD002",
            name: "Ấm trà Kyusu truyền thống",
            price: 850000,
            originalPrice: 850000,
            image: "/images/product2.jpg",
            category: "Ấm trà",
            rating: 4.9,
            reviewCount: 89,
            availability: "low_stock",
            description: "Ấm trà Kyusu truyền thống làm từ đất sét cao cấp",
          },
          dateAdded: new Date("2024-01-15"),
          notes: "",
        },
        {
          id: 3,
          product: {
            id: "PROD003",
            name: "Bình hoa gốm Satsuma",
            price: 2500000,
            originalPrice: 2500000,
            image: "/images/product3.jpg",
            category: "Trang trí",
            rating: 4.7,
            reviewCount: 56,
            availability: "out_of_stock",
            description:
              "Bình hoa gốm Satsuma chính hiệu với họa tiết truyền thống",
          },
          dateAdded: new Date("2024-01-20"),
          notes: "Chờ về hàng",
        },
      ];

      setWishlistItems(mockWishlist);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (itemId) => {
    if (
      window.confirm(
        "Bạn có chắc muốn xóa sản phẩm này khỏi danh sách yêu thích?"
      )
    ) {
      try {
        setWishlistItems((prev) => prev.filter((item) => item.id !== itemId));
        // API call would go here
      } catch (error) {
        console.error("Error removing from wishlist:", error);
      }
    }
  };

  const handleAddToCart = async (product) => {
    try {
      // Add to cart logic here
      console.log("Adding to cart:", product);
      alert("Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case "in_stock":
        return "text-green-600 bg-green-50";
      case "low_stock":
        return "text-yellow-600 bg-yellow-50";
      case "out_of_stock":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getAvailabilityLabel = (availability) => {
    switch (availability) {
      case "in_stock":
        return "Còn hàng";
      case "low_stock":
        return "Sắp hết";
      case "out_of_stock":
        return "Hết hàng";
      default:
        return "Không xác định";
    }
  };

  const sortedAndFilteredItems = wishlistItems
    .filter(
      (item) =>
        filterCategory === "all" || item.product.category === filterCategory
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.product.name.localeCompare(b.product.name, "vi");
        case "price":
          return a.product.price - b.product.price;
        case "priceDesc":
          return b.product.price - a.product.price;
        case "dateAdded":
        default:
          return b.dateAdded - a.dateAdded;
      }
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Danh sách yêu thích ({wishlistItems.length})
          </h2>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg ${
                viewMode === "grid"
                  ? "bg-red-100 text-red-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg ${
                viewMode === "list"
                  ? "bg-red-100 text-red-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">Tất cả danh mục</option>
              <option value="Chén dĩa">Chén dĩa</option>
              <option value="Ấm trà">Ấm trà</option>
              <option value="Trang trí">Trang trí</option>
            </select>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="dateAdded">Mới thêm nhất</option>
            <option value="name">Tên A-Z</option>
            <option value="price">Giá thấp - cao</option>
            <option value="priceDesc">Giá cao - thấp</option>
          </select>
        </div>
      </div>

      {/* Wishlist Items */}
      {wishlistItems.length > 0 ? (
        <div
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }`}
        >
          {sortedAndFilteredItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-lg shadow-sm border border-gray-200 ${
                viewMode === "list" ? "flex" : ""
              }`}
            >
              {/* Product Image */}
              <div
                className={`${
                  viewMode === "list" ? "w-32 h-32" : "aspect-square"
                } bg-gray-200 rounded-t-lg ${
                  viewMode === "list"
                    ? "rounded-l-lg rounded-tr-none flex-shrink-0"
                    : ""
                } relative overflow-hidden group`}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <Heart className="w-16 h-16 text-gray-400" />
                </div>

                {/* Quick Actions Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <button className="p-2 bg-white rounded-full text-gray-600 hover:text-red-600 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    className="p-2 bg-white rounded-full text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                <div
                  className={`${
                    viewMode === "list" ? "flex justify-between h-full" : ""
                  }`}
                >
                  <div
                    className={`${viewMode === "list" ? "flex-1 pr-4" : ""}`}
                  >
                    {/* Category */}
                    <div className="text-sm text-gray-500 mb-1">
                      {item.product.category}
                    </div>

                    {/* Product Name */}
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                      {item.product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center space-x-1 mb-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= Math.floor(item.product.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {item.product.rating} ({item.product.reviewCount})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-lg font-semibold text-red-600">
                        {formatPrice(item.product.price)}
                      </span>
                      {item.product.originalPrice > item.product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(item.product.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Availability */}
                    <div className="mb-3">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(
                          item.product.availability
                        )}`}
                      >
                        {getAvailabilityLabel(item.product.availability)}
                      </span>
                    </div>

                    {/* Notes */}
                    {item.notes && (
                      <div className="text-sm text-gray-600 mb-3 italic">
                        Ghi chú: {item.notes}
                      </div>
                    )}

                    {/* Date Added */}
                    <div className="text-xs text-gray-500 mb-3">
                      Thêm vào: {item.dateAdded.toLocaleDateString("vi-VN")}
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    className={`flex ${
                      viewMode === "list"
                        ? "flex-col justify-center space-y-2"
                        : "space-x-2"
                    }`}
                  >
                    <button
                      onClick={() => handleAddToCart(item.product)}
                      disabled={item.product.availability === "out_of_stock"}
                      className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        item.product.availability === "out_of_stock"
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-red-600 text-white hover:bg-red-700"
                      } ${viewMode === "list" ? "w-32" : "flex-1"}`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>
                        {item.product.availability === "out_of_stock"
                          ? "Hết hàng"
                          : "Thêm vào giỏ"}
                      </span>
                    </button>

                    <button
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      className={`flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors ${
                        viewMode === "list" ? "w-32" : "flex-1"
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg">
          <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <div className="text-xl font-medium text-gray-900 mb-2">
            Danh sách yêu thích trống
          </div>
          <div className="text-gray-600 mb-6">
            Bạn chưa có sản phẩm nào trong danh sách yêu thích. Hãy khám phá và
            thêm những sản phẩm bạn yêu thích!
          </div>
          <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Khám phá sản phẩm
          </button>
        </div>
      )}
    </div>
  );
};

export default WishlistTab;
