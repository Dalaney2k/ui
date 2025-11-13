import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  Grid,
  List,
  Search,
  ChevronDown,
  X,
  SlidersHorizontal,
} from "lucide-react";
import ProductCard from "../components/Product/ProductCard";
import { productService, categoryService } from "../services/index.js";
import { transformProducts, transformCategories } from "../utils/dataTransform";

// Custom hook cho debounced search
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const ProductsPage = ({
  selectedCategory,
  setSelectedCategory,
  addToCart,
  toggleWishlist,
  wishlistItems,
  isInWishlist,
  onQuickView,
  onNotification,
}) => {
  // States
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [showFilters, setShowFilters] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Data states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Server-side pagination states
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [apiLoading, setApiLoading] = useState(false);

  // Ref để track mounted state - FIX: Khởi tạo true và không reset trong effect
  const isMountedRef = useRef(true);

  // === OPTIMIZATION: Debounced search với delay dài hơn ===
  const debouncedSearchTerm = useDebounce(searchTerm, 1000); // Tăng delay lên 1000ms

  // === FIX: Memoized API params với stable reference ===
  const apiParams = useMemo(() => {
    const params = {
      page: currentPage,
      pageSize: itemsPerPage,
    };

    // === UPDATED: Sort by mapping theo API docs ===
    if (sortBy) {
      switch (sortBy) {
        case "name":
          params.sortBy = "name";
          params.sortOrder = "asc";
          break;
        case "price-low":
          params.sortBy = "price";
          params.sortOrder = "asc";
          break;
        case "price-high":
          params.sortBy = "price";
          params.sortOrder = "desc";
          break;
        case "newest":
          params.sortBy = "created";
          params.sortOrder = "desc";
          break;
        case "bestseller":
          params.sortBy = "sold";
          params.sortOrder = "desc";
          break;
        case "rating":
          params.sortBy = "rating";
          params.sortOrder = "desc";
          break;
        case "popularity":
          params.sortBy = "popularity";
          params.sortOrder = "desc";
          break;
        case "discount":
          params.sortBy = "discount";
          params.sortOrder = "desc";
          break;
        default:
          params.sortBy = "relevance";
          params.sortOrder = "desc";
      }
    }

    // Chỉ thêm search nếu có giá trị sau debounce
    if (debouncedSearchTerm && debouncedSearchTerm.trim()) {
      params.search = debouncedSearchTerm.trim();
    }

    // === UPDATED: Sử dụng categoryId (number) thay vì category slug ===
    if (selectedCategory && selectedCategory !== "all") {
      // Chuyển đổi từ category slug/id sang integer categoryId
      const categoryId =
        typeof selectedCategory === "string" && selectedCategory !== "all"
          ? parseInt(selectedCategory) || null
          : selectedCategory;

      if (categoryId && !isNaN(categoryId)) {
        params.categoryId = categoryId;
      }
    }

    // === FIX: Price range implementation ===
    if (priceRange[0] > 0) {
      params.minPrice = priceRange[0];
    }
    if (priceRange[1] < 10000000) {
      params.maxPrice = priceRange[1];
    }

    return params;
  }, [
    currentPage,
    itemsPerPage,
    debouncedSearchTerm,
    selectedCategory,
    sortBy,
    priceRange,
  ]);

  // === OPTIMIZATION: Memoized fetch function với better error handling ===
  const fetchProducts = useCallback(
    async (params) => {
      console.log(
        "🔍 fetchProducts called, isMounted:",
        isMountedRef.current,
        "params:",
        params
      );

      // Simplified mount check
      if (!isMountedRef.current) {
        console.log("⚠️ Component unmounted, skipping fetchProducts");
        return;
      }

      try {
        setApiLoading(true);
        console.log("🔍 ProductsPage: Fetching products with params:", params);

        const response = await productService.getProducts(params);

        // Check if component is still mounted before updating state
        if (!isMountedRef.current) return;

        console.log("✅ Products response:", response);
        console.log("🔍 Response structure check:", {
          hasData: !!response.data,
          dataType: Array.isArray(response.data)
            ? "array"
            : typeof response.data,
          dataLength: Array.isArray(response.data)
            ? response.data.length
            : "not array",
          hasProducts: !!response.products,
          productsType: Array.isArray(response.products)
            ? "array"
            : typeof response.products,
          productsLength: Array.isArray(response.products)
            ? response.products.length
            : "not array",
          isDirectArray: Array.isArray(response),
          directArrayLength: Array.isArray(response)
            ? response.length
            : "not array",
        });

        // Xử lý response data
        let productsData = [];
        let pagination = {};

        if (response.data) {
          if (Array.isArray(response.data)) {
            productsData = response.data;
            pagination = response.pagination || {};
          } else if (response.data.data && Array.isArray(response.data.data)) {
            productsData = response.data.data;
            pagination = response.data.pagination || response.pagination || {};
          } else if (
            response.data.products &&
            Array.isArray(response.data.products)
          ) {
            productsData = response.data.products;
            pagination = response.data.pagination || response.pagination || {};
          }
        } else if (response.products && Array.isArray(response.products)) {
          productsData = response.products;
          pagination = response.pagination || {};
        } else if (Array.isArray(response)) {
          productsData = response;
          pagination = {};
        }

        console.log("🔍 Raw products data:", productsData);
        console.log("📊 Products count before transform:", productsData.length);

        // Transform products safely
        let transformedProducts = [];

        if (productsData && productsData.length > 0) {
          try {
            if (typeof transformProducts === "function") {
              transformedProducts = transformProducts(productsData);
            } else {
              console.warn(
                "⚠️ transformProducts function not found, using raw data"
              );
              transformedProducts = productsData.map((product) => ({
                id: product.id || product._id,
                name: product.name || product.title || "Unnamed Product",
                price: product.price || 0,
                originalPrice: product.originalPrice || product.oldPrice,
                image: product.image || product.mainImage || product.thumbnail,
                mainImage:
                  product.mainImage || product.image || product.thumbnail,
                description: product.description || "",
                shortDescription: product.shortDescription || product.summary,
                category: product.category || product.categoryName,
                rating: product.rating || 4.5,
                reviewCount: product.reviewCount || product.reviews || 0,
                isInStock: product.isInStock !== false,
                isNew: product.isNew || false,
                isOnSale:
                  product.isOnSale ||
                  (product.originalPrice &&
                    product.originalPrice > product.price),
                ...product,
              }));
            }
          } catch (transformError) {
            console.error("❌ Transform error:", transformError);
            transformedProducts = productsData;
          }
        }

        console.log("✅ Transformed products:", transformedProducts);
        console.log("📊 Final products count:", transformedProducts.length);

        // Only update state if component is still mounted
        if (isMountedRef.current) {
          console.log("🔄 Setting products state:", transformedProducts.length);
          setProducts(transformedProducts);

          // Set pagination info
          const totalItems =
            pagination.totalItems ||
            pagination.total ||
            transformedProducts.length;
          const totalPagesCalc =
            pagination.totalPages || Math.ceil(totalItems / itemsPerPage);

          console.log("📊 Setting pagination:", {
            totalItems,
            totalPagesCalc,
            pagination,
          });

          setTotalProducts(totalItems);
          setTotalPages(totalPagesCalc);

          console.log(
            `📊 Loaded ${transformedProducts.length} products (Page ${
              pagination.currentPage || currentPage
            }/${totalPagesCalc})`
          );
          console.log(`📈 Total: ${totalItems} products`);
        }
      } catch (error) {
        console.error("❌ ProductsPage: Error fetching products:", error);
        if (isMountedRef.current) {
          console.log("🔄 Setting empty products due to error");
          setProducts([]);
          setTotalProducts(0);
          setTotalPages(0);
        }
      } finally {
        if (isMountedRef.current) {
          console.log("🔄 Setting loading states to false");
          setApiLoading(false);
          setLoading(false);
        }
      }
    },
    [itemsPerPage, currentPage]
  );

  // === OPTIMIZATION: Effect với dependency chính xác ===
  useEffect(() => {
    console.log(
      "🔄 Effect triggered for fetchProducts, isMounted:",
      isMountedRef.current
    );
    // Remove timeout protection that was causing issues
    fetchProducts(apiParams);
  }, [fetchProducts, apiParams]);

  // === FIX: Fetch categories (only once) với better error handling ===
  useEffect(() => {
    console.log(
      "🔄 Categories effect triggered, isMounted:",
      isMountedRef.current
    );

    const fetchCategories = async () => {
      try {
        console.log("🔍 ProductsPage: Fetching categories...");
        const response = await categoryService.getCategories();

        // Simplified mount check
        if (!isMountedRef.current) return;

        let categoriesData = [];

        if (response.data) {
          categoriesData = Array.isArray(response.data)
            ? response.data
            : response.data.categories || response.data.data || [];
        } else if (response.categories) {
          categoriesData = response.categories;
        } else if (Array.isArray(response)) {
          categoriesData = response;
        }

        console.log("🔍 Raw categories data:", categoriesData);

        let transformedCategories = [];

        if (categoriesData && categoriesData.length > 0) {
          try {
            if (typeof transformCategories === "function") {
              transformedCategories = transformCategories(categoriesData);
            } else {
              console.warn(
                "⚠️ transformCategories function not found, using raw data"
              );
              transformedCategories = categoriesData.map((cat) => ({
                id: cat.id || cat._id,
                name: cat.name || cat.title,
                slug: cat.slug || cat.id || cat._id,
                ...cat,
              }));
            }
          } catch (transformError) {
            console.error("❌ Categories transform error:", transformError);
            transformedCategories = categoriesData;
          }
        }

        if (isMountedRef.current) {
          console.log("🔄 Setting categories:", transformedCategories.length);
          setCategories(transformedCategories);
          console.log("✅ Categories loaded:", transformedCategories.length);
        }
      } catch (error) {
        console.error("❌ ProductsPage: Error fetching categories:", error);
      } finally {
        if (isMountedRef.current) {
          console.log("🔄 Setting categoriesLoading to false");
          setCategoriesLoading(false);
        }
      }
    };

    fetchCategories();
  }, []);

  // === OPTIMIZATION: Reset page chỉ khi filter thay đổi ===
  useEffect(() => {
    // Chỉ reset khi debounced search thay đổi (tức là user đã dừng typing)
    if (currentPage !== 1) {
      console.log("🔄 Resetting to page 1 due to filter change");
      setCurrentPage(1);
    }
  }, [selectedCategory, debouncedSearchTerm, sortBy, priceRange, itemsPerPage]);

  // === FIX: Cleanup effect - CHỈ set false khi thực sự unmount ===
  useEffect(() => {
    isMountedRef.current = true; // Ensure it's true on mount
    return () => {
      isMountedRef.current = false; // Only set false on real unmount
    };
  }, []);

  // Category options with "All"
  const categoryOptions = useMemo(
    () => [{ id: "all", name: "Tất cả sản phẩm", slug: "all" }, ...categories],
    [categories]
  );

  // Sort options (Updated theo API docs)
  const sortOptions = [
    { value: "relevance", label: "Phù hợp nhất" },
    { value: "popularity", label: "Phổ biến nhất" },
    { value: "rating", label: "Đánh giá cao nhất" },
    { value: "price-low", label: "Giá thấp đến cao" },
    { value: "price-high", label: "Giá cao đến thấp" },
    { value: "newest", label: "Mới nhất" },
    { value: "bestseller", label: "Bán chạy nhất" },
    { value: "discount", label: "Giảm giá nhiều nhất" },
    { value: "name", label: "Tên A-Z" },
  ];

  // Price ranges (Memoized để tránh re-render)
  const priceRanges = useMemo(
    () => [
      { label: "Tất cả", value: [0, 10000000] },
      { label: "Dưới 100k", value: [0, 100000] },
      { label: "100k - 500k", value: [100000, 500000] },
      { label: "500k - 1 triệu", value: [500000, 1000000] },
      { label: "1 triệu - 2 triệu", value: [1000000, 2000000] },
      { label: "2 triệu - 5 triệu", value: [2000000, 5000000] },
      { label: "Trên 5 triệu", value: [5000000, 10000000] },
    ],
    []
  );

  // === OPTIMIZATION: Memoized handlers ===
  const handleItemsPerPageChange = useCallback((newItemsPerPage) => {
    console.log("🔄 Changing items per page to:", newItemsPerPage);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback(
    (page) => {
      if (page >= 1 && page <= totalPages && !apiLoading) {
        console.log(`🔄 Changing page from ${currentPage} to ${page}`);
        setCurrentPage(page);
        // Scroll to top khi chuyển trang
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [currentPage, totalPages, apiLoading]
  );

  // === FIX: Category selection handler ===
  const handleCategoryChange = useCallback(
    (categoryId) => {
      console.log("🔄 Changing category to:", categoryId);
      setSelectedCategory(categoryId);
      setCurrentPage(1);
      // Clear search khi chọn category
      if (searchTerm) {
        setSearchTerm("");
      }
    },
    [setSelectedCategory, searchTerm]
  );

  // === OPTIMIZATION: Clear filters handler ===
  const clearAllFilters = useCallback(() => {
    console.log("🔄 Clearing all filters");
    setSearchTerm("");
    setSelectedCategory("all");
    setSortBy("name");
    setPriceRange([0, 10000000]);
    setItemsPerPage(12);
    setCurrentPage(1);
  }, [setSelectedCategory]);

  // === OPTIMIZATION: Search handler với immediate UI update ===
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Không reset page ở đây, để debounce xử lý
  }, []);

  // === FIX: Sort handler ===
  const handleSortChange = useCallback((newSortBy) => {
    console.log("🔄 Changing sort to:", newSortBy);
    setSortBy(newSortBy);
    setCurrentPage(1);
  }, []);

  // === FIX: Price range handler ===
  const handlePriceRangeChange = useCallback(
    (rangeIndex) => {
      const newRange = priceRanges[parseInt(rangeIndex)].value;
      console.log("🔄 Changing price range to:", newRange);
      setPriceRange(newRange);
      setCurrentPage(1);
    },
    [priceRanges]
  );

  // Skeleton loader component
  const SkeletonProductCard = React.memo(({ viewMode }) => (
    <div
      className={`
      bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse
      ${viewMode === "list" ? "flex" : ""}
    `}
    >
      {viewMode === "list" ? (
        <>
          <div className="w-48 h-48 bg-gray-200 flex-shrink-0"></div>
          <div className="flex-1 p-6 space-y-4">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="flex space-x-2">
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="aspect-square bg-gray-200"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="flex space-x-2">
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </>
      )}
    </div>
  ));

  // Debug log - immediate để troubleshoot
  console.log("🐛 DEBUG ProductsPage render:", {
    loading,
    categoriesLoading,
    apiLoading,
    productsCount: products.length,
    totalProducts,
    totalPages,
    currentPage,
    selectedCategory,
    searchTerm,
    debouncedSearchTerm,
    sortBy,
    priceRange,
    apiParams,
  });

  // Loading state
  if (loading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-white shadow-sm border-b flex-shrink-0">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <div className="h-10 bg-gray-200 rounded w-80 mx-auto mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 shadow-sm border border-gray-200">
              <div className="h-16 bg-gray-200 rounded-2xl animate-pulse mb-6"></div>
              <div className="flex gap-3 justify-center">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="h-12 w-32 bg-gray-200 rounded-2xl animate-pulse"
                    ></div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array(12)
              .fill(0)
              .map((_, index) => (
                <SkeletonProductCard
                  key={`skeleton-${index}`}
                  viewMode="grid"
                />
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Professional Header with Integrated Search & Filters */}
      <div className="bg-white shadow-sm border-b flex-shrink-0">
        <div className="container mx-auto px-4 py-8">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              Sản Phẩm Nhật Bản
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Khám phá bộ sưu tập đồ Nhật chính hãng với chất lượng cao và thiết
              kế tinh tế
            </p>
          </div>

          {/* Professional Search & Filter Panel */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 shadow-sm border border-gray-200">
            {/* Main Search Row */}
            <div className="flex flex-col lg:flex-row gap-6 items-center mb-6">
              {/* Search Box */}
              <div className="flex-1 relative w-full lg:w-auto">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên sản phẩm, thương hiệu, mô tả..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-14 pr-14 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-red-500 focus:ring-4 focus:ring-red-100 focus:outline-none transition-all shadow-sm text-lg"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                {/* Search status indicator */}
                {searchTerm !== debouncedSearchTerm && (
                  <div className="absolute right-14 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                  </div>
                )}
              </div>

              {/* Quick Category Filters */}
              <div className="flex items-center gap-3 flex-wrap">
                {categoryOptions.slice(0, 4).map((category) => (
                  <button
                    key={category.slug}
                    onClick={() => handleCategoryChange(category.id)}
                    disabled={apiLoading}
                    className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                      selectedCategory === category.id
                        ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                        : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}

                {/* Advanced Filters Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  disabled={apiLoading}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                    showFilters
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200"
                      : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  <span>Bộ lọc nâng cao</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      showFilters ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Advanced Filters - Collapsible */}
            {showFilters && (
              <div className="border-t-2 border-gray-200 pt-6 animate-in slide-in-from-top-2 duration-300">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                  <SlidersHorizontal className="w-5 h-5 mr-2 text-red-500" />
                  Bộ lọc chi tiết
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Categories Dropdown */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">
                      Danh mục sản phẩm
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      disabled={apiLoading}
                      className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-red-500 focus:ring-4 focus:ring-red-100 focus:outline-none transition-all text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {categoryOptions.map((category) => (
                        <option key={category.slug} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort Options */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">
                      Sắp xếp theo
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      disabled={apiLoading}
                      className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-red-500 focus:ring-4 focus:ring-red-100 focus:outline-none transition-all text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">
                      Khoảng giá
                    </label>
                    <select
                      value={priceRanges.findIndex(
                        (range) =>
                          range.value[0] === priceRange[0] &&
                          range.value[1] === priceRange[1]
                      )}
                      onChange={(e) => handlePriceRangeChange(e.target.value)}
                      disabled={apiLoading}
                      className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-red-500 focus:ring-4 focus:ring-red-100 focus:outline-none transition-all text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {priceRanges.map((range, index) => (
                        <option key={index} value={index}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Items per page */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">
                      Số sản phẩm hiển thị
                    </label>
                    <select
                      value={itemsPerPage}
                      onChange={(e) =>
                        handleItemsPerPageChange(parseInt(e.target.value))
                      }
                      disabled={apiLoading}
                      className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-red-500 focus:ring-4 focus:ring-red-100 focus:outline-none transition-all text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value={12}>12 sản phẩm</option>
                      <option value={24}>24 sản phẩm</option>
                      <option value={36}>36 sản phẩm</option>
                      <option value={48}>48 sản phẩm</option>
                    </select>
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t-2 border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-semibold text-gray-700">
                      Tìm thấy{" "}
                      <span className="text-2xl font-bold text-red-600">
                        {totalProducts}
                      </span>{" "}
                      sản phẩm
                    </span>
                  </div>
                  <button
                    onClick={clearAllFilters}
                    disabled={apiLoading}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Xóa tất cả bộ lọc
                  </button>
                </div>
              </div>
            )}

            {/* Results Summary & View Toggle */}
            <div className="flex justify-between items-center pt-6">
              <div className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <span>
                  Hiển thị{" "}
                  {products.length > 0
                    ? (currentPage - 1) * itemsPerPage + 1
                    : 0}
                  -{Math.min(currentPage * itemsPerPage, totalProducts)} trong{" "}
                  {totalProducts} sản phẩm (Trang {currentPage}/{totalPages})
                </span>
                {apiLoading && (
                  <div className="flex items-center text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    <span className="text-sm">Đang tải...</span>
                  </div>
                )}
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  disabled={apiLoading}
                  className={`p-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                    viewMode === "grid"
                      ? "bg-red-500 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  disabled={apiLoading}
                  className={`p-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                    viewMode === "list"
                      ? "bg-red-500 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Display & Content */}
      <div className="flex-1 container mx-auto px-4 py-12">
        {products.length === 0 && !apiLoading ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-200">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm khác
            </p>
            <button
              onClick={clearAllFilters}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-2xl transition-all transform hover:scale-105 font-semibold text-lg shadow-lg"
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        ) : (
          <>
            {/* Products Grid/List */}
            <div
              className={`
              ${
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                  : "space-y-6"
              }
            `}
            >
              {apiLoading
                ? // Show skeleton while loading
                  Array(itemsPerPage)
                    .fill(0)
                    .map((_, index) => (
                      <SkeletonProductCard
                        key={`loading-skeleton-${index}`}
                        viewMode={viewMode}
                      />
                    ))
                : products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      addToCart={addToCart}
                      toggleWishlist={toggleWishlist}
                      wishlistItems={wishlistItems}
                      isInWishlist={isInWishlist}
                      onQuickView={onQuickView}
                      onNotification={onNotification}
                      viewMode={viewMode}
                    />
                  ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-16 space-x-3">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || apiLoading}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all font-semibold"
                >
                  ← Trước
                </button>

                {/* Smart pagination */}
                {(() => {
                  const maxVisiblePages = 5;
                  let startPage = Math.max(
                    1,
                    currentPage - Math.floor(maxVisiblePages / 2)
                  );
                  let endPage = Math.min(
                    totalPages,
                    startPage + maxVisiblePages - 1
                  );

                  if (endPage - startPage + 1 < maxVisiblePages) {
                    startPage = Math.max(1, endPage - maxVisiblePages + 1);
                  }

                  const pages = [];

                  if (startPage > 1) {
                    pages.push(1);
                    if (startPage > 2) {
                      pages.push("...");
                    }
                  }

                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(i);
                  }

                  if (endPage < totalPages) {
                    if (endPage < totalPages - 1) {
                      pages.push("...");
                    }
                    pages.push(totalPages);
                  }

                  return pages.map((page, index) => {
                    if (page === "...") {
                      return (
                        <span
                          key={`ellipsis-${index}`}
                          className="px-4 py-3 text-gray-500"
                        >
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        disabled={apiLoading}
                        className={`px-4 py-3 border-2 rounded-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed ${
                          currentPage === page
                            ? "border-red-500 bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                            : "border-gray-300 hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  });
                })()}

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || apiLoading}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all font-semibold"
                >
                  Sau →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
