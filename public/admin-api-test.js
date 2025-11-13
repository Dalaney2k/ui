// Admin API Test - Test các endpoints mới
console.log("🧪 Testing Admin API calls...");

// API Configuration
const API_CONFIG = {
  baseURL: "https://localhost:8080/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

// Mock token for testing
const mockToken = "test-token";

// Get Auth Headers
const getAuthHeaders = () => ({
  ...API_CONFIG.headers,
  Authorization: `Bearer ${mockToken}`,
});

// Test Functions
const testEndpoints = async () => {
  console.log("🔧 Testing API Endpoints...");

  // Test 1: Auth endpoint (without token)
  try {
    console.log("📡 Testing /auth/login endpoint...");
    const loginResponse = await fetch(`${API_CONFIG.baseURL}/auth/login`, {
      method: "POST",
      headers: API_CONFIG.headers,
      body: JSON.stringify({
        email: "admin@sakurahome.com",
        password: "admin123",
        rememberMe: true,
      }),
    });

    console.log("✅ Login endpoint accessible:", loginResponse.status);
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log("📊 Login response structure:", Object.keys(loginData));
    }
  } catch (error) {
    console.log("❌ Login endpoint error:", error.message);
  }

  // Test 2: Users endpoint
  try {
    console.log("📡 Testing /admin/users endpoint...");
    const usersResponse = await fetch(
      `${API_CONFIG.baseURL}/admin/users?page=1&pageSize=5`,
      {
        headers: getAuthHeaders(),
      }
    );

    console.log("✅ Users endpoint accessible:", usersResponse.status);
    if (usersResponse.ok) {
      const usersData = await usersResponse.json();
      console.log("📊 Users response structure:", Object.keys(usersData));
    }
  } catch (error) {
    console.log("❌ Users endpoint error:", error.message);
  }

  // Test 3: Products endpoint
  try {
    console.log("📡 Testing /product endpoint...");
    const productsResponse = await fetch(
      `${API_CONFIG.baseURL}/product?page=1&pageSize=5`,
      {
        headers: getAuthHeaders(),
      }
    );

    console.log("✅ Products endpoint accessible:", productsResponse.status);
    if (productsResponse.ok) {
      const productsData = await productsResponse.json();
      console.log("📊 Products response structure:", Object.keys(productsData));
    }
  } catch (error) {
    console.log("❌ Products endpoint error:", error.message);
  }

  // Test 4: Orders endpoint
  try {
    console.log("📡 Testing /order endpoint...");
    const ordersResponse = await fetch(
      `${API_CONFIG.baseURL}/order?page=1&pageSize=5`,
      {
        headers: getAuthHeaders(),
      }
    );

    console.log("✅ Orders endpoint accessible:", ordersResponse.status);
    if (ordersResponse.ok) {
      const ordersData = await ordersResponse.json();
      console.log("📊 Orders response structure:", Object.keys(ordersData));
    }
  } catch (error) {
    console.log("❌ Orders endpoint error:", error.message);
  }

  // Test 5: Categories endpoint
  try {
    console.log("📡 Testing /category endpoint...");
    const categoryResponse = await fetch(`${API_CONFIG.baseURL}/category`, {
      headers: getAuthHeaders(),
    });

    console.log("✅ Categories endpoint accessible:", categoryResponse.status);
    if (categoryResponse.ok) {
      const categoryData = await categoryResponse.json();
      console.log(
        "📊 Categories response structure:",
        Object.keys(categoryData)
      );
    }
  } catch (error) {
    console.log("❌ Categories endpoint error:", error.message);
  }

  // Test 6: Brands endpoint
  try {
    console.log("📡 Testing /brand endpoint...");
    const brandResponse = await fetch(`${API_CONFIG.baseURL}/brand`, {
      headers: getAuthHeaders(),
    });

    console.log("✅ Brands endpoint accessible:", brandResponse.status);
    if (brandResponse.ok) {
      const brandData = await brandResponse.json();
      console.log("📊 Brands response structure:", Object.keys(brandData));
    }
  } catch (error) {
    console.log("❌ Brands endpoint error:", error.message);
  }

  console.log("🎯 API Test completed!");
  console.log(
    "📝 Check the network tab for detailed request/response information"
  );
};

// Auto-run test when page loads
if (typeof window !== "undefined") {
  // Browser environment
  document.addEventListener("DOMContentLoaded", testEndpoints);
} else {
  // Node.js environment
  testEndpoints();
}

// Export for manual testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = { testEndpoints, API_CONFIG };
}
