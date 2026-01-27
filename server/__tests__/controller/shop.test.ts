import { jest, describe, it, expect, beforeEach} from '@jest/globals'
import { Request, Response } from 'express';
import { getAllItems, 
         addToCart,
         decrementOrRemoveCartItem,
         getFullCart,
         addQuantity, 
         removeCartItem,
         clearCart} from "../../controller/shop"


// Mock dependencies
jest.mock('../../db', () => ({
  __esModule: true,              // <-- ensures Jest treats it as an ES module
  default: { query: jest.fn() }, // <-- mock the default export
}));

import pool from '../../db';
const mockedPoolQuery = pool.query as unknown as jest.MockedFunction<
  (query: string, values?: any[]) => Promise<{ rows: any[] }>
>;

const mockResponse = (): Response => {
    return {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;
  };
  
  // --- Mock Request ---
  const mockRequest = (body?: any, cookies?: Record<string,string>): Request => {
    return { body: body || {}, cookies: cookies || {} } as unknown as Request;
  };
  
  
  describe('getAllItems (unit)', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return 200 with products when query succeeds', async () => {
        
      const fakeProducts = [
        { id: 1, name: 'Product 1', description: 'Desc', img: 'img.png', price: 10, quantity: 5, category: 'Cat1' },
        { id: 2, name: 'Product 2', description: 'Desc2', img: 'img2.png', price: 20, quantity: 2, category: 'Cat2' },
      ];
  
      // mock pool.query to return fake products
      mockedPoolQuery.mockResolvedValue({ rows: fakeProducts });
  
      const req = mockRequest();
      const res = mockResponse();
  
      await getAllItems(req, res);
  
      expect(mockedPoolQuery).toHaveBeenCalledTimes(1); // check query was called
      expect(res.status).toHaveBeenCalledWith(200); 
      expect(res.json).toHaveBeenCalledWith({ success: true, products: fakeProducts });
    });
  
    it('should return 500 if query throws an error', async () => {
        mockedPoolQuery.mockRejectedValue(new Error('DB down'));
  
      const req = mockRequest();
      const res = mockResponse();
  
      await getAllItems(req, res);
  
      expect(mockedPoolQuery).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Something went wrong' });
    });
  });
  describe('addToCart (unit)', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return 400 if required fields are missing', async () => {
      const req = mockRequest({ cart_id: 1, product_id: 2 }); // missing quantity
      const res = mockResponse();
  
      await addToCart(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "cart_id, product_id, and quantity are required",
      });
    });
  
    it('should update quantity if item already exists', async () => {
      const reqBody = { cart_id: 1, product_id: 2, quantity: 3 };
      const req = mockRequest(reqBody);
      const res = mockResponse();
  
      // Mock SELECT returning existing item
      mockedPoolQuery.mockResolvedValueOnce({ rows: [{ cart_id: 1, product_id: 2, quantity: 1 }] });
      // Mock UPDATE returning updated item
      const updatedItem = { cart_id: 1, product_id: 2, quantity: 4 };
      mockedPoolQuery.mockResolvedValueOnce({ rows: [updatedItem] });
  
      await addToCart(req, res);
  
      expect(mockedPoolQuery).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        item: updatedItem,
        message: "Item quantity updated",
      });
    });
  
    it('should insert new item if it does not exist', async () => {
      const reqBody = { cart_id: 1, product_id: 2, quantity: 3 };
      const req = mockRequest(reqBody);
      const res = mockResponse();
  
      // Mock SELECT returning empty array
      mockedPoolQuery.mockResolvedValueOnce({ rows: [] });
      // Mock INSERT returning inserted item
      const insertedItem = { cart_id: 1, product_id: 2, quantity: 3 };
      mockedPoolQuery.mockResolvedValueOnce({ rows: [insertedItem] });
  
      await addToCart(req, res);
  
      expect(mockedPoolQuery).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        item: insertedItem,
        message: "Item added to cart",
      });
    });
  
    it('should return 500 if DB throws error', async () => {
      const req = mockRequest({ cart_id: 1, product_id: 2, quantity: 3 });
      const res = mockResponse();
  
      mockedPoolQuery.mockRejectedValueOnce(new Error('DB error'));
  
      await addToCart(req, res);
  
      expect(mockedPoolQuery).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Something went wrong",
      });
    });
  });

  describe('decrementOrRemoveCartItem', () => {
    const mockDecrementOrRemoveQuery = {
      check: (rows: any[]) =>
        (pool.query as unknown as jest.MockedFunction<
          (query: string, values?: any[]) => Promise<{ rows: typeof rows }>
        >).mockResolvedValueOnce({ rows }),
  
      deleteOrUpdate: (rows: any[]) =>
        (pool.query as unknown as jest.MockedFunction<
          (query: string, values?: any[]) => Promise<{ rows: typeof rows }>
        >).mockResolvedValueOnce({ rows }),
    };
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should remove item if quantity goes to zero', async () => {
      const req = { body: { cart_id: 1, product_id: 2, decrement: 1 } } as Request;
      const res = mockResponse();
  
      // Existing item has quantity 1 → triggers delete
      mockDecrementOrRemoveQuery.check([{ quantity: 1, product_id: 2 }]);
      mockDecrementOrRemoveQuery.deleteOrUpdate([{ product_id: 2 }]);
  
      await decrementOrRemoveCartItem(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        removed: true,
        product_id: 2,
        message: "Item removed from cart",
      });
    });
  });
  describe('getFullCart', () => {
    const mockQuery = pool.query as unknown as jest.MockedFunction<
      (query: string, values?: any[]) => Promise<{ rows: any[] }>
    >;
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return empty cart if no cart exists', async () => {
      const req = { params: { id: '1' } } as unknown as Request;
      const res = mockResponse();
  
      mockQuery.mockResolvedValueOnce({ rows: [] }); // no cart found
  
      await getFullCart(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Cart is Empty",
      });
    });
  
    it('should return cart with items and total', async () => {
      const req = { params: { id: '1' } } as unknown as Request;
      const res = mockResponse();
  
      // Step 1: cart exists
      mockQuery.mockResolvedValueOnce({ rows: [{ id: 10, customer_id: 1, created_at: '2026-01-13' }] });
      // Step 2: items in cart
      mockQuery.mockResolvedValueOnce({
        rows: [
          { id: 1, cart_id: 10, product_id: 100, quantity: 2, added_at: '2026-01-13', name: 'Product', price: 5, img: '', description: '', subtotal: 10 },
          { id: 2, cart_id: 10, product_id: 101, quantity: 1, added_at: '2026-01-13', name: 'Product2', price: 3, img: '', description: '', subtotal: 3 },
        ],
      });
  
      await getFullCart(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        cart: {
          cart_id: 10,
          customer_id: 1,
          created_at: '2026-01-13',
          items: [
            { id: 1, cart_id: 10, product_id: 100, quantity: 2, added_at: '2026-01-13', name: 'Product', price: 5, img: '', description: '', subtotal: 10 },
            { id: 2, cart_id: 10, product_id: 101, quantity: 1, added_at: '2026-01-13', name: 'Product2', price: 3, img: '', description: '', subtotal: 3 },
          ],
          total: 13
        }
      });
    });
  });
  describe('addQuantity', () => {
    const mockQuery = pool.query as unknown as jest.MockedFunction<
      (query: string, values?: any[]) => Promise<{ rows: any[] }>
    >;
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should add new item to cart if not exists', async () => {
      const req = { body: { cart_id: 1, product_id: 2, increment: 3 } } as Request;
      const res = mockResponse();
  
      // Step 1: product exists
      mockQuery.mockResolvedValueOnce({ rows: [{ quantity: 5 }] });
      // Step 2: cart query returns empty → insert
      mockQuery.mockResolvedValueOnce({ rows: [] });
      // Step 3: insert query
      mockQuery.mockResolvedValueOnce({ rows: [{ cart_id: 1, product_id: 2, quantity: 3 }] });
  
      await addQuantity(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        item: { cart_id: 1, product_id: 2, quantity: 3 },
        message: "Item added to cart"
      });
    });
  
    it('should update quantity if item exists', async () => {
      const req = { body: { cart_id: 1, product_id: 2, increment: 2 } } as Request;
      const res = mockResponse();
  
      // Step 1: product exists
      mockQuery.mockResolvedValueOnce({ rows: [{ quantity: 10 }] });
      // Step 2: cart query returns existing item
      mockQuery.mockResolvedValueOnce({ rows: [{ quantity: 3 }] });
      // Step 3: update query
      mockQuery.mockResolvedValueOnce({ rows: [{ cart_id: 1, product_id: 2, quantity: 5 }] });
  
      await addQuantity(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        item: { cart_id: 1, product_id: 2, quantity: 5 },
        message: "Quantity updated"
      });
    });
  
    it('should fail if increment exceeds stock', async () => {
      const req = { body: { cart_id: 1, product_id: 2, increment: 10 } } as Request;
      const res = mockResponse();
  
      // stock query returns 5 → increment 10 exceeds
      mockQuery.mockResolvedValueOnce({ rows: [{ quantity: 5 }] });
      mockQuery.mockResolvedValueOnce({ rows: [{ quantity: 3 }] }); // current in cart
  
      await addQuantity(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Cannot add more than available stock"
      });
    });
  });
  
  describe('removeCartItem (unit)', () => {
    const mockQuery = pool.query as unknown as jest.MockedFunction<
      (query: string, values?: any[]) => Promise<{ rows: any[] }>
    >;
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return 400 if cart_id or product_id is missing', async () => {
      const req = { body: {} } as Request;
      const res = mockResponse();
  
      await removeCartItem(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "cart_id and product_id are required",
      });
    });
  
    it('should return 404 if item is not found in cart', async () => {
      const req = {
        body: { cart_id: 1, product_id: 2 },
      } as Request;
      const res = mockResponse();
  
      // checkQuery → no existing item
      mockQuery.mockResolvedValueOnce({ rows: [] });
  
      await removeCartItem(req, res);
  
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Item not found in cart",
      });
    });
  
    it('should delete item and return 200 when item exists', async () => {
      const req = {
        body: { cart_id: 1, product_id: 2 },
      } as Request;
      const res = mockResponse();
  
      // 1️⃣ item exists
      mockQuery.mockResolvedValueOnce({
        rows: [{ cart_id: 1, product_id: 2 }],
      });
  
      // 2️⃣ delete result
      mockQuery.mockResolvedValueOnce({
        rows: [{ product_id: 2 }],
      });
  
      await removeCartItem(req, res);
  
      expect(mockQuery).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        removed: true,
        product_id: 2,
        message: "Item removed from cart",
      });
    });
  
    it('should return 500 if database throws an error', async () => {
      const req = {
        body: { cart_id: 1, product_id: 2 },
      } as Request;
      const res = mockResponse();
  
      mockQuery.mockRejectedValueOnce(new Error('DB error'));
  
      await removeCartItem(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Something went wrong",
      });
    });
  });
  describe('clearCart (unit)', () => {
    const mockQuery = pool.query as unknown as jest.MockedFunction<
      (query: string, values?: any[]) => Promise<{ rows: any[] }>
    >;
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return 400 if cart_id is missing', async () => {
      const req = { body: {} } as Request;
      const res = mockResponse();
  
      await clearCart(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "cart_id is required",
      });
    });
  
    it('should return 404 if cart is already empty', async () => {
      const req = {
        body: { cart_id: 1 },
      } as Request;
      const res = mockResponse();
  
      // checkQuery → empty cart
      mockQuery.mockResolvedValueOnce({ rows: [] });
  
      await clearCart(req, res);
  
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Cart is already empty",
      });
    });
  
    it('should delete all items and return 200 when cart has items', async () => {
      const req = {
        body: { cart_id: 1 },
      } as Request;
      const res = mockResponse();
  
      // 1️⃣ cart has items
      mockQuery.mockResolvedValueOnce({
        rows: [
          { product_id: 1 },
          { product_id: 2 },
        ],
      });
  
      // 2️⃣ delete result
      mockQuery.mockResolvedValueOnce({
        rows: [
          { product_id: 1 },
          { product_id: 2 },
        ],
      });
  
      await clearCart(req, res);
  
      expect(mockQuery).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        cleared: true,
        removed_items: [1, 2],
        message: "Cart cleared successfully",
      });
    });
  
    it('should return 500 if database throws an error', async () => {
      const req = {
        body: { cart_id: 1 },
      } as Request;
      const res = mockResponse();
  
      mockQuery.mockRejectedValueOnce(new Error('DB error'));
  
      await clearCart(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Something went wrong",
      });
    });
  });
    