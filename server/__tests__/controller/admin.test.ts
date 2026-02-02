import { jest, describe, it, expect, beforeEach, beforeAll} from '@jest/globals';
import { Request, Response } from 'express';

jest.mock('../../db', () => {
  return {
    __esModule: true,
    default: {
      query: jest.fn(),
    },
  };
});

jest.mock('bcrypt', () => ({
    __esModule: true,
    default: {
      hash: jest.fn(),
    },
  }));

import bcrypt from 'bcrypt';  
import pool from '../../db.js';

const mockResponse = (): Response =>
    ({
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response);
  
  const mockRequest = (
    body?: any,
    query?: Record<string, any>, 
    cookies?: Record<string, string>,
    user?: { id: number },
    params?: Record<string, any>,
  ): Request =>
    ({
      body: body || {},
      query: query || {},
      cookies: cookies || {},
      user,
      params: params || {},
    } as unknown as Request);
 
const mockedPoolQuery = pool.query as unknown as jest.MockedFunction<
    (query: string, values?: any[]) => Promise<{ rows: any[] }>
  >;

const mockedBcryptHash = bcrypt.hash as jest.MockedFunction<
  (data: string, salt: number) => Promise<string>
>;
const mockedPoolQueryRowCount = pool.query as unknown as jest.MockedFunction<
  (query: string, values?: any[]) => Promise<{ rowCount: number }>
>;
beforeAll(() => {
    (global as any).emailCheck = { test: (s: string) => /^[^@]+@[^@]+\.[^@]+$/.test(s) };
    (global as any).passwordCheck = {
      test: (s: string) =>
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(s),
    };
  });
import { adminAddNewUser,
         getAllUsers,
         toggleBanUserController,
         updateProductPrice,
         updateProductQuantity,
         addNewItem,
         getDailyOrderTotals
 } from "../../controller/admin.js";

describe('adminAddNewUser (unit)', () => {

      
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return 400 if required fields are missing', async () => {
      const req = mockRequest({ name: 'John' }); // missing fields
      const res = mockResponse();
  
      await adminAddNewUser(req, res);
  
      expect(mockedPoolQuery).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'All fields are required',
      });
    });
  
    it('should return 400 for invalid email', async () => {
      const req = mockRequest({
        name: 'John',
        surname: 'Doe',
        role: 'buyer',
        email: 'invalid-email',
        password: 'PassworD123!',
      });
  
      const res = mockResponse();
  
      await adminAddNewUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid email address',
      });
    });
  
    it('should return 400 for invalid role', async () => {
      const req = mockRequest({
        name: 'John',
        surname: 'Doe',
        role: 'superadmin',
        email: 'john@test.com',
        password: 'PassworD123!',
      });
  
      const res = mockResponse();
  
      await adminAddNewUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid role',
      });
    });
  
    it('should return 400 for weak password', async () => {
      const req = mockRequest({
        name: 'John',
        surname: 'Doe',
        role: 'buyer',
        email: 'john@test.com',
        password: 'weakpass',
      });
  
      const res = mockResponse();
  
      await adminAddNewUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message:
          'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character',
      });
    });
  
    it('should return 400 if user already exists', async () => {
      mockedPoolQuery.mockResolvedValueOnce({
        rows: [{ id: 1, email: 'john@test.com' }],
      });
  
      const req = mockRequest({
        name: 'John',
        surname: 'Doe',
        role: 'buyer',
        email: 'john@test.com',
        password: 'PassworD123!',
      });
  
      const res = mockResponse();
  
      await adminAddNewUser(req, res);
  
      expect(mockedPoolQuery).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User already exists',
      });
    });
  
    it('should create a buyer and create a cart', async () => {
      mockedBcryptHash.mockResolvedValue('hashed-password');
  
      mockedPoolQuery
        .mockResolvedValueOnce({ rows: [] }) // email check
        .mockResolvedValueOnce({
          rows: [
            {
              id: 10,
              name: 'John',
              surname: 'Doe',
              role: 'buyer',
              email: 'john@test.com',
            },
          ],
        }) // insert user
        .mockResolvedValueOnce({ rows: [] }); // cart insert
  
      const req = mockRequest({
        name: 'John',
        surname: 'Doe',
        role: 'buyer',
        email: 'john@test.com',
        password: 'PassworD123!',
      });
  
      const res = mockResponse();
  
      await adminAddNewUser(req, res);
  
      expect(bcrypt.hash).toHaveBeenCalledWith('PassworD123!', 10);
  
      expect(mockedPoolQuery).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('FROM customers'),
        ['john@test.com']
      );
  
      expect(mockedPoolQuery).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('INSERT INTO customers'),
        expect.arrayContaining(['John', 'Doe', 'buyer', 'john@test.com'])
      );
  
      expect(mockedPoolQuery).toHaveBeenNthCalledWith(
        3,
        expect.stringContaining('INSERT INTO carts'),
        [10]
      );
  
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User registered successfully! Welcome John Doe',
      });
    });
  
    it('should create an admin without creating a cart', async () => {
      mockedBcryptHash.mockResolvedValue('hashed-password');
  
      mockedPoolQuery
        .mockResolvedValueOnce({ rows: [] }) // email check
        .mockResolvedValueOnce({
          rows: [
            {
              id: 20,
              name: 'Jane',
              surname: 'Smith',
              role: 'admin',
              email: 'jane@test.com',
            },
          ],
        }); // insert user
  
      const req = mockRequest({
        name: 'Jane',
        surname: 'Smith',
        role: 'admin',
        email: 'jane@test.com',
        password: 'PassworD123!',
      });
  
      const res = mockResponse();
  
      await adminAddNewUser(req, res);
  
      expect(mockedPoolQuery).toHaveBeenCalledTimes(2); // no cart insert
      expect(res.status).toHaveBeenCalledWith(201);
    });
  
    it('should return 500 if db throws error', async () => {
        mockedPoolQuery.mockRejectedValueOnce(new Error('DB error'));
      
        const req = mockRequest({
          name: 'John',
          surname: 'Doe',
          role: 'buyer',
          email: 'john@test.com',
          password: 'PassworD123!',
        });
      
        const res = mockResponse();
      
        await adminAddNewUser(req, res);
      
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: 'Something went wrong',
        });
      });
      
  });
  describe('getAllUsers', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return a list of users with status 200', async () => {
      const fakeUsers = [
        { id: 1, name: 'John', surname: 'Doe', role: 'buyer', email: 'john@test.com', is_banned: false },
        { id: 2, name: 'Jane', surname: 'Smith', role: 'admin', email: 'jane@test.com', is_banned: true },
      ];
  
      mockedPoolQuery.mockResolvedValueOnce({ rows: fakeUsers });
  
      const req = mockRequest();
      const res = mockResponse();
  
      await getAllUsers(req, res);
  
      expect(mockedPoolQuery).toHaveBeenCalledTimes(1);
      expect(mockedPoolQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT'));
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        users: fakeUsers,
      });
    });
  
    it('should handle db errors and throw', async () => {
      const req = mockRequest();
      const res = mockResponse();
  
      mockedPoolQuery.mockRejectedValueOnce(new Error('DB failure'));
  
      // Since your function doesn’t catch errors, this will throw
      await expect(getAllUsers(req, res)).rejects.toThrow('DB failure');
  
      expect(mockedPoolQuery).toHaveBeenCalledTimes(1);
    });
  });

  describe('toggleBanUserController', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return 400 if userId is missing', async () => {
      const req = mockRequest({});
      const res = mockResponse();
  
      await toggleBanUserController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'userId is required',
      });
    });
  
    it('should return 404 if user does not exist', async () => {
      mockedPoolQuery.mockResolvedValueOnce({ rows: [] }); // user query
  
      const req = mockRequest({ userId: 1 });
      const res = mockResponse();
  
      await toggleBanUserController(req, res);
  
      expect(mockedPoolQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT id, role FROM customers WHERE id = $1'),
        [1]
      );
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found',
      });
    });
  
    it('should return 403 if user is admin', async () => {
      mockedPoolQuery.mockResolvedValueOnce({ rows: [{ id: 1, role: 'admin' }] });
  
      const req = mockRequest({ userId: 1 });
      const res = mockResponse();
  
      await toggleBanUserController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Cannot ban/unban an admin',
      });
    });
  
    it('should ban a user if not currently banned', async () => {
      // User exists and is not admin
      mockedPoolQuery
        .mockResolvedValueOnce({ rows: [{ id: 2, role: 'buyer' }] }) // user query
        .mockResolvedValueOnce({ rows: [{ is_banned: false }] }) // status query
        .mockResolvedValueOnce({
          rows: [{ customer_id: 2, is_banned: true, banned_at: new Date(), ban_reason: 'Violation' }],
        }); // ban query
  
      const req = mockRequest({ userId: 2, reason: 'Violation' });
      const res = mockResponse();
  
      await toggleBanUserController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User 2 ban status updated',
        user: { customer_id: 2, is_banned: true, banned_at: expect.any(Date), ban_reason: 'Violation' },
      });
    });
  
    it('should unban a user if currently banned', async () => {
      // User exists and is not admin
      mockedPoolQuery
        .mockResolvedValueOnce({ rows: [{ id: 3, role: 'buyer' }] }) // user query
        .mockResolvedValueOnce({ rows: [{ is_banned: true }] }) // status query
        .mockResolvedValueOnce({
          rows: [{ customer_id: 3, is_banned: false, banned_at: null, ban_reason: null }],
        }); // unban query
  
      const req = mockRequest({ userId: 3 });
      const res = mockResponse();
  
      await toggleBanUserController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User 3 ban status updated',
        user: { customer_id: 3, is_banned: false, banned_at: null, ban_reason: null },
      });
    });
  
    it('should return 500 on DB error', async () => {
      mockedPoolQuery.mockRejectedValueOnce(new Error('DB failure'));
  
      const req = mockRequest({ userId: 4 });
      const res = mockResponse();
  
      await toggleBanUserController(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Something went wrong',
      });
    });
  });  

  describe('updateProductPrice', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return 400 if productId or price is invalid', async () => {
      const req = mockRequest({ productId: 'abc', price: 'xyz' });
      const res = mockResponse();
  
      await updateProductPrice(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid product ID or price',
      });
    });
  
    it('should return 400 if price is negative', async () => {
      const req = mockRequest({ productId: 1, price: -10 });
      const res = mockResponse();
  
      await updateProductPrice(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Price must be 0 or greater',
      });
    });
  
    it('should return 400 if product does not exist (rowCount === 0)', async () => {
      mockedPoolQueryRowCount.mockResolvedValueOnce({ rowCount: 0 });
  
      const req = mockRequest({ productId: 1, price: 100 });
      const res = mockResponse();
  
      await updateProductPrice(req, res);
  
      expect(mockedPoolQueryRowCount).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE products'),
        [100, 1]
      );
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Price must be 0 or greater',
      });
    });
  
    it('should update product price successfully', async () => {
      mockedPoolQueryRowCount.mockResolvedValueOnce({ rowCount: 1 });
  
      const req = mockRequest({ productId: 2, price: 50 });
      const res = mockResponse();
  
      await updateProductPrice(req, res);
  
      expect(mockedPoolQueryRowCount).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE products'),
        [50, 2]
      );
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Product with ID 2 price has been changed to 50',
      });
    });
  
    it('should return 500 if DB throws error', async () => {
      mockedPoolQueryRowCount.mockRejectedValueOnce(new Error('DB error'));
  
      const req = mockRequest({ productId: 1, price: 10 });
      const res = mockResponse();
  
      await updateProductPrice(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Something went wrong',
      });
    });
  });

  describe('updateProductQuantity', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return 400 if productId or quantity is invalid', async () => {
      const req = mockRequest({ productId: 'abc', quantity: 'xyz' });
      const res = mockResponse();
  
      await updateProductQuantity(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid product ID or quantity',
      });
    });
  
    it('should return 400 if quantity is negative', async () => {
      const req = mockRequest({ productId: 1, quantity: -5 });
      const res = mockResponse();
  
      await updateProductQuantity(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'quantity must be 0 or greater',
      });
    });
  
    it('should return 400 if product does not exist (rowCount === 0)', async () => {
      mockedPoolQueryRowCount.mockResolvedValueOnce({ rowCount: 0 });
  
      const req = mockRequest({ productId: 1, quantity: 10 });
      const res = mockResponse();
  
      await updateProductQuantity(req, res);
  
      expect(mockedPoolQueryRowCount).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE products'),
        [10, 1]
      );
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Price must be 0 or greater',
      });
    });
  
    it('should update product quantity successfully', async () => {
      mockedPoolQueryRowCount.mockResolvedValueOnce({ rowCount: 1 });
  
      const req = mockRequest({ productId: 2, quantity: 50 });
      const res = mockResponse();
  
      await updateProductQuantity(req, res);
  
      expect(mockedPoolQueryRowCount).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE products'),
        [50, 2]
      );
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Product with ID 2 price has been changed to 50',
      });
    });
  
    it('should return 500 if DB throws error', async () => {
      mockedPoolQueryRowCount.mockRejectedValueOnce(new Error('DB error'));
  
      const req = mockRequest({ productId: 1, quantity: 10 });
      const res = mockResponse();
  
      await updateProductQuantity(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Something went wrong',
      });
    });
  });
  describe('addNewItem', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return 400 if any required field is missing', async () => {
      const req = mockRequest({ name: 'Item 1', price: 10 }); // missing fields
      const res = mockResponse();
  
      await addNewItem(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'All fields are required',
      });
    });
  
    it('should return 400 if product already exists', async () => {
      mockedPoolQuery.mockResolvedValueOnce({
        rows: [{ id: 1, name: 'Item 1' }],
      });
  
      const req = mockRequest({
        name: 'Item 1',
        description: 'Test item',
        img: 'image.jpg',
        price: 10,
        quantity: 5,
        category: 'category1',
      });
      const res = mockResponse();
  
      await addNewItem(req, res);
  
      expect(mockedPoolQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM products WHERE name = $1'),
        ['Item 1']
      );
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Product already Exists in DataBase',
      });
    });
  
    it('should insert new product successfully', async () => {
      mockedPoolQuery
        .mockResolvedValueOnce({ rows: [] }) 
        .mockResolvedValueOnce({
          rows: [
            {
              id: 2,
              name: 'Item 2',
              description: 'Description 2',
              img: 'img2.jpg',
              price: 20,
              quantity: 10,
              category: 'category2',
              created_at: new Date(),
            },
          ],
        }); // addItemQuery
  
      const req = mockRequest({
        name: 'Item 2',
        description: 'Description 2',
        img: 'img2.jpg',
        price: 20,
        quantity: 10,
        category: 'category2',
      });
      const res = mockResponse();
  
      await addNewItem(req, res);
  
      expect(mockedPoolQuery).toHaveBeenCalledTimes(2);
      expect(mockedPoolQuery).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('SELECT * FROM products WHERE name = $1'),
        ['Item 2']
      );
      expect(mockedPoolQuery).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('INSERT INTO products'),
        ['Item 2', 'Description 2', 'img2.jpg', 20, 10, 'category2']
      );
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        product: expect.objectContaining({
          id: 2,
          name: 'Item 2',
        }),
      });
    });
  
    it('should return 500 if DB throws error', async () => {
      mockedPoolQuery.mockRejectedValueOnce(new Error('DB error'));
  
      const req = mockRequest({
        name: 'Item 3',
        description: 'Description 3',
        img: 'img3.jpg',
        price: 30,
        quantity: 5,
        category: 'category3',
      });
      const res = mockResponse();
  
      await addNewItem(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Something went wrong',
      });
    });
  });

  describe('getDailyOrderTotals (unit)', () => {
    let req: Request;
    let res: Response;
  
    beforeEach(() => {
      jest.clearAllMocks();
      res = mockResponse();
    });
  
    it('should return daily totals for default 7-day range', async () => {
        req = mockRequest();
  
      const mockRows = [
        { order_date: '2026-01-01', total_sales: '100.00', profit: '25.00' },
        { order_date: '2026-01-02', total_sales: '150.00', profit: '37.50' },
      ];
  
      mockedPoolQuery.mockResolvedValueOnce({ rows: mockRows });
  
      await getDailyOrderTotals(req, res);
  
      expect(mockedPoolQuery).toHaveBeenCalledTimes(1);
      expect(mockedPoolQuery).toHaveBeenCalledWith(
        expect.stringContaining("INTERVAL '7 days'"),
        []
      );
  
      // expect(res.status).not.toHaveBeenCalled(); // default is 200
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockRows,
      });
    });
  
    it('should return daily totals for a custom day range', async () => {
      req = mockRequest({}, { range: 'days', value: '5' });
      req.query.range = 'days';
      req.query.value = '5';
  
      const mockRows = [
        { order_date: '2026-01-03', total_sales: '200.00', profit: '50.00' },
      ];
  
      mockedPoolQuery.mockResolvedValueOnce({ rows: mockRows });
  
      await getDailyOrderTotals(req, res);
  
      expect(mockedPoolQuery).toHaveBeenCalledTimes(1);
      expect(mockedPoolQuery).toHaveBeenCalledWith(
        expect.stringContaining("INTERVAL '5 days'"),
        []
      );
  
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockRows });
    });
  
    it('should return daily totals for a specific month', async () => {
      req = mockRequest({}, { range: 'month', value: '2026-01' });
      req.query.range = 'month';
      req.query.value = '2026-01';
  
      const mockRows = [
        { order_date: '2026-01-01', total_sales: '300.00', profit: '75.00' },
      ];
  
      mockedPoolQuery.mockResolvedValueOnce({ rows: mockRows });
  
      await getDailyOrderTotals(req, res);
  
      expect(mockedPoolQuery).toHaveBeenCalledTimes(1);
      expect(mockedPoolQuery).toHaveBeenCalledWith(
        expect.stringContaining("DATE_TRUNC('month', created_at)"),
        ['2026-01']
      );
  
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockRows });
    });
  
    it('should return daily totals for a specific year', async () => {
      req = mockRequest({}, { range: 'year', value: '2026' });
      req.query.range = 'year';
      req.query.value = '2026';
  
      const mockRows = [
        { order_date: '2026-01-01', total_sales: '400.00', profit: '100.00' },
      ];
  
      mockedPoolQuery.mockResolvedValueOnce({ rows: mockRows });
  
      await getDailyOrderTotals(req, res);
  
      expect(mockedPoolQuery).toHaveBeenCalledTimes(1);
      expect(mockedPoolQuery).toHaveBeenCalledWith(
        expect.stringContaining("EXTRACT(YEAR FROM created_at)"),
        [2026]
      );
  
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockRows });
    });
  
    it('should return 500 if DB throws an error', async () => {
      req = mockRequest();
      mockedPoolQuery.mockRejectedValueOnce(new Error('DB error'));
  
      await getDailyOrderTotals(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to fetch daily order totals',
      });
    });
  });
  