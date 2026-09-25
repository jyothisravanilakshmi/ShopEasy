function OrderSuccess({ onNavigate, placedOrder }) {
  return (
    <main>
      <section className="order-success-section">
        <div className="order-success-box">
          <div className="success-icon">✓</div>

          <h1>Order Placed Successfully!</h1>

          {placedOrder && placedOrder.orderId && (
            <div
              style={{
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                color: "#1d4ed8",
                padding: "8px 16px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "1rem",
                display: "inline-block",
                margin: "12px 0"
              }}
            >
              Order ID: {placedOrder.orderId}
            </div>
          )}

          <p>Thank you for shopping with ShopEasy.</p>

          <p className="success-message">
            Your order has been received and is being processed for delivery.
          </p>

          <div className="order-info">
            <p>🎉 Thank you for choosing ShopEasy!</p>
            <p>📦 Your order will be delivered to your provided address.</p>
            <p>📧 You can track your order status anytime in My Orders.</p>
          </div>

          <div className="success-buttons" style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              className="continue-shopping-btn"
              onClick={() => onNavigate("orders")}
              style={{ background: "#2563eb", color: "#fff" }}
            >
              📦 Track Order
            </button>

            <button
              type="button"
              className="continue-shopping-btn"
              onClick={() => onNavigate("products")}
            >
              Continue Shopping
            </button>

            <button
              type="button"
              className="home-btn"
              onClick={() => onNavigate("home")}
            >
              Back to Home
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default OrderSuccess;
