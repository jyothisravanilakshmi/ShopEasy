const initialProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 1999,
    category: "Electronics",
    description: "High-quality wireless headphones with clear sound and comfortable design.",
    image: "/images/headphone.jpg",
    stock: 15
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 2999,
    category: "Electronics",
    description: "Smart watch with fitness tracking, notifications and modern design.",
    image: "/images/smartwatch.jpg",
    stock: 20
  },
  {
    id: 3,
    name: "Sports Shoes",
    price: 2499,
    category: "Shoes",
    description: "Comfortable sports shoes suitable for running, walking and everyday use.",
    image: "/images/shoes.jpg",
    stock: 25
  },
  {
    id: 4,
    name: "Backpack",
    price: 1499,
    category: "Bags",
    description: "Spacious and stylish backpack perfect for college, work and travel.",
    image: "/images/backpack.jpg",
    stock: 18
  },
  {
    id: 5,
    name: "Bluetooth Speaker",
    price: 1499,
    category: "Electronics",
    description: "Portable Bluetooth speaker with powerful sound and compact design.",
    image: "/images/speaker.jpg",
    stock: 30
  },
  {
    id: 6,
    name: "Smartphone",
    price: 14999,
    category: "Electronics",
    description: "Modern smartphone with excellent performance and stylish design.",
    image: "/images/phone.jpg",
    stock: 12
  },
  {
    id: 7,
    name: "Laptop",
    price: 49999,
    category: "Electronics",
    description: "Powerful laptop suitable for studying, programming and everyday work.",
    image: "/images/laptop.jpg",
    stock: 8
  },
  {
    id: 8,
    name: "Sunglasses",
    price: 799,
    category: "Accessories",
    description: "Stylish sunglasses designed for everyday fashion and comfort.",
    image: "/images/sunglasses.jpg",
    stock: 40
  },
  {
    id: 9,
    name: "Leather Wallet",
    price: 699,
    category: "Accessories",
    description: "Compact and stylish wallet with multiple card and cash compartments.",
    image: "/images/wallet.jpg",
    stock: 35
  },
  {
    id: 10,
    name: "Travel Bag",
    price: 1299,
    category: "Bags",
    description: "Durable travel bag with enough space for your essentials.",
    image: "/images/travel-bag.jpg",
    stock: 15
  },
  {
    id: 11,
    name: "Running T-Shirt",
    price: 599,
    category: "Fashion",
    description: "Lightweight and comfortable T-shirt suitable for running and workouts.",
    image: "/images/tshirt.jpg",
    stock: 50
  },
  {
    id: 12,
    name: "Denim Jacket",
    price: 1599,
    category: "Fashion",
    description: "Classic denim jacket that gives your outfit a stylish look.",
    image: "/images/jacket.jpg",
    stock: 20
  },
  {
    id: 13,
    name: "Women's Handbag",
    price: 1899,
    category: "Bags",
    description: "Elegant handbag with enough space for your everyday essentials.",
    image: "/images/handbag.jpg",
    stock: 14
  },
  {
    id: 14,
    name: "Casual Sneakers",
    price: 1499,
    category: "Shoes",
    description: "Comfortable casual sneakers designed for everyday wear.",
    image: "/images/sneakers.jpg",
    stock: 22
  },
  {
    id: 15,
    name: "Fitness Band",
    price: 1299,
    category: "Electronics",
    description: "Fitness band for tracking steps, activity and daily workouts.",
    image: "/images/fitness-band.jpg",
    stock: 28
  },
  {
    id: 16,
    name: "Wireless Mouse",
    price: 599,
    category: "Electronics",
    description: "Smooth and responsive wireless mouse for laptops and computers.",
    image: "/images/mouse.jpg",
    stock: 45
  },
  {
    id: 17,
    name: "Mechanical Keyboard",
    price: 2499,
    category: "Electronics",
    description: "Mechanical keyboard with responsive keys and comfortable typing.",
    image: "/images/keyboard.jpg",
    stock: 16
  },
  {
    id: 18,
    name: "Tablet",
    price: 15999,
    category: "Electronics",
    description: "Portable tablet suitable for entertainment, studying and browsing.",
    image: "/images/tablet.jpg",
    stock: 10
  },
  {
    id: 19,
    name: "Coffee Mug",
    price: 399,
    category: "Accessories",
    description: "Simple and stylish coffee mug for your home or office.",
    image: "/images/mug.jpg",
    stock: 60
  },
  {
    id: 20,
    name: "Water Bottle",
    price: 499,
    category: "Accessories",
    description: "Reusable water bottle designed for everyday use.",
    image: "/images/bottle.jpg",
    stock: 55
  },
  {
    id: 21,
    name: "Classic Wrist Watch",
    price: 1999,
    category: "Accessories",
    description: "Timeless analog wrist watch with premium leather strap and water resistance.",
    image: "/images/watch.jpg",
    stock: 20
  },
  {
    id: 22,
    name: "Leather Office Bag",
    price: 2199,
    category: "Bags",
    description: "Professional leather office bag with padded laptop compartment and shoulder strap.",
    image: "/images/bag.jpg",
    stock: 15
  },
  {
    id: 23,
    name: "Casual Cotton Hoodie",
    price: 1799,
    category: "Fashion",
    description: "Cozy fleece cotton hoodie designed for casual comfort and everyday warmth.",
    image: "/images/jacket.jpg",
    stock: 25
  },
  {
    id: 24,
    name: "Formal Leather Shoes",
    price: 2899,
    category: "Shoes",
    description: "Classic handcrafted formal leather shoes suitable for office and formal events.",
    image: "/images/shoes.jpg",
    stock: 18
  }
];

module.exports = initialProducts;
