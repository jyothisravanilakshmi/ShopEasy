function Cart({ cart, isLoggedIn, onChangeQuantity, onRemoveFromCart, onClearCart, onNavigate }) {
  const handleImageError = (e) => {
    e.currentTarget.onerror = null;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="#f1f5f9"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="32" font-family="sans-serif">🛒</text></svg>`;
    e.currentTarget.src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const handleClearCart = () => {
    if (cart.length === 0) return;
    const confirmed = window.confirm("Are you sure you want to clear your cart?");
    if (confirmed) {
      onClearCart();
    }
  };

  const handleGoToCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    onNavigate("checkout");
  };

  return (
    <main>
      <section className="cart-section">
        <div className="section-title">
          <h1>Shopping Cart</h1>
          <p>Review your items before checkout</p>
        </div>

        {!isLoggedIn && (
          <div
            style={{
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              color: "#1e40af",
              padding: "14px 20px",
              borderRadius: "12px",
              marginBottom: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px"
            }}
          >
            <div>
              <strong>🔒 Login Required for Cart & Checkout</strong>
              <p style={{ margin: "4px 0 0 0", fontSize: "0.9rem", color: "#3b82f6" }}>
                Login to access your saved cart items and proceed with order placement.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("login")}
              style={{
                background: "#2563eb",
                color: "#ffffff",
                border: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Login / Register
            </button>
          </div>
        )}

        <div id="cart-container" className="cart-container">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h2>Your cart is empty</h2>
              <p>Looks like you haven't added anything to your cart yet.</p>
              <button
                type="button"
                className="checkout-btn"
                onClick={() => onNavigate("products")}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item) => {
                  const itemId = item.productId !== undefined ? item.productId : item.id;
                  const price = Number(item.price);
                  const quantity = Number(item.quantity);
                  const itemTotal = price * quantity;
                  const imgUrl = item.image?.startsWith("/")
                    ? item.image
                    : item.image?.startsWith("http")
                    ? item.image
                    : `/${item.image || "images/headphone.jpg"}`;

                  return (
                    <div className="cart-item" key={itemId}>
                      <img
                        src={imgUrl}
                        alt={item.name}
                        className="cart-item-image"
                        onError={handleImageError}
                      />

                      <div className="cart-item-info">
                        <h3>{item.name}</h3>
                        <p>₹{price.toLocaleString("en-IN")}</p>
                      </div>

                      <div className="quantity-controls">
                        <button
                          type="button"
                          onClick={() => onChangeQuantity(itemId, -1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span>{quantity}</span>
                        <button
                          type="button"
                          onClick={() => onChangeQuantity(itemId, 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <div className="cart-item-total">
                        ₹{itemTotal.toLocaleString("en-IN")}
                      </div>

                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => onRemoveFromCart(itemId)}
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="cart-summary">
                <h2>Cart Summary</h2>
                <p>
                  Total: <strong>₹{total.toLocaleString("en-IN")}</strong>
                </p>

                <div className="cart-summary-buttons">
                  <button
                    type="button"
                    className="clear-cart-btn"
                    onClick={handleClearCart}
                  >
                    Clear Cart
                  </button>

                  <button
                    type="button"
                    className="checkout-btn"
                    onClick={handleGoToCheckout}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default Cart;
