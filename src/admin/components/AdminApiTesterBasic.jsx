import React, { useState } from "react";
import { authService } from "../services/AdminApiService";

const AdminApiTesterBasic = () => {
  const [testResult, setTestResult] = useState("");
  const [loading, setLoading] = useState(false);

  const testAdminLogin = async () => {
    setLoading(true);
    setTestResult("Đang test...");

    try {
      const result = await authService.login({
        email: "admin@sakurahome.com",
        password: "Admin123!",
      });

      setTestResult(JSON.stringify(result, null, 2));
    } catch (error) {
      setTestResult(`Lỗi: ${error.message}\n${JSON.stringify(error, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const testUserLogin = async () => {
    setLoading(true);
    setTestResult("Đang test user login...");

    try {
      const response = await fetch("https://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "admin@sakurahome.com",
          password: "Admin123!",
        }),
      });

      const data = await response.json();
      setTestResult(
        `Status: ${response.status}\nData: ${JSON.stringify(data, null, 2)}`
      );
    } catch (error) {
      setTestResult(`Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">🔧 Admin API Test</h2>

      <div className="space-y-4">
        <button
          onClick={testAdminLogin}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? "Testing..." : "Test Admin Login Service"}
        </button>

        <button
          onClick={testUserLogin}
          disabled={loading}
          className="btn btn-secondary"
        >
          {loading ? "Testing..." : "Test Direct API Call"}
        </button>

        {testResult && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Kết quả:</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
              {testResult}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApiTesterBasic;
