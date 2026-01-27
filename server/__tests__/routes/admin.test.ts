import { describe, it, expect, jest, beforeEach} from '@jest/globals'


import { Request, Response, NextFunction } from 'express';

jest.mock('../../middleware/jwtAuth', () => ({
  authToken: jest.fn(
    (_req: Request, _res: Response, next: NextFunction) => next()
  ),
}));
jest.mock('../../middleware/adminAuth', () => ({
    requireAdmin: jest.fn(
      (_req: Request, _res: Response, next: NextFunction) => next()
    ),
  }));
const mockHandler =
  (status = 200, body: any = { success: true }) =>
  jest.fn((_req: any, res: any) => res.status(status).json(body));


  jest.mock('../../controller/admin', () => ({
    adminAddNewUser: mockHandler(201, { success: true}),
    getAllUsers: mockHandler(200, { success: true }),
    getBannedUsers: mockHandler(200, { success: true }),
    toggleBanUserController: mockHandler(200, { success: true }),
    updateProductPrice: mockHandler(200, { success: true }),
    updateProductQuantity: mockHandler(200, { success: true }),
    addNewItem: mockHandler(200, { success: true }),
    getDailyOrderTotals: mockHandler(200, { success: true }), 
  }));
  

import * as adminController from '../../controller/admin';
import request from 'supertest';
import express from 'express';
import { adminRouter } from '../../routes/admin';


const app = express();
app.use(express.json());
app.use('/admin', adminRouter);


describe('Admin Routes', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('POST /admin/addNewUser', async () => {
      const res = await request(app)
        .post('/admin/addNewUser')
        .send({
          name: 'John',
          surname: 'Doe',
          role: 'admin',
          email: 'john@test.com',
          password: 'PassworD@123',
        });
  
      expect(res.status).toBe(201);
      expect(res.body).toEqual({ success: true });
      expect(adminController.adminAddNewUser).toHaveBeenCalledTimes(1);
    });
  
    it('POST /admin/toggleBannedUser', async () => {
      const res = await request(app)
        .post('/admin/toggleBannedUser')
        .send({ userId: 1 });
  
      expect(res.status).toBe(200);
      expect(adminController.toggleBanUserController).toHaveBeenCalledTimes(1);
    });
  
    it('GET /admin/fetchUsers', async () => {
      const res = await request(app).get('/admin/fetchUsers');
  
      expect(res.status).toBe(200);
      expect(adminController.getAllUsers).toHaveBeenCalledTimes(1);
    });
  
    it('GET /admin/getBanned', async () => {
      const res = await request(app).get('/admin/getBanned');
  
      expect(res.status).toBe(200);
      expect(adminController.getBannedUsers).toHaveBeenCalledTimes(1);
    });
  
    it('POST /admin/addNewItem', async () => {
      const res = await request(app)
        .post('/admin/addNewItem')
        .send({ name: 'Item', price: 10 });
  
      expect(res.status).toBe(200);
      expect(adminController.addNewItem).toHaveBeenCalledTimes(1);
    });
  
    it('POST /admin/updatePrice', async () => {
      const res = await request(app)
        .post('/admin/updatePrice')
        .send({ productId: 1, price: 20 });
  
      expect(res.status).toBe(200);
      expect(adminController.updateProductPrice).toHaveBeenCalledTimes(1);
    });
  
    it('POST /admin/updateQuantity', async () => {
      const res = await request(app)
        .post('/admin/updateQuantity')
        .send({ productId: 1, quantity: 5 });
  
      expect(res.status).toBe(200);
      expect(adminController.updateProductQuantity).toHaveBeenCalledTimes(1);
    });
  
    it('GET /admin/orders/profits/daily', async () => {
      const res = await request(app).get('/admin/orders/profits/daily');
  
      expect(res.status).toBe(200);
      expect(adminController.getDailyOrderTotals).toHaveBeenCalledTimes(1);
    });
  });