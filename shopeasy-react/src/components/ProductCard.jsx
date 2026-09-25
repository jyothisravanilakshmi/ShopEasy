function ProductCard({ product, onViewDetails, onAddToCart }) {
  const handleImageError = (e) => {
    e.currentTarget.onerror = null;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="#f1f5f9"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-size="48" font-family="sans-serif">🛍️</text><text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" font-size="16" font-weight="600" fill="#64748b" font-family="sans-serif">${product.name}</text></svg>`;
    e.currentTarget.src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  const imageUrl = product.image?.startsWith("/")
    ? product.image
    : product.image?.startsWith("http")
    ? product.image
    : `/${product.image || "images/headphone.jpg"}`;

  return (
    <div className="product-card">
      <div className="product-image product-image-container">
        <span className="product-badge">
          {product.category}
        </span>
        <img
          src={imageUrl}
          alt={product.name}
          className="product-image"
          onError={handleImageError}
        />
      </div>

      <div className="product-info">
        <p className="product-category">
          {product.category}
        </p>

        <h3>
          {product.name}
        </h3>

        <p className="product-price">
          ₹{product.price.toLocaleString("en-IN")}
        </p>

        <div className="product-buttons">
          <button
            type="button"
            className="view-details-btn"
            onClick={() => onViewDetails(product.id)}
          >
            View Details
          </button>

          <button
            type="button"
            className="add-cart-btn"
            onClick={() => onAddToCart(product.id)}
          >
            🛒 Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
