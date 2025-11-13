import React, { useState } from "react";
import { authService } from "../services/AdminApiService.js";

const AdminTokenManager = () => {
  const [tokenInfo, setTokenInfo] = useState({});
  const [loading, setLoading] = useState(false);

  const checkToken = () => {
    const token = localStorage.getItem("adminToken");
    const refreshToken = localStorage.getItem("adminRefreshToken");
    const adminInfo = localStorage.getItem("adminInfo");

    setTokenInfo({
      hasToken: !!token,
      hasRefreshToken: !!refreshToken,
      hasAdminInfo: !!adminInfo,
      token: token ? token.substring(0, 50) + "..." : "None",
      adminInfo: adminInfo ? JSON.parse(adminInfo) : null,
    });
  };

  const refreshToken = async () => {
    try {
      setLoading(true);
      const response = await authService.refreshToken();
      console.log("🔄 Token refresh response:", response);
      checkToken();
    } catch (error) {
      console.error("❌ Token refresh failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    try {
      setLoading(true);
      const response = await authService.login({
        email: "admin@sakurahome.com",
        password: "admin123",
      });
      console.log("🔐 Login response:", response);
      checkToken();
    } catch (error) {
      console.error("❌ Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearTokens = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRefreshToken");
    localStorage.removeItem("adminInfo");
    checkToken();
  };

  React.useEffect(() => {
    checkToken();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Token Manager</h1>

        <div className="grid gap-4 mb-6">
          <button
            onClick={checkToken}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Check Current Tokens
          </button>

          <button
            onClick={testLogin}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Test Admin Login"}
          </button>

          <button
            onClick={refreshToken}
            disabled={loading}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh Token"}
          </button>

          <button
            onClick={clearTokens}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Clear All Tokens
          </button>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-4">Token Status:</h3>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Has Admin Token:</strong>
              <span
                className={
                  tokenInfo.hasToken
                    ? "text-green-600 ml-2"
                    : "text-red-600 ml-2"
                }
              >
                {tokenInfo.hasToken ? "✅ Yes" : "❌ No"}
              </span>
            </div>

            <div>
              <strong>Has Refresh Token:</strong>
              <span
                className={
                  tokenInfo.hasRefreshToken
                    ? "text-green-600 ml-2"
                    : "text-red-600 ml-2"
                }
              >
                {tokenInfo.hasRefreshToken ? "✅ Yes" : "❌ No"}
              </span>
            </div>

            <div>
              <strong>Has Admin Info:</strong>
              <span
                className={
                  tokenInfo.hasAdminInfo
                    ? "text-green-600 ml-2"
                    : "text-red-600 ml-2"
                }
              >
                {tokenInfo.hasAdminInfo ? "✅ Yes" : "❌ No"}
              </span>
            </div>

            {tokenInfo.token && (
              <div>
                <strong>Token Preview:</strong>
                <div className="bg-white p-2 rounded mt-1 text-xs font-mono break-all">
                  {tokenInfo.token}
                </div>
              </div>
            )}

            {tokenInfo.adminInfo && (
              <div>
                <strong>Admin Info:</strong>
                <div className="bg-white p-2 rounded mt-1 text-xs">
                  <div>Email: {tokenInfo.adminInfo.email}</div>
                  <div>Name: {tokenInfo.adminInfo.fullName}</div>
                  <div>Role: {tokenInfo.adminInfo.role}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTokenManager;
