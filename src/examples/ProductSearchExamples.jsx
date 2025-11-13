// ProductSearchExamples.jsx - Ví dụ sử dụng API mới
import React, { useState, useEffect } from "react";
import { productService } from "../services";

const ProductSearchExamples = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Ví dụ 1: Tìm kiếm cơ bản với từ khóa đa ngôn ngữ
  const basicSearch = async () => {
    setLoading(true);
    try {
      // Hỗ trợ tìm kiếm multi-word theo API docs v2.1.0
      const response = await productService.searchProducts("japanese snack", {
        page: 1,
        pageSize: 12,
        sortBy: "relevance",
      });
      console.log("Basic search results:", response);
      setResults(response.products);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Ví dụ 2: Tìm kiếm với bộ lọc nâng cao
  const advancedSearch = async () => {
    setLoading(true);
    try {
      const response = await productService.getProductsWithAdvancedFilters({
        search: "bim bim", // Multi-word search
        categoryId: 1, // Japanese Snacks category
        minPrice: 50000,
        maxPrice: 200000,
        minRating: 4.0,
        inStockOnly: true,
        isFeatured: true,
        japaneseRegion: "Tokyo",
        authenticityLevel: "Verified",
        sortBy: "popularity",
        sortOrder: "desc",
        page: 1,
        pageSize: 20,
      });
      console.log("Advanced search results:", response);
      setResults(response.products);
    } catch (error) {
      console.error("Advanced search error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Ví dụ 3: Lấy sản phẩm trending
  const getTrendingProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getTrendingProducts({
        count: 10,
        daysPeriod: 7, // 7 ngày gần đây
      });
      console.log("Trending products:", response);
      setResults(response.products);
    } catch (error) {
      console.error("Trending products error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Ví dụ 4: Tìm kiếm theo category với filters
  const searchByCategory = async () => {
    setLoading(true);
    try {
      const response = await productService.getProductsByCategory(1, {
        includeSubcategories: true,
        minRating: 4.5,
        inStockOnly: true,
        onSaleOnly: true, // Chỉ sản phẩm đang sale
        sortBy: "discount",
        sortOrder: "desc",
        page: 1,
        pageSize: 15,
      });
      console.log("Category search with filters:", response);
      setResults(response.products);
    } catch (error) {
      console.error("Category search error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Ví dụ 5: Tìm kiếm sản phẩm cao cấp
  const searchPremiumProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getProductsWithAdvancedFilters({
        japaneseRegion: "Kyoto",
        authenticityLevel: "Certified",
        minPrice: 500000,
        minRating: 4.8,
        tagNames: ["Premium", "Authentic"],
        tagMatchMode: "All",
        isGiftWrappingAvailable: true,
        sortBy: "rating",
        sortOrder: "desc",
      });
      console.log("Premium products:", response);
      setResults(response.products);
    } catch (error) {
      console.error("Premium search error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Ví dụ 6: Tìm kiếm theo khoảng thời gian
  const searchByDateRange = async () => {
    setLoading(true);
    try {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      const response = await productService.getProductsWithAdvancedFilters({
        createdFrom: lastMonth.toISOString(),
        createdTo: new Date().toISOString(),
        isNew: true,
        sortBy: "created",
        sortOrder: "desc",
      });
      console.log("New products from last month:", response);
      setResults(response.products);
    } catch (error) {
      console.error("Date range search error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        SakuraHome API v2.1.0 - Examples
      </h1>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          onClick={basicSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          Basic Search: "japanese snack"
        </button>

        <button
          onClick={advancedSearch}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={loading}
        >
          Advanced Search: "bim bim" + Filters
        </button>

        <button
          onClick={getTrendingProducts}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          disabled={loading}
        >
          Trending Products (7 days)
        </button>

        <button
          onClick={searchByCategory}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          disabled={loading}
        >
          Category Search + Sale Filter
        </button>

        <button
          onClick={searchPremiumProducts}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          disabled={loading}
        >
          Premium Products (Kyoto)
        </button>

        <button
          onClick={searchByDateRange}
          className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
          disabled={loading}
        >
          New Products (Last Month)
        </button>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2">Loading...</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            Results ({results.length} products)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((product) => (
              <div key={product.id} className="bg-white p-4 rounded border">
                <img
                  src={product.mainImage || "/default-product.svg"}
                  alt={product.name}
                  className="w-full h-32 object-cover mb-2"
                />
                <h3 className="font-medium text-sm mb-1">{product.name}</h3>
                <p className="text-gray-600 text-xs mb-2">
                  {product.shortDescription}
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-red-600">
                    {product.price?.toLocaleString("vi-VN")}₫
                  </span>
                  <div className="flex items-center">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-xs ml-1">{product.rating}</span>
                  </div>
                </div>
                {product.isOnSale && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded mt-2 inline-block">
                    On Sale
                  </span>
                )}
                {product.isFeatured && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2 ml-2 inline-block">
                    Featured
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 bg-yellow-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">
          🚀 New Features in v2.1.0:
        </h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>
            <strong>Multi-word Search:</strong> "japanese snack", "bim bim" now
            work perfectly
          </li>
          <li>
            <strong>Enhanced Relevance:</strong> MetaKeywords matches get high
            priority
          </li>
          <li>
            <strong>Advanced Filters:</strong> Japanese regions, authenticity
            levels, tags
          </li>
          <li>
            <strong>Better Performance:</strong> Optimized query structure
          </li>
          <li>
            <strong>Rich Aggregates:</strong> More detailed filter statistics
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProductSearchExamples;
