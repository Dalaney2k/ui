import React, { useState } from "react";
import {
  cartService,
  wishlistService,
  userService,
} from "../../services/index.js";

const ApiTestComponent = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setResults((prev) => [...prev, { timestamp, message, type }]);
  };

  const testLogin = async () => {
    setLoading(true);
    addLog("🔐 Testing login...", "info");

    try {
      const result = await userService.login({
        email: "quicktest@example.com",
        password: "Quick123!",
        rememberMe: false,
      });

      addLog(`✅ Login successful: ${JSON.stringify(result)}`, "success");
    } catch (error) {
      addLog(`❌ Login failed: ${error.message}`, "error");
    }

    setLoading(false);
  };

  const testAddToCart = async () => {
    setLoading(true);
    addLog("🛒 Testing add to cart...", "info");

    try {
      const result = await cartService.addToCart({
        productId: 1,
        quantity: 2,
        customOptions: "Color: Red, Size: Large",
        giftMessage: "Test gift message",
        isGift: true,
      });

      addLog(`✅ Add to cart result: ${JSON.stringify(result)}`, "success");
    } catch (error) {
      addLog(`❌ Add to cart failed: ${error.message}`, "error");
    }

    setLoading(false);
  };

  const testGetCart = async () => {
    setLoading(true);
    addLog("🛒 Testing get cart...", "info");

    try {
      const result = await cartService.getCart();
      addLog(`✅ Get cart result: ${JSON.stringify(result)}`, "success");
    } catch (error) {
      addLog(`❌ Get cart failed: ${error.message}`, "error");
    }

    setLoading(false);
  };

  const testAddToWishlist = async () => {
    setLoading(true);
    addLog("❤️ Testing add to wishlist...", "info");

    try {
      const result = await wishlistService.addToWishlist(
        2,
        null,
        "Test product 2 for wishlist"
      );
      addLog(`✅ Add to wishlist result: ${JSON.stringify(result)}`, "success");
    } catch (error) {
      addLog(`❌ Add to wishlist failed: ${error.message}`, "error");
    }

    setLoading(false);
  };

  const testGetWishlist = async () => {
    setLoading(true);
    addLog("❤️ Testing get wishlist...", "info");

    try {
      const result = await wishlistService.getWishlist();
      addLog(`✅ Get wishlist result: ${JSON.stringify(result)}`, "success");
    } catch (error) {
      addLog(`❌ Get wishlist failed: ${error.message}`, "error");
    }

    setLoading(false);
  };

  const clearLogs = () => {
    setResults([]);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">🧪 API Test Component</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Test Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button
              onClick={testLogin}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              🔐 Test Login
            </button>

            <button
              onClick={testAddToCart}
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              🛒 Add to Cart
            </button>

            <button
              onClick={testGetCart}
              disabled={loading}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
            >
              🛒 Get Cart
            </button>

            <button
              onClick={testAddToWishlist}
              disabled={loading}
              className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 disabled:opacity-50"
            >
              ❤️ Add to Wishlist
            </button>

            <button
              onClick={testGetWishlist}
              disabled={loading}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
            >
              ❤️ Get Wishlist
            </button>

            <button
              onClick={clearLogs}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              🧹 Clear Logs
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Test Results</h2>
          <div className="max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <p className="text-gray-500">
                No test results yet. Click a test button above.
              </p>
            ) : (
              results.map((result, index) => (
                <div
                  key={index}
                  className={`mb-2 p-3 rounded text-sm ${
                    result.type === "success"
                      ? "bg-green-100 text-green-800"
                      : result.type === "error"
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  <span className="font-mono text-xs text-gray-500">
                    [{result.timestamp}]
                  </span>{" "}
                  {result.message}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">
            📝 Instructions:
          </h3>
          <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
            <li>First click "Test Login" to authenticate</li>
            <li>Then test cart and wishlist operations</li>
            <li>Check browser console for detailed API logs</li>
            <li>Results will show here and in console</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ApiTestComponent;
