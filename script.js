// ==========================================
// SHOP EASY - PRODUCT DATA
// ==========================================

const products = [

    {
        id: 1,
        name: "Wireless Headphones",
        price: 1999,
        image: "images/headphone.jpg",
        category: "electronics",
        description: "High-quality wireless headphones with clear sound and comfortable design."
    },

    {
        id: 2,
        name: "Smart Watch",
        price: 2499,
        image: "images/smartwatch.jpg",
        category: "electronics",
        description: "Smart watch with fitness tracking, notifications and modern design."
    },

    {
        id: 3,
        name: "Sports Shoes",
        price: 1799,
        image: "images/shoes.jpg",
        category: "shoes",
        description: "Comfortable sports shoes suitable for running, walking and everyday use."
    },

    {
        id: 4,
        name: "Backpack",
        price: 999,
        image: "images/backpack.jpg",
        category: "bags",
        description: "Spacious and stylish backpack perfect for college, work and travel."
    },

    {
        id: 5,
        name: "Bluetooth Speaker",
        price: 1499,
        image: "images/speaker.jpg",
        category: "electronics",
        description: "Portable Bluetooth speaker with powerful sound and compact design."
    },

    {
        id: 6,
        name: "Smartphone",
        price: 14999,
        image: "images/phone.jpg",
        category: "electronics",
        description: "Modern smartphone with excellent performance and stylish design."
    },

    {
        id: 7,
        name: "Laptop",
        price: 49999,
        image: "images/laptop.jpg",
        category: "electronics",
        description: "Powerful laptop suitable for studying, programming and everyday work."
    },

    {
        id: 8,
        name: "Sunglasses",
        price: 799,
        image: "images/sunglasses.jpg",
        category: "accessories",
        description: "Stylish sunglasses designed for everyday fashion and comfort."
    },

    {
        id: 9,
        name: "Leather Wallet",
        price: 699,
        image: "images/wallet.jpg",
        category: "accessories",
        description: "Compact and stylish wallet with multiple card and cash compartments."
    },

    {
        id: 10,
        name: "Travel Bag",
        price: 1299,
        image: "images/travel-bag.jpg",
        category: "bags",
        description: "Durable travel bag with enough space for your essentials."
    },

    {
        id: 11,
        name: "Running T-Shirt",
        price: 599,
        image: "images/tshirt.jpg",
        category: "fashion",
        description: "Lightweight and comfortable T-shirt suitable for running and workouts."
    },

    {
        id: 12,
        name: "Denim Jacket",
        price: 1599,
        image: "images/jacket.jpg",
        category: "fashion",
        description: "Classic denim jacket that gives your outfit a stylish look."
    },

    {
        id: 13,
        name: "Women's Handbag",
        price: 1899,
        image: "images/handbag.jpg",
        category: "bags",
        description: "Elegant handbag with enough space for your everyday essentials."
    },

    {
        id: 14,
        name: "Casual Sneakers",
        price: 1499,
        image: "images/sneakers.jpg",
        category: "shoes",
        description: "Comfortable casual sneakers designed for everyday wear."
    },

    {
        id: 15,
        name: "Fitness Band",
        price: 1299,
        image: "images/fitness-band.jpg",
        category: "electronics",
        description: "Fitness band for tracking steps, activity and daily workouts."
    },

    {
        id: 16,
        name: "Wireless Mouse",
        price: 599,
        image: "images/mouse.jpg",
        category: "electronics",
        description: "Smooth and responsive wireless mouse for laptops and computers."
    },

    {
        id: 17,
        name: "Mechanical Keyboard",
        price: 2499,
        image: "images/keyboard.jpg",
        category: "electronics",
        description: "Mechanical keyboard with responsive keys and comfortable typing."
    },

    {
        id: 18,
        name: "Tablet",
        price: 15999,
        image: "images/tablet.jpg",
        category: "electronics",
        description: "Portable tablet suitable for entertainment, studying and browsing."
    },

    {
        id: 19,
        name: "Coffee Mug",
        price: 399,
        image: "images/mug.jpg",
        category: "accessories",
        description: "Simple and stylish coffee mug for your home or office."
    },

    {
        id: 20,
        name: "Water Bottle",
        price: 499,
        image: "images/bottle.jpg",
        category: "accessories",
        description: "Reusable water bottle designed for everyday use."
    }

];


// ==========================================
// CART
// ==========================================

let cart = JSON.parse(localStorage.getItem("shopEasyCart")) || [];

cart = cart.map(item => ({
    ...item,
    id: Number(item.id),
    price: Number(item.price),
    quantity: Number(item.quantity)
})).filter(item =>
    Number.isFinite(item.id) &&
    Number.isFinite(item.price) &&
    Number.isFinite(item.quantity)
);

// Save cart
function saveCart() {

    localStorage.setItem(
        "shopEasyCart",
        JSON.stringify(cart)
    );

}


// Update cart count
function updateCart() {
    localStorage.setItem("shopEasyCart", JSON.stringify(cart));

    const totalQuantity = cart.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
    );

    const cartCounts = document.querySelectorAll(".cart-count, #cart-count");
    cartCounts.forEach(el => {
        el.textContent = totalQuantity;
    });
}

// ==========================================
// DISPLAY PRODUCTS
// ==========================================

function displayProducts(productArray) {

    const productList =
        document.getElementById("product-list");

    if (!productList) {
        return;
    }


    productList.innerHTML = "";


    if (productArray.length === 0) {

        productList.innerHTML = `
            <div class="no-products">
                <h2>No products found</h2>
                <p>Try another search or category.</p>
            </div>
        `;

        return;

    }


    productArray.forEach(product => {

        const productCard = document.createElement("div");

        productCard.className = "product-card";


        productCard.innerHTML = `

            <div class="product-image-container">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    class="product-image"
                >

                <span class="product-badge">
                    ${product.category}
                </span>

            </div>


            <div class="product-info">

                <p class="product-category">
                    ${product.category}
                </p>

                <h3>
                    ${product.name}
                </h3>

                <p class="product-price">
                    ₹${product.price}
                </p>


                <div class="product-buttons">

                    <button
                        class="view-details-btn"
                        onclick="viewProduct(${product.id})"
                    >
                        View Details
                    </button>


                    <button
                        class="add-cart-btn"
                        onclick="addToCart(${product.id})"
                    >
                        Add to Cart
                    </button>

                </div>

            </div>

        `;


        productList.appendChild(productCard);

    });

}


// ==========================================
// VIEW PRODUCT DETAILS
// ==========================================

function viewProduct(productId) {

    window.location.href =
        `product-details.html?id=${productId}`;

}


// ==========================================
// PRODUCT DETAILS PAGE
// ==========================================

function displayProductDetails() {

    const detailsContainer =
        document.getElementById("product-details");

    if (!detailsContainer) {
        return;
    }


    const urlParams =
        new URLSearchParams(window.location.search);

    const productId =
        Number(urlParams.get("id"));


    const product =
        products.find(item => item.id === productId);


    if (!product) {

        detailsContainer.innerHTML = `

            <div class="no-products">

                <h2>Product Not Found</h2>

                <p>
                    Sorry, this product does not exist.
                </p>

                <a
                    href="product.html"
                    class="add-cart-btn"
                >
                    Back to Products
                </a>

            </div>

        `;

        return;

    }


    detailsContainer.innerHTML = `

        <div class="product-details-container">


            <!-- Product Image -->

            <div class="product-details-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

            </div>


            <!-- Product Information -->

            <div class="product-details-info">

                <p class="product-category">
                    ${product.category}
                </p>


                <h1>
                    ${product.name}
                </h1>


                <h2 class="product-details-price">
                    ₹${product.price}
                </h2>


                <p class="product-details-description">
                    ${product.description}
                </p>


                <div class="product-details-buttons">

                    <button
                        class="add-cart-btn"
                        onclick="addToCart(${product.id})"
                    >
                        🛒 Add to Cart
                    </button>


                    <button
                        class="view-details-btn"
                        onclick="window.location.href='cart.html'"
                    >
                        Go to Cart
                    </button>

                </div>


                <div class="product-features">

                    <p>✓ Good Quality Product</p>

                    <p>✓ Affordable Price</p>

                    <p>✓ Easy Shopping</p>

                    <p>✓ Secure Checkout</p>

                </div>

            </div>

        </div>

    `;

}


// ==========================================
// ADD TO CART
// ==========================================

function addToCart(productId) {

    const product =
        products.find(item => item.id === productId);


    if (!product) {
        return;
    }


    const existingProduct =
        cart.find(item => item.id === productId);


    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({

            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1

        });

    }


    saveCart();

    updateCart();


    alert(`${product.name} added to cart!`);

}


// ==========================================
// SEARCH + CATEGORY FILTER
// ==========================================

let currentCategory = "all";

let currentSearch = "";


// Get category from URL
function getCategoryFromURL() {

    const urlParams =
        new URLSearchParams(window.location.search);

    return urlParams.get("category") || "all";

}


// Apply filters
function applyProductFilters() {

    let filteredProducts = products;


    // Category filter

    if (currentCategory !== "all") {

        filteredProducts =
            filteredProducts.filter(product =>
                product.category === currentCategory
            );

    }


    // Search filter

    if (currentSearch.trim() !== "") {

        const searchText =
            currentSearch.toLowerCase();


        filteredProducts =
            filteredProducts.filter(product =>

                product.name
                    .toLowerCase()
                    .includes(searchText)

                ||

                product.category
                    .toLowerCase()
                    .includes(searchText)

            );

    }


    displayProducts(filteredProducts);


    // Update result text

    const resultText =
        document.getElementById("filter-result");


    if (resultText) {

        resultText.textContent =
            `Showing ${filteredProducts.length} products`;

    }

}


// ==========================================
// PRODUCT FILTER SETUP
// ==========================================

function setupProductFilters() {

    const filterButtons =
        document.querySelectorAll(".filter-btn");


    const searchInput =
        document.getElementById("search");


    currentCategory =
        getCategoryFromURL();


    // Activate correct category button

    filterButtons.forEach(button => {

        button.classList.remove("active");


        if (
            button.dataset.category ===
            currentCategory
        ) {

            button.classList.add("active");

        }

    });


    // Category buttons

    filterButtons.forEach(button => {

        button.addEventListener("click", function () {

            currentCategory =
                this.dataset.category;


            filterButtons.forEach(btn => {

                btn.classList.remove("active");

            });


            this.classList.add("active");


            applyProductFilters();

        });

    });


    // Search

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                currentSearch =
                    this.value;

                applyProductFilters();

            }
        );

    }


    applyProductFilters();

}




    displayCart();
// ==========================================
// DISPLAY CART
// ==========================================

function displayCart() {

    const cartContainer = document.getElementById("cart-container");

    if (!cartContainer) {
        return;
    }

    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <div class="empty-cart">

                <div class="empty-cart-icon">
                    🛒
                </div>

                <h2>Your cart is empty</h2>

                <p>
                    Looks like you haven't added
                    anything to your cart yet.
                </p>

                <a href="product.html" class="checkout-btn">
                    Start Shopping
                </a>

            </div>
        `;

        return;
    }

    let total = 0;

    let cartHTML = `
        <div class="cart-items">
    `;

    cart.forEach(item => {

        const price = Number(item.price);
        const quantity = Number(item.quantity);

        const itemTotal = price * quantity;

        total += itemTotal;

        cartHTML += `

            <div class="cart-item">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                    class="cart-item-image"
                >

                <div class="cart-item-info">

                    <h3>
                        ${item.name}
                    </h3>

                    <p>
                        ₹${price}
                    </p>

                </div>

                <div class="quantity-controls">

                    <button
                        onclick="changeQuantity(${item.id}, -1)"
                    >
                        −
                    </button>

                    <span>
                        ${quantity}
                    </span>

                    <button
                        onclick="changeQuantity(${item.id}, 1)"
                    >
                        +
                    </button>

                </div>

                <div class="cart-item-total">

                    ₹${itemTotal}

                </div>

                <button
                    class="remove-btn"
                    onclick="removeFromCart(${item.id})"
                >
                    Remove
                </button>

            </div>

        `;
    });

    cartHTML += `

        </div>

        <div class="cart-summary">

            <h2>
                Cart Summary
            </h2>

            <p>
                Total:
                <strong>₹${total}</strong>
            </p>

            <div class="cart-summary-buttons">

                <button
                    class="clear-cart-btn"
                    onclick="clearCart()"
                >
                    Clear Cart
                </button>

                <button
                    class="checkout-btn"
                    onclick="goToCheckout()"
                >
                    Proceed to Checkout
                </button>

            </div>

        </div>

    `;

    cartContainer.innerHTML = cartHTML;
}


// ==========================================
// CLEAR CART
// ==========================================

function clearCart() {

    if (cart.length === 0) {
        return;
    }


    const confirmation =
        confirm("Are you sure you want to clear your cart?");


    if (confirmation) {

        cart = [];

        saveCart();

        updateCart();

        displayCart();

    }

}


// ==========================================
// GO TO CHECKOUT
// ==========================================

function goToCheckout() {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;

    }


    window.location.href =
        "checkout.html";

}


// ==========================================
// LOGIN
// ==========================================

function loginUser(event) {

    event.preventDefault();


    const email =
        document.getElementById("login-email").value.trim();


    const password =
        document.getElementById("login-password").value;


    if (email === "" || password === "") {

        alert("Please enter email and password.");

        return;

    }


    localStorage.setItem(
        "loggedIn",
        "true"
    );


    localStorage.setItem(
        "userEmail",
        email
    );


    alert("Login successful!");


    window.location.href =
        "index.html";

}


// ==========================================
// CHECK LOGIN STATUS
// ==========================================

function isLoggedIn() {

    return localStorage.getItem("loggedIn") === "true";

}


// ==========================================
// UPDATE LOGIN / PROFILE UI
// ==========================================

function updateAuthUI() {

    const authNav =
        document.getElementById("auth-nav");


    if (!authNav) {
        return;
    }


    if (isLoggedIn()) {

        const email =
            localStorage.getItem("userEmail");


        authNav.innerHTML = `

            <div class="profile-menu">

                <button
                    class="profile-button"
                    onclick="toggleProfileMenu(event)"
                >
                    👤
                </button>


                <div
                    class="profile-dropdown"
                    id="profile-dropdown"
                >

                    <p>
                        ${email}
                    </p>


                    <button
                        class="logout-btn"
                        onclick="logoutUser()"
                    >
                        Logout
                    </button>

                </div>

            </div>

        `;

    } else {

        authNav.innerHTML = `

            <a href="login.html">
                Login
            </a>

        `;

    }

}


// ==========================================
// PROFILE DROPDOWN
// ==========================================

function toggleProfileMenu(event) {

    event.stopPropagation();


    const dropdown =
        document.getElementById("profile-dropdown");


    if (dropdown) {

        dropdown.classList.toggle("show");

    }

}


// ==========================================
// LOGOUT
// ==========================================

function logoutUser() {

    localStorage.removeItem("loggedIn");

    localStorage.removeItem("userEmail");


    alert("You have been logged out.");


    window.location.href =
        "index.html";

}


// ==========================================
// CONTACT FORM
// ==========================================

function submitContactForm(event) {

    event.preventDefault();


    alert(
        "Thank you for contacting ShopEasy! We will get back to you soon."
    );


    event.target.reset();

}


// ==========================================
// PLACE ORDER
// ==========================================

function placeOrder(event) {

    event.preventDefault();


    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;

    }


    cart = [];

    saveCart();

    updateCart();


    window.location.href =
        "order-success.html";

}


// ==========================================
// PAGE INITIALIZATION
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // Login/Profile
        updateAuthUI();


        // Cart count
        updateCart();


        // Products page
        if (
            document.getElementById("product-list")
        ) {

            setupProductFilters();

        }


        // Cart page
        if (
            document.getElementById("cart-container")
        ) {

            displayCart();

        }


        // Product details page
        if (
            document.getElementById("product-details")
        ) {

            displayProductDetails();

        }


        // Close profile dropdown
        document.addEventListener(
            "click",
            function () {

                const dropdown =
                    document.getElementById(
                        "profile-dropdown"
                    );


                if (dropdown) {

                    dropdown.classList.remove(
                        "show"
                    );

                }

            }
        );

    }
);
