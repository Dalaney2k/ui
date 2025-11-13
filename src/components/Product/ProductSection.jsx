import React, { useState, useEffect } from "react";
import { Grid, List, Filter } from "lucide-react";
import { useCategories, useProducts } from "../../hooks/useProducts.jsx";
import { LoadingSpinner, ErrorMessage } from "../UI/LoadingComponents.jsx";
import {
  transformProducts,
  getCategoryOptions,
} from "../../utils/dataTransform";
import ProductCard from "./ProductCard";

const ProductSection = ({
  selectedCategory,
  viewMode,
  setViewMode,
  addToCart,
  toggleWishlist,
  wishlistItems,
  onQuickView,
}) => {
  const { categories, loading: categoriesLoading } = useCategories();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    category: selectedCategory,
    pageSize: 12,
  });

  // Get products based on selected category
  const {
    products: rawProducts,
    pagination,
    loading: productsLoading,
    error: productsError,
    refetch,
  } = useProducts(filters);

  // Transform API products to app format
  const products = transformProducts(rawProducts);

  // Update filters when selectedCategory changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: selectedCategory === "all" ? undefined : selectedCategory,
      currentPage: 1,
    }));
    setCurrentPage(1);
  }, [selectedCategory]);

  // Get current category name for display
  const getCurrentCategoryName = () => {
    if (selectedCategory === "all") return "";
    const category = categories.find((c) => c.slug === selectedCategory);
    return category ? category.name : "";
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setFilters((prev) => ({ ...prev, currentPage: page }));
  };

  if (productsLoading && products.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (productsError) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <ErrorMessage error={productsError} onRetry={refetch} />
        </div>
      </section>
    );
  }
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Sản Phẩm {getCurrentCategoryName()}
            </h2>
            <p className="text-gray-600">
              Khám phá những sản phẩm chất lượng cao từ Nhật Bản
            </p>
            {pagination.totalItems && (
              <p className="text-sm text-gray-500 mt-1">
                Tìm thấy {pagination.totalItems} sản phẩm
              </p>
            )}
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex bg-white rounded-lg p-1 border border-gray-200">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${
                  viewMode === "grid"
                    ? "bg-red-500 text-white"
                    : "text-gray-600"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${
                  viewMode === "list"
                    ? "bg-red-500 text-white"
                    : "text-gray-600"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <button className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              <span>Lọc</span>
            </button>
          </div>
        </div>

        {/* Loading overlay for page changes */}
        {productsLoading && products.length > 0 && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
            <LoadingSpinner />
          </div>
        )}

        {/* Products Grid */}
        {products.length > 0 ? (
          <>
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                  addToCart={addToCart}
                  toggleWishlist={toggleWishlist}
                  wishlistItems={wishlistItems}
                  onQuickView={onQuickView}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrevious || productsLoading}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Trước
                </button>

                {/* Page numbers */}
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    disabled={productsLoading}
                    className={`px-4 py-2 border rounded-lg ${
                      page === currentPage
                        ? "bg-red-500 text-white border-red-500"
                        : "border-gray-300 hover:bg-gray-50"
                    } disabled:opacity-50`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNext || productsLoading}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Sau
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Không tìm thấy sản phẩm nào</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;
