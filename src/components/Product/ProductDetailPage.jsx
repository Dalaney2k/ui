// ProductDetailPage.jsx - FIXED VERSION
import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  ShoppingCart,
  Heart,
  Share2,
  Shield,
  Truck,
  RefreshCw,
  Star,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  X,
  Check,
  Award,
  Package,
  Globe,
  Eye,
  MessageCircle,
  ThumbsUp,
  AlertCircle,
  ArrowRight,
  Zap,
  Clock,
  Users,
  TrendingUp,
} from "lucide-react";
import { productService } from "../../services";
import FloatingButtons from "../Common/FloatingButtons";
import ChatModal from "../Common/ChatModal";

// Utility functions
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

const transformProduct = (rawProduct) => {
  if (!rawProduct) return null;
  return {
    ...rawProduct,
    isInStock: rawProduct.stock > 0,
    images:
      rawProduct.images?.length > 0
        ? rawProduct.images
        : rawProduct.mainImage
        ? [rawProduct.mainImage]
        : [],
    rating: rawProduct.rating || 0,
    reviewCount: rawProduct.reviewCount || 0,
    soldCount: rawProduct.soldCount || 0,
  };
};

// Enhanced Image Gallery Component
const ImageGallery = React.memo(({ images, productName, onImageClick }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState(new Set([0]));

  const currentImage = images[selectedIndex];

  const handleThumbnailClick = useCallback(
    (index) => {
      setSelectedIndex(index);
      const preloadIndexes = [index - 1, index, index + 1].filter(
        (i) => i >= 0 && i < images.length
      );
      setLoadedImages((prev) => new Set([...prev, ...preloadIndexes]));
    },
    [images.length]
  );

  const navigate = useCallback(
    (direction) => {
      const newIndex =
        direction === "next"
          ? (selectedIndex + 1) % images.length
          : (selectedIndex - 1 + images.length) % images.length;
      handleThumbnailClick(newIndex);
    },
    [selectedIndex, images.length, handleThumbnailClick]
  );

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className="relative group cursor-zoom-in bg-gray-50 rounded-xl overflow-hidden"
        onClick={() => onImageClick(selectedIndex)}
      >
        <div className="aspect-square">
          <img
            src={currentImage}
            alt={`${productName} - Image ${selectedIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="eager"
          />
        </div>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate("prev");
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate("next");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Zoom indicator */}
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
          <ZoomIn size={16} className="inline mr-1" />
          Phóng to
        </div>

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm">
            {selectedIndex + 1}/{images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.slice(0, 4).map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                selectedIndex === index
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <img
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

// Product Info Stats Component
const ProductStats = ({ product }) => (
  <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
    <div className="text-center">
      <div className="flex items-center justify-center mb-1">
        <Eye className="text-blue-600" size={16} />
      </div>
      <div className="text-lg font-bold text-gray-900">
        {formatNumber(product.viewCount || 0)}
      </div>
      <div className="text-xs text-gray-600">Lượt xem</div>
    </div>
    <div className="text-center">
      <div className="flex items-center justify-center mb-1">
        <Heart className="text-red-600" size={16} />
      </div>
      <div className="text-lg font-bold text-gray-900">
        {formatNumber(product.favoriteCount || 0)}
      </div>
      <div className="text-xs text-gray-600">Yêu thích</div>
    </div>
    <div className="text-center">
      <div className="flex items-center justify-center mb-1">
        <TrendingUp className="text-green-600" size={16} />
      </div>
      <div className="text-lg font-bold text-gray-900">
        {formatNumber(product.soldCount || 0)}
      </div>
      <div className="text-xs text-gray-600">Đã bán</div>
    </div>
  </div>
);

// Enhanced Product Card Component
const ProductCard = ({ product, onProductClick }) => (
  <div
    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group border border-gray-100 hover:border-gray-200"
    onClick={() => onProductClick(product)}
  >
    <div className="relative overflow-hidden rounded-t-xl">
      <img
        src={
          product.imageUrl ||
          product.image ||
          product.mainImage ||
          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop"
        }
        alt={product.name}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      {product.isOnSale &&
        product.originalPrice &&
        product.originalPrice > product.price && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
            -
            {Math.round(
              ((product.originalPrice - product.price) /
                product.originalPrice) *
                100
            )}
            %
          </div>
        )}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="bg-white/90 p-1.5 rounded-full shadow-lg">
          <Heart size={16} />
        </button>
      </div>
    </div>

    <div className="p-4">
      <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
        {product.name}
      </h3>

      <div className="flex items-center gap-1 mb-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={12}
              className={
                i < Math.floor(product.rating || 0)
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }
            />
          ))}
        </div>
        <span className="text-xs text-gray-500">
          ({product.reviewCount || 0})
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-blue-600">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        {product.soldCount && (
          <div className="text-xs text-gray-500">
            Đã bán {formatNumber(product.soldCount)}
          </div>
        )}
      </div>
    </div>
  </div>
);

// Main Product Detail Component
const ProductDetailPage = ({
  productId,
  addToCart,
  toggleWishlist,
  wishlistItems = [],
  onProductClick,
}) => {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Chat Modal State
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  // Fetch product data using existing API service
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log(
          `🔍 ProductDetailPage: Fetching product ${productId} using productService`
        );

        // ✅ Use existing productService.getProductById
        const productResponse = await productService.getProductById(productId);
        console.log("✅ ProductDetailPage API response:", productResponse);

        // ✅ FIXED: Handle both possible API response structures
        if (productResponse?.success === true) {
          // Support both response.data and response.product for flexibility
          const rawProduct = productResponse.product || productResponse.data;

          if (!rawProduct || !rawProduct.id) {
            throw new Error("Dữ liệu sản phẩm không hợp lệ hoặc thiếu ID");
          }

          console.log("🔍 ProductDetailPage Raw product data:", rawProduct);

          // ✅ Validate essential product fields before transform
          if (
            !rawProduct.name ||
            (!rawProduct.price && rawProduct.price !== 0)
          ) {
            throw new Error(
              "Dữ liệu sản phẩm thiếu thông tin cần thiết (name, price)"
            );
          }

          // ✅ Transform product with error handling
          let transformedProduct;
          try {
            transformedProduct = transformProduct
              ? transformProduct(rawProduct)
              : rawProduct;
          } catch (transformError) {
            console.warn("Transform failed, using raw data:", transformError);
            transformedProduct = rawProduct;
          }

          // ✅ Professional data enhancement with defensive programming
          transformedProduct = {
            ...transformedProduct,
            // Ensure stock status
            isInStock:
              transformedProduct.isInStock ?? transformedProduct.stock > 0,

            // Handle images professionally
            images: (() => {
              const allImages = [];

              // Add mainImage first if exists
              if (transformedProduct.mainImage) {
                allImages.push(transformedProduct.mainImage);
              }

              // Add images from array
              if (transformedProduct.images?.length > 0) {
                const additionalImages = transformedProduct.images
                  .map((img) => {
                    // Handle both string URLs and image objects
                    if (typeof img === "string") return img;
                    return img.imageUrl || img.url || null;
                  })
                  .filter(Boolean)
                  .filter((url) => url !== transformedProduct.mainImage); // Avoid duplicates

                allImages.push(...additionalImages);
              }

              // Return combined array or fallback
              return allImages.length > 0
                ? allImages
                : [
                    "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=600&fit=crop",
                  ];
            })(),

            // Ensure numeric fields with defaults
            rating: transformedProduct.rating || 0,
            reviewCount: transformedProduct.reviewCount || 0,
            soldCount: transformedProduct.soldCount || 0,
            viewCount: transformedProduct.viewCount || 0,

            // Ensure price fields
            originalPrice:
              transformedProduct.originalPrice || transformedProduct.price,

            // Handle nested objects safely
            brand: transformedProduct.brand || null,
            category:
              transformedProduct.category ||
              transformedProduct.categoryInfo ||
              null,
          };

          console.log(
            "✅ ProductDetailPage Final transformed product:",
            transformedProduct
          );
          setProduct(transformedProduct);

          // ✅ Professional async operations with error boundaries
          await Promise.allSettled([
            fetchRelatedProducts(transformedProduct),
            updateRecentlyViewed(productId),
            trackProductView(productId),
          ]);
        } else {
          // ✅ Enhanced error logging for debugging
          console.error(
            "❌ ProductDetailPage: Invalid API response structure:",
            {
              hasResponse: !!productResponse,
              success: productResponse?.success,
              successType: typeof productResponse?.success,
              hasData: !!productResponse?.data,
              hasProduct: !!productResponse?.product,
              dataType: typeof productResponse?.data,
              productType: typeof productResponse?.product,
              message: productResponse?.message,
              fullResponse: productResponse,
            }
          );

          throw new Error(
            productResponse?.message || "Cấu trúc dữ liệu API không hợp lệ"
          );
        }
      } catch (err) {
        console.error("❌ Error fetching product:", err);
        setError(err.message || "Không thể tải thông tin sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    // ✅ Professional helper functions with error handling
    const fetchRelatedProducts = async (product) => {
      try {
        if (!product.category?.id && !product.categoryId) {
          console.warn("No category ID for related products");
          setRelatedProducts(generateMockRelatedProducts(product));
          return;
        }

        const categoryId = product.category?.id || product.categoryId;
        const response = await productService.getProductsByCategory(
          categoryId,
          {
            pageSize: 4,
            excludeId: productId,
          }
        );

        if (response?.success && response.products?.length > 0) {
          setRelatedProducts(response.products.slice(0, 4));
        } else {
          setRelatedProducts(generateMockRelatedProducts(product));
        }
      } catch (error) {
        console.warn("Failed to fetch related products:", error);
        setRelatedProducts(generateMockRelatedProducts(product));
      }
    };

    const updateRecentlyViewed = async (productId) => {
      try {
        const recent = JSON.parse(
          localStorage.getItem("recentlyViewed") || "[]"
        );
        const updated = [
          productId,
          ...recent.filter((id) => id !== productId),
        ].slice(0, 10);
        localStorage.setItem("recentlyViewed", JSON.stringify(updated));

        // Try to fetch actual recently viewed products
        if (updated.length > 1) {
          const recentIds = updated.slice(1, 5); // Skip current product
          const recentPromises = recentIds.map((id) =>
            productService.getProductById(id).catch(() => null)
          );

          const recentResults = await Promise.all(recentPromises);
          const recentProducts = recentResults
            .filter((r) => r?.success && r?.product)
            .map((r) =>
              transformProduct ? transformProduct(r.product) : r.product
            )
            .slice(0, 4);

          setRecentlyViewed(recentProducts);
        }
      } catch (error) {
        console.warn("Failed to update recently viewed:", error);
      }
    };

    const trackProductView = async (productId) => {
      try {
        // Increment view count locally for immediate UI update
        setProduct((prev) =>
          prev ? { ...prev, viewCount: (prev.viewCount || 0) + 1 } : prev
        );

        // Track in analytics (non-blocking)
        if (window.gtag) {
          window.gtag("event", "page_view", {
            page_title: `Product ${productId}`,
            page_location: window.location.href,
          });
        }
      } catch (error) {
        console.warn("Failed to track product view:", error);
      }
    };

    const generateMockRelatedProducts = (product) => {
      return [
        {
          id: 101,
          name: `${product.name} - Phiên bản tương tự`,
          price: product.price * 0.9,
          originalPrice: product.originalPrice * 0.9,
          mainImage:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
          rating: 4.3,
          reviewCount: 89,
          soldCount: 192,
          isOnSale: true,
        },
        {
          id: 102,
          name: `${product.name} - Mẫu khác`,
          price: product.price * 1.1,
          originalPrice: product.originalPrice * 1.1,
          mainImage:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
          rating: 4.6,
          reviewCount: 156,
          soldCount: 324,
          isOnSale: true,
        },
        {
          id: 103,
          name: `${product.name} - Phiên bản nâng cao`,
          price: product.price * 1.2,
          originalPrice: product.originalPrice * 1.2,
          mainImage:
            "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop",
          rating: 4.4,
          reviewCount: 203,
          soldCount: 418,
          isOnSale: true,
        },
        {
          id: 104,
          name: `${product.name} - Bản đặc biệt`,
          price: product.price * 0.8,
          originalPrice: product.originalPrice * 0.8,
          mainImage:
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
          rating: 4.7,
          reviewCount: 267,
          soldCount: 534,
          isOnSale: true,
        },
      ];
    };

    console.log(
      `🔍 ProductDetailPage useEffect: productId=${productId}, type=${typeof productId}`
    );

    if (productId) {
      fetchProductData();
    } else {
      console.warn("❌ ProductDetailPage: No productId provided");
      setError("Product ID is required");
      setLoading(false);
    }
  }, [productId]);

  // Memoized calculations
  const productImages = useMemo(() => {
    if (!product) {
      return [
        "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=600&fit=crop",
      ];
    }

    if (product.images?.length > 0) {
      return product.images.filter(Boolean);
    }

    if (product.mainImage) {
      return [product.mainImage];
    }

    return [
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=600&fit=crop",
    ];
  }, [product]);

  const isInWishlist = useMemo(
    () => wishlistItems.includes(product?.id),
    [wishlistItems, product?.id]
  );

  const discountPercentage = useMemo(() => {
    if (!product?.originalPrice || product.originalPrice <= product.price)
      return 0;
    return Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    );
  }, [product?.originalPrice, product?.price]);

  // Event handlers
  const handleQuantityChange = useCallback(
    (delta) => {
      setQuantity((prev) => {
        const newQuantity = prev + delta;
        return Math.max(1, Math.min(newQuantity, product?.stock || 999));
      });
    },
    [product?.stock]
  );

  const handleAddToCart = useCallback(async () => {
    if (!product?.isInStock) return;

    setIsAddingToCart(true);
    try {
      for (let i = 0; i < quantity; i++) {
        await addToCart(product);
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  }, [product, quantity, addToCart]);

  const handleToggleWishlist = useCallback(() => {
    if (product?.id) {
      toggleWishlist(product.id);
    }
  }, [product?.id, toggleWishlist]);

  // Chat and Share handlers
  const handleChatClick = () => {
    setIsChatModalOpen(true);
  };

  const handleShareClick = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product?.name || "Sản phẩm",
          text: `Xem sản phẩm ${product?.name} - ${formatPrice(
            product?.price || 0
          )}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        console.log("Đã copy link vào clipboard!");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Share failed:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-4">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-200 aspect-square rounded-xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Không thể tải sản phẩm
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "Sản phẩm không tồn tại hoặc đã bị xóa"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "description", label: "Mô tả", icon: Package },
    { id: "specifications", label: "Thông số", icon: Award },
    {
      id: "reviews",
      label: `Đánh giá (${formatNumber(product.reviewCount || 0)})`,
      icon: Star,
    },
    { id: "warranty", label: "Bảo hành", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <a href="/" className="text-gray-500 hover:text-gray-700">
              Trang chủ
            </a>
            <ChevronRight size={16} className="text-gray-400" />
            <a
              href={`/category/${
                product.category?.slug || product.categoryName
              }`}
              className="text-gray-500 hover:text-gray-700"
            >
              {product.category?.name || product.categoryName || "Danh mục"}
            </a>
            <ChevronRight size={16} className="text-gray-400" />
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-8">
        {/* Main Product Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Images */}
            <div>
              <ImageGallery
                images={productImages}
                productName={product.name}
                onImageClick={(index) => {
                  setModalImageIndex(index);
                  setIsModalOpen(true);
                }}
              />
            </div>

            {/* Right: Product Info */}
            <div className="space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {product.isNew && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium rounded-full">
                    Mới
                  </span>
                )}
                {product.isBestseller && (
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 text-xs font-medium rounded-full">
                    Bán chạy
                  </span>
                )}
                {product.isOnSale && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 text-xs font-medium rounded-full">
                    Giảm giá
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* Brand & Category */}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {product.brand && (
                  <span>
                    Thương hiệu:{" "}
                    <strong className="text-gray-900">
                      {product.brand.name || product.brandName}
                    </strong>
                  </span>
                )}
                {product.category && (
                  <span>
                    Danh mục:{" "}
                    <strong className="text-gray-900">
                      {product.category.name || product.categoryName}
                    </strong>
                  </span>
                )}
              </div>

              {/* Rating & Sales */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={
                          i < Math.floor(product.rating || 0)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">
                    {product.rating || 0}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({formatNumber(product.reviewCount || 0)} đánh giá)
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Đã bán:{" "}
                  <strong className="text-gray-900">
                    {formatNumber(product.soldCount || 0)}
                  </strong>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-blue-600">
                    {formatPrice(product.price)}
                  </span>
                  {discountPercentage > 0 && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <span className="bg-red-100 text-red-700 px-2 py-1 text-sm font-medium rounded-md">
                        -{discountPercentage}%
                      </span>
                    </>
                  )}
                </div>
                {discountPercentage > 0 && (
                  <p className="text-sm text-green-600 font-medium">
                    Tiết kiệm:{" "}
                    {formatPrice(product.originalPrice - product.price)}
                  </p>
                )}
              </div>

              {/* Product Stats */}
              <ProductStats product={product} />

              {/* Stock Status */}
              <div
                className={`p-4 rounded-xl border-2 ${
                  product.isInStock
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  {product.isInStock ? (
                    <>
                      <Check className="text-green-600" size={20} />
                      <div>
                        <div className="font-medium text-green-700">
                          Còn hàng
                        </div>
                        <div className="text-sm text-green-600">
                          {product.stock > 10
                            ? "Số lượng nhiều"
                            : `Chỉ còn ${product.stock} sản phẩm`}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <X className="text-red-600" size={20} />
                      <div>
                        <div className="font-medium text-red-700">
                          Tạm hết hàng
                        </div>
                        <div className="text-sm text-red-600">
                          Sẽ có hàng trong vài ngày tới
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Quantity & Actions */}
              {product.isInStock && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="font-medium">Số lượng:</span>
                    <div className="flex items-center border-2 border-gray-200 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 py-3 min-w-[60px] text-center font-medium border-x border-gray-200">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= (product.stock || 999)}
                        className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={isAddingToCart}
                      className="sm:col-span-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                      {isAddingToCart ? (
                        <RefreshCw size={20} className="animate-spin" />
                      ) : (
                        <ShoppingCart size={20} />
                      )}
                      {isAddingToCart ? "Đang thêm..." : "Thêm vào giỏ hàng"}
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={handleToggleWishlist}
                        className={`flex-1 p-4 rounded-xl border-2 transition-colors ${
                          isInWishlist
                            ? "border-red-300 bg-red-50 text-red-600"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <Heart
                          size={20}
                          className={`mx-auto ${
                            isInWishlist ? "fill-current" : ""
                          }`}
                        />
                      </button>

                      <button
                        onClick={handleShareClick}
                        className="flex-1 p-4 rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-colors"
                      >
                        <Share2 size={20} className="mx-auto" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Guarantees */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Cam kết của chúng tôi
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="text-blue-600" size={16} />
                    <span>Cam kết chính hãng 100%</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="text-blue-600" size={16} />
                    <span>Miễn phí vận chuyển toàn quốc</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <RefreshCw className="text-blue-600" size={16} />
                    <span>Đổi trả miễn phí trong 30 ngày</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="text-blue-600" size={16} />
                    <span>Giao hàng nhanh trong 24h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6">
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <div className="text-gray-700 leading-relaxed space-y-4">
                  {product.description
                    ?.split("\n")
                    .map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    )) || <p>Thông tin mô tả sản phẩm sẽ được cập nhật sớm.</p>}
                </div>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Thông tin cơ bản
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        label: "Thương hiệu",
                        value: product.brand?.name || product.brandName,
                      },
                      {
                        label: "Danh mục",
                        value: product.category?.name || product.categoryName,
                      },
                      { label: "Xuất xứ", value: product.origin },
                      {
                        label: "Trọng lượng",
                        value: product.weight ? `${product.weight}g` : null,
                      },
                    ]
                      .filter((item) => item.value)
                      .map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between py-2 border-b border-gray-100"
                        >
                          <span className="font-medium text-gray-600">
                            {item.label}:
                          </span>
                          <span className="text-gray-900">{item.value}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="text-center py-12">
                <Star className="mx-auto mb-4 text-gray-300" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Chưa có đánh giá
                </h3>
                <p className="text-gray-600 mb-4">
                  Hãy là người đầu tiên đánh giá sản phẩm này!
                </p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Viết đánh giá
                </button>
              </div>
            )}

            {activeTab === "warranty" && (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="text-green-600" size={24} />
                    <h3 className="text-lg font-semibold text-green-800">
                      Sản phẩm chính hãng được xác thực
                    </h3>
                  </div>
                  <p className="text-green-700">
                    Sản phẩm được đảm bảo chính hãng 100% từ nhà phân phối uy
                    tín.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Sản phẩm liên quan
              </h2>
              <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                Xem tất cả
                <ArrowRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  onProductClick={onProductClick}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Sản phẩm đã xem
              </h2>
              <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                Xem lịch sử
                <ArrowRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentlyViewed.map((viewedProduct) => (
                <ProductCard
                  key={viewedProduct.id}
                  product={viewedProduct}
                  onProductClick={onProductClick}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <X size={32} />
          </button>

          <div className="relative max-w-4xl max-h-full">
            <img
              src={productImages[modalImageIndex]}
              alt={`${product.name} - Full size ${modalImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {productImages.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setModalImageIndex(
                      (prev) =>
                        (prev - 1 + productImages.length) % productImages.length
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  onClick={() =>
                    setModalImageIndex(
                      (prev) => (prev + 1) % productImages.length
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Floating Buttons */}
      <FloatingButtons
        showQuickActions={true}
        onMessageClick={handleChatClick}
        onShareClick={handleShareClick}
      />

      {/* Chat Modal */}
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        productInfo={{
          name: product?.name,
          price: product?.price,
          id: product?.id,
          url: window.location.href,
        }}
      />
    </div>
  );
};

export default ProductDetailPage;
