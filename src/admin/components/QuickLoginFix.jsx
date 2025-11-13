import React from "react";
import { authService } from "../services/AdminApiService.js";

const QuickLoginFix = () => {
  const handleQuickLogin = async () => {
    try {
      console.log("🔐 Attempting admin login...");
      const result = await authService.login({
        email: "admin@sakurahome.com",
        password: "admin123",
      });

      if (result.success) {
        console.log("✅ Login successful!");
        window.location.reload();
      } else {
        console.error("❌ Login failed:", result.message);
        alert("Login failed: " + result.message);
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      alert("Login error: " + error.message);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={handleQuickLogin}
        className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 text-sm font-semibold"
      >
        🔐 Quick Admin Login Fix
      </button>
    </div>
  );
};

export default QuickLoginFix;
