import pool from "./db.js";


export const seedProducts = async () => {
  try {
    const check = await pool.query("SELECT COUNT(*) FROM products;");
    const count = Number(check.rows[0].count);

    if (count > 0) {
      console.log("🟡 Products already exist — skipping seeding.");
      return;
    }

    console.log("📦 Seeding default products...");

    for (const p of defaultProducts) {
      await pool.query(
        `INSERT INTO products (name, description, price, quantity, img, category)
         VALUES ($1, $2, $3, $4, $5, $6);`,
        [p.name, p.description, p.price, p.quantity, p.img ,p.category]
      );
    }

    console.log("✅ Default products inserted.");
  } catch (err) {
    console.error("❌ Error seeding products:", err);
  }
};

export const defaultProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "Noise-cancelling over-ear headphones with 30-hour battery life.",
    price: 89.99,
    quantity: 50,
    img: "https://example.com/products/headphones.jpg",
    category: "Audio"
  },
  {
    name: "Mechanical Gaming Keyboard",
    description: "RGB backlit mechanical keyboard with blue switches.",
    price: 59.99,
    quantity: 0,
    img: "https://example.com/products/keyboard.jpg",
    
    category: "Computers"
  },
  {
    name: "4K Ultra HD Monitor 27''",
    description: "Crystal clear 4K IPS display with 75Hz refresh rate.",
    price: 279.99,
    quantity: 20,
    img: "https://example.com/products/monitor.jpg",
    category: "Displays"
  },
  {
    name: "Wireless Gaming Mouse",
    description: "Lightweight ergonomic mouse with 6 programmable buttons.",
    price: 39.99,
    quantity: 60,
    img: "https://example.com/products/mouse.jpg",
    category: "Computers"
  },
  {
    name: "Portable Bluetooth Speaker",
    description: "Waterproof outdoor speaker with powerful bass.",
    price: 49.99,
    quantity: 45,
    img: "https://example.com/products/speaker.jpg",
    category: "Audio"
  },
  {
    name: "Smartwatch Series X",
    description: "Fitness tracking with heart rate monitor, GPS, and Bluetooth.",
    price: 119.99,
    quantity: 0,
    img: "https://example.com/products/smartwatch.jpg",
    
    category: "Wearables"
  },
  {
    name: "USB-C Fast Charger 45W",
    description: "Fast-charging adapter compatible with phones and tablets.",
    price: 24.99,
    quantity: 80,
    img: "https://example.com/products/charger.jpg",
    category: "Accessories"
  },
  {
    name: "Noise-Cancelling Earbuds",
    description: "Compact wireless earbuds with charging case.",
    price: 69.99,
    quantity: 55,
    img: "https://example.com/products/earbuds.jpg",
    category: "Audio"
  },
  {
    name: "1080p HD Webcam",
    description: "High-quality webcam suitable for streaming and video calls.",
    price: 34.99,
    quantity: 35,
    img: "https://example.com/products/webcam.jpg",
    category: "Computers"
  },
  {

    name: "External SSD 1TB",
    description: "Portable USB-C solid state drive with fast transfer speeds.",
    price: 129.99,
    quantity: 25,
    img: "https://example.com/products/ssd.jpg",
    category: "Storage"
  }
];
  