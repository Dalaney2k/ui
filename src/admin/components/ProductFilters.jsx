import React, { useState, useEffect } from "react";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";
import {
  adminBrandService,
  adminCategoryService,
} from "../services/AdminApiService.js";

const ProductFilters = ({
  filters,
  onFiltersChange,
  stats = {},
  onClearFilters,
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [commonTags] = useState([
    "matcha",
    "tea",
    "watch",
    "traditional",
    "eco-friendly",
    "premium",
    "limited-edition",
    "japanese",
    "ceramic",
    "health",
    "beauty",
    "electronics",
    "food",
    "beverage",
  ]);

  // Load categories and brands
  useEffect(() => {
    const loadFilterData = async () => {
      try {
        console.log("📂 [FILTER] Loading categories and brands...");
        const [categoriesResponse, brandsResponse] = await Promise.all([
          adminCategoryService.getCategories(),
          adminBrandService.getBrands(),
        ]);

        console.log("📂 [FILTER] Categories response:", categoriesResponse);
        console.log("🏷️ [FILTER] Brands response:", brandsResponse);

        if (categoriesResponse && categoriesResponse.length > 0) {
          setCategories(
            categoriesResponse.map((cat) => ({
              value: cat.id || cat.slug,
              label: cat.name || cat.title,
            }))
          );
        }

        if (brandsResponse && brandsResponse.length > 0) {
          setBrands(
            brandsResponse.map((brand) => ({
              value: brand.id || brand.slug,
              label: brand.name || brand.title,
            }))
          );
        }
      } catch (error) {
        console.error("❌ [FILTER] Error loading filter data:", error);
      }
    };

    loadFilterData();
  }, []);

  // Product Status enum mapping
  const productStatuses = [
    { value: 0, label: "Nháp", color: "text-gray-600" },
    { value: 1, label: "Hoạt động", color: "text-green-600" },
    { value: 2, label: "Không hoạt động", color: "text-red-600" },
    { value: 3, label: "Hết hàng", color: "text-orange-600" },
    { value: 4, label: "Ngừng bán", color: "text-red-800" },
    { value: 5, label: "Sắp ra mắt", color: "text-blue-600" },
  ];

  const handleInputChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    // Debounce search input
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      handleInputChange("search", value);
    }, 300);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleInputChange("search", searchInput);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Bộ lọc sản phẩm</h3>
      </div>
      <div className="card-content">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchInput}
              onChange={handleSearchChange}
              className="input w-full pl-10"
            />
          </div>
        </form>

        {/* Quick Filters */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Lọc nhanh</h3>
          <div className="flex flex-wrap gap-2">
            {/* Status Quick Filters */}
            <button
              onClick={() =>
                handleInputChange("status", filters.status === 1 ? "" : 1)
              }
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                filters.status === 1
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Hoạt động ({stats.active || 0})
            </button>

            <button
              onClick={() =>
                handleInputChange("status", filters.status === 2 ? "" : 2)
              }
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                filters.status === 2
                  ? "bg-red-100 text-red-800 border border-red-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Không hoạt động ({stats.inactive || 0})
            </button>

            <button
              onClick={() =>
                handleInputChange("status", filters.status === 3 ? "" : 3)
              }
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                filters.status === 3
                  ? "bg-orange-100 text-orange-800 border border-orange-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Hết hàng ({stats.outOfStock || 0})
            </button>

            <button
              onClick={() =>
                handleInputChange("status", filters.status === 0 ? "" : 0)
              }
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                filters.status === 0
                  ? "bg-gray-100 text-gray-800 border border-gray-300"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Nháp ({stats.draft || 0})
            </button>

            <button
              onClick={() =>
                handleInputChange("status", filters.status === 4 ? "" : 4)
              }
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                filters.status === 4
                  ? "bg-red-100 text-red-800 border border-red-300"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Ngừng bán ({stats.discontinued || 0})
            </button>

            <button
              onClick={() =>
                handleInputChange("status", filters.status === 5 ? "" : 5)
              }
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                filters.status === 5
                  ? "bg-blue-100 text-blue-800 border border-blue-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Sắp ra mắt ({stats.comingSoon || 0})
            </button>

            {/* Feature Filters */}
            <button
              onClick={() =>
                handleInputChange("isFeatured", !filters.isFeatured)
              }
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                filters.isFeatured
                  ? "bg-purple-100 text-purple-800 border border-purple-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Nổi bật ({stats.featured || 0})
            </button>

            <button
              onClick={() => handleInputChange("isNew", !filters.isNew)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                filters.isNew
                  ? "bg-blue-100 text-blue-800 border border-blue-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Mới ({stats.new || 0})
            </button>

            <button
              onClick={() =>
                handleInputChange(
                  "inStock",
                  filters.inStock === false ? undefined : false
                )
              }
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                filters.inStock === false
                  ? "bg-orange-100 text-orange-800 border border-orange-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Hết hàng ({stats.outOfStock || 0})
            </button>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="border-t pt-4">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Lọc nâng cao
            {showAdvancedFilters ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showAdvancedFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <select
                  value={filters.status !== undefined ? filters.status : ""}
                  onChange={(e) =>
                    handleInputChange(
                      "status",
                      e.target.value === ""
                        ? undefined
                        : parseInt(e.target.value)
                    )
                  }
                  className="select w-full"
                >
                  <option value="">Tất cả trạng thái</option>
                  {productStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Danh mục
                </label>
                <select
                  value={filters.categoryId || ""}
                  onChange={(e) =>
                    handleInputChange("categoryId", e.target.value)
                  }
                  className="select w-full"
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thương hiệu
                </label>
                <select
                  value={filters.brandId || ""}
                  onChange={(e) => handleInputChange("brandId", e.target.value)}
                  className="select w-full"
                >
                  <option value="">Tất cả thương hiệu</option>
                  {brands.map((brand) => (
                    <option key={brand.value} value={brand.value}>
                      {brand.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tag Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thẻ tag
                </label>
                <select
                  value={filters.tag || ""}
                  onChange={(e) => handleInputChange("tag", e.target.value)}
                  className="select w-full"
                >
                  <option value="">Tất cả tag</option>
                  {commonTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá từ (VNĐ)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.priceMin || ""}
                  onChange={(e) =>
                    handleInputChange("priceMin", e.target.value)
                  }
                  className="input w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá đến (VNĐ)
                </label>
                <input
                  type="number"
                  placeholder="10000000"
                  value={filters.priceMax || ""}
                  onChange={(e) =>
                    handleInputChange("priceMax", e.target.value)
                  }
                  className="input w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Clear Filters Button */}
        {(filters.search ||
          filters.status !== undefined ||
          filters.categoryId ||
          filters.brandId ||
          filters.tag ||
          filters.priceMin ||
          filters.priceMax ||
          filters.isFeatured ||
          filters.isNew ||
          filters.inStock === false) && (
          <div className="mt-4 pt-4 border-t">
            <button
              onClick={onClearFilters}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Xóa tất cả bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;
