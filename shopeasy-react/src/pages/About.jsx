function About() {
  return (
    <main>
      {/* ================= ABOUT HEADER ================= */}
      <section className="page-header">
        <h1>About ShopEasy</h1>
        <p>Making online shopping simple, convenient and enjoyable.</p>
      </section>

      {/* ================= ABOUT CONTENT ================= */}
      <section className="about-section">
        <div className="about-container">
          {/* About Text */}
          <div className="about-content">
            <h2>Who We Are</h2>
            <p>
              ShopEasy is a modern online shopping platform created to make
              everyday shopping simple and convenient.
            </p>
            <p>
              We offer a variety of products including electronics, fashion,
              shoes, bags and accessories.
            </p>
            <p>
              Our goal is to provide customers with a smooth shopping experience,
              affordable products and an easy-to-use website.
            </p>
          </div>

          {/* About Image */}
          <div className="about-image">
            <div className="about-image-box">
              <img
                src="/images/about.jpg"
                alt="About ShopEasy Store"
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: "350px",
                  objectFit: "cover",
                  borderRadius: "25px",
                  display: "block"
                }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement.innerText = "🛍️";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= OUR MISSION ================= */}
      <section className="why-us-section">
        <div className="section-title">
          <h2>Our Mission</h2>
          <p>What we want to achieve</p>
        </div>

        <div className="why-us-grid">
          <div className="why-us-card">
            <div className="why-icon">🎯</div>
            <h3>Quality Products</h3>
            <p>
              We aim to provide useful and reliable products for everyday needs.
            </p>
          </div>

          <div className="why-us-card">
            <div className="why-icon">💰</div>
            <h3>Affordable Prices</h3>
            <p>
              We focus on providing products at prices that are accessible to
              everyone.
            </p>
          </div>

          <div className="why-us-card">
            <div className="why-icon">😊</div>
            <h3>Happy Customers</h3>
            <p>
              Our goal is to create a simple and enjoyable shopping experience.
            </p>
          </div>

          <div className="why-us-card">
            <div className="why-icon">🔒</div>
            <h3>Secure Shopping</h3>
            <p>
              We design our website with a focus on a safe and convenient
              shopping experience.
            </p>
          </div>
        </div>
      </section>

      {/* ================= WHY SHOP EASY ================= */}
      <section className="about-extra-section">
        <div className="section-title">
          <h2>Why Choose ShopEasy?</h2>
        </div>

        <div className="about-extra-grid">
          <div className="about-extra-card">
            <h3>🛒 Easy Shopping</h3>
            <p>
              Browse products, search by category and add your favorite products
              to the cart easily.
            </p>
          </div>

          <div className="about-extra-card">
            <h3>📦 Simple Checkout</h3>
            <p>
              Our simple checkout process helps customers place their orders
              quickly.
            </p>
          </div>

          <div className="about-extra-card">
            <h3>📱 Responsive Design</h3>
            <p>
              ShopEasy is designed to work across desktops, tablets and mobile
              devices.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;
