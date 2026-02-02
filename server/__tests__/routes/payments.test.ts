import { describe, it, expect, jest, beforeEach} from '@jest/globals'


import { Request, Response, NextFunction } from 'express';

jest.mock('../../middleware/jwtAuth', () => ({
  authToken: jest.fn(
    (_req: Request, _res: Response, next: NextFunction) => next()
  ),
}));
const mockHandler =
  (status = 200, body: any = { success: true }) =>
  jest.fn((_req: any, res: any) => res.status(status).json(body));


  jest.mock('../../controller/payments', () => ({
    createOrder: mockHandler(200, { success: true}),
    getOrders: mockHandler(200, { success: true }),
    getOrderItems: mockHandler(200, { success: true }),
    getAllReceipt: mockHandler(200, { success: true }),
    getReceipt: mockHandler(200, { success: true }),
    getFrontReceipt: mockHandler(200, { success: true }),
    getSingleUserReceipt: mockHandler(200, { success: true }),
    downloadReceipt: mockHandler(200, { success: true }), 
  }));
  

import * as paymentController from '../../controller/payments.js';
import request from 'supertest';
import express from 'express';
import { paymentRouter } from '../../routes/payments.js';


const app = express();
app.use(express.json());
app.use('/payment', paymentRouter);

describe('Payment Routes', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    /**
     * GET /payment/getOrders
     */
    it('GET /payment/getOrders → should return orders', async () => {
      const res = await request(app).get('/payment/getOrders');
  
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true });
      expect(paymentController.getOrders).toHaveBeenCalledTimes(1);
    });
  
    /**
     * GET /payment/getOrderItems
     */
    it('GET /payment/getOrderItems → should return order items', async () => {
      const res = await request(app).get('/payment/getOrderItems');
  
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true });
      expect(paymentController.getOrderItems).toHaveBeenCalledTimes(1);
    });
  
    /**
     * POST /payment/order
     */
    it('POST /payment/order → should create an order', async () => {
      const res = await request(app)
        .post('/payment/order')
        .send({}); // body optional since controller is mocked
  
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true });
      expect(paymentController.createOrder).toHaveBeenCalledTimes(1);
    });
  
    /**
     * GET /payment/allReceipts
     */
    it('GET /payment/allReceipts → should return all receipts', async () => {
      const res = await request(app).get('/payment/allReceipts');
  
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true });
      expect(paymentController.getAllReceipt).toHaveBeenCalledTimes(1);
    });
  
    /**
     * GET /payment/receipts/:id
     */
    it('GET /payment/receipts/:id → should return receipt by id', async () => {
      const res = await request(app).get('/payment/receipts/123');
  
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true });
      expect(paymentController.getReceipt).toHaveBeenCalledTimes(1);
    });
  
    /**
     * GET /payment/receipt
     */
    it('GET /payment/receipt → should return front receipt', async () => {
      const res = await request(app).get('/payment/receipt');
  
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true });
      expect(paymentController.getFrontReceipt).toHaveBeenCalledTimes(1);
    });
  
    /**
     * GET /payment/receipt/:id
     */
    it('GET /payment/receipt/:id → should return single user receipt', async () => {
      const res = await request(app).get('/payment/receipt/456');
  
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true });
      expect(paymentController.getSingleUserReceipt).toHaveBeenCalledTimes(1);
    });
  
    /**
     * GET /payment/orders/:id/receipt
     */
    it('GET /payment/orders/:id/receipt → should download receipt PDF', async () => {
      const res = await request(app).get('/payment/orders/789/receipt');
  
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true });
      expect(paymentController.downloadReceipt).toHaveBeenCalledTimes(1);
    });
  });