import type {Request, Response} from 'express';
import pool from '../db.ts';





export const getAllItems = async (_req: Request, res:Response)=>{
 try{   
    const getItemsQuery = `SELECT id,
  name,
  description,
  img,
  price,
  quantity,
  category FROM products
  ORDER BY id ASC
  `;
    const {rows: existing} = await pool.query(getItemsQuery);

   return res.status(200).json({success: true, products:existing})
}catch(err){
    console.log("error found in db");
    return res.status(500).json({ success: false, message: "Something went wrong" });
}
}


export const testCartContents = async (_req:Request,res:Response)=>{

  try{
  const cartUserIdsQuery = `SELECT * FROM carts`
  const {rows: existing} = await pool.query(cartUserIdsQuery);

  return res.status(200).json({success:true, message:existing})
}catch(err){
  console.log("error found in db");
    return res.status(500).json({ success: false, message: "Something went wrong" });
}
}
export const getCartById = async (req:Request,res:Response)=>{
    const customer_id = req.params.id
    if (!customer_id) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is required",
      });
    }
  try{
    
  const cartUserIdsQuery = `SELECT id FROM carts WHERE customer_id= $1`
  const {rows: existing} = await pool.query(cartUserIdsQuery,[customer_id]);

  return res.status(200).json({success:true, cart:existing})
}catch(err){
  console.log("error found in db");
    return res.status(500).json({ success: false, message: "Something went wrong" });
}
}

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { cart_id, product_id, quantity } = req.body;

    if (!cart_id || !product_id || !quantity) {
      return res.status(400).json({
        success: false,
        message: "cart_id, product_id, and quantity are required",
      });
    }

    const checkQuery = `
      SELECT * FROM cart_items
      WHERE cart_id = $1 AND product_id = $2
    `;
    const { rows: existingItems } = await pool.query(checkQuery, [cart_id, product_id]);

    if (existingItems.length > 0) {
      const updateQuery = `
        UPDATE cart_items
        SET quantity = quantity + $1
        WHERE cart_id = $2 AND product_id = $3
        RETURNING *;
      `;
      const { rows: updatedRows } = await pool.query(updateQuery, [quantity, cart_id, product_id]);

      return res.status(200).json({
        success: true,
        item: updatedRows[0],
        message: "Item quantity updated",
      });
    } else {
      const insertQuery = `
        INSERT INTO cart_items (cart_id, product_id, quantity)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
      const { rows: insertedRows } = await pool.query(insertQuery, [cart_id, product_id, quantity]);

      return res.status(200).json({
        success: true,
        item: insertedRows[0],
        message: "Item added to cart",
      });
    }

  } catch (err) {
    console.error("DB ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


export const decrementOrRemoveCartItem = async (req: Request, res: Response) => {
   try {
    const { cart_id, product_id, decrement } = req.body;

    if (!cart_id || !product_id) {
      return res.status(400).json({
        success: false,
        message: "cart_id and product_id are required",
      });
    }

    // Get current item
    const checkQuery = `
      SELECT * FROM cart_items
      WHERE cart_id = $1 AND product_id = $2
    `;
    const { rows: existingItems } = await pool.query(checkQuery, [
      cart_id,
      product_id,
    ]);

    if (existingItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    const item = existingItems[0];

    // If quantity goes to zero → delete the row
    if (item.quantity - decrement <= 0) {
      const deleteQuery = `
        DELETE FROM cart_items
        WHERE cart_id = $1 AND product_id = $2
        RETURNING product_id;
      `;
      const { rows: deletedRows } = await pool.query(deleteQuery, [
        cart_id,
        product_id,
      ]);

      return res.status(200).json({
        success: true,
        removed: true,
        product_id: deletedRows[0].product_id,
        message: "Item removed from cart",
      });
    }

    // Otherwise decrement quantity
    const updateQuery = `
      UPDATE cart_items
      SET quantity = quantity - $1
      WHERE cart_id = $2 AND product_id = $3
      RETURNING *;
    `;

    const { rows: updatedRows } = await pool.query(updateQuery, [
      decrement,
      cart_id,
      product_id,
    ]);

    return res.status(200).json({
      success: true,
      item: updatedRows[0],
      removed: false,
      message: "Quantity decreased",
    });
  } catch (err) {
    console.error("DB ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};



export const getFullCart = async (req: Request, res: Response) => {
  const customer_id = req.params.id;
  const customerIdNum = parseInt(customer_id)
  if (!customer_id) {
    return res.status(400).json({
      success: false,
      message: "Customer ID is required",
    });
  }

  try {
    // 1. Get the customer's cart
    const cartQuery = `
      SELECT * FROM carts WHERE customer_id = $1;
    `;
    const { rows: cartRows } = await pool.query(cartQuery, [customerIdNum]);

    if (cartRows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Cart is Empty",
      });
    }

    const cart = cartRows[0];

    // 2. Get all items for that cart
    const itemsQuery = `
      SELECT 
        ci.id,
        ci.cart_id,
        ci.product_id,
        ci.quantity,
        ci.added_at,
        p.name,
        p.price,
        p.img,
        p.description,
        (ci.quantity * p.price) AS subtotal
      FROM cart_items ci
      JOIN products p ON p.id = ci.product_id
      WHERE ci.cart_id = $1;
    `;

    const { rows: items } = await pool.query(itemsQuery, [cart.id]);

    // 3. Calculate total
    const total = items.reduce((sum, item) => sum + Number(item.subtotal), 0);

    return res.status(200).json({
      success: true,
      cart: {
        cart_id: cart.id,
        customer_id: cart.customer_id,
        created_at: cart.created_at,
        items,
        total
      },
    });

  } catch (err) {
    console.error("DB ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


export const addQuantity = async (req: Request, res: Response) => {
  try {
    const { cart_id, product_id, increment } = req.body;

    if (!cart_id || !product_id || !increment) {
      return res.status(400).json({ success: false, message: "cart_id, product_id, and increment are required" });
    }

    // 1️⃣ Check product stock
    const stockQuery = `SELECT quantity FROM products WHERE id = $1`;
    const { rows: productRows } = await pool.query(stockQuery, [product_id]);

    if (productRows.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const stockAvailable = productRows[0].quantity;

    // 2️⃣ Check current quantity in cart
    const cartQuery = `SELECT quantity FROM cart_items WHERE cart_id = $1 AND product_id = $2`;
    const { rows: cartRows } = await pool.query(cartQuery, [cart_id, product_id]);

    const currentQuantity = cartRows.length ? cartRows[0].quantity : 0;

    if (currentQuantity + increment > stockAvailable) {
      return res.status(400).json({ success: false, message: "Cannot add more than available stock" });
    }

    // 3️⃣ Either insert or update
    if (cartRows.length > 0) {
      const updateQuery = `UPDATE cart_items SET quantity = quantity + $1 WHERE cart_id = $2 AND product_id = $3 RETURNING *`;
      const { rows: updatedRows } = await pool.query(updateQuery, [increment, cart_id, product_id]);
      return res.status(200).json({ success: true, item: updatedRows[0], message: "Quantity updated" });
    } else {
      const insertQuery = `INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *`;
      const { rows: insertedRows } = await pool.query(insertQuery, [cart_id, product_id, increment]);
      return res.status(200).json({ success: true, item: insertedRows[0], message: "Item added to cart" });
    }

  } catch (err) {
    console.error("DB ERROR:", err);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const subtractQuantity = async (req: Request, res: Response) => {
  try {
    const { cart_id, product_id, decrement } = req.body;

    if (!cart_id || !product_id || !decrement) {
      return res.status(400).json({ success: false, message: "cart_id, product_id, and decrement are required" });
    }

    // 1️⃣ Get current quantity in cart
    const cartQuery = `SELECT quantity FROM cart_items WHERE cart_id = $1 AND product_id = $2`;
    const { rows: cartRows } = await pool.query(cartQuery, [cart_id, product_id]);

    if (!cartRows.length) {
      return res.status(404).json({ success: false, message: "Item not found in cart" });
    }

    const currentQuantity = cartRows[0].quantity;

    if (currentQuantity - decrement < 0) {
      return res.status(400).json({ success: false, message: "Cannot reduce quantity below zero" });
    }

    if (currentQuantity - decrement === 0) {
      const deleteQuery = `DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2 RETURNING *`;
      const { rows: deletedRows } = await pool.query(deleteQuery, [cart_id, product_id]);
      return res.status(200).json({ success: true, item: deletedRows[0], message: "Item removed from cart" });
    } else {
      const updateQuery = `UPDATE cart_items SET quantity = quantity - $1 WHERE cart_id = $2 AND product_id = $3 RETURNING *`;
      const { rows: updatedRows } = await pool.query(updateQuery, [decrement, cart_id, product_id]);
      return res.status(200).json({ success: true, item: updatedRows[0], message: "Quantity updated" });
    }

  } catch (err) {
    console.error("DB ERROR:", err);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};


export const removeCartItem = async (req: Request, res: Response) => {
  try {
    const { cart_id, product_id } = req.body;

    if (!cart_id || !product_id) {
      return res.status(400).json({
        success: false,
        message: "cart_id and product_id are required",
      });
    }

    const checkQuery = `
      SELECT * FROM cart_items
      WHERE cart_id = $1 AND product_id = $2
    `;

    const { rows: existingItems } = await pool.query(checkQuery, [
      cart_id,
      product_id,
    ]);

    if (existingItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    // Delete the item completely
    const deleteQuery = `
      DELETE FROM cart_items
      WHERE cart_id = $1 AND product_id = $2
      RETURNING product_id;
    `;

    const { rows: deletedRows } = await pool.query(deleteQuery, [
      cart_id,
      product_id,
    ]);

    return res.status(200).json({
      success: true,
      removed: true,
      product_id: deletedRows[0].product_id,
      message: "Item removed from cart",
    });
  } catch (err) {
    console.error("DB ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const { cart_id } = req.body;

    if (!cart_id) {
      return res.status(400).json({
        success: false,
        message: "cart_id is required",
      });
    }

    // Check if cart has any items
    const checkQuery = `
      SELECT * FROM cart_items
      WHERE cart_id = $1
    `;

    const { rows: existingItems } = await pool.query(checkQuery, [cart_id]);

    if (existingItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart is already empty",
      });
    }

    const deleteQuery = `
      DELETE FROM cart_items
      WHERE cart_id = $1
      RETURNING product_id;
    `;

    const { rows: deletedRows } = await pool.query(deleteQuery, [cart_id]);

    return res.status(200).json({
      success: true,
      cleared: true,
      removed_items: deletedRows.map((row) => row.product_id),
      message: "Cart cleared successfully",
    });
  } catch (err) {
    console.error("DB ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}; 
