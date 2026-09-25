import { useState, useMemo } from "react";
import ProductCard from "../components/ProductCard";

const CATEGORIES = [
  { id: "all", label: "🛍️ All" },
  { id: "electronics", label: "📱 Electronics" },
  { id: "fashion", label: "👕 Fashion" },
  { id: "shoes", label: "👟 Shoes" },
  { id: "bags", label: "🎒 Bags" },
  { id: "accessories", label: "🕶️ Accessories" },
];

function Products({ products, initialCategory = "all", onViewDetails, onAddToCart }) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory !== "all") {
      result = result.filter(
        (product) =>
          product.category &&
          product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (product) =>
          product.name?.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [products, selectedCategory, searchQuery]);

  return (
    <main>
      {/* ================= PRODUCTS HEADER ================= */}
      <section className="products-header">
        <h1>Our Products 🛍️</h1>
        <p>Explore our collection and find something you love.</p>

        {/* SEARCH */}
        <div className="search-container">
          <input
            type="text"
            id="search"
            placeholder="Search products..."
            autoComplete="off"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      {/* ================= CATEGORY FILTERS ================= */}
      <section className="filter-section">
        <div className="category-filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`filter-btn ${selectedCategory === cat.id ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <p className="filter-result" id="filter-result">
          Showing {filteredProducts.length} products
        </p>
      </section>

      {/* ================= PRODUCTS LIST ================= */}
      <section className="products-list-section">
        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <h2>No products found</h2>
            <p>Try another search or category.</p>
          </div>
        ) : (
          <div className="product-grid" id="product-list">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={onViewDetails}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Products;