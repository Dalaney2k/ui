// Debug/BackendHealthCheck.jsx - Test Backend Connection
import React, { useState } from "react";

const BackendHealthCheck = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test, result, error = null) => {
    const timestamp = new Date().toLocaleTimeString();
    setResults((prev) => [
      ...prev,
      {
        timestamp,
        test,
        result,
        error,
        success: !error,
      },
    ]);
  };

  const clearResults = () => setResults([]);

  // Test basic backend connection
  const testBasicConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://localhost:8080", {
        method: "GET",
      });

      const contentType = response.headers.get("content-type");
      const text = await response.text();

      addResult("basicConnection", {
        status: response.status,
        contentType,
        isSwagger: text.includes("Swagger"),
        responsePreview: text.substring(0, 200),
      });
    } catch (error) {
      addResult("basicConnection", null, error.message);
    }
    setLoading(false);
  };

  // Test auth profile endpoint
  const testAuthProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("https://localhost:8080/api/auth/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const contentType = response.headers.get("content-type");
      let responseData;

      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      addResult("authProfile", {
        status: response.status,
        contentType,
        hasToken: !!token,
        tokenPreview: token ? `${token.substring(0, 20)}...` : "none",
        responseData,
      });
    } catch (error) {
      addResult("authProfile", null, error.message);
    }
    setLoading(false);
  };

  // Test wishlist endpoint with different approaches
  const testWishlistEndpoint = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");

      // Test with auth headers
      const response = await fetch("https://localhost:8080/api/wishlist", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
        headers: Object.fromEntries(response.headers.entries()),
        responseData:
          typeof responseData === "string"
            ? responseData.substring(0, 500)
            : responseData,
      });
    } catch (error) {
      addResult("wishlistEndpoint", null, error.message);
    }
    setLoading(false);
  };

  // Test available endpoints
  const testAvailableEndpoints = async () => {
    setLoading(true);
    const endpoints = [
      "/api",
      "/api/auth",
      "/api/products",
      "/api/cart",
      "/api/wishlist",
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`https://localhost:8080${endpoint}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        });

        addResult(`endpoint ${endpoint}`, {
          status: response.status,
          statusText: response.statusText,
          exists: response.status !== 404,
        });
      } catch (error) {
        addResult(`endpoint ${endpoint}`, null, error.message);
      }
    }
    setLoading(false);
  };

  // Check local storage data
  const checkLocalStorage = () => {
    const authData = {
      auth_token: localStorage.getItem("auth_token"),
      user_data: localStorage.getItem("user_data"),
      refresh_token: localStorage.getItem("refresh_token"),
      token_expires_at: localStorage.getItem("token_expires_at"),
    };

    addResult("localStorage", {
      hasAuthToken: !!authData.auth_token,
      hasUserData: !!authData.user_data,
      tokenPreview: authData.auth_token
        ? `${authData.auth_token.substring(0, 30)}...`
        : "none",
      userData: authData.user_data ? JSON.parse(authData.user_data) : null,
      expiresAt: authData.token_expires_at,
    });
  };

  return (
    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
      <h3 className="text-lg font-bold mb-4">🏥 Backend Health Check</h3>

      <div className="space-x-2 mb-4 flex flex-wrap gap-2">
        <button
          onClick={checkLocalStorage}
          className="px-3 py-1 bg-indigo-500 text-white rounded text-sm"
        >
          Check Local Storage
        </button>
        <button
          onClick={testBasicConnection}
          disabled={loading}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm disabled:opacity-50"
        >
          Test Basic Connection
        </button>
        <button
          onClick={testAuthProfile}
          disabled={loading}
          className="px-3 py-1 bg-green-500 text-white rounded text-sm disabled:opacity-50"
        >
          Test Auth Profile
        </button>
        <button
          onClick={testWishlistEndpoint}
          disabled={loading}
          className="px-3 py-1 bg-purple-500 text-white rounded text-sm disabled:opacity-50"
        >
          Test Wishlist Endpoint
        </button>
        <button
          onClick={testAvailableEndpoints}
          disabled={loading}
          className="px-3 py-1 bg-orange-500 text-white rounded text-sm disabled:opacity-50"
        >
          Scan Endpoints
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
              {result.success ? "✅" : "❌"} {result.test} - {result.timestamp}
            </div>
            {result.error && (
              <div className="text-red-600 mt-1">Error: {result.error}</div>
            )}
            {result.result && (
              <div className="mt-1">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap bg-white p-2 rounded border">
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

export default BackendHealthCheck;
