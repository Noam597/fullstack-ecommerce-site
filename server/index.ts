import express from 'express'
import type { Request, Response} from 'express' 
import cors from 'cors';
import cookieParser from "cookie-parser";
import {signUpRouter} from './routes/user.js';
import { shopRouter } from './routes/shop.js';
import { adminRouter } from './routes/admin.js';
import { paymentRouter } from "./routes/payments.js"
import { specs, swaggerUi } from './docs/swagger.js';
import { initDb } from './initDb.js';
import { connectRedisOnce, redisClient} from './redis.js';
const port = 3010;
const app = express();

app.use(express.json());
app.use(cookieParser())
 
const allowedOrigins = ["http://localhost:5173",'http://127.0.0.1:5173'];


app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow mobile apps or curl
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));
app.use((req: Request, res: Response, next) => {
  const origin = req.headers.origin;
  console.log(`Incoming request: ${req.method} ${req.path}, Origin: ${origin}`);

  res.on('finish', () => {
    console.log('Response headers:');
    console.log({
      'Access-Control-Allow-Origin': res.getHeader('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Credentials': res.getHeader('Access-Control-Allow-Credentials'),
    });
  });

  next();
});
app.use((req, res, next) => {
  console.log('--- Incoming Request ---');
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Origin header:', req.headers.origin);

  // Hook to log headers the server sends
  const originalSetHeader = res.setHeader.bind(res);
  res.setHeader = (name, value) => {
    console.log('Setting header:', name, value);
    return originalSetHeader(name, value);
  };

  next();
});




app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'E-commerce API Documentation',
  swaggerOptions: {
    withCredentials: true, // 🔥 THIS enables cookies
  },
}));

app.use('/admin', adminRouter)
app.use('/users', signUpRouter)
app.use('/store', shopRouter)
app.use('/payment', paymentRouter)
app.get("/", (_req: Request, res: Response) => {
    console.log("done");
    res.json({ message: "Server is running!" });
  });
 
try{
    await connectRedisOnce();
    console.log('🔌 Connected to Redis');
  } catch (err) {
    console.error('❌ Failed to connect to Redis:', err);
  }
  
// Simple Redis ping endpoint
app.get('/redis/ping', async (_req: Request, res: Response) => {
  try {
    const pong = await redisClient.ping();
    res.json({ success: true, pong });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Redis not available' });
  }
});
  

const server = app.listen(port,"0.0.0.0", async ()=>{
    const address = server.address()
    console.log(address)
    console.log(`you are listening on port ${port}`)
    console.log(`Swagger documentation available at http://localhost:${port}/api-docs`)
    // Initialize database, but don't exit if it fails
    const dbInitialized = await initDb();
    if (dbInitialized) {
        console.log('🚀 Server started successfully with database connection');
    } else {
        console.log('🚀 Server started successfully (database connection failed)');
        console.log('💡 Database-dependent endpoints may not work properly');
    }

    // Initialize Redis, but don't exit if it fails
    try {
      await connectRedisOnce();
      console.log('🔌 Connected to Redis');
    } catch (err) {
      console.error('❌ Failed to connect to Redis:', err);
      console.log('💡 Redis-dependent features may not work properly');
      
    }
}) 