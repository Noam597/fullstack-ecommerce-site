import type {Request, Response} from 'express';
import bcrypt from 'bcrypt'
import { createToken } from '../middleware/jwtAuth.ts';
import pool from '../db.ts';
import jwt  from 'jsonwebtoken';
import {redisClient, connectRedisOnce} from '../redis.ts'
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */
/**
 * @swagger
 * /users/getallusers:
 *   get:
 *     summary: Get all users from the database
 *     description: Returns all users from the `customers` table.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Customer'
 *             examples:
 *               example:
 *                 value:
 *                   success: true
 *                   users:
 *                     - id: 1
 *                       name: "John"
 *                       surname: "Smith"
 *                       role: "admin"
 *                       email: "john.smith@email.com"
 *                       created_at: "2025-01-01T12:00:00.000Z"
 *                     - id: 2
 *                       name: "Sarah"
 *                       surname: "Johnson"
 *                       role: "buyer"
 *                       email: "sarah.johnson@email.com"
 *                       created_at: "2025-01-02T09:30:00.000Z"
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /users/login:
 *   post:
 *      summary: Login an existing user
 *      tags: [Users]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                 type: string
 *                 description: The email of the user
 *                password:
 *                 type: string
 *                 description: The password of the user
 *      responses:
 *        200:
 *          description: User Login succesful
 *          content:
 *            application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Whether the user has logged in successfully
 *                 message:
 *                   type: string
 *                   description: The message from the server
 *        400:
 *          description: Invalid request
 *          content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Whether the user was logged in successfully
 *                 message:
 *                   type: string
 *                   description: The message from the server
 *        500:
 *          description: Internal server error
 *          content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Whether the user was logged in successfully
 */
/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user
 *               surname:
 *                 type: string
 *                 description: The surname of the user
 *               email:
 *                 type: string
 *                 description: The email of the user
 *               password:
 *                 type: string
 *                 description: The password of the user
 *               verifyPassword:
 *                 type: string
 *                 description: The password of the user
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Whether the user was registered successfully
 *                 message:
 *                   type: string
 *                   description: The message from the server
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Whether the user was registered successfully
 *                 message:
 *                   type: string
 *                   description: The message from the server
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Whether the user was registered successfully
 * */
/**
 * @swagger
 * /users/adduser:
 *   post:
 *     summary: Add a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user
 *               surname:
 *                 type: string
 *                 description: The surname of the user
 *               role:
 *                 type: string
 *                 description: The role of the user
 *               email:
 *                 type: string
 *                 description: The email of the user
 *               password:
 *                 type: string
 *                 description: The password of the user
 *     responses:
 *       200:
 *         description: User Added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Whether the user was registered successfully
 *                 message:
 *                   type: string
 *                   description: The message from the server
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Whether the user was registered successfully
 *                 message:
 *                   type: string
 *                   description: The message from the server
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Whether the user was registered successfully
 * */
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Endpoints related to user authentication
 */

/**
 * @swagger
 * /users/token:
 *   post:
 *     summary: Create a JWT access token
 *     description: Generates a JWT for a given user payload.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - surname
 *               - role
 *               - email
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: John
 *               surname:
 *                 type: string
 *                 example: Smith
 *               role:
 *                 type: string
 *                 example: buyer
 *               email:
 *                 type: string
 *                 example: john.smith@email.com
 *     responses:
 *       200:
 *         description: Successfully generated JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: The generated JWT token
 *       400:
 *         description: Invalid request body
 */
/**
 * @swagger
 * /users/authToken:
 *   post:
 *     summary: Verify JWT token and fetch user data
 *     description: Requires a valid JWT Bearer token in the Authorization header.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []   # <--- This line connects to the security scheme
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john.smith@email.com
 *     responses:
 *       200:
 *         description: Valid token — returns filtered user data
 *       401:
 *         description: Missing token
 *       403:
 *         description: Invalid or expired token
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
 
const users = [
  { name: "Admin", surname: "Adminson", role: "admin", password: "AdmiN123!", email: "admin@email.com" },
  {  name: "Sarah", surname: "Johnson", role: "buyer", password: "SaraH123!", email: "sarah.johnson@email.com" },
  {  name: "Michael", surname: "Brown", role: "buyer", password: "Michael123!", email: "michael.brown@email.com" },
  {  name: "Emily", surname: "Davis", role: "buyer", password: "EmilY123!", email: "emily.davis@email.com" },
  {  name: "David", surname: "Wilson", role: "buyer", password: "DaviD123!", email: "david.wilson@email.com" },
  {  name: "Lisa", surname: "Anderson", role: "buyer", password: "LisA123!", email: "lisa.anderson@email.com" },
  {  name: "Robert", surname: "Taylor", role: "buyer", password: "RoberT123!", email: "robert.taylor@email.com" },
  {  name: "Jennifer", surname: "Thomas", role: "buyer", password: "JennifeR123!", email: "jennifer.thomas@email.com" },
  {  name: "William", surname: "Jackson", role: "buyer", password: "WilliaM123!", email: "william.jackson@email.com" },
  {  name: "Maria", surname: "White", role: "buyer", password: "MariA123!", email: "maria.white@email.com" }
];
const passwordCheck =/^(?=.*[a-z])(?=.*[A-Z].*[A-Z])(?=.*[0-9].*[0-9])(?=.*[!@#$%&])[a-zA-Z0-9?!@#$%&]{8,}$/
const emailCheck = /^([a-zA-Z0-9\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,3})?$/i


export const signupController =  async (_req: Request, res: Response) => {
  if (users.length == 0){
    return res.json({success: true, message: "No users found"})
  }
    console.log("users requested successfully");
    return res.json({ success: true, message: "Response Successful", users: users});
};


// --- Login Controller
export const loginController = async (req:Request, res:Response) => {
  try{
  const {email, password} = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  await connectRedisOnce(); // ensure Redis is connected before using it

  //Try to get cached user first
  const cached = await redisClient.get(`user:${email}`);
  if (cached) {
    const { user } = JSON.parse(cached);
    const token = createToken(user)
    res.cookie("token", token, {
      httpOnly: false,
      secure: false,
      sameSite: "lax"
    });




    return res.status(200).json({
      success: true,
      message: "Login successful (from cache)",
      user,
      token,
    });
  }
  // const loginQuery = `SELECT * FROM customers WHERE email =$1;`
  const loginQuery = `
      SELECT c.*, COALESCE(s.is_banned, FALSE) AS is_banned
      FROM customers c
      LEFT JOIN customer_status s
        ON s.customer_id = c.id
      WHERE c.email = $1
    `;
  const {rows: existing} = await pool.query(loginQuery,[email])

  if (!existing || existing.length === 0){
    return res.status(400).json({success: false, message: "User not found"})
  }
  const user = existing[0]

  if (user.is_banned) {
    return res.status(403).json({ 
      success: false, 
      message: "Your account is banned. Please contact support." 
    });
  }


  const ok = await bcrypt.compare(password,user.password)
    if(!ok){
      return res.status(400).json({success: false, message: "Invalid email/password"})
    }
    const {password:_pw, ...safeUser} = user;
    const token = createToken(user);
    await redisClient.set(
      `user:${email}`,
      JSON.stringify({ user: safeUser })
    );

    res.cookie("token", token, {
      httpOnly: false,
      secure: false,
      sameSite: "lax"
    });


    return res.status(200).json({success: true, 
      message: `Login successful`, 
      user:safeUser, 
      token})
  }catch(err){
      console.log("error found in db");
      return res.status(500).json({ success: false, 
        message: "Something went wrong" });
  }
  
}

// --- Register New User
export const registerController = async (req:Request, res:Response) => {

   const {name, surname, email, password, verifyPassword} = req.body
   
   const query = `SELECT * FROM customers WHERE email =$1;`;
   try{
    
    if(!name || !surname || !email || !password || !verifyPassword){
        return res.status(400).json({success: false, message: "All fields are required"})
   }
   if(!emailCheck.test(email)){
        return res.status(400).json({success: false, message: "Invalid email address"})
   }
   
   if(password !== verifyPassword){
        return res.status(400).json({success: false, message: "Passwords do not match"})
   }
   if(!passwordCheck.test(password)){
            return res.status(400).json({success: false, message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character"})
      }

   
   const { rows: existing } = await pool.query(query,[email])
    if(existing.length > 0){
      return res.status(400).json({success: false, message: "User already exists"})
    }

//  hashing password
  
    const hash = await bcrypt.hash(password, 10)
      let registerUser = ` INSERT INTO customers (name, surname, role, email, password) 
  VALUES( $1, $2, $3, $4, $5)
  RETURNING id, name, surname, role, email, created_at
  ;`
      let newUser = [ name, surname,"buyer", email, hash];
      const { rows:inserted } = await pool.query(registerUser,newUser);

      const userId = inserted[0].id;
      const cartQuery = `INSERT INTO carts (customer_id) VALUES ($1);`
      await pool.query(cartQuery,[userId])

      return res.status(201).json({success: true, message: `User registered successfully!welcome ${inserted[0].name} ${inserted[0].surname}`,});
      
    }catch(err){
      console.log("error found in db");
        return res.status(500).json({ success: false, message: "Something went wrong" });
      }
    
       
 
}


// --- Logout controller
export const logoutController = async (req: Request, res: Response) => {
 
  try {
    await connectRedisOnce();

    const token = req.cookies?.token;

    if (token) {
      try {
        const decoded = jwt.decode(token) as { email?: string };
        if (decoded?.email) {
          await redisClient.del(`user:${decoded.email}`);
        }
      } catch {}
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
};


export const loggedInUserController = async (req: Request, res: Response) => {
  // At this point, testToken middleware has already validated the token
  // and attached the decoded user to req.user

  const user = req.user;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  return res.status(200).json({
    success: true,
    user, // send back user info (no password!)
  });
};







export const addUser = async (req:Request, res:Response)=>{
  const {name, surname, role, email, password } = req.body;
  
  let query = `SELECT * FROM customers WHERE email =$1`;
  const { rows: existing } = await  pool.query(query, [email])
  if(existing.length > 0){
      res.status(400).json({success: false, message: "User already exist"})
  }
  if(role !== "buyer" && role !== "admin"){
    res.status(400).json({success: false, message: "Role is Invalid"})
  }

  const hashed = await bcrypt.hash(password,10)
  let addNewUser = ` INSERT INTO customers (name, surname, role, email, password) 
  VALUES( $1, $2, $3, $4, $5)
  RETURNING id, name, surname, role, email, created_at
  ;`
  const values = [name, surname,role, email, hashed ]
  const { rows:inserted } = await pool.query(addNewUser,values);

  return res.status(201).json({success: true, user: inserted[0]});

}

export const getAllUsers = async (_req:Request, res:Response)=>{
  let query = `SELECT * FROM customers;`;
  const { rows } = await pool.query(query);
  console.log(rows)
  return res.status(200).json({success: true, users: rows})
}

export const makeNewToken = (req:Request, res:Response)=>{
  const user = req.body;
  const token = createToken(user);
  res.json({accessToken: token})

}
export const jwtTest = (req:Request, res:Response)=>{
  const user = (req as any).user;
  res.json({ message: 'Token verified!', user });
}

export const testRedis = async (req: Request, res: Response) => {
  try {
    await connectRedisOnce();

    // You can pass a key in the query or params, e.g. /test-redis?key=user:test@example.com
    const { key } = req.query;

    if (!key || typeof key !== "string") {
      return res.status(400).json({ success: false, message: "Missing Redis key in query (?key=...)" });
    }

    const data = await redisClient.get(key);

    if (data) {
      let parsed;
      try {
        parsed = JSON.parse(data);
      } catch {
        parsed = data; // Not JSON, return raw
      }

      return res.status(200).json({
        success: true,
        message: "Cache found",
        key,
        data: parsed,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "No cache found for this key",
        key,
        data: null,
      });
    }
  } catch (err) {
    console.error("Redis test error:", err);
    return res.status(500).json({
      success: false,
      message: "Error accessing Redis",
      error: (err as Error).message,
    });
  }}


  // export const seedUsersController = async (_req: Request, res: Response) => {
  //   const created: string[] = [];
  //   const skipped: string[] = [];
  
  //   try {
  //     for (const user of users) {
  //       const { name, surname, email, password, role } = user;
  
  //       // check if user exists
  //       const existsQuery = `SELECT id FROM customers WHERE email = $1`;
  //       const { rows } = await pool.query(existsQuery, [email]);
  
  //       if (rows.length > 0) {
  //         skipped.push(email);
  //         continue;
  //       }
  
  //       // hash password
  //       const hash = await bcrypt.hash(password, 10);
  
  //       // insert user
  //       const insertUserQuery = `
  //         INSERT INTO customers (name, surname, role, email, password)
  //         VALUES ($1, $2, $3, $4, $5)
  //         RETURNING id
  //       `;
  
  //       const { rows: inserted } = await pool.query(insertUserQuery, [
  //         name,
  //         surname,
  //         role,
  //         email,
  //         hash,
  //       ]);
  
  //       const userId = inserted[0].id;
  
  //       // create cart (only for buyers if you want)
  //       if (role === "buyer") {
  //         const cartQuery = `INSERT INTO carts (customer_id) VALUES ($1)`;
  //         await pool.query(cartQuery, [userId]);
  //       }
  
  //       created.push(email);
  //     }
  
  //     return res.status(201).json({
  //       success: true,
  //       message: "User seeding completed",
  //       createdCount: created.length,
  //       skippedCount: skipped.length,
  //       created,
  //       skipped,
  //     });
  //   } catch (err) {
  //     console.error("Seed users error:", err);
  //     return res.status(500).json({
  //       success: false,
  //       message: "Failed to seed users",
  //     });
  //   }
  // };