import React, { useState, useEffect } from "react";
import config from "../../config/index.js";

const ConnectionTest = () => {
  const [status, setStatus] = useState("testing");
  const [error, setError] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        setStatus("testing");
        console.log("🔌 Testing connection to:", config.API_BASE_URL);

        const response = await fetch(
          config.API_BASE_URL.replace("/api", "/health"),
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (response.ok) {
          setStatus("connected");
          console.log("✅ Backend is running");
        } else {
          setStatus("error");
          setError(`HTTP ${response.status}: ${response.statusText}`);
          console.log("❌ Backend returned error:", response.status);
        }
      } catch (err) {
        setStatus("error");
        setError(err.message);
        console.log("❌ Connection failed:", err.message);
      }
    };

    testConnection();
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case "testing":
        return "bg-yellow-500";
      case "connected":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="fixed top-4 left-4 bg-white p-3 rounded-lg shadow-lg border z-50">
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
        <span className="text-sm font-medium">
          {status === "testing" && "Testing backend..."}
          {status === "connected" && "Backend connected"}
          {status === "error" && "Backend offline"}
        </span>
      </div>
      {error && <div className="mt-1 text-xs text-red-600">{error}</div>}
      <div className="mt-1 text-xs text-gray-500">{config.API_BASE_URL}</div>
    </div>
  );
};

export default ConnectionTest;
