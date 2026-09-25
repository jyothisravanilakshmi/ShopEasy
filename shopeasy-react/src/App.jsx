import { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthPromptModal from "./components/AuthPromptModal";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import { products as localProducts } from "./data/products";

function getInitialCart() {
  try {
    const saved = localStorage.getItem("shopEasyCart");
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => {
        let pId = Number(item.productId !== undefined ? item.productId : item.id);
        if (!Number.isFinite(pId) || isNaN(pId)) {
          const match = localProducts.find(
            (lp) => lp.name?.trim().toLowerCase() === item.name?.trim().toLowerCase()
          );
          pId = match ? match.id : 1;
        }
        let img = item.image;
        if (!img || typeof img !== "string" || img.trim() === "") {
          const match = localProducts.find(
            (lp) => lp.name?.trim().toLowerCase() === item.name?.trim().toLowerCase()
          );
          img = match && match.image ? match.image : "/images/headphone.jpg";
        } else {
          img = img.trim();
        }
        if (!img.startsWith("/") && !img.startsWith("http") && !img.startsWith("data:")) {
          img = "/" + img;
        }
        return {
          ...item,
          id: pId,
          productId: pId,
          price: Number(item.price),
          quantity: Number(item.quantity),
          image: img
        };
      })
      .filter(
        (item) =>
          Number.isFinite(item.id) &&
          Number.isFinite(item.price) &&
          Number.isFinite(item.quantity) &&
          item.quantity > 0
      );
  } catch (e) {
    console.error("Error reading cart from localStorage", e);
    return [];
  }
}

function getInitialUser() {
  try {
    const saved = localStorage.getItem("shopEasyUser");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function App() {
  // Page Routing State
  const [currentPage, setCurrentPage] = useState("home");
  const [pageParams, setPageParams] = useState({});

  // Products State (Fetches from backend API, falls back to local catalog)
  const [products, setProducts] = useState(localProducts);

  // Cart State
  const [cart, setCart] = useState(getInitialCart);

  // Auth State
  const [currentUser, setCurrentUser] = useState(getInitialUser);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("loggedIn") === "true";
  });
  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem("userEmail") || "";
  });

  // Auth Prompt Modal State (for unauthenticated Add to Cart attempts)
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Last Placed Order State
  const [placedOrder, setPlacedOrder] = useState(null);

  // Normalize cart items received from backend API
  const normalizeCartItems = (backendItems) => {
    if (!Array.isArray(backendItems)) return [];
    return backendItems.map((item) => {
      let pId = Number(item.productId !== undefined ? item.productId : item.id);
      if (!Number.isFinite(pId) || isNaN(pId)) {
        const match = localProducts.find(
          (lp) => lp.name?.trim().toLowerCase() === item.name?.trim().toLowerCase()
        );
        pId = match ? match.id : 1;
      }
      let img = item.image;
      if (!img || typeof img !== "string" || img.trim() === "") {
        const match = localProducts.find(
          (lp) => lp.name?.trim().toLowerCase() === item.name?.trim().toLowerCase()
        );
        img = match && match.image ? match.image : "/images/headphone.jpg";
      } else {
        img = img.trim();
      }
      if (!img.startsWith("/") && !img.startsWith("http") && !img.startsWith("data:")) {
        img = "/" + img;
      }

      return {
        ...item,
        id: pId,
        productId: pId,
        price: Number(item.price),
        quantity: Number(item.quantity),
        image: img
      };
    });
  };

  // Helper to normalize product from backend without converting ObjectId to Number
  const normalizeBackendProduct = (p, index) => {
    // Determine consistent numeric ID without converting ObjectId string to Number
    let numericId = null;
    if (p.id !== undefined && p.id !== null && p.id !== "") {
      const parsed = Number(p.id);
      if (Number.isFinite(parsed) && !isNaN(parsed)) {
        numericId = parsed;
      }
    }

    if (numericId === null && p.name) {
      const match = localProducts.find(
        (lp) => lp.name?.trim().toLowerCase() === p.name?.trim().toLowerCase()
      );
      if (match && Number.isFinite(Number(match.id))) {
        numericId = Number(match.id);
      }
    }

    if (numericId === null) {
      numericId = index + 1;
    }

    // Determine valid image URL with leading slash
    let img = p.image;
    if (!img || typeof img !== "string" || img.trim() === "") {
      const match = localProducts.find(
        (lp) => lp.name?.trim().toLowerCase() === p.name?.trim().toLowerCase()
      );
      img = match && match.image ? match.image : "/images/headphone.jpg";
    } else {
      img = img.trim();
    }

    if (!img.startsWith("/") && !img.startsWith("http") && !img.startsWith("data:")) {
      img = "/" + img;
    }

    return {
      ...p,
      id: numericId,
      image: img
    };
  };

  // Fetch logged-in user's cart from Express backend (MongoDB Atlas ShopEasy → cart)
  const fetchUserCart = useCallback((email) => {
    if (!email) return;
    fetch(`https://shopeasy-backend-seven.vercel.app/api/cart?userEmail=${encodeURIComponent(email)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch cart from server");
        return res.json();
      })
      .then((data) => {
        if (data && Array.isArray(data.items)) {
          const normalized = normalizeCartItems(data.items);
          setCart(normalized);
        }
      })
      .catch((err) => {
        console.warn("Backend cart fetch notice:", err.message);
      });
  }, []);

  // Fetch catalog products from Express backend on mount
  useEffect(() => {
    fetch("https://shopeasy-backend-seven.vercel.app/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const normalized = data.map((p, idx) => normalizeBackendProduct(p, idx));
          setProducts(normalized);
        }
      })
      .catch((err) => {
        console.warn("Backend products fetch note (using local catalog):", err.message);
      });
  }, []);

  // Fetch user cart on mount if logged in
  useEffect(() => {
    if (isLoggedIn && userEmail) {
      fetchUserCart(userEmail);
    }
  }, [isLoggedIn, userEmail, fetchUserCart]);

  // Sync cart to localStorage as offline cache
  useEffect(() => {
    localStorage.setItem("shopEasyCart", JSON.stringify(cart));
  }, [cart]);

  // Navigate function with smooth scroll to top
  const navigateTo = (page, params = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ADD TO CART HANDLER
  // 1. Check whether user is logged in
  // 2. If NOT logged in: show AuthPromptModal (message: "Please login or register before adding products to your cart.")
  // 3. If logged in: Send to Express Cart API -> MongoDB Atlas cart collection -> Update React UI
  const addToCart = (productId) => {
    // 1. Check whether user is logged in
    if (!isLoggedIn) {
      // 2. User is NOT logged in -> Show proper user-friendly modal, NOT just a basic JavaScript alert!
      setShowAuthModal(true);
      return;
    }

    // 3. User IS logged in -> Find product
    const id =
      typeof productId === "object" && productId !== null
        ? productId.productId !== undefined
          ? productId.productId
          : productId.id
        : productId;
    const numId = Number(id);
    const product = products.find(
      (item) =>
        Number(item.id) === numId ||
        String(item.id) === String(id) ||
        String(item._id) === String(id)
    );
    if (!product) return;

    const cartItemPayload = {
      productId: Number(product.id),
      name: product.name,
      price: Number(product.price),
      quantity: 1,
      image: product.image || ""
    };

    // Send request from React to Express backend (Express saves in MongoDB ShopEasy → cart)
    fetch("https://shopeasy-backend-seven.vercel.app/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userEmail: userEmail.trim().toLowerCase(),
        item: cartItemPayload
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add item to backend cart");
        return res.json();
      })
      .then((data) => {
        if (data.cart && Array.isArray(data.cart.items)) {
          const normalized = normalizeCartItems(data.cart.items);
          setCart(normalized);
        }
        alert(`${product.name} added to cart!`);
      })
      .catch((err) => {
        console.warn("Backend cart update fallback:", err.message);
        // Fallback update to keep frontend responsive
        setCart((prevCart) => {
          const existing = prevCart.find(
            (item) =>
              Number(item.id) === Number(product.id) ||
              Number(item.productId) === Number(product.id)
          );
          if (existing) {
            return prevCart.map((item) =>
              Number(item.id) === Number(product.id) ||
              Number(item.productId) === Number(product.id)
                ? { ...item, quantity: Number(item.quantity) + 1 }
                : item
            );
          } else {
            return [
              ...prevCart,
              {
                id: Number(product.id),
                productId: Number(product.id),
                name: product.name,
                price: Number(product.price),
                image: product.image,
                quantity: 1,
              },
            ];
          }
        });
        alert(`${product.name} added to cart!`);
      });
  };

  // UPDATE CART ITEM QUANTITY
  const changeQuantity = (productId, delta) => {
    const numId = Number(productId);
    const existing = cart.find(
      (item) => Number(item.id) === numId || Number(item.productId) === numId
    );
    if (!existing) return;

    const newQty = Number(existing.quantity) + Number(delta);

    if (isLoggedIn && userEmail) {
      if (newQty <= 0) {
        // Remove item via backend API
        fetch("https://shopeasy-backend-seven.vercel.app/api/cart/item", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userEmail: userEmail.trim().toLowerCase(),
            productId: numId
          })
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.cart && Array.isArray(data.cart.items)) {
              setCart(normalizeCartItems(data.cart.items));
            }
          })
          .catch((err) => console.warn("Cart remove error:", err));
      } else {
        // Update item quantity via backend API
        fetch("https://shopeasy-backend-seven.vercel.app/api/cart/item", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userEmail: userEmail.trim().toLowerCase(),
            productId: numId,
            quantity: newQty
          })
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.cart && Array.isArray(data.cart.items)) {
              setCart(normalizeCartItems(data.cart.items));
            }
          })
          .catch((err) => console.warn("Cart quantity update error:", err));
      }
    }

    // Local state optimistic update
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (Number(item.id) === numId || Number(item.productId) === numId) {
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  // REMOVE CART ITEM
  const removeFromCart = (productId) => {
    const numId = Number(productId);

    if (isLoggedIn && userEmail) {
      fetch("https://shopeasy-backend-seven.vercel.app/api/cart/item", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: userEmail.trim().toLowerCase(),
          productId: numId
        })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.cart && Array.isArray(data.cart.items)) {
            setCart(normalizeCartItems(data.cart.items));
          }
        })
        .catch((err) => console.warn("Cart remove item error:", err));
    }

    setCart((prevCart) =>
      prevCart.filter(
        (item) => Number(item.id) !== numId && Number(item.productId) !== numId
      )
    );
  };

  // CLEAR CART
  const clearCart = () => {
    if (isLoggedIn && userEmail) {
      fetch("https://shopeasy-backend-seven.vercel.app/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: userEmail.trim().toLowerCase()
        })
      }).catch((err) => console.warn("Cart clear error:", err));
    }

    setCart([]);
  };

  // PLACE ORDER HANDLER
  const handlePlaceOrder = (newOrder) => {
    clearCart();
    setPlacedOrder(newOrder);

    // Save order locally as offline backup
    try {
      const existing = JSON.parse(localStorage.getItem("shopEasyOrders") || "[]");
      existing.unshift(newOrder);
      localStorage.setItem("shopEasyOrders", JSON.stringify(existing));
    } catch (e) {
      console.error("Local order backup error:", e);
    }

    navigateTo("order-success", { order: newOrder });
  };

  // Auth Handlers
  const login = (userData) => {
    const email = typeof userData === "string" ? userData : userData?.email || "";
    setIsLoggedIn(true);
    setUserEmail(email);
    setCurrentUser(typeof userData === "object" ? userData : { email });

    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userEmail", email);
    if (typeof userData === "object") {
      localStorage.setItem("shopEasyUser", JSON.stringify(userData));
    }

    // Immediately fetch the user's cart from backend upon login
    fetchUserCart(email);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
    setCurrentUser(null);
    setCart([]);
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("shopEasyUser");
    localStorage.removeItem("shopEasyCart");
    alert("You have been logged out.");
    navigateTo("home");
  };

  // Total items in cart
  const cartCount = cart.reduce((total, item) => total + Number(item.quantity), 0);

  // Render Page Content
  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <Home
            products={products}
            onNavigate={navigateTo}
            onViewDetails={(id) => navigateTo("product-details", { productId: id })}
            onAddToCart={addToCart}
          />
        );
      case "products":
        return (
          <Products
            key={pageParams.category || "all"}
            products={products}
            initialCategory={pageParams.category || "all"}
            onViewDetails={(id) => navigateTo("product-details", { productId: id })}
            onAddToCart={addToCart}
          />
        );
      case "product-details":
        return (
          <ProductDetails
            productId={pageParams.productId}
            products={products}
            onAddToCart={addToCart}
            onNavigate={navigateTo}
          />
        );
      case "cart":
        return (
          <Cart
            cart={cart}
            isLoggedIn={isLoggedIn}
            onChangeQuantity={changeQuantity}
            onRemoveFromCart={removeFromCart}
            onClearCart={clearCart}
            onNavigate={navigateTo}
          />
        );
      case "checkout":
        return (
          <Checkout
            cart={cart}
            currentUser={currentUser}
            isLoggedIn={isLoggedIn}
            onPlaceOrder={handlePlaceOrder}
            onNavigate={navigateTo}
          />
        );
      case "order-success":
        return (
          <OrderSuccess
            placedOrder={pageParams.order || placedOrder}
            onNavigate={navigateTo}
          />
        );
      case "orders":
        return (
          <Orders
            userEmail={userEmail}
            isLoggedIn={isLoggedIn}
            onNavigate={navigateTo}
          />
        );
      case "about":
        return <About />;
      case "contact":
        return <Contact />;
      case "login":
        return (
          <Login
            initialMode={pageParams.mode || "login"}
            onLogin={login}
            onNavigate={navigateTo}
          />
        );
      default:
        return (
          <Home
            products={products}
            onNavigate={navigateTo}
            onViewDetails={(id) => navigateTo("product-details", { productId: id })}
            onAddToCart={addToCart}
          />
        );
    }
  };

  return (
    <div className="shopeasy-app">
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateTo}
        cartCount={cartCount}
        isLoggedIn={isLoggedIn}
        userEmail={userEmail}
        onLogout={logout}
      />

      {renderPage()}

      {/* User-friendly Login/Registration Prompt Modal */}
      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={() => {
          setShowAuthModal(false);
          navigateTo("login", { mode: "login" });
        }}
        onRegister={() => {
          setShowAuthModal(false);
          navigateTo("login", { mode: "register" });
        }}
      />

      <Footer onNavigate={navigateTo} />
    </div>
  );
}

export default App;