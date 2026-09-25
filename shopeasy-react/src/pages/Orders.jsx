import { useState, useEffect } from "react";

const ORDER_STAGES = ["Placed", "Confirmed", "Shipped", "Out for Delivery", "Delivered"];

function Orders({ userEmail, isLoggedIn, onNavigate }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://shopeasy-backend-seven.vercel.app/api/orders?userEmail=${encodeURIComponent(userEmail)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch orders from server");
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.warn("Backend orders fetch error, checking local store:", err.message);
      // Fallback to locally saved orders if any
      try {
        const local = localStorage.getItem("shopEasyOrders");
        if (local) {
          const parsed = JSON.parse(local);
          const userLocalOrders = parsed.filter(
            (o) => o.userEmail && o.userEmail.toLowerCase() === userEmail.toLowerCase()
          );
          setOrders(userLocalOrders);
        }
      } catch (e) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userEmail]);

  const handleImageError = (e) => {
    e.currentTarget.onerror = null;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="65" height="65" viewBox="0 0 65 65"><rect width="100%" height="100%" fill="#f1f5f9"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="24" font-family="sans-serif">🛍️</text></svg>`;
    e.currentTarget.src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  const getStageIndex = (status) => {
    const idx = ORDER_STAGES.indexOf(status);
    return idx >= 0 ? idx : 0;
  };

  if (!isLoggedIn) {
    return (
      <main>
        <section className="checkout-section" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="checkout-empty" style={{ textAlign: "center", maxWidth: "500px", padding: "40px" }}>
            <div style={{ fontSize: "3rem", marginBottom: "15px" }}>🔒</div>
            <h2>Please Log In to View Orders</h2>
            <p style={{ color: "#64748b", margin: "10px 0 25px 0" }}>
              Log in to your ShopEasy account to view your past orders and live delivery tracking status.
            </p>
            <button
              type="button"
              className="checkout-btn"
              onClick={() => onNavigate("login")}
            >
              Go to Login
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="checkout-section" style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "15px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "2rem", color: "#1e293b" }}>📦 My Orders & Tracking</h1>
            <p style={{ margin: "6px 0 0 0", color: "#64748b" }}>
              Track order status and view complete purchase history for <strong>{userEmail}</strong>
            </p>
          </div>
          <button
            type="button"
            onClick={fetchOrders}
            style={{
              background: "#f1f5f9",
              border: "1px solid #cbd5e1",
              padding: "8px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              color: "#334155"
            }}
          >
            🔄 Refresh Status
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <div style={{ fontSize: "2rem", marginBottom: "10px" }}>⏳</div>
            <p style={{ color: "#64748b" }}>Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="checkout-empty" style={{ textAlign: "center", padding: "50px 20px" }}>
            <div style={{ fontSize: "3rem", marginBottom: "10px" }}>🛍️</div>
            <h2>No Orders Found</h2>
            <p style={{ color: "#64748b", marginBottom: "25px" }}>You haven't placed any orders with ShopEasy yet.</p>
            <button
              type="button"
              className="checkout-btn"
              onClick={() => onNavigate("products")}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
            {orders.map((order) => {
              const currentStageIndex = getStageIndex(order.orderStatus);
              const orderDate = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })
                : "Recent";

              return (
                <div
                  key={order._id || order.orderId}
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                    padding: "24px",
                    overflow: "hidden"
                  }}
                >
                  {/* Order Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      borderBottom: "1px solid #f1f5f9",
                      paddingBottom: "16px",
                      marginBottom: "20px",
                      flexWrap: "wrap",
                      gap: "12px"
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600", textTransform: "uppercase" }}>
                        Order ID
                      </div>
                      <div style={{ fontSize: "1.2rem", fontWeight: "700", color: "#2563eb", marginTop: "2px" }}>
                        {order.orderId}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "4px" }}>
                        Placed on {orderDate}
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                        Total Amount
                      </div>
                      <div style={{ fontSize: "1.3rem", fontWeight: "700", color: "#0f172a" }}>
                        ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                      </div>
                      <span
                        style={{
                          display: "inline-block",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                          padding: "3px 10px",
                          borderRadius: "12px",
                          marginTop: "4px",
                          background:
                            order.paymentStatus === "Completed" || order.paymentStatus === "Paid"
                              ? "#dcfce7"
                              : "#fef3c7",
                          color:
                            order.paymentStatus === "Completed" || order.paymentStatus === "Paid"
                              ? "#15803d"
                              : "#b45309"
                        }}
                      >
                        Payment: {order.paymentStatus} ({order.paymentMethod?.toUpperCase()})
                      </span>
                    </div>
                  </div>

                  {/* Visual Order Lifecycle Step Tracker */}
                  <div style={{ margin: "25px 0 30px 0" }}>
                    <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "#334155", marginBottom: "15px" }}>
                      Delivery Progress
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        position: "relative",
                        alignItems: "center"
                      }}
                    >
                      {/* Tracker background line */}
                      <div
                        style={{
                          position: "absolute",
                          top: "16px",
                          left: "5%",
                          right: "5%",
                          height: "4px",
                          background: "#e2e8f0",
                          zIndex: 1
                        }}
                      />
                      {/* Tracker active progress line */}
                      <div
                        style={{
                          position: "absolute",
                          top: "16px",
                          left: "5%",
                          width: `${(currentStageIndex / (ORDER_STAGES.length - 1)) * 90}%`,
                          height: "4px",
                          background: "#2563eb",
                          zIndex: 2,
                          transition: "width 0.4s ease"
                        }}
                      />

                      {ORDER_STAGES.map((stage, idx) => {
                        const isCompleted = idx <= currentStageIndex;
                        const isCurrent = idx === currentStageIndex;

                        return (
                          <div
                            key={stage}
                            style={{
                              position: "relative",
                              zIndex: 3,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              textAlign: "center",
                              width: "18%"
                            }}
                          >
                            <div
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                background: isCompleted ? "#2563eb" : "#ffffff",
                                border: isCompleted ? "2px solid #2563eb" : "2px solid #cbd5e1",
                                color: isCompleted ? "#ffffff" : "#64748b",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "700",
                                fontSize: "0.85rem",
                                boxShadow: isCurrent ? "0 0 0 4px rgba(37, 99, 235, 0.2)" : "none"
                              }}
                            >
                              {isCompleted ? "✓" : idx + 1}
                            </div>
                            <span
                              style={{
                                marginTop: "8px",
                                fontSize: "0.82rem",
                                fontWeight: isCurrent ? "700" : "500",
                                color: isCurrent ? "#2563eb" : isCompleted ? "#0f172a" : "#94a3b8"
                              }}
                            >
                              {stage}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Details & Items List */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                    {/* Items */}
                    <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "16px" }}>
                      <div style={{ fontSize: "0.9rem", fontWeight: "600", color: "#475569", marginBottom: "12px" }}>
                        Items Ordered ({order.items?.length || 0})
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {order.items?.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              background: "#ffffff",
                              padding: "10px",
                              borderRadius: "8px",
                              border: "1px solid #e2e8f0"
                            }}
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              onError={handleImageError}
                              style={{ width: "45px", height: "45px", objectFit: "cover", borderRadius: "6px" }}
                            />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: "0.9rem", fontWeight: "600", color: "#1e293b" }}>{item.name}</div>
                              <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                                ₹{Number(item.price).toLocaleString("en-IN")} × {item.quantity}
                              </div>
                            </div>
                            <div style={{ fontWeight: "600", fontSize: "0.9rem", color: "#0f172a" }}>
                              ₹{(Number(item.price) * Number(item.quantity)).toLocaleString("en-IN")}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "16px" }}>
                      <div style={{ fontSize: "0.9rem", fontWeight: "600", color: "#475569", marginBottom: "12px" }}>
                        Delivery Details
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "#1e293b", lineHeight: "1.6" }}>
                        <p style={{ margin: "0 0 4px 0", fontWeight: "600" }}>{order.customerName}</p>
                        <p style={{ margin: "0 0 4px 0", color: "#64748b" }}>📞 {order.phone}</p>
                        <p style={{ margin: "0 0 4px 0", color: "#475569" }}>
                          📍 {order.deliveryAddress?.address}, {order.deliveryAddress?.city} - {order.deliveryAddress?.pincode}
                        </p>
                        {order.deliveryAddress?.coordinates && (
                          <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#0284c7" }}>
                            🌐 GPS Coordinates: {Number(order.deliveryAddress.coordinates.lat).toFixed(4)}, {Number(order.deliveryAddress.coordinates.lng).toFixed(4)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default Orders;
