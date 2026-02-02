// initDb.ts
import pool from './db.js';
import { seedProducts } from './utils.js';
export const initDb = async () => {
  try {
    // Create table if not exists
    const query = `
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        surname VARCHAR(100) NOT NULL,
        role VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS customer_status (
    customer_id INTEGER PRIMARY KEY
      REFERENCES customers(id) ON DELETE CASCADE,
    is_banned BOOLEAN NOT NULL DEFAULT FALSE,
    banned_at TIMESTAMP NULL,
    ban_reason TEXT NULL
  );

   CREATE OR REPLACE FUNCTION create_customer_status()
      RETURNS TRIGGER AS $$
      BEGIN
        -- Skip admins
        IF NEW.role = 'admin' THEN
          RETURN NEW;
        END IF;

        INSERT INTO customer_status (customer_id)
        VALUES (NEW.id);

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      -- ======================
      -- TRIGGER 
      -- ======================
      DROP TRIGGER IF EXISTS trg_create_customer_status ON customers;

      CREATE TRIGGER trg_create_customer_status
      AFTER INSERT ON customers
      FOR EACH ROW
      EXECUTE FUNCTION create_customer_status();

      -- Carts table — one cart per customer
      CREATE TABLE IF NOT EXISTS carts (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER UNIQUE NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      description TEXT,
      img TEXT,
      price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
      quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
      category VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

      -- Cart items table — a row per product in the cart
     CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  cart_id INTEGER NOT NULL 
    REFERENCES carts(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL
    REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_cart_product UNIQUE (cart_id, product_id)
);
    CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  
  email VARCHAR(150) NOT NULL,          -- store email snapshot
  total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
  payment_status VARCHAR(20) NOT NULL DEFAULT 'success',  -- mock always success
  receipt_id VARCHAR(50),               -- mock receipt code
  order_code VARCHAR(50),               -- mock order ID like ORD-xxxx
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items table (contains each item purchased)
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,

  order_id INTEGER NOT NULL 
    REFERENCES orders(id) ON DELETE CASCADE,
  
  product_id INTEGER NOT NULL 
    REFERENCES products(id) ON DELETE SET NULL,

  product_name VARCHAR(150) NOT NULL,   -- snapshot in case product is renamed
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),  -- snapshot of price at purchase
  subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Useful index for faster order lookups
CREATE INDEX IF NOT EXISTS idx_orders_customer
  ON orders(customer_id);
    `;
 
    await pool.query(query);
    await seedProducts();
    console.log('✅ Customers table is ready.');
    return true;
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    console.log('⚠️  Server will continue running without database connection.');
    return false;
  }
};

export const resetDb = async () => {
  try {
    const query = `
      DROP TABLE IF EXISTS cart_items CASCADE;
      DROP TABLE IF EXISTS carts CASCADE;
      DROP TABLE IF EXISTS products CASCADE;
      DROP TABLE IF EXISTS customers CASCADE;
    `;
  
    await pool.query(query);
    console.log("🔥 All tables dropped.");
  
    await initDb(); // recreate tables + seed products
    console.log("✨ Database reset complete.");
  } catch (err) {
    console.error("❌ Failed to reset database:", err);
  }
};
