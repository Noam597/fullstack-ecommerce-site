import express from 'express'
import type { Request, Response} from 'express' 
import cors from 'cors';
import cookieParser from "cookie-parser";
import {signUpRouter} from './routes/user.ts';
import { shopRouter } from './routes/shop.ts';
import { adminRouter } from './routes/admin.ts';
import { paymentRouter } from "./routes/payments.ts"
import { specs, swaggerUi } from './docs/swagger.ts';
import { initDb } from './initDb.ts';
import { connectRedisOnce, redisClient} from './redis.ts';
const port = 3010;
const app = express();

app.use(express.json());
app.use(cookieParser())
 
const allowedOrigins = ["http://localhost:5173",'http://127.0.0.1:5173'];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// app.use(cors({
//   origin: allowedOrigins, 
//   credentials: true}));
 
// app.use(cors({
//   origin: true, 
//   credentials: true}));
  

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true, // important for cookies
//   })
// );


app.options(/.*/, cors({
  origin: allowedOrigins,
  credentials: true,
}));
// ✅ Handle preflight requests
// app.options("*", cors({ credentials: true, origin: allowedOrigins }));



app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'E-commerce API Documentation',
  swaggerOptions: {
    withCredentials: true, // 🔥 THIS enables cookies
  },
}));

// app.use((req: Request, res: Response, next: NextFunction) => {
//   res.header("Access-Control-Allow-Origins", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin,X-Requested-with,Content-Type,Accept,Authorization"
//   );
//   if (req.method === "OPTIONS") {
//     res.header("Access-Control-Allow-Methods", "POST,PATCH,PUT,DELETE,GET");
//     return res.status(200).json({});
//   }
//   return next();
// });
// app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
//   if (err instanceof SyntaxError && 'body' in err) {
//     return res.status(400).json({ success: false, message: 'Invalid JSON payload' });
//   }
//   next(err);
// });
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