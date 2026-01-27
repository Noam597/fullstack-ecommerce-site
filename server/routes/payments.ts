import { Router } from 'express';
import { createOrder, downloadReceipt, getAllReceipt, getFrontReceipt, getOrderItems, getOrders, getReceipt, getSingleUserReceipt } from '../controller/payments.ts';
import { authToken } from '../middleware/jwtAuth.ts';


const paymentRouter = Router()

paymentRouter.get("/getOrders", authToken,getOrders)
paymentRouter.get("/getOrderItems", authToken,getOrderItems)
paymentRouter.post('/order',authToken,createOrder)
paymentRouter.get('/allReceipts',authToken,getAllReceipt)
paymentRouter.get('/receipts/:id',authToken,getReceipt)
paymentRouter.get('/receipt',authToken,getFrontReceipt)
paymentRouter.get('/receipt/:id',authToken,getSingleUserReceipt)

//PDF reciept
paymentRouter.get('/orders/:id/receipt',authToken,downloadReceipt)

 
export { paymentRouter };