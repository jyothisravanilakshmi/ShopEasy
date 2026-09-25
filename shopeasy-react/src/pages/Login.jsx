import { useState, useEffect } from "react";

function Login({ onLogin, onNavigate, initialMode = "login" }) {
  const [isRegisterMode, setIsRegisterMode] = useState(initialMode === "register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    setIsRegisterMode(initialMode === "register");
    setErrorMsg("");
    setSuccessMsg("");
  }, [initialMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (isRegisterMode) {
      // Registration Flow
      if (!name.trim() || !email.trim() || !password) {
        setErrorMsg("Please fill in all required fields (Name, Email, Password).");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch("https://shopeasy-backend-seven.vercel.app/api/users/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            password
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Registration failed. Please try again.");
        }

        setSuccessMsg("Account created successfully! Logging you in...");
        setTimeout(() => {
          onLogin(data.user);
          onNavigate("home");
        }, 1000);
      } catch (err) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      // Login Flow
      if (!email.trim() || !password) {
        setErrorMsg("Please enter both email and password.");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch("https://shopeasy-backend-seven.vercel.app/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            password
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Invalid email or password.");
        }

        onLogin(data.user);
        alert("Login successful!");
        onNavigate("home");
      } catch (err) {
        // Local fallback for offline mode
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <main>
      <section className="new-login-section">
        {/* Left Side */}
        <div className="login-welcome">
          <div className="welcome-content">
            <div className="welcome-icon">🛍️</div>

            <h1>{isRegisterMode ? "Join ShopEasy!" : "Welcome Back!"}</h1>

            <p>
              {isRegisterMode
                ? "Create your ShopEasy account today to start shopping quality products at great prices."
                : "Login to your ShopEasy account and continue shopping your favorite products."}
            </p>

            <div className="welcome-points">
              <p>✓ Easy and secure shopping</p>
              <p>✓ Track your orders in real-time</p>
              <p>✓ Automatic location detection</p>
              <p>✓ Get exciting discounts & offers</p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="login-form-area">
          <div className="new-login-box">
            <h2>{isRegisterMode ? "Create Account" : "Login"}</h2>

            <p className="login-subtitle">
              {isRegisterMode
                ? "Enter your details to register"
                : "Enter your details to continue"}
            </p>

            {errorMsg && (
              <div
                style={{
                  background: "#fee2e2",
                  color: "#dc2626",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  fontSize: "0.9rem",
                  fontWeight: "500"
                }}
              >
                ⚠️ {errorMsg}
              </div>
            )}

            {successMsg && (
              <div
                style={{
                  background: "#dcfce7",
                  color: "#15803d",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  fontSize: "0.9rem",
                  fontWeight: "500"
                }}
              >
                ✓ {successMsg}
              </div>
            )}

            <form id="login-form" onSubmit={handleSubmit}>
              {/* Name Field (Register mode only) */}
              {isRegisterMode && (
                <div className="new-input-group">
                  <label htmlFor="register-name">Full Name</label>
                  <div className="input-wrapper">
                    <span>👤</span>
                    <input
                      type="text"
                      id="register-name"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={isRegisterMode}
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="new-input-group">
                <label htmlFor="login-email">Email Address</label>
                <div className="input-wrapper">
                  <span>📧</span>
                  <input
                    type="email"
                    id="login-email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Phone Field (Register mode only) */}
              {isRegisterMode && (
                <div className="new-input-group">
                  <label htmlFor="register-phone">Phone Number</label>
                  <div className="input-wrapper">
                    <span>📞</span>
                    <input
                      type="tel"
                      id="register-phone"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div className="new-input-group">
                <label htmlFor="login-password">Password</label>
                <div className="input-wrapper">
                  <span>🔒</span>
                  <input
                    type="password"
                    id="login-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Remember + Forgot (Login mode only) */}
              {!isRegisterMode && (
                <div className="login-extra">
                  <label>
                    <input
                      type="checkbox"
                      id="remember-me"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Remember me
                  </label>

                  <a href="#forgot" onClick={(e) => e.preventDefault()}>
                    Forgot Password?
                  </a>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="new-login-button"
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "wait" : "pointer" }}
              >
                {loading
                  ? isRegisterMode
                    ? "Creating Account..."
                    : "Logging In..."
                  : isRegisterMode
                  ? "Register"
                  : "Login"}
              </button>
            </form>

            {/* Signup / Login Toggle */}
            <p className="new-signup-text">
              {isRegisterMode ? (
                <>
                  Already have an account?{" "}
                  <a
                    href="#login"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsRegisterMode(false);
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                  >
                    Login here
                  </a>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <a
                    href="#signup"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsRegisterMode(true);
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                  >
                    Create Account
                  </a>
                </>
              )}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;
