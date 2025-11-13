// Manual API Test
// Test different payload formats for add to cart

const testPayloads = [
  // Test 1: Documentation format
  {
    name: "Documentation format",
    payload: {
      productId: 101,
      quantity: 1,
      customOptions: {},
    },
  },

  // Test 2: Without customOptions
  {
    name: "Without customOptions",
    payload: {
      productId: 101,
      quantity: 1,
    },
  },

  // Test 3: PascalCase
  {
    name: "PascalCase format",
    payload: {
      ProductId: 101,
      Quantity: 1,
      CustomOptions: {},
    },
  },

  // Test 4: Different field names
  {
    name: "Alternative field names",
    payload: {
      product_id: 101,
      qty: 1,
      options: {},
    },
  },

  // Test 5: String productId
  {
    name: "String productId",
    payload: {
      productId: "101",
      quantity: 1,
      customOptions: {},
    },
  },
];

// Function to test each payload
async function testAddToCart(payload, sessionId = "guest_test_123") {
  const url = `https://localhost:8080/api/cart/items?sessionId=${sessionId}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.text();
    console.log(`Status: ${response.status}`);
    console.log(`Response: ${result}`);

    if (!response.ok) {
      console.error(`Error ${response.status}:`, result);
    }

    return { status: response.status, data: result };
  } catch (error) {
    console.error("Network error:", error);
    return { error: error.message };
  }
}

// Export for use in console
window.testAddToCart = testAddToCart;
window.testPayloads = testPayloads;

console.log("🧪 API Test functions loaded. Use in console:");
console.log(
  "testPayloads.forEach((test, i) => { console.log(`Test ${i+1}: ${test.name}`); testAddToCart(test.payload); });"
);
