import { describe, it, expect, jest} from '@jest/globals'


import { Request, Response, NextFunction } from 'express';

jest.mock('../../middleware/jwtAuth', () => ({
  authToken: jest.fn(
    (_req: Request, _res: Response, next: NextFunction) => next()
  ),
}));
const mockHandler =
  (status = 200, body: any = { success: true }) =>
  jest.fn((_req: any, res: any) => res.status(status).json(body));


jest.mock('../../controller/shop', () => ({
    getAllItems: mockHandler(200, { success: true, products: [] }),
    addToCart: mockHandler(200, { success: true }),
    decrementOrRemoveCartItem: mockHandler(200, { success: true }),
    removeCartItem: mockHandler(200, { success: true }),
    clearCart: mockHandler(200, { success: true }),
    addQuantity: mockHandler(200, { success: true }),
    getCartById: mockHandler(200, { success: true }),
    getFullCart: mockHandler(200, { success: true }), 
    testCartContents: mockHandler(200, { success: true }),
    subtractQuantity: mockHandler(200, { success: true }),
  }));
  
  
import * as shopController from '../../controller/shop';
import request from 'supertest';
import express from 'express';
import { shopRouter } from '../../routes/shop';

const app = express();
app.use(express.json());
app.use('/store', shopRouter);


describe('GET /store/products', () => {
    it('should call getAllItems and return its response', async () => {
  
      const res = await request(app).get('/store/products');
  
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true, products: [] });
      expect(shopController.getAllItems).toHaveBeenCalledTimes(1);
    });
  });

describe('POST /store/cartItem', () => {
    it('should pass auth and call addToCart', async () => {   
  
      const res = await request(app)
        .post('/store/cartItem')
        .send({ cart_id: 1, product_id: 2, quantity: 1 });
  
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true });
      expect(shopController.addToCart).toHaveBeenCalledTimes(1);
    });
  });


  describe('POST /store/cartItem/remove', () => {
    it('should call decrementOrRemoveCartItem', async () => {
      const res = await request(app)
        .post('/store/cartItem/remove')
        .send({ cart_id: 1, product_id: 2, decrement: 1 });
  
      expect(res.status).toBe(200);
      expect(shopController.decrementOrRemoveCartItem).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /store/cartItem/clearCart', () => {
    it('should call clearCart', async () => {
      const res = await request(app)
        .post('/store/cartItem/clearCart')
        .send({ cart_id: 1 });
  
      expect(res.status).toBe(200);
      expect(shopController.clearCart).toHaveBeenCalledTimes(1);
    });
  });

describe('POST /store/cartItem/add', () => {
    it('should call addQuantity', async () => {
      const res = await request(app)
        .post('/store/cartItem/add')
        .send({ cart_id: 1, product_id: 2, increment: 1 });
  
      expect(res.status).toBe(200);
      expect(shopController.addQuantity).toHaveBeenCalledTimes(1);
    });
  });
  