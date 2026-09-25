import { useState, useEffect, useRef } from "react";

function Navbar({ currentPage, onNavigate, cartCount, isLoggedIn, userEmail, onLogout }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleNavClick = (e, page, params) => {
    e.preventDefault();
    setProfileOpen(false);
    onNavigate(page, params);
  };

  return (
    <header className="navbar">
      <div
        className="logo"
        style={{ cursor: "pointer" }}
        onClick={(e) => handleNavClick(e, "home")}
      >
        🛍️ <span>ShopEasy</span>
      </div>

      <nav>
        <ul className="nav-links">
          <li>
            <a
              href="#home"
              className={currentPage === "home" ? "active" : ""}
              onClick={(e) => handleNavClick(e, "home")}
            >
              Home
            </a>
          </li>

          <li>
            <a
              href="#products"
              className={currentPage === "products" || currentPage === "product-details" ? "active" : ""}
              onClick={(e) => handleNavClick(e, "products")}
            >
              Products
            </a>
          </li>

          <li>
            <a
              href="#about"
              className={currentPage === "about" ? "active" : ""}
              onClick={(e) => handleNavClick(e, "about")}
            >
              About
            </a>
          </li>

          <li>
            <a
              href="#contact"
              className={currentPage === "contact" ? "active" : ""}
              onClick={(e) => handleNavClick(e, "contact")}
            >
              Contact
            </a>
          </li>

          {/* Orders link when logged in */}
          {isLoggedIn && (
            <li>
              <a
                href="#orders"
                className={currentPage === "orders" ? "active" : ""}
                onClick={(e) => handleNavClick(e, "orders")}
              >
                Orders
              </a>
            </li>
          )}

          {/* Authentication Navigation */}
          <li id="auth-nav">
            {isLoggedIn ? (
              <div className="profile-menu" ref={profileRef}>
                <button
                  type="button"
                  className="profile-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileOpen(!profileOpen);
                  }}
                  aria-label="User Profile"
                >
                  👤
                </button>

                <div className={`profile-dropdown ${profileOpen ? "show" : ""}`}>
                  <p className="profile-email">
                    {userEmail}
                  </p>
                  <button
                    type="button"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "none",
                      background: "transparent",
                      textAlign: "left",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      color: "#334155",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                    onClick={(e) => {
                      setProfileOpen(false);
                      handleNavClick(e, "orders");
                    }}
                  >
                    📦 My Orders
                  </button>
                  <button
                    type="button"
                    className="logout-btn"
                    onClick={() => {
                      setProfileOpen(false);
                      onLogout();
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <a
                href="#login"
                className={currentPage === "login" ? "active" : ""}
                onClick={(e) => handleNavClick(e, "login")}
              >
                Login
              </a>
            )}
          </li>

          <li>
            <a
              href="#cart"
              className={`cart-link ${currentPage === "cart" || currentPage === "checkout" ? "active" : ""}`}
              onClick={(e) => handleNavClick(e, "cart")}
            >
              🛒 Cart
              <span className="cart-count" id="cart-count">{cartCount}</span>
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;