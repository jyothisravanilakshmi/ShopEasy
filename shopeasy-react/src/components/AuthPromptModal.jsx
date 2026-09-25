function AuthPromptModal({ isOpen, onClose, onLogin, onRegister }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(4px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 0.2s ease-out"
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          maxWidth: "460px",
          width: "100%",
          padding: "32px 28px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          textAlign: "center",
          position: "relative"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "#f1f5f9",
            border: "none",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            fontSize: "1rem",
            color: "#64748b",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Icon */}
        <div
          style={{
            width: "68px",
            height: "68px",
            background: "#eff6ff",
            border: "2px solid #bfdbfe",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            margin: "0 auto 18px auto"
          }}
        >
          🛍️
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: "1.45rem",
            fontWeight: "700",
            color: "#0f172a",
            margin: "0 0 10px 0"
          }}
        >
          Login Required
        </h3>

        {/* Message */}
        <p
          style={{
            fontSize: "1rem",
            color: "#475569",
            lineHeight: "1.5",
            margin: "0 0 24px 0"
          }}
        >
          Please login or register before adding products to your cart.
        </p>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            type="button"
            onClick={onLogin}
            style={{
              background: "#2563eb",
              color: "#ffffff",
              border: "none",
              padding: "12px 20px",
              borderRadius: "10px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background 0.2s"
            }}
          >
            Login to Your Account
          </button>

          <button
            type="button"
            onClick={onRegister}
            style={{
              background: "#f8fafc",
              color: "#2563eb",
              border: "1.5px solid #bfdbfe",
              padding: "12px 20px",
              borderRadius: "10px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background 0.2s"
            }}
          >
            Create New Account
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              color: "#94a3b8",
              border: "none",
              padding: "8px",
              fontSize: "0.9rem",
              cursor: "pointer"
            }}
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthPromptModal;
