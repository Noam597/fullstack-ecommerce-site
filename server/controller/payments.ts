import type { Request, Response } from "express";
import pool from "../db.ts"; 
import crypto from "crypto";
import { generateReceiptPDF } from "../utils/generateReciept.ts";

const generateOrderCode = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `ORD-${date}-${rand}`;
};

export const createOrder = async (req: Request, res: Response) => {
  const customer_id = req.user!.id;

  if (!customer_id) {
    return res.status(400).json({
      success: false,
      message: "Customer ID is required",
    });
  }

  const client = await pool.connect();

  try {
    // Start transaction
    await client.query("BEGIN");

    // 1. Get cart + all items (same logic as your getFullCart)
    const cartRes = await client.query(
      `SELECT * FROM carts WHERE customer_id = $1`, 
      [customer_id]
    );

    if (cartRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const cart = cartRes.rows[0];

    const itemsRes = await client.query(
      `
      SELECT 
        ci.product_id,
        ci.quantity,
        p.name,
        p.price,
        (ci.quantity * p.price) AS subtotal
      FROM cart_items ci
      JOIN products p ON p.id = ci.product_id
      WHERE ci.cart_id = $1
      `,
      [cart.id]
    );

    const items = itemsRes.rows;

    if (items.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const total = items.reduce((sum, item) => sum + Number(item.subtotal), 0);

    // 2. Get customer email snapshot
    const customerRes = await client.query(
      `SELECT email FROM customers WHERE id = $1`,
      [customer_id]
    );

    const email = customerRes.rows[0].email;

    // 3. Create the order
    const order_code = generateOrderCode();
    const receipt_id = crypto.randomUUID(); // mock receipt ID

    const orderInsert = await client.query(
      `
      INSERT INTO orders (
        customer_id, 
        email, 
        total,
        payment_status,
        receipt_id,
        order_code
      )
      VALUES ($1, $2, $3, 'success', $4, $5)
      RETURNING id, order_code
      `,
      [customer_id, email, total, receipt_id, order_code]
    );

    const orderId = orderInsert.rows[0].id;

   // 4. Insert order items
for (const item of items) {
  await client.query(
    `
    INSERT INTO order_items (
      order_id,
      product_id,
      product_name,
      quantity,
      price,
      subtotal
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    `,
    [
      orderId,
      item.product_id,
      item.name,
      item.quantity,
      item.price,
      item.subtotal,
    ]
  );
}

// 4.5. 🔥 UPDATE PRODUCT INVENTORY (subtract quantity purchased)
for (const item of items) {
  const updateRes = await client.query(
    `
    UPDATE products
    SET quantity = quantity - $1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
      AND quantity >= $1          -- ensure no negative stock
    RETURNING quantity;
    `,
    [item.quantity, item.product_id]
  );

  // If updateRes returned no rows → not enough stock
  if (updateRes.rows.length === 0) {
    throw new Error(
      `Insufficient stock for product ${item.product_id}`
    );
  }
}


    // 5. Clear cart after purchase
    await client.query(`DELETE FROM cart_items WHERE cart_id = $1`, [cart.id]);

    // 6. Commit
    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "Order created successfully",
      order_code: orderInsert.rows[0].order_code,
      order_id: orderId,
      total,
    });

  } catch (err) {
    console.error("❌ Order creation failed:", err);
    await client.query("ROLLBACK");
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the order",
    });
  } finally {
    client.release();
  }
};
 

export const getOrders = async (_req: Request, res:Response)=>{
    try{
        let ordersQuery = `SELECT * FROM orders`;
        const {rows: existing}= await pool.query(ordersQuery)
        return res.status(200).json({success: true, orders: existing})

    }catch(err){
        console.error("❌ couldnot get Orders:", err);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}


export const getOrderItems = async (_req: Request, res:Response)=>{
  try{
      let ordersQuery = `SELECT * FROM order_items`;
      const {rows: existing}= await pool.query(ordersQuery)
      return res.status(200).json({success: true, orders: existing})

  }catch(err){
      console.error("❌ couldnot get Orders:", err);
      return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}
export const getAllReceipt = async (_req: Request, res:Response)=>{

  try{
    let ordersQuery = `SELECT
    o.id AS order_id,
    o.order_code,
    o.email,
    o.created_at,
    c.name AS customer_name,
    o.total AS order_total,

    oi.product_id,
    oi.product_name,
    oi.price,
    oi.quantity,
    oi.subtotal

FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN order_items oi ON o.id = oi.order_id
ORDER BY o.created_at DESC, oi.id;`;
    const {rows: existing}= await pool.query(ordersQuery)
    return res.status(200).json({success: true, orders: existing})
  }catch(err){
    console.error("❌ couldnot get Orders:", err);
      return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}


export const getReceipt = async (req: Request, res:Response)=>{
  const id = req.params.id

  try{
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is required",
      });
    }

    let ordersQuery = `SELECT
    o.id AS order_id,
    o.order_code,
    o.email,
    c.id AS customer_id,
    c.name AS customer_name,
    o.total AS order_total,

    oi.product_id,
    oi.product_name,
    oi.price,
    oi.quantity,
    oi.subtotal

FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN order_items oi ON o.id = oi.order_id
WHERE o.id = $1; 
`;
    const {rows: existing}= await pool.query(ordersQuery,[id])
    return res.status(200).json({success: true, orders: existing})
  }catch(err){
    console.error("❌ couldnot get Orders:", err);
      return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}


export const getFrontReceipt = async (_req: Request, res:Response)=>{
  

  try{
    let ordersQuery = `SELECT
    o.id AS order_id,
    o.order_code,
    o.email,
    c.name AS customer_name,
    o.total AS order_total,
    o.created_at,

    SUM(oi.subtotal) AS subtotal_sum,

    JSON_AGG(
        JSON_BUILD_OBJECT(
            'product_id', oi.product_id,
            'product_name', oi.product_name,
            'price', oi.price,
            'quantity', oi.quantity,
            'subtotal', oi.subtotal
        )
    ) AS items

FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, c.name
ORDER BY o.created_at DESC;

`;
    const {rows: existing}= await pool.query(ordersQuery)
    return res.status(200).json({success: true, orders: existing})
  }catch(err){
    console.error("❌ couldnot get Orders:", err);
      return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

export const getSingleUserReceipt = async ( req: Request, res:Response)=>{
  try{
    const id = req.params.id
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is required",
      });
    }
    let ordersQuery = `SELECT
    o.id AS order_id,
    o.order_code,
    o.email,
    c.name AS customer_name,
    o.total AS order_total,
    o.created_at,

    SUM(oi.subtotal) AS subtotal_sum,

    JSON_AGG(
        JSON_BUILD_OBJECT(
            'product_id', oi.product_id,
            'product_name', oi.product_name,
            'price', oi.price,
            'quantity', oi.quantity,
            'subtotal', oi.subtotal
        )
    ) AS items

FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN order_items oi ON o.id = oi.order_id
WHERE o.customer_id = $1
GROUP BY o.id, c.name
ORDER BY o.created_at DESC;

`;
    const {rows: existing}= await pool.query(ordersQuery,[id])
    return res.status(200).json({success: true, orders: existing})
  }catch(err){
    console.error("❌ couldnot get Orders:", err);
      return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}




export const downloadReceipt = async (req: Request, res: Response) => {
  const orderId = req.params.id;
  const customer_id = req.user!.id;

  const client = await pool.connect();

  try {
    // Verify order belongs to user
    const orderRes = await client.query(
      `
      SELECT *
      FROM orders
      WHERE id = $1 AND customer_id = $2
      `,
      [orderId, customer_id]
    );

    if (orderRes.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const itemsRes = await client.query(
      `
      SELECT product_name, quantity, subtotal
      FROM order_items
      WHERE order_id = $1
      `,
      [orderId]
    );

    res.on("finish", () => {
      client.release();
    });


     generateReceiptPDF(
      orderRes.rows[0],
      itemsRes.rows,
      res
    );

    return

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate receipt" });
  } finally {
    client.release();
    return
  }
};