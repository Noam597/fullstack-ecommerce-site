import type {Request, Response} from 'express';
import bcrypt from 'bcrypt'
import pool from '../db.ts';
import { passwordCheck, emailCheck } from '../utils/validators.ts'

export type UserRole = "admin" | "manager" | "buyer";


interface AdminAddUserProps{
    name: string; 
    surname: string;
    role: UserRole;
    email: string 
    password: string; 
}


// export const passwordCheck =/^(?=.*[a-z])(?=.*[A-Z].*[A-Z])(?=.*[0-9].*[0-9])(?=.*[!@#$%&])[a-zA-Z0-9?!@#$%&]{8,}$/
// export const emailCheck = /^([a-zA-Z0-9\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,3})?$/i

export const adminAddNewUser = async (req: Request, res: Response)=>{
    const { name, surname, role, email, password}: AdminAddUserProps = req.body;

    try{
        let checkQuery = `SELECT * FROM customers WHERE email = $1;`
        if(!name || !surname ||!role || !email || !password ){
            return res.status(400).json({success: false, message: "All fields are required"})
       }
       if(!emailCheck.test(email)){
            return res.status(400).json({success: false, message: "Invalid email address"})
       }
       
       if (!["admin", "manager", "buyer"].includes(role)) {
            return res.status(400).json({ success: false, message: "Invalid role" });
      }
       if(!passwordCheck.test(password)){
                return res.status(400).json({success: false, message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character"})
          }
    
       
       const { rows: existing } = await pool.query(checkQuery,[email])
        if(existing.length > 0){
          return res.status(400).json({success: false, message: "User already exists"})
        }

        const hash = await bcrypt.hash(password, 10)
        let registerUser = ` INSERT INTO customers (name, surname, role, email, password) 
    VALUES( $1, $2, $3, $4, $5)
    RETURNING id, name, surname, role, email, created_at
    ;`
        let newUser = [ name, surname,role, email, hash];
        const { rows:inserted } = await pool.query(registerUser,newUser);
        if(inserted[0].role === "buyer"){
            const userId = inserted[0].id;
            const cartQuery = `INSERT INTO carts (customer_id) VALUES ($1);`
            await pool.query(cartQuery,[userId]) 
        }
        
  
        return res.status(201).json({success: true, message: `User registered successfully! Welcome ${inserted[0].name} ${inserted[0].surname}`,});

    }catch(err){
        console.log("error found in db",err);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }


}
export const getAllUsers = async (_req:Request, res:Response)=>{
    const query = `
    SELECT
      c.id,
      c.name,
      c.surname,
      c.role,
      c.email,
      COALESCE(s.is_banned, FALSE) AS is_banned
    FROM customers c
    LEFT JOIN customer_status s
      ON s.customer_id = c.id
    ORDER BY c.id;
  `;
    const { rows } = await pool.query(query);
    console.log(rows)
    return res.status(200).json({success: true, users: rows})
  }
  
 
export const getBannedUsers = async (_req:Request, res:Response)=>{
    try{let query = `SELECT c.id, c.role, s.customer_id
                     FROM customers c
                     LEFT JOIN customer_status s ON s.customer_id = c.id
                     WHERE s.is_banned = TRUE;`;
const { rows } = await pool.query(query);
if(rows.length === 0){
    return res.status(200).json({success: true, message:"There are no banned users"})
}
    return res.status(200).json({success: true, banned_users:rows})
    }catch(err){
        console.log("error found in db",err);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
    
} 


export const toggleBanUserController = async (req: Request, res: Response) => {
    try {
      const { userId, reason="Violated Terms of use" } = req.body;
  
      if (!userId) {
        return res.status(400).json({ success: false, message: "userId is required" });
      }
  
      // Check user exists and is not admin
      const userQuery = `SELECT id, role FROM customers WHERE id = $1`;
      const { rows } = await pool.query(userQuery, [userId]);
  
      if (!rows || rows.length === 0) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      if (rows[0].role === "admin") {
        return res.status(403).json({ success: false, message: "Cannot ban/unban an admin" });
      }
  
      // Get current status
      const statusQuery = `SELECT is_banned FROM customer_status WHERE customer_id = $1`;
      const { rows: statusRows } = await pool.query(statusQuery, [userId]);
  
      let updatedUser;
      if (!statusRows || statusRows.length === 0 || statusRows[0].is_banned === false) {
        // Ban user
        const banQuery = `
          INSERT INTO customer_status (customer_id, is_banned, banned_at, ban_reason)
          VALUES ($1, TRUE, NOW(), $2)
          ON CONFLICT (customer_id)
          DO UPDATE SET is_banned = TRUE, banned_at = NOW(), ban_reason = $2
          RETURNING customer_id, is_banned, banned_at, ban_reason;
        `;
        const { rows: updatedRows } = await pool.query(banQuery, [userId, reason || null]);
        updatedUser = updatedRows[0];
      } else {
        // Unban user
        const unbanQuery = `
          UPDATE customer_status
          SET is_banned = FALSE, banned_at = NULL, ban_reason = NULL
          WHERE customer_id = $1
          RETURNING customer_id, is_banned, banned_at, ban_reason;
        `;
        const { rows: updatedRows } = await pool.query(unbanQuery, [userId]);
        updatedUser = updatedRows[0];
      }
  
      return res.status(200).json({
        success: true,
        message: `User ${userId} ban status updated`,
        user: updatedUser
      });
  
    } catch (err) {
      console.error("Error toggling ban:", err);
      return res.status(500).json({ success: false, message: "Something went wrong" });
    }
  };

export const updateProductPrice = async (req: Request, res: Response) => {
  try{
    let { productId, price } = req.body;

    productId = parseInt(productId, 10);
    price = parseFloat(price);

    if (isNaN(productId) || isNaN(price)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID or price"
      });
    }

    if (price < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be 0 or greater"
      });
    }

    const priceQuery = `UPDATE products 
    SET price = $1
    WHERE id= $2
    ;`

   const result = await pool.query(priceQuery, [price, productId]);

if (result.rowCount === 0) {
  return res.status(400).json({
    success: false,
    message: "Price must be 0 or greater"
  });

  
}
return res.status(200).json({
    success: true,
    message: `Product with ID ${productId} price has been changed to ${price}`,
    
  });
  }catch(err){
    console.log("error found in db",err);
    return res.status(500).json({ success: false, message: "Something went wrong" });
}
}

export const updateProductQuantity = async (req: Request, res: Response) => {
  try{
    let { productId, quantity } = req.body;

    productId = parseInt(productId, 10);
    quantity = parseFloat(quantity);

    if (isNaN(productId) || isNaN(quantity)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID or quantity"
      });
    }

    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "quantity must be 0 or greater"
      });
    }

    const quantityQuery = `UPDATE products 
    SET quantity = $1
    WHERE id= $2
    ;`

   const result = await pool.query(quantityQuery, [quantity, productId]);

if (result.rowCount === 0) {
  return res.status(400).json({
    success: false,
    message: "Price must be 0 or greater"
  });

  
}
return res.status(200).json({
    success: true,
    message: `Product with ID ${productId} price has been changed to ${quantity}`,
    
  });
  }catch(err){
    console.log("error found in db",err);
    return res.status(500).json({ success: false, message: "Something went wrong" });
}
}

export const addNewItem = async (req: Request, res: Response) => {
  try{
   const {name, description, img, price, quantity, category} = req.body;
   if(!name || !description ||!img || !price || !quantity || !category){
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
    }
    const checkItemQuery =`SELECT * FROM products WHERE name = $1`
    const {rows:existing} = await pool.query(checkItemQuery,[name]);

    if(existing.length > 0){
      return res.status(400).json({
        success: false,
        message: "Product already Exists in DataBase",
      });
    }

    const addItemQuery = `INSERT INTO products (name, description, img, price, quantity, category)
    VALUES( $1, $2, $3, $4, $5, $6)
    RETURNING id, name, description, img, price, quantity, category, created_at`
    let newItem = [name, description, img, price, quantity, category]
    const { rows: inserted } = await pool.query(addItemQuery,newItem);

    return res.status(200).json({success: true, product: inserted[0]})

  }catch(err){
    console.log("error found in db",err);
    return res.status(500).json({ success: false, message: "Something went wrong" });
}
}

export const getDailyOrderTotals = async (req: Request, res: Response) => {
  try {
    const { range, value } = req.query;

    let whereClause = "";
    const params: any[] = [];

    // Default → last 7 days
    if (!range) {
      whereClause = `WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'`;
    }

    if (range === "days" && value) {
      whereClause = `
        WHERE created_at >= CURRENT_DATE - INTERVAL '${Number(value)} days'
      `;
    }

    if (range === "month" && value) {
      whereClause = `
        WHERE DATE_TRUNC('month', created_at) =
              DATE_TRUNC('month', TO_DATE($1, 'YYYY-MM'))
      `;
      params.push(value);
    }

    if (range === "year" && value) {
      whereClause = `
        WHERE EXTRACT(YEAR FROM created_at) = $1
      `;
      params.push(Number(value));
    }

    const query = `
      SELECT
        TO_CHAR(created_at, 'YYYY-MM-DD') AS order_date,
        SUM(total)::numeric(10,2) AS total_sales,
        SUM(total) * 0.25::numeric(10,2) AS profit
      FROM orders
      ${whereClause}
      GROUP BY order_date
      ORDER BY order_date ASC;
    `;

    const { rows } = await pool.query(query, params);

    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error("Daily totals error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch daily order totals"
    });
  }
};
