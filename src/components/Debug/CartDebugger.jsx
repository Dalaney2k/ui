import React, { useState, useEffect } from "react";
import { cartService } from "../../services/api.js";

const CartDebugger = () => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);

  const addLog = (message, data = null) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { timestamp, message, data }]);
    console.log(`[${timestamp}] ${message}`, data);
  };

  const loadCartData = async () => {
    setLoading(true);
    setError(null);
    try {
      addLog("🛒 Loading cart data...");
      const response = await cartService.getCart();
      addLog("✅ Cart response received", response);
      setCartData(response);
    } catch (err) {
      addLog("❌ Error loading cart", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testAddItem = async () => {
    try {
      addLog("➕ Testing add item to cart...");
      const response = await cartService.addToCart({
        productId: 1,
        quantity: 1,
        productVariantId: null,
      });
      addLog("✅ Add item response", response);
      // Reload cart after adding
      await loadCartData();
    } catch (err) {
      addLog("❌ Error adding item", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        addLog("🛒 Loading cart data...");
        const response = await cartService.getCart();
        addLog("✅ Cart response received", response);
        setCartData(response);
      } catch (err) {
        addLog("❌ Error loading cart", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Cart API Debugger</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Controls</h2>
            <div className="space-y-2">
              <button
                onClick={loadCartData}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? "Loading..." : "Reload Cart"}
              </button>
              <button
                onClick={testAddItem}
                className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Test Add Item (ID: 1)
              </button>
            </div>
          </div>

          {/* Cart Data */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Cart Data</h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                Error: {error}
              </div>
            )}
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-64">
              {JSON.stringify(cartData, null, 2)}
            </pre>
          </div>
        </div>

        {/* Logs */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">API Logs</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="border-b pb-2">
                <div className="text-sm text-gray-600">
                  [{log.timestamp}] {log.message}
                </div>
                {log.data && (
                  <pre className="bg-gray-50 p-2 rounded text-xs mt-1 overflow-auto">
                    {JSON.stringify(log.data, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDebugger;
