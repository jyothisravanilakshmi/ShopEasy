function ProductDetails({ productId, products, onAddToCart, onNavigate }) {
  const product = products.find(
    (item) =>
      item &&
      (Number(item.id) === Number(productId) ||
        String(item.id) === String(productId) ||
        String(item._id) === String(productId))
  );

  const handleImageError = (e) => {
    e.currentTarget.onerror = null;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="500" viewBox="0 0 600 500"><rect width="100%" height="100%" fill="#f1f5f9"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-size="64" font-family="sans-serif">🛍️</text><text x="50%" y="62%" dominant-baseline="middle" text-anchor="middle" font-size="20" font-weight="600" fill="#64748b" font-family="sans-serif">${product ? product.name : "ShopEasy"}</text></svg>`;
    e.currentTarget.src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  if (!product) {
    return (
      <main>
        <section className="product-details-section">
          <div id="product-details">
            <div className="no-products">
              <h2>Product Not Found</h2>
              <p>Sorry, this product does not exist.</p>
              <button
                type="button"
                className="add-cart-btn"
                style={{ display: "inline-block", width: "auto", padding: "12px 24px" }}
                onClick={() => onNavigate("products")}
              >
                Back to Products
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="product-details-section">
        <div id="product-details">
          <div className="product-details-container">
            {/* Product Image */}
            <div className="product-details-image">
              <img
                src={product.image}
                alt={product.name}
                onError={handleImageError}
              />
            </div>

            {/* Product Information */}
            <div className="product-details-info">
              <p className="product-category">{product.category}</p>

              <h1>{product.name}</h1>

              <h2 className="product-details-price">
                ₹{product.price.toLocaleString("en-IN")}
              </h2>

              <p className="product-details-description">
                {product.description}
              </p>

              <div className="product-details-buttons">
                <button
                  type="button"
                  className="add-cart-btn"
                  onClick={() => onAddToCart(product.id)}
                >
                  🛒 Add to Cart
                </button>

                <button
                  type="button"
                  className="view-details-btn"
                  onClick={() => onNavigate("cart")}
                >
                  Go to Cart
                </button>
              </div>

              <div className="product-features">
                <p>✓ Good Quality Product</p>
                <p>✓ Affordable Price</p>
                <p>✓ Easy Shopping</p>
                <p>✓ Secure Checkout</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;
