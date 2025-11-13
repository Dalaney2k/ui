import React, { useEffect, useState } from "react";
import { ArrowRight, Star, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import { productService } from "../../services/index.js";
import { transformProducts } from "../../utils/dataTransform";

const FeaturedProducts = ({
  addToCart,
  toggleWishlist,
  wishlistItems,
  isInWishlist,
  onQuickView,
  onNotification,
}) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("🔍 FeaturedProducts: Fetching products...");
        setLoading(true);

        const response = await productService.getProducts({ pageSize: 8 });
        console.log("✅ FeaturedProducts: Got response:", response);

        const transformedProducts = transformProducts(response.products || []);
        console.log(
          "✅ FeaturedProducts: Transformed products:",
          transformedProducts
        );

        setProducts(transformedProducts);
        setError(null);
      } catch (err) {
        console.error("❌ FeaturedProducts: Error:", err);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // DEBUG: Log để kiểm tra dữ liệu
  console.log("🔍 FeaturedProducts Debug:", {
    products,
    productsLength: products?.length,
    loading,
    error,
  });

  // Get featured products (first 8 for display)
  const featuredProducts = products.slice(0, 8);

  // ✨ FIXED: Skeleton loader thay vì spinner để tránh layout shift
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <Sparkles className="w-8 h-8 text-yellow-500 mr-2" />
            <h2 className="text-4xl font-bold text-gray-800">
              Sản Phẩm Nổi Bật
            </h2>
            <Sparkles className="w-8 h-8 text-yellow-500 ml-2" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá những sản phẩm Nhật Bản chất lượng cao được yêu thích nhất
          </p>

          {/* Decorative line */}
          <div className="flex justify-center mt-6">
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
          </div>
        </div>

        {/* Products Grid - FIXED: Equal height grid với auto-fit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {loading
            ? // Show skeleton loaders to prevent layout shift
              Array(8)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="opacity-0 animate-fadeInUp"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: "forwards",
                    }}
                  >
                    <SkeletonCard />
                  </div>
                ))
            : // Show actual products with staggered animation and equal heights
              featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="opacity-0 animate-fadeInUp h-full"
                  style={{
                    animationDelay: `${index * 50}ms`, // Reduced delay for smoother effect
                    animationFillMode: "forwards",
                  }}
                >
                  <ProductCard
                    product={product}
                    addToCart={addToCart}
                    toggleWishlist={toggleWishlist}
                    wishlistItems={wishlistItems}
                    isInWishlist={isInWishlist}
                    onQuickView={onQuickView}
                    onNotification={onNotification}
                    viewMode="grid"
                  />
                </div>
              ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <button
            onClick={() => navigate("/products")}
            className="group inline-flex items-center space-x-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <span>Xem Tất Cả Sản Phẩm</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="group cursor-pointer">
              <div className="text-3xl font-bold text-red-600 mb-2 group-hover:scale-110 transition-transform">
                {loading ? "..." : `${products.length}+`}
              </div>
              <div className="text-gray-700 font-medium">Sản Phẩm</div>
            </div>
            <div className="group cursor-pointer">
              <div className="text-3xl font-bold text-red-600 mb-2 group-hover:scale-110 transition-transform">
                4.8
              </div>
              <div className="flex justify-center items-center space-x-1 text-gray-700">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-medium">Đánh Giá</span>
              </div>
            </div>
            <div className="group cursor-pointer">
              <div className="text-3xl font-bold text-red-600 mb-2 group-hover:scale-110 transition-transform">
                1000+
              </div>
              <div className="text-gray-700 font-medium">Khách Hàng</div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for optimized animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px) translateZ(0);
          }
          to {
            opacity: 1;
            transform: translateY(0) translateZ(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform, opacity;
        }

        .animate-pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </section>
  );
};

export default FeaturedProducts;
