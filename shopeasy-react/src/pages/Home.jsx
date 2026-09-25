import ProductCard from "../components/ProductCard";

function Home({ products, onNavigate, onViewDetails, onAddToCart }) {
  // Top 4 featured/trending products
  const featuredProducts = products.slice(0, 4);

  const scrollToCategories = (e) => {
    e.preventDefault();
    const element = document.getElementById("categories");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main>
      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-tag">✨ WELCOME TO SHOPEASY</span>

          <h1>
            Shop Smart.
            <span>Live Better.</span>
          </h1>

          <p>
            Discover the best products at the best prices. Quality you can trust,
            style you will love.
          </p>

          <div className="hero-buttons">
            <button
              type="button"
              className="hero-btn"
              onClick={() => onNavigate("products")}
            >
              Start Shopping →
            </button>

            <a href="#categories" className="secondary-btn" onClick={scrollToCategories}>
              Explore Categories
            </a>
          </div>

          <div className="hero-features">
            <div>
              🛡️
              <span>Secure Shopping</span>
            </div>

            <div>
              ↻
              <span>Easy Returns</span>
            </div>

            <div>
              🏷️
              <span>Best Prices</span>
            </div>
          </div>
        </div>

        {/* HERO PRODUCT VISUAL */}
        <div className="hero-visual">
          <div className="hero-big-circle"></div>

          <img
            src="/images/shoes.jpg"
            className="hero-product hero-shoes"
            alt="Sports Shoes"
          />

          <img
            src="/images/headphone.jpg"
            className="hero-product hero-headphones"
            alt="Wireless Headphones"
          />

          <img
            src="/images/smartwatch.jpg"
            className="hero-product hero-watch"
            alt="Smart Watch"
          />

          <img
            src="/images/backpack.jpg"
            className="hero-product hero-bag"
            alt="Backpack"
          />

          <div className="discount-circle">
            <small>UP TO</small>
            <strong>50%</strong>
            <span>OFF</span>
          </div>

          <div className="hero-decoration decoration-one"></div>
          <div className="hero-decoration decoration-two"></div>
          <div className="hero-decoration decoration-three"></div>
        </div>
      </section>

      {/* ================= TRUST ================= */}
      <section className="trust-section">
        <div className="trust-grid">
          <div className="trust-item">
            <div className="trust-icon">🚚</div>
            <div>
              <h3>Fast Delivery</h3>
              <p>Quick & reliable delivery</p>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon">🔒</div>
            <div>
              <h3>Secure Payment</h3>
              <p>100% safe checkout</p>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon">⭐</div>
            <div>
              <h3>Quality Products</h3>
              <p>Products you can trust</p>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon">💬</div>
            <div>
              <h3>Customer Support</h3>
              <p>We're here to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="featured-section">
        <div className="section-title">
          <span className="section-label">OUR COLLECTION</span>
          <h2>🔥 Trending Products</h2>
          <p className="section-subtitle">
            Discover our most popular products
          </p>
        </div>

        <div className="product-grid">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={onViewDetails}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        <div className="view-all">
          <button
            type="button"
            className="hero-btn"
            onClick={() => onNavigate("products")}
          >
            View All Products →
          </button>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="categories-section" id="categories">
        <div className="section-title">
          <span className="section-label">EXPLORE</span>
          <h2>🛍️ Shop by Category</h2>
          <p className="section-subtitle">
            Find everything you need in one place
          </p>
        </div>

        <div className="categories-grid">
          <div
            className="category-card"
            style={{ cursor: "pointer" }}
            onClick={() => onNavigate("products", { category: "electronics" })}
          >
            <div className="category-icon">📱</div>
            <h3>Electronics</h3>
            <p>Phones, gadgets & more</p>
            <span>Explore →</span>
          </div>

          <div
            className="category-card"
            style={{ cursor: "pointer" }}
            onClick={() => onNavigate("products", { category: "fashion" })}
          >
            <div className="category-icon">👕</div>
            <h3>Fashion</h3>
            <p>Trendy clothes & styles</p>
            <span>Explore →</span>
          </div>

          <div
            className="category-card"
            style={{ cursor: "pointer" }}
            onClick={() => onNavigate("products", { category: "shoes" })}
          >
            <div className="category-icon">👟</div>
            <h3>Shoes</h3>
            <p>Stylish & comfortable</p>
            <span>Explore →</span>
          </div>

          <div
            className="category-card"
            style={{ cursor: "pointer" }}
            onClick={() => onNavigate("products", { category: "bags" })}
          >
            <div className="category-icon">🎒</div>
            <h3>Bags</h3>
            <p>Backpacks & travel bags</p>
            <span>Explore →</span>
          </div>

          <div
            className="category-card"
            style={{ cursor: "pointer" }}
            onClick={() => onNavigate("products", { category: "accessories" })}
          >
            <div className="category-icon">🕶️</div>
            <h3>Accessories</h3>
            <p>Complete your style</p>
            <span>Explore →</span>
          </div>
        </div>
      </section>

      {/* ================= OFFER ================= */}
      <section className="offer-section">
        <div className="offer-content">
          <span className="offer-tag">🎁 LIMITED TIME OFFER</span>
          <h2>Great Deals Are Waiting For You!</h2>
          <p>
            Discover amazing products at affordable prices. Find your favorites
            before they're gone.
          </p>
          <button
            type="button"
            className="offer-btn"
            onClick={() => onNavigate("products")}
          >
            Explore Deals →
          </button>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="why-us">
        <div className="section-title">
          <span className="section-label">WHY SHOPEASY</span>
          <h2>💙 Why Choose ShopEasy?</h2>
          <p className="section-subtitle">
            Shopping made simple, safe and enjoyable
          </p>
        </div>

        <div className="why-grid">
          <div className="why-card">
            <div className="icon">🛍️</div>
            <h3>Wide Selection</h3>
            <p>Explore a wide range of products across multiple categories.</p>
          </div>

          <div className="why-card">
            <div className="icon">💰</div>
            <h3>Affordable Prices</h3>
            <p>Get great products at prices that fit your budget.</p>
          </div>

          <div className="why-card">
            <div className="icon">❤️</div>
            <h3>Customer First</h3>
            <p>Your satisfaction is our priority at every step.</p>
          </div>
        </div>
      </section>

      {/* ================= ABOUT PREVIEW ================= */}
      <section className="about-preview">
        <div className="about-preview-content">
          <span className="section-label">ABOUT SHOPEASY</span>
          <h2>Shopping Made Easy 💙</h2>
          <p>
            ShopEasy is a simple and user-friendly online shopping platform
            where you can discover electronics, fashion, shoes, bags and
            accessories in one place.
          </p>
          <button
            type="button"
            className="learn-more-btn"
            onClick={() => onNavigate("about")}
          >
            Learn More →
          </button>
        </div>
      </section>
    </main>
  );
}

export default Home;