import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Upload,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { productService } from "../services/AdminApiService.js";
import ProductFilters from "../components/ProductFilters.jsx";

// Debounce hook
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

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    pageSize: 20,
    tag: "",
    category: "",
    brand: "",
    status: "",
    priceMin: "",
    priceMax: "",
    updatedSince: "",
    sortBy: "newest",
  });

  // Stats for quick filters
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    outOfStock: 0,
    featured: 0,
    new: 0,
    filtered: 0,
  });

  // Debounced search
  const debouncedSearch = useDebounce(filters.search, 500);

  // Fetch products with proper filter handling
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Prepare filters for API - send all non-empty filters
      const apiFilters = {
        page: filters.page || pagination.page,
        pageSize: filters.pageSize || 20,
      };

      // Add all filters that have values
      if (debouncedSearch && debouncedSearch.trim()) {
        apiFilters.search = debouncedSearch.trim();
      }
      if (filters.tag) {
        apiFilters.tag = filters.tag;
      }
      if (filters.categoryId) {
        apiFilters.categoryId = filters.categoryId;
      }
      if (filters.category) {
        apiFilters.category = filters.category;
      }
      if (filters.brandId) {
        apiFilters.brandId = filters.brandId;
      }
      if (filters.brand) {
        apiFilters.brand = filters.brand;
      }
      if (filters.status) {
        apiFilters.status = filters.status;
      }
      if (filters.priceMin) {
        apiFilters.priceMin = parseFloat(filters.priceMin);
      }
      if (filters.priceMax) {
        apiFilters.priceMax = parseFloat(filters.priceMax);
      }
      if (filters.sortBy && filters.sortBy !== "newest") {
        apiFilters.sortBy = filters.sortBy;
      }
      if (filters.inStock === false) {
        apiFilters.inStock = false;
      }
      if (filters.isFeatured === true) {
        apiFilters.isFeatured = true;
      }
      if (filters.isNew === true) {
        apiFilters.isNew = true;
      }

      console.log("🔍 Calling API with filters:", apiFilters);
      const response = await productService.getProducts(apiFilters);
      console.log("📦 API response:", response);
      console.log("📦 Response structure:", {
        hasData: !!response?.data,
        hasItems: !!response?.items,
        responseKeys: Object.keys(response || {}),
        dataKeys: response?.data ? Object.keys(response.data) : null,
        itemsLength: response?.items?.length || 0,
        dataItemsLength: response?.data?.items?.length || 0,
      });

      if (!response) {
        throw new Error("API response is null or undefined");
      }

      // Handle response safely - check multiple possible structures
      let products = [];
      let paginationData = {};
      let statsData = {};

      if (response.data && response.data.items) {
        // Structure: { data: { items: [...], pagination: {...} } }
        products = response.data.items || [];
        paginationData = response.data.pagination || {};
        statsData = response.data.stats || {};
      } else if (response.items) {
        // Structure: { items: [...], pagination: {...} }
        products = response.items || [];
        paginationData = response.pagination || {};
        statsData = response.stats || {};
      } else if (response.data && Array.isArray(response.data)) {
        // Structure: { data: [...] }
        products = response.data || [];
        paginationData = response.pagination || {};
        statsData = response.stats || {};
      } else if (Array.isArray(response)) {
        // Structure: [...]
        products = response || [];
      } else {
        console.warn("⚠️ Unexpected response structure:", response);
        products = [];
      }

      console.log("📦 Extracted data:", {
        productsLength: products.length,
        products: products.slice(0, 2), // Show first 2 products for debugging
        paginationData,
        statsData,
      });

      setProducts(products);
      setPagination((prev) => ({
        ...prev,
        page: paginationData.currentPage || pagination.page,
        pageSize: paginationData.pageSize || filters.pageSize,
        totalItems: paginationData.totalItems || products.length,
        totalPages:
          paginationData.totalPages ||
          Math.ceil(
            (paginationData.totalItems || products.length) / filters.pageSize
          ),
      }));

      // Update stats - keep original total stats but update filtered count
      const filteredCount = paginationData.totalItems || products.length;

      // Only update filtered count, keep original total stats for quick filters
      setStats((prevStats) => ({
        ...prevStats, // Keep original stats (total, active, inactive, etc.)
        filtered: filteredCount, // Update only filtered count
        // If this is the first load (no filters), update all stats
        ...(Object.keys(apiFilters).length <= 2 && statsData
          ? {
              total: statsData.total || filteredCount,
              active: statsData.active || prevStats.active,
              inactive: statsData.inactive || prevStats.inactive,
              outOfStock: statsData.outOfStock || prevStats.outOfStock,
              featured: statsData.featured || prevStats.featured,
              new: statsData.new || prevStats.new,
            }
          : {}),
      }));
    } catch (error) {
      console.error("Load products error:", error);
      setError(`Không thể tải danh sách sản phẩm: ${error.message}`);
      // Set empty data on error
      setProducts([]);
      setPagination((prev) => ({ ...prev, totalItems: 0, totalPages: 0 }));
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    filters.page,
    filters.pageSize,
    filters.tag,
    filters.category,
    filters.categoryId,
    filters.brand,
    filters.brandId,
    filters.status,
    filters.priceMin,
    filters.priceMax,
    filters.sortBy,
    filters.inStock,
    filters.isFeatured,
    filters.isNew,
    debouncedSearch,
  ]);

  // Load initial stats
  const loadStats = useCallback(async () => {
    try {
      const statsData = await productService.getProductStats();
      if (statsData && Object.keys(statsData).length > 0) {
        setStats((prev) => ({
          ...prev,
          ...statsData,
        }));
      }
    } catch (error) {
      console.error("Load stats error:", error);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Load stats on component mount
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Chọn tất cả checkbox
  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((p) => p.id));
    }
  };

  // Chọn 1 sản phẩm
  const toggleSelectProduct = (id) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter((pid) => pid !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    console.log("🔄 Clearing all filters");
    setFilters({
      search: "",
      pageSize: 20,
      tag: "",
      category: "",
      brand: "",
      status: "",
      priceMin: "",
      priceMax: "",
      updatedSince: "",
      sortBy: "newest",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  // Handle filters change
  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  // Handle page change
  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage >= 1 && newPage <= pagination.totalPages) {
        setPagination((prev) => ({ ...prev, page: newPage }));
      }
    },
    [pagination.totalPages]
  );

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <h1 className="page-title">Sản phẩm</h1>
          <div className="flex items-center gap-3">
            <button className="btn btn-outline">
              <Download size={16} />
              Xuất danh sách
            </button>
            <button className="btn btn-outline">
              <Upload size={16} />
              Nhập danh sách
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/admin/products/add")}
            >
              <Plus size={16} />
              Thêm sản phẩm
            </button>
          </div>
        </div>
      </div>
      {/* Product Filters */}
      <ProductFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        stats={stats}
        loading={loading}
        onClearFilters={clearAllFilters}
      />

      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="card-title">Danh sách sản phẩm</h3>
            </div>

            {/* Bulk Actions */}
            {selectedProducts.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Đã chọn {selectedProducts.length} sản phẩm
                </span>
                <button className="btn btn-outline btn-sm">Xóa đã chọn</button>
                <button className="btn btn-outline btn-sm">Xuất đã chọn</button>
              </div>
            )}
          </div>
        </div>
        <div className="card-content p-0">
          {/* Bảng sản phẩm */}
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th className="w-12">
                    <input
                      type="checkbox"
                      checked={
                        products.length > 0 &&
                        selectedProducts.length === products.length
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="w-16">Hình ảnh</th>
                  <th className="text-left">Sản phẩm</th>
                  <th className="text-center">Giá</th>
                  <th className="text-center">Kho</th>
                  <th className="text-center">Danh mục</th>
                  <th className="text-center">Trạng thái</th>
                  <th className="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="p-8 text-center">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="text-gray-600">Đang tải dữ liệu...</p>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="8" className="p-8 text-center">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="text-red-500 text-lg">
                          ❌ Lỗi tải dữ liệu
                        </div>
                        <p className="text-gray-600">{error}</p>
                        <button
                          onClick={loadProducts}
                          className="btn btn-primary"
                        >
                          Thử lại
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => toggleSelectProduct(product.id)}
                        />
                      </td>
                      <td className="p-3">
                        <img
                          src={
                            product.mainImage || "/images/default-product.svg"
                          }
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg border"
                          onError={(e) => {
                            e.target.src = "/images/default-product.svg";
                          }}
                        />
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          <div
                            onClick={() =>
                              navigate(`/admin/products/edit/${product.id}`)
                            }
                            className="font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                          >
                            {product.name}
                          </div>
                          {product.sku && (
                            <div className="text-xs text-gray-500">
                              SKU: {product.sku}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className="space-y-1">
                          {product.discountPrice ? (
                            <>
                              <div className="font-medium text-red-600">
                                {new Intl.NumberFormat("vi-VN").format(
                                  product.discountPrice
                                )}
                                ₫
                              </div>
                              <div className="text-xs text-gray-500 line-through">
                                {new Intl.NumberFormat("vi-VN").format(
                                  product.originalPrice
                                )}
                                ₫
                              </div>
                            </>
                          ) : (
                            <div className="font-medium text-gray-900">
                              {new Intl.NumberFormat("vi-VN").format(
                                product.originalPrice || 0
                              )}
                              ₫
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className="space-y-1">
                          <div
                            className={`font-medium ${
                              product.stock > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {product.stock || 0}
                          </div>
                          <div className="text-xs text-gray-500">
                            {product.stock > 0 ? "Còn hàng" : "Hết hàng"}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          {product.category?.name || "Chưa phân loại"}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            product.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.isActive ? "Hoạt động" : "Tạm ngưng"}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() =>
                              navigate(`/admin/products/edit/${product.id}`)
                            }
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                            title="Chỉnh sửa"
                          >
                            Sửa
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800 font-medium text-sm"
                            title="Xóa"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="p-8 text-center">
                      <div className="text-gray-500">
                        {Object.values(filters).some(
                          (value) => value && value !== 20 && value !== "newest"
                        ) ? (
                          <div className="space-y-2">
                            <p className="text-lg">
                              🔍 Không tìm thấy sản phẩm phù hợp
                            </p>
                            <p className="text-sm">
                              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                            </p>
                            <button
                              onClick={clearAllFilters}
                              className="mt-3 text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Xóa tất cả bộ lọc
                            </button>
                          </div>
                        ) : (
                          <p className="text-lg">Chưa có sản phẩm nào</p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t">
              <div className="flex items-center text-sm text-gray-700">
                <span>
                  Hiển thị {(pagination.page - 1) * pagination.pageSize + 1} -{" "}
                  {Math.min(
                    pagination.page * pagination.pageSize,
                    pagination.totalItems
                  )}{" "}
                  trong {pagination.totalItems} sản phẩm
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1 || loading}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft size={16} />
                  Trước
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          disabled={loading}
                          className={`px-3 py-2 text-sm font-medium rounded-md disabled:cursor-not-allowed ${
                            pageNum === pagination.page
                              ? "bg-blue-600 text-white"
                              : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages || loading}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  Sau
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
