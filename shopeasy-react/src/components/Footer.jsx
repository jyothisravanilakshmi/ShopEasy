function Footer({ onNavigate }) {
  const handleClick = (e, page, params) => {
    e.preventDefault();
    onNavigate(page, params);
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3>🛍️ ShopEasy</h3>
          <p>Everything you need, all in one place.</p>
          <p>Simple. Affordable. Reliable.</p>
        </div>

        <div className="footer-column">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <a href="#home" onClick={(e) => handleClick(e, "home")}>
                Home
              </a>
            </li>
            <li>
              <a href="#products" onClick={(e) => handleClick(e, "products")}>
                Products
              </a>
            </li>
            <li>
              <a href="#about" onClick={(e) => handleClick(e, "about")}>
                About Us
              </a>
            </li>
            <li>
              <a href="#contact" onClick={(e) => handleClick(e, "contact")}>
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Categories</h3>
          <ul>
            <li>
              <a
                href="#products"
                onClick={(e) => handleClick(e, "products", { category: "electronics" })}
              >
                Electronics
              </a>
            </li>
            <li>
              <a
                href="#products"
                onClick={(e) => handleClick(e, "products", { category: "fashion" })}
              >
                Fashion
              </a>
            </li>
            <li>
              <a
                href="#products"
                onClick={(e) => handleClick(e, "products", { category: "shoes" })}
              >
                Shoes
              </a>
            </li>
            <li>
              <a
                href="#products"
                onClick={(e) => handleClick(e, "products", { category: "bags" })}
              >
                Bags
              </a>
            </li>
            <li>
              <a
                href="#products"
                onClick={(e) => handleClick(e, "products", { category: "accessories" })}
              >
                Accessories
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Account</h3>
          <ul>
            <li>
              <a href="#login" onClick={(e) => handleClick(e, "login")}>
                Login
              </a>
            </li>
            <li>
              <a href="#cart" onClick={(e) => handleClick(e, "cart")}>
                My Cart
              </a>
            </li>
            <li>
              <a href="#contact" onClick={(e) => handleClick(e, "contact")}>
                Help & Support
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 ShopEasy. All Rights Reserved.</p>
        <p>Made with ❤️ for easy shopping.</p>
      </div>
    </footer>
  );
}

export default Footer;
