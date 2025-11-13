// CategoryFilterTest.jsx - Test component for category filtering
import React, { useState, useEffect } from "react";
import { productService } from "../services";

const CategoryFilterTest = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Assuming we have a category service
        const response = await fetch("/api/category");
        const data = await response.json();
        setCategories(data.data || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  // Test category filtering
  const testCategoryFilter = async (categoryId) => {
    setLoading(true);
    setError(null);
    setSelectedCategoryId(categoryId);

    try {
      console.log("🔍 Testing category filter with ID:", categoryId);

      if (categoryId === "all") {
        // Get all products
        const response = await productService.getProducts({
          page: 1,
          pageSize: 12,
          sortBy: "name",
          sortOrder: "asc",
        });
        console.log("✅ All products response:", response);
        setProducts(response.products || []);
      } else {
        // Get products by category ID
        const response = await productService.getProductsByCategory(
          parseInt(categoryId),
          {
            page: 1,
            pageSize: 12,
            sortBy: "popularity",
            sortOrder: "desc",
          }
        );
        console.log("✅ Category products response:", response);
        setProducts(response.products || []);
      }
    } catch (err) {
      console.error("❌ Category filter error:", err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Category Filter Test</h1>

      {/* Category Filter Buttons */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Select Category:</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => testCategoryFilter("all")}
            className={`px-4 py-2 rounded border ${
              selectedCategoryId === "all"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 border-gray-300"
            }`}
            disabled={loading}
          >
            All Products
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => testCategoryFilter(category.id)}
              className={`px-4 py-2 rounded border ${
                selectedCategoryId === category.id
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
              disabled={loading}
            >
              {category.name} (ID: {category.id})
            </button>
          ))}
        </div>
      </div>

      {/* API Request Debug Info */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Debug Info:</h3>
        <p>
          <strong>Selected Category ID:</strong> {selectedCategoryId || "None"}
        </p>
        <p>
          <strong>Expected API Call:</strong>{" "}
          {selectedCategoryId === "all"
            ? "GET /api/product?page=1&pageSize=12&sortBy=name&sortOrder=asc"
            : `GET /api/product?page=1&pageSize=12&sortBy=popularity&sortOrder=desc&categoryId=${selectedCategoryId}`}
        </p>
        <p>
          <strong>Loading:</strong> {loading ? "Yes" : "No"}
        </p>
        {error && (
          <p className="text-red-600">
            <strong>Error:</strong> {error}
          </p>
        )}
      </div>

      {/* Results */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          Results ({products.length} products)
        </h2>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2">Loading products...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>
              <strong>Error:</strong> {error}
            </p>
            <p className="text-sm mt-1">
              This usually means the categoryId is not being sent as an integer
              to the backend.
            </p>
          </div>
        )}

        {!loading && !error && products.length === 0 && selectedCategoryId && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p>No products found for the selected category.</p>
          </div>
        )}

        {products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white p-4 rounded border shadow"
              >
                <img
                  src={product.mainImage || "/default-product.svg"}
                  alt={product.name}
                  className="w-full h-32 object-cover mb-2 rounded"
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
                <div className="mt-2 text-xs text-gray-500">
                  <p>Category: {product.category?.name || "N/A"}</p>
                  <p>Brand: {product.brand?.name || "N/A"}</p>
                  <p>ID: {product.id}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Testing Instructions */}
      <div className="mt-8 p-4 bg-blue-50 rounded border border-blue-200">
        <h3 className="font-semibold mb-2">🧪 Testing Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Click "All Products" - should work (no categoryId parameter)</li>
          <li>Click any category button - should send categoryId as integer</li>
          <li>Check browser DevTools Network tab to verify API calls</li>
          <li>Backend should receive categoryId as number, not string</li>
          <li>No more 400 Bad Request errors should occur</li>
        </ol>
      </div>
    </div>
  );
};

export default CategoryFilterTest;
