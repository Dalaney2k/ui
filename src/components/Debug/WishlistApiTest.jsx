// Debug/WishlistApiTest.jsx - Test Wishlist API
import React, { useState } from "react";
import { wishlistService } from "../../services";

const WishlistApiTest = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (operation, result, error = null) => {
    const timestamp = new Date().toLocaleTimeString();
    setResults((prev) => [
      ...prev,
      {
        timestamp,
        operation,
        result,
        error,
        success: !error,
      },
    ]);
  };

  const clearResults = () => setResults([]);

  // Test get all wishlists
  const testGetWishlists = async () => {
    setLoading(true);
    try {
      const result = await wishlistService.getWishlists();
      addResult("getWishlists", result);
    } catch (error) {
      addResult("getWishlists", null, error.message);
    }
    setLoading(false);
  };

  // Test authentication headers
  const testAuthHeaders = () => {
    const headers = wishlistService.getAuthHeaders();
    const token = localStorage.getItem("auth_token");
    addResult("authHeaders", {
      headers,
      tokenExists: !!token,
      token: token ? `${token.substring(0, 20)}...` : "none",
    });
  };

  // Test backend connection
  const testBackendConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://localhost:8080/api/auth/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      const text = await response.text();
      addResult("backendConnection", {
        status: response.status,
        statusText: response.statusText,
        contentType: response.headers.get("content-type"),
        responseText: text.substring(0, 200),
      });
    } catch (error) {
      addResult("backendConnection", null, error.message);
    }
    setLoading(false);
  };

  // Test wishlist endpoint specifically
  const testWishlistEndpoint = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://localhost:8080/api/wishlist", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      const contentType = response.headers.get("content-type");
      let responseData;

      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      addResult("wishlistEndpoint", {
        status: response.status,
        statusText: response.statusText,
        contentType,
        responseData,
      });
    } catch (error) {
      addResult("wishlistEndpoint", null, error.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-bold mb-4">🧪 Wishlist API Debug</h3>

      <div className="space-x-2 mb-4">
        <button
          onClick={testAuthHeaders}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
        >
          Test Auth Headers
        </button>
        <button
          onClick={testBackendConnection}
          disabled={loading}
          className="px-3 py-1 bg-green-500 text-white rounded text-sm disabled:opacity-50"
        >
          Test Backend Connection
        </button>
        <button
          onClick={testWishlistEndpoint}
          disabled={loading}
          className="px-3 py-1 bg-purple-500 text-white rounded text-sm disabled:opacity-50"
        >
          Test Wishlist Endpoint
        </button>
        <button
          onClick={testGetWishlists}
          disabled={loading}
          className="px-3 py-1 bg-orange-500 text-white rounded text-sm disabled:opacity-50"
        >
          Test GetWishlists Service
        </button>
        <button
          onClick={clearResults}
          className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
        >
          Clear
        </button>
      </div>

      {loading && <div className="text-blue-600 mb-2">⏳ Testing...</div>}

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-3 rounded text-sm ${
              result.success
                ? "bg-green-50 border-l-4 border-green-400"
                : "bg-red-50 border-l-4 border-red-400"
            }`}
          >
            <div className="font-bold">
              {result.success ? "✅" : "❌"} {result.operation} -{" "}
              {result.timestamp}
            </div>
            {result.error && (
              <div className="text-red-600 mt-1">Error: {result.error}</div>
            )}
            {result.result && (
              <div className="mt-1">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(result.result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistApiTest;
