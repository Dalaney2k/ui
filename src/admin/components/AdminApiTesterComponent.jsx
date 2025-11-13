import React, { useState, useEffect } from "react";

const ApiTester = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testApiCall = async (name, endpoint, params = {}) => {
    try {
      setLoading(true);
      const url = new URL(endpoint, "http://localhost:5000");
      Object.keys(params).forEach((key) => {
        if (
          params[key] !== undefined &&
          params[key] !== null &&
          params[key] !== ""
        ) {
          url.searchParams.append(key, params[key]);
        }
      });

      console.log(`🔍 Testing ${name}:`, url.toString());

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log(`✅ ${name} Response:`, data);

      setResults((prev) => ({
        ...prev,
        [name]: {
          status: response.status,
          url: url.toString(),
          data: data,
          success: response.ok,
        },
      }));
    } catch (error) {
      console.error(`❌ ${name} Error:`, error);
      setResults((prev) => ({
        ...prev,
        [name]: {
          error: error.message,
          success: false,
        },
      }));
    } finally {
      setLoading(false);
    }
  };

  const runTests = async () => {
    setResults({});

    // Test các API endpoint
    await testApiCall("All Products", "/api/admin/products");
    await testApiCall("Active Products", "/api/admin/products", {
      status: "Active",
    });
    await testApiCall("Inactive Products", "/api/admin/products", {
      status: "Inactive",
    });
    await testApiCall("Out of Stock", "/api/admin/products", {
      inStock: false,
    });
    await testApiCall("Featured Products", "/api/admin/products", {
      isFeatured: true,
    });
    await testApiCall("Search Products", "/api/admin/products", {
      search: "Sony",
    });
    await testApiCall("Price Range", "/api/admin/products", {
      priceMin: 100000,
      priceMax: 500000,
    });
    await testApiCall("Categories", "/api/admin/categories");
    await testApiCall("Brands", "/api/admin/brands");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">
          API Tester - Product Filters
        </h1>

        <button
          onClick={runTests}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 mb-6"
        >
          {loading ? "Testing..." : "Run API Tests"}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Object.entries(results).map(([name, result]) => (
            <div key={name} className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                {result.success ? "✅" : "❌"} {name}
              </h3>

              {result.url && (
                <p className="text-sm text-gray-600 mb-2">
                  <strong>URL:</strong> {result.url}
                </p>
              )}

              {result.status && (
                <p className="text-sm mb-2">
                  <strong>Status:</strong>
                  <span
                    className={
                      result.status === 200 ? "text-green-600" : "text-red-600"
                    }
                  >
                    {result.status}
                  </span>
                </p>
              )}

              {result.data && (
                <div className="text-sm">
                  <strong>Data:</strong>
                  <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-auto max-h-32">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              )}

              {result.error && (
                <p className="text-red-600 text-sm">
                  <strong>Error:</strong> {result.error}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApiTester;
