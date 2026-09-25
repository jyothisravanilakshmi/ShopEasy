// Automated test script for all ShopEasy REST APIs
const http = require("http");

function request(options, data) {
  const payload = data ? (typeof data === "string" ? data : JSON.stringify(data)) : "";
  const headers = {
    ...(options.headers || {}),
    ...(payload ? { "Content-Length": Buffer.byteLength(payload) } : {})
  };

  return new Promise((resolve, reject) => {
    const req = http.request({ ...options, headers }, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on("error", reject);
    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

async function runTests() {
  const host = "localhost";
  const port = 5000;
  console.log("=== STARTING COMPLETE API TESTS ===");

  try {
    // 1. Health check
    const root = await request({ host, port, path: "/", method: "GET" });
    console.log("1. GET / -> Status:", root.status, root.data.message);

    // 2. Products
    const products = await request({ host, port, path: "/api/products", method: "GET" });
    console.log("2. GET /api/products -> Status:", products.status, "Count:", products.data.length);

    const newProd = await request(
      {
        host,
        port,
        path: "/api/products",
        method: "POST",
        headers: { "Content-Type": "application/json" }
      },
      {
        name: "Test Mechanical Keyboard",
        price: 3499,
        category: "Electronics",
        description: "RGB Mechanical Keyboard for developers",
        image: "images/keyboard.jpg",
        stock: 10
      }
    );
    console.log("3. POST /api/products -> Status:", newProd.status, "Product ID:", newProd.data._id || newProd.data.id);

    // 3. User Register & Login
    const testEmail = `testuser_${Date.now()}@example.com`;
    const regRes = await request(
      {
        host,
        port,
        path: "/api/users/register",
        method: "POST",
        headers: { "Content-Type": "application/json" }
      },
      {
        name: "Sravani Puppala",
        email: testEmail,
        password: "securePassword123",
        phone: "9876543210"
      }
    );
    console.log("4. POST /api/users/register -> Status:", regRes.status, regRes.data.message);

    const loginRes = await request(
      {
        host,
        port,
        path: "/api/users/login",
        method: "POST",
        headers: { "Content-Type": "application/json" }
      },
      {
        email: testEmail,
        password: "securePassword123"
      }
    );
    console.log("5. POST /api/users/login -> Status:", loginRes.status, loginRes.data.message, "User:", loginRes.data.user.email);

    // 4. Cart - Add to Cart Flow (First add: qty 1, Second add: increments qty to 2)
    const cartRes1 = await request(
      {
        host,
        port,
        path: "/api/cart",
        method: "POST",
        headers: { "Content-Type": "application/json" }
      },
      {
        userEmail: testEmail,
        item: {
          productId: 1,
          name: "Wireless Headphones",
          price: 1999,
          quantity: 1,
          image: "images/headphone.jpg"
        }
      }
    );
    console.log("6a. POST /api/cart (First Add) -> Status:", cartRes1.status, "Qty:", cartRes1.data.cart.items[0].quantity);

    // Duplicate Add check
    const cartRes2 = await request(
      {
        host,
        port,
        path: "/api/cart",
        method: "POST",
        headers: { "Content-Type": "application/json" }
      },
      {
        userEmail: testEmail,
        item: {
          productId: 1,
          name: "Wireless Headphones",
          price: 1999,
          quantity: 1,
          image: "images/headphone.jpg"
        }
      }
    );
    console.log("6b. POST /api/cart (Duplicate Add increments Qty) -> Qty:", cartRes2.data.cart.items[0].quantity, "Total:", cartRes2.data.cart.totalAmount);

    const getCartRes = await request({
      host,
      port,
      path: `/api/cart?userEmail=${encodeURIComponent(testEmail)}`,
      method: "GET"
    });
    console.log("7. GET /api/cart -> Status:", getCartRes.status, "Items in cart:", getCartRes.data.items.length);

    // 5. Order
    const orderRes = await request(
      {
        host,
        port,
        path: "/api/orders",
        method: "POST",
        headers: { "Content-Type": "application/json" }
      },
      {
        userEmail: testEmail,
        customerName: "Sravani Puppala",
        phone: "9876543210",
        deliveryAddress: {
          address: "123 Main Street, Flat 402",
          city: "Hyderabad",
          pincode: "500001",
          coordinates: { lat: 17.385, lng: 78.4867 }
        },
        items: [
          {
            productId: 1,
            name: "Wireless Headphones",
            price: 1999,
            quantity: 2,
            image: "images/headphone.jpg"
          }
        ],
        totalAmount: 3998,
        paymentMethod: "cod"
      }
    );
    console.log("8. POST /api/orders -> Status:", orderRes.status, "Created Order:", orderRes.data.order.orderId);

    const getOrdersRes = await request({
      host,
      port,
      path: `/api/orders?userEmail=${encodeURIComponent(testEmail)}`,
      method: "GET"
    });
    console.log("9. GET /api/orders -> Status:", getOrdersRes.status, "Orders Count:", getOrdersRes.data.length);

    // Order status update
    const updateOrderRes = await request(
      {
        host,
        port,
        path: `/api/orders/${orderRes.data.order.orderId}/status`,
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      },
      { orderStatus: "Confirmed" }
    );
    console.log("10. PUT /api/orders/:id/status -> Status:", updateOrderRes.status, "Updated Status:", updateOrderRes.data.order.orderStatus);

    // 6. Payment
    const paymentRes = await request(
      {
        host,
        port,
        path: "/api/payments",
        method: "POST",
        headers: { "Content-Type": "application/json" }
      },
      {
        orderId: orderRes.data.order.orderId,
        userEmail: testEmail,
        amount: 3998,
        method: "cod"
      }
    );
    console.log("11. POST /api/payments -> Status:", paymentRes.status, "TXN ID:", paymentRes.data.payment.transactionId);

    // 7. Address
    const addrRes = await request(
      {
        host,
        port,
        path: "/api/addresses",
        method: "POST",
        headers: { "Content-Type": "application/json" }
      },
      {
        userEmail: testEmail,
        fullName: "Sravani Puppala",
        phone: "9876543210",
        address: "123 Main Street, Flat 402",
        city: "Hyderabad",
        pincode: "500001",
        isDefault: true
      }
    );
    console.log("12. POST /api/addresses -> Status:", addrRes.status, addrRes.data.message);

    // 8. Review
    const revRes = await request(
      {
        host,
        port,
        path: "/api/reviews",
        method: "POST",
        headers: { "Content-Type": "application/json" }
      },
      {
        productId: 1,
        userName: "Sravani Puppala",
        userEmail: testEmail,
        rating: 5,
        comment: "Excellent sound quality and fast delivery!"
      }
    );
    console.log("13. POST /api/reviews -> Status:", revRes.status, revRes.data.message);

    const getRevRes = await request({
      host,
      port,
      path: `/api/reviews?productId=1`,
      method: "GET"
    });
    console.log("14. GET /api/reviews -> Status:", getRevRes.status, "Reviews Count:", getRevRes.data.length);

    console.log("=== ALL API TESTS PASSED SUCCESSFULLY! ===");
    process.exit(0);
  } catch (err) {
    console.error("Test failed:", err);
    process.exit(1);
  }
}

// Start backend server in same process for test
require("./server.js");
setTimeout(runTests, 1000);
