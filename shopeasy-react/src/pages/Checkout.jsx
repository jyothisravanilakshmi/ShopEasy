import { useState, useEffect } from "react";

function Checkout({ cart, currentUser, isLoggedIn, onPlaceOrder, onNavigate }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    payment: "cod"
  });
  const [coordinates, setCoordinates] = useState(null);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Interactive Payment Simulation States
  const [upiId, setUpiId] = useState("");
  const [upiError, setUpiError] = useState("");
  const [isUpiVerified, setIsUpiVerified] = useState(false);

  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: ""
  });
  const [cardError, setCardError] = useState("");

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(true); // Default true because default method is "cod"
  const [paymentTransactionId, setPaymentTransactionId] = useState("");

  // Pre-fill user data if logged in
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.name || prev.name,
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone
      }));
    }
  }, [currentUser]);

  const handleImageError = (e) => {
    e.currentTarget.onerror = null;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="65" height="65" viewBox="0 0 65 65"><rect width="100%" height="100%" fill="#f1f5f9"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="24" font-family="sans-serif">🛍️</text></svg>`;
    e.currentTarget.src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (e) => {
    const method = e.target.value;
    setFormData((prev) => ({ ...prev, payment: method }));
    setIsPaymentConfirmed(method === "cod");
    setIsProcessingPayment(false);
    setIsUpiVerified(false);
    setUpiError("");
    setCardError("");
    setPaymentTransactionId("");
  };

  // UPI Handlers
  const handleVerifyUpi = (e) => {
    if (e) e.preventDefault();
    const trimmed = upiId.trim();
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,64}@[a-zA-Z]{2,32}$/;
    if (!trimmed) {
      setUpiError("Please enter your UPI ID.");
      setIsUpiVerified(false);
      return false;
    }
    if (!upiRegex.test(trimmed)) {
      setUpiError("Please enter a valid UPI ID (e.g. mobile@upi or username@okaxis).");
      setIsUpiVerified(false);
      return false;
    }
    setIsUpiVerified(true);
    setUpiError("");
    return true;
  };

  const handlePayUpi = (e) => {
    if (e) e.preventDefault();
    if (!isUpiVerified) {
      const valid = handleVerifyUpi();
      if (!valid) return;
    }
    setIsProcessingPayment(true);
    setUpiError("");
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsPaymentConfirmed(true);
      const txn = `UPI-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
      setPaymentTransactionId(txn);
    }, 1200);
  };

  // Card Handlers
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardData((prev) => ({ ...prev, number: formatted }));
    setCardError("");
  };

  const handleCardNameChange = (e) => {
    setCardData((prev) => ({ ...prev, name: e.target.value }));
    setCardError("");
  };

  const handleExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length > 2) {
      raw = raw.slice(0, 2) + "/" + raw.slice(2);
    }
    setCardData((prev) => ({ ...prev, expiry: raw }));
    setCardError("");
  };

  const handleCvvChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCardData((prev) => ({ ...prev, cvv: raw }));
    setCardError("");
  };

  const handlePayCard = (e) => {
    if (e) e.preventDefault();
    setCardError("");
    const rawNumber = cardData.number.replace(/\s/g, "");
    if (rawNumber.length !== 16) {
      setCardError("Card number must be 16 digits.");
      return;
    }
    if (!cardData.name.trim()) {
      setCardError("Please enter the cardholder name.");
      return;
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardData.expiry)) {
      setCardError("Please enter a valid expiry date in MM/YY format.");
      return;
    }
    if (cardData.cvv.length < 3) {
      setCardError("Please enter a valid 3 or 4 digit CVV.");
      return;
    }

    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsPaymentConfirmed(true);
      const txn = `CARD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
      setPaymentTransactionId(txn);
    }, 1200);
  };

  // Browser Geolocation API integration (Free, zero paid services)
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setDetectingLocation(true);
    setLocationStatus("Detecting your location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });

        try {
          // Free reverse geocoding via OpenStreetMap Nominatim
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          if (!response.ok) {
            throw new Error("Unable to fetch address details");
          }

          const data = await response.json();
          const addr = data.address || {};

          const street = addr.road || addr.suburb || addr.neighbourhood || "";
          const city = addr.city || addr.town || addr.village || addr.county || "";
          const pincode = addr.postcode || "";

          setFormData((prev) => ({
            ...prev,
            address: data.display_name ? data.display_name.split(",").slice(0, 3).join(", ") : street,
            city: city || prev.city,
            pincode: pincode || prev.pincode
          }));

          setLocationStatus("📍 Location detected and address auto-filled!");
          setTimeout(() => setLocationStatus(""), 4000);
        } catch (err) {
          console.warn("Reverse geocode fallback:", err.message);
          setLocationStatus(`📍 Coords: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        } finally {
          setDetectingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setDetectingLocation(false);
        setLocationStatus("");
        if (error.code === error.PERMISSION_DENIED) {
          alert("Location permission was denied. Please enter your address manually.");
        } else {
          alert("Could not detect location. Please enter your address manually.");
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("You must be logged in to place an order.");
      onNavigate("login");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if ((formData.payment === "upi" || formData.payment === "card") && !isPaymentConfirmed) {
      alert(
        `Please complete the ${formData.payment === "upi" ? "UPI" : "Card"} payment before placing your order.`
      );
      return;
    }

    setIsSubmitting(true);

    const resolvedPaymentMethod =
      formData.payment === "upi"
        ? "UPI"
        : formData.payment === "card"
        ? "Credit / Debit Card"
        : "Cash on Delivery";

    const resolvedPaymentStatus =
      formData.payment === "cod" ? "Pending" : "Paid";

    const orderPayload = {
      userEmail: formData.email.trim().toLowerCase(),
      customerName: formData.name.trim(),
      phone: formData.phone.trim(),
      deliveryAddress: {
        address: formData.address.trim(),
        city: formData.city.trim(),
        pincode: formData.pincode.trim(),
        coordinates: coordinates
      },
      items: cart.map((item) => ({
        productId: item.productId !== undefined ? item.productId : item.id,
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity),
        image: item.image?.startsWith("/") ? item.image : (item.image?.startsWith("http") ? item.image : `/${item.image || "images/headphone.jpg"}`)
      })),
      totalAmount: total,
      paymentMethod: resolvedPaymentMethod,
      paymentStatus: resolvedPaymentStatus
    };

    try {
      // 1. Post order to backend MongoDB API
      const orderRes = await fetch("https://shopeasy-backend-seven.vercel.app/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.message || "Failed to place order");
      }

      const createdOrder = orderData.order;

      // 2. Record payment in backend MongoDB API (No card numbers/CVV stored)
      try {
        await fetch("https://shopeasy-backend-seven.vercel.app/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: createdOrder.orderId,
            userEmail: createdOrder.userEmail,
            amount: createdOrder.totalAmount,
            method: createdOrder.paymentMethod,
            status: createdOrder.paymentStatus === "Paid" ? "Success" : "Pending",
            transactionId: paymentTransactionId || `TXN-${Date.now()}`
          })
        });
      } catch (payErr) {
        console.warn("Payment recording note:", payErr.message);
      }

      onPlaceOrder(createdOrder);
    } catch (err) {
      console.warn("Backend order submission note:", err.message);
      // Fallback order generation for smooth user experience
      const fallbackOrder = {
        orderId: `ORD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
        userEmail: formData.email,
        customerName: formData.name,
        phone: formData.phone,
        deliveryAddress: {
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          coordinates
        },
        items: cart,
        totalAmount: total,
        paymentMethod: resolvedPaymentMethod,
        paymentStatus: resolvedPaymentStatus,
        orderStatus: "Placed",
        createdAt: new Date().toISOString()
      };
      onPlaceOrder(fallbackOrder);
    } finally {
      setIsSubmitting(false);
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  return (
    <main>
      <section className="checkout-section">
        <h1>Checkout</h1>

        {/* Authentication Notice Banner if not logged in */}
        {!isLoggedIn && (
          <div
            style={{
              background: "#fef3c7",
              border: "1px solid #f59e0b",
              color: "#92400e",
              borderRadius: "12px",
              padding: "16px 20px",
              marginBottom: "25px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px"
            }}
          >
            <div>
              <strong style={{ fontSize: "1.05rem" }}>🔒 Login Required to Place Order</strong>
              <p style={{ margin: "4px 0 0 0", fontSize: "0.95rem" }}>
                You must be logged in to place an order and track its delivery.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("login")}
              style={{
                background: "#f59e0b",
                color: "#fff",
                border: "none",
                padding: "8px 18px",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Login / Register Now
            </button>
          </div>
        )}

        {cart.length === 0 ? (
          <div className="checkout-empty">
            <h2>Your cart is empty</h2>
            <p>Please add products before going to checkout.</p>
            <button
              type="button"
              className="checkout-btn"
              onClick={() => onNavigate("products")}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="checkout-container">
            {/* ================= CUSTOMER INFORMATION ================= */}
            <div className="checkout-form">
              <h2>Customer Information</h2>

              <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Address + Detect Location Button */}
                <div className="form-group">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "6px"
                    }}
                  >
                    <label htmlFor="address" style={{ margin: 0 }}>
                      Delivery Address
                    </label>
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      disabled={detectingLocation}
                      style={{
                        background: "#e0f2fe",
                        color: "#0284c7",
                        border: "1px solid #bae6fd",
                        borderRadius: "6px",
                        padding: "4px 10px",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        cursor: detectingLocation ? "wait" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      {detectingLocation ? "⏳ Detecting..." : "📍 Auto-fill with Location"}
                    </button>
                  </div>

                  {locationStatus && (
                    <div
                      style={{
                        fontSize: "0.82rem",
                        color: locationStatus.includes("⚠️") ? "#dc2626" : "#059669",
                        marginBottom: "6px",
                        fontWeight: "500"
                      }}
                    >
                      {locationStatus}
                    </div>
                  )}

                  <textarea
                    id="address"
                    name="address"
                    placeholder="Enter your complete address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                {/* City */}
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="Enter your city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Pincode */}
                <div className="form-group">
                  <label htmlFor="pincode">Pincode</label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    placeholder="Enter your pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Payment */}
                <div className="form-group">
                  <label>Payment Method</label>

                  <div className="payment-options">
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={formData.payment === "cod"}
                        onChange={handlePaymentMethodChange}
                        required
                      />
                      <span>Cash on Delivery (COD)</span>
                    </label>

                    <label className="payment-option">
                      <input
                        type="radio"
                        name="payment"
                        value="upi"
                        checked={formData.payment === "upi"}
                        onChange={handlePaymentMethodChange}
                      />
                      <span>UPI (GPay / PhonePe / Paytm / BHIM)</span>
                    </label>

                    <label className="payment-option">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={formData.payment === "card"}
                        onChange={handlePaymentMethodChange}
                      />
                      <span>Credit / Debit Card</span>
                    </label>
                  </div>

                  {/* COD Info */}
                  {formData.payment === "cod" && (
                    <div
                      style={{
                        marginTop: "12px",
                        padding: "12px 14px",
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        color: "#475569",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}
                    >
                      <span style={{ fontSize: "1.2rem" }}>💵</span>
                      <span>
                        <strong>Cash on Delivery:</strong> Pay in cash upon delivery at your doorstep. No advance payment required.
                      </span>
                    </div>
                  )}

                  {/* UPI Simulation Container */}
                  {formData.payment === "upi" && (
                    <div
                      style={{
                        marginTop: "14px",
                        padding: "16px",
                        background: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                        borderRadius: "10px"
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "12px",
                          flexWrap: "wrap",
                          gap: "8px"
                        }}
                      >
                        <div style={{ fontWeight: "600", color: "#166534", display: "flex", alignItems: "center", gap: "6px" }}>
                          <span>⚡ Instant UPI Payment</span>
                        </div>
                        <span style={{ fontSize: "0.8rem", color: "#15803d", background: "#dcfce7", padding: "2px 8px", borderRadius: "10px" }}>
                          GPay • PhonePe • Paytm • BHIM
                        </span>
                      </div>

                      <label
                        htmlFor="upi-id-input"
                        style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#374151", marginBottom: "6px" }}
                      >
                        Enter UPI ID (VPA)
                      </label>
                      <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                        <input
                          type="text"
                          id="upi-id-input"
                          placeholder="e.g. yourname@okaxis or 9876543210@upi"
                          value={upiId}
                          disabled={isPaymentConfirmed || isProcessingPayment}
                          onChange={(e) => {
                            setUpiId(e.target.value);
                            setIsUpiVerified(false);
                            setUpiError("");
                          }}
                          style={{
                            flex: 1,
                            padding: "10px 12px",
                            border: upiError ? "1px solid #ef4444" : isUpiVerified ? "1px solid #10b981" : "1px solid #cbd5e1",
                            borderRadius: "8px",
                            fontSize: "0.92rem",
                            outline: "none"
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleVerifyUpi}
                          disabled={isPaymentConfirmed || isProcessingPayment || !upiId.trim()}
                          style={{
                            padding: "10px 16px",
                            background: isUpiVerified ? "#10b981" : "#2563eb",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "600",
                            fontSize: "0.88rem",
                            cursor: isUpiVerified || isPaymentConfirmed ? "default" : "pointer",
                            whiteSpace: "nowrap",
                            transition: "0.2s"
                          }}
                        >
                          {isUpiVerified ? "✓ Verified" : "Verify UPI"}
                        </button>
                      </div>

                      {upiError && (
                        <div style={{ color: "#dc2626", fontSize: "0.82rem", marginBottom: "8px", fontWeight: "500" }}>
                          ⚠️ {upiError}
                        </div>
                      )}

                      {isUpiVerified && !isPaymentConfirmed && (
                        <div style={{ color: "#15803d", fontSize: "0.82rem", marginBottom: "10px", fontWeight: "600" }}>
                          ✓ UPI ID Verified ({upiId})
                        </div>
                      )}

                      {/* Pay Button / Success Status */}
                      {isPaymentConfirmed ? (
                        <div
                          style={{
                            padding: "10px 14px",
                            background: "#dcfce7",
                            border: "1px solid #86efac",
                            borderRadius: "8px",
                            color: "#166534",
                            fontWeight: "600",
                            fontSize: "0.9rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginTop: "10px"
                          }}
                        >
                          <span>✓ Payment Successful!</span>
                          <span style={{ fontSize: "0.8rem", color: "#15803d", marginLeft: "auto" }}>
                            Ref: {paymentTransactionId}
                          </span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handlePayUpi}
                          disabled={!isUpiVerified || isProcessingPayment}
                          style={{
                            width: "100%",
                            padding: "11px",
                            marginTop: "8px",
                            background: isUpiVerified ? "#16a34a" : "#94a3b8",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "700",
                            fontSize: "0.95rem",
                            cursor: isUpiVerified && !isProcessingPayment ? "pointer" : "not-allowed",
                            transition: "0.2s"
                          }}
                        >
                          {isProcessingPayment ? "⏳ Processing UPI Payment..." : `Pay ₹${total.toLocaleString("en-IN")}`}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Card Simulation Container */}
                  {formData.payment === "card" && (
                    <div
                      style={{
                        marginTop: "14px",
                        padding: "16px",
                        background: "#f8fafc",
                        border: "1px solid #cbd5e1",
                        borderRadius: "10px"
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "12px",
                          flexWrap: "wrap",
                          gap: "8px"
                        }}
                      >
                        <div style={{ fontWeight: "600", color: "#1e293b", display: "flex", alignItems: "center", gap: "6px" }}>
                          <span>💳 Credit / Debit Card</span>
                        </div>
                        <span style={{ fontSize: "0.8rem", color: "#475569", background: "#e2e8f0", padding: "2px 8px", borderRadius: "10px" }}>
                          Visa • Mastercard • RuPay
                        </span>
                      </div>

                      {/* Card Number */}
                      <div style={{ marginBottom: "10px" }}>
                        <label
                          htmlFor="card-number-input"
                          style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#374151", marginBottom: "4px" }}
                        >
                          Card Number
                        </label>
                        <input
                          type="text"
                          id="card-number-input"
                          placeholder="4532 1234 5678 9010"
                          maxLength={19}
                          value={cardData.number}
                          disabled={isPaymentConfirmed || isProcessingPayment}
                          onChange={handleCardNumberChange}
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            border: "1px solid #cbd5e1",
                            borderRadius: "8px",
                            fontSize: "0.95rem",
                            letterSpacing: "1px",
                            fontFamily: "monospace",
                            outline: "none"
                          }}
                        />
                      </div>

                      {/* Cardholder Name */}
                      <div style={{ marginBottom: "10px" }}>
                        <label
                          htmlFor="card-name-input"
                          style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#374151", marginBottom: "4px" }}
                        >
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          id="card-name-input"
                          placeholder="Name as on card"
                          value={cardData.name}
                          disabled={isPaymentConfirmed || isProcessingPayment}
                          onChange={handleCardNameChange}
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            border: "1px solid #cbd5e1",
                            borderRadius: "8px",
                            fontSize: "0.92rem",
                            outline: "none"
                          }}
                        />
                      </div>

                      {/* Expiry & CVV */}
                      <div style={{ display: "flex", gap: "12px", marginBottom: "10px" }}>
                        <div style={{ flex: 1 }}>
                          <label
                            htmlFor="card-expiry-input"
                            style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#374151", marginBottom: "4px" }}
                          >
                            Expiry (MM/YY)
                          </label>
                          <input
                            type="text"
                            id="card-expiry-input"
                            placeholder="MM/YY"
                            maxLength={5}
                            value={cardData.expiry}
                            disabled={isPaymentConfirmed || isProcessingPayment}
                            onChange={handleExpiryChange}
                            style={{
                              width: "100%",
                              padding: "10px 12px",
                              border: "1px solid #cbd5e1",
                              borderRadius: "8px",
                              fontSize: "0.92rem",
                              outline: "none"
                            }}
                          />
                        </div>

                        <div style={{ flex: 1 }}>
                          <label
                            htmlFor="card-cvv-input"
                            style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#374151", marginBottom: "4px" }}
                          >
                            CVV
                          </label>
                          <input
                            type="password"
                            id="card-cvv-input"
                            placeholder="•••"
                            maxLength={4}
                            value={cardData.cvv}
                            disabled={isPaymentConfirmed || isProcessingPayment}
                            onChange={handleCvvChange}
                            style={{
                              width: "100%",
                              padding: "10px 12px",
                              border: "1px solid #cbd5e1",
                              borderRadius: "8px",
                              fontSize: "0.92rem",
                              outline: "none"
                            }}
                          />
                        </div>
                      </div>

                      <div
                        style={{
                          fontSize: "0.78rem",
                          color: "#64748b",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          marginBottom: "10px"
                        }}
                      >
                        <span>🔒 Demo simulation. Sensitive card details are never stored.</span>
                      </div>

                      {cardError && (
                        <div style={{ color: "#dc2626", fontSize: "0.82rem", marginBottom: "8px", fontWeight: "500" }}>
                          ⚠️ {cardError}
                        </div>
                      )}

                      {/* Pay Button / Success Status */}
                      {isPaymentConfirmed ? (
                        <div
                          style={{
                            padding: "10px 14px",
                            background: "#dcfce7",
                            border: "1px solid #86efac",
                            borderRadius: "8px",
                            color: "#166534",
                            fontWeight: "600",
                            fontSize: "0.9rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginTop: "10px"
                          }}
                        >
                          <span>✓ Payment Successful!</span>
                          <span style={{ fontSize: "0.8rem", color: "#15803d", marginLeft: "auto" }}>
                            Ref: {paymentTransactionId}
                          </span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handlePayCard}
                          disabled={isProcessingPayment}
                          style={{
                            width: "100%",
                            padding: "11px",
                            marginTop: "8px",
                            background: "#2563eb",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "700",
                            fontSize: "0.95rem",
                            cursor: isProcessingPayment ? "wait" : "pointer",
                            transition: "0.2s"
                          }}
                        >
                          {isProcessingPayment ? "⏳ Processing Card Payment..." : `Pay ₹${total.toLocaleString("en-IN")}`}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Place Order */}
                {isLoggedIn ? (
                  <button
                    type="submit"
                    className="place-order-btn"
                    disabled={isSubmitting || ((formData.payment === "upi" || formData.payment === "card") && !isPaymentConfirmed)}
                    style={{
                      opacity: isSubmitting || ((formData.payment === "upi" || formData.payment === "card") && !isPaymentConfirmed) ? 0.75 : 1,
                      cursor: isSubmitting ? "wait" : ((formData.payment === "upi" || formData.payment === "card") && !isPaymentConfirmed ? "not-allowed" : "pointer"),
                      background: (formData.payment === "upi" || formData.payment === "card") && !isPaymentConfirmed ? "#64748b" : undefined
                    }}
                  >
                    {isSubmitting
                      ? "Placing Order..."
                      : (formData.payment === "upi" || formData.payment === "card") && !isPaymentConfirmed
                      ? `Complete ${formData.payment === "upi" ? "UPI" : "Card"} Payment to Place Order`
                      : "Place Order"}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="place-order-btn"
                    style={{
                      background: "#94a3b8",
                      cursor: "not-allowed"
                    }}
                    onClick={() => {
                      alert("Please log in to place an order.");
                      onNavigate("login");
                    }}
                  >
                    🔒 Login to Place Order
                  </button>
                )}
              </form>
            </div>

            {/* ================= ORDER SUMMARY ================= */}
            <div className="checkout-summary">
              <h2>Order Summary</h2>

              <div id="checkout-items">
                {cart.map((item) => {
                  const itemId = item.productId !== undefined ? item.productId : item.id;
                  const itemTotal = Number(item.price) * Number(item.quantity);
                  const imgUrl = item.image?.startsWith("/") ? item.image : (item.image?.startsWith("http") ? item.image : `/${item.image || "images/headphone.jpg"}`);

                  return (
                    <div className="checkout-item" key={itemId}>
                      <img
                        src={imgUrl}
                        alt={item.name}
                        onError={handleImageError}
                      />

                      <div className="checkout-item-info">
                        <h3>{item.name}</h3>
                        <p>
                          ₹{Number(item.price).toLocaleString("en-IN")} ×{" "}
                          {item.quantity}
                        </p>
                      </div>

                      <div className="checkout-item-price">
                        ₹{itemTotal.toLocaleString("en-IN")}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total */}
              <div className="checkout-total">
                <span>Total</span>
                <strong id="checkout-total">
                  ₹{total.toLocaleString("en-IN")}
                </strong>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default Checkout;
