import { jest, describe, it, expect, beforeEach} from '@jest/globals';
import { Request, Response } from 'express';
import { createOrder, 
         getOrders, 
         getOrderItems,
         getAllReceipt,
         getReceipt,
         getFrontReceipt,
         getSingleUserReceipt,
         downloadReceipt } from "../../controller/payments.js";


jest.mock('../../db', () => {
  return {
    __esModule: true,
    default: {
      connect: jest.fn(),
      query: jest.fn(),
    },
  };
});
jest.mock('../../utils/generateReciept', () => ({
  generateReceiptPDF: jest.fn(),
}));
import pool from '../../db.js';
import { generateReceiptPDF } from '../../utils/generateReciept.js';
  // --- helpers ---
  const mockResponse = (): Response =>
    ({
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response);
  
  const mockRequest = (
    body?: any,
    cookies?: Record<string, string>,
    user?: { id: number },
    params?: Record<string, any>,
  ): Request =>
    ({
      body: body || {},
      cookies: cookies || {},
      user,
      params: params || {},
    } as unknown as Request);
  
  // --- typed DB client ---
  export type MockedPgClient = {
    query: jest.MockedFunction<
      (query: string, values?: any[]) => Promise<{ rows: any[] }>
    >;
    release: jest.MockedFunction<() => void>;
  };
  
  export const createMockedPgClient = (): MockedPgClient => ({
    query: jest.fn(),
    release: jest.fn(),
  });
  // --- mock query for creating an order the orders
  const mockedPoolConnect = pool as unknown as {
    connect: jest.MockedFunction<() => Promise<MockedPgClient>>;
  };

// --- mock query for getting the orders
  const mockedPool = pool as unknown as {
    query: jest.MockedFunction<
      (query: string, values?: any[]) => Promise<{ rows: any[] }>
    >;
  };

describe('createOrder (unit)', () => {
    let client: MockedPgClient;
  
    beforeEach(() => {
      jest.clearAllMocks();
  
      client = createMockedPgClient();
      mockedPoolConnect.connect.mockResolvedValue(client);
  });
   
  
    it('should create an order successfully', async () => {
        const req = mockRequest({}, {}, { id: 1 });
        const res = mockResponse();

      client.query
        .mockResolvedValueOnce({ rows: [] })              // BEGIN
        .mockResolvedValueOnce({ rows: [{ id: 10 }] })    // cart
        .mockResolvedValueOnce({
          rows: [{ product_id: 5, quantity: 2, price: 50, subtotal: 100 }],
        })                                                // cart_items
        .mockResolvedValueOnce({ rows: [{ email: 'x@y.com' }] })
        .mockResolvedValueOnce({ rows: [{ id: 99, order_code: 'ORD-1' }] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ quantity: 8 }] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] });
  
      await createOrder(req, res);
  
      expect(client.release).toHaveBeenCalled();
    });
   });
  

   describe('getOrders (unit)', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return all orders successfully', async () => {
      const orders = [
        { id: 1, order_code: 'ORD-1' },
        { id: 2, order_code: 'ORD-2' },
      ];
  
      mockedPool.query.mockResolvedValueOnce({ rows: orders });
  
      const req = mockRequest();
      const res = mockResponse();
  
      await getOrders(req, res);
  
      expect(mockedPool.query).toHaveBeenCalledWith('SELECT * FROM orders');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        orders,
      });
    });
  
    it('should return 500 if db query fails', async () => {
      mockedPool.query.mockRejectedValueOnce(new Error('DB error'));
  
      const req = mockRequest();
      const res = mockResponse();
  
      await getOrders(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Something went wrong',
      });
    });
  });
  describe('getOrderItems (unit)', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return all order items successfully', async () => {
      const orderItems = [
        { id: 1, order_id: 10, product_id: 5, quantity: 2 },
        { id: 2, order_id: 11, product_id: 6, quantity: 1 },
      ];
  
      mockedPool.query.mockResolvedValueOnce({ rows: orderItems });
  
      const req = mockRequest();
      const res = mockResponse();
  
      await getOrderItems(req, res);
  
      expect(mockedPool.query).toHaveBeenCalledWith(
        'SELECT * FROM order_items'
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        orders: orderItems,
      });
    });
  
    it('should return 500 if db query fails', async () => {
      mockedPool.query.mockRejectedValueOnce(new Error('DB error'));
  
      const req = mockRequest();
      const res = mockResponse();
  
      await getOrderItems(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Something went wrong',
      });
    });
  });
  describe('getAllReceipt (unit)', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return all receipts successfully', async () => {
      const receipts = [
        {
          order_id: 1,
          order_code: 'ORD-001',
          email: 'a@test.com',
          customer_name: 'John Doe',
          order_total: 200,
          product_id: 5,
          product_name: 'Product A',
          price: 50,
          quantity: 2,
          subtotal: 100,
        },
        {
          order_id: 1,
          order_code: 'ORD-001',
          email: 'a@test.com',
          customer_name: 'John Doe',
          order_total: 200,
          product_id: 6,
          product_name: 'Product B',
          price: 100,
          quantity: 1,
          subtotal: 100,
        },
      ];
  
      mockedPool.query.mockResolvedValueOnce({ rows: receipts });
  
      const req = mockRequest();
      const res = mockResponse();
  
      await getAllReceipt(req, res);
  
      expect(mockedPool.query).toHaveBeenCalledTimes(1);
  
      // Avoid brittle multiline SQL comparison
      expect(mockedPool.query).toHaveBeenCalledWith(
        expect.stringContaining('FROM orders o')
      );
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        orders: receipts,
      });
    });
  
    it('should return 500 if db query fails', async () => {
      mockedPool.query.mockRejectedValueOnce(new Error('DB error'));
  
      const req = mockRequest();
      const res = mockResponse();
  
      await getAllReceipt(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Something went wrong',
      });
    });
  });
  describe('getReceipt (unit)', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return 400 if id param is missing', async () => {
      const req = mockRequest(); // no params
      const res = mockResponse();
  
      await getReceipt(req, res);
  
      expect(mockedPool.query).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Customer ID is required',
      });
    });
  
    it('should return receipt for a given order id', async () => {
      const receiptRows = [
        {
          order_id: 1,
          order_code: 'ORD-001',
          email: 'a@test.com',
          customer_id: 3,
          customer_name: 'John Doe',
          order_total: 200,
          product_id: 5,
          product_name: 'Product A',
          price: 50,
          quantity: 2,
          subtotal: 100,
        },
      ];
  
      mockedPool.query.mockResolvedValueOnce({ rows: receiptRows });
  
      const req = mockRequest(undefined, undefined, undefined, { id: '1' });
      const res = mockResponse();
  
      await getReceipt(req, res);
  
      expect(mockedPool.query).toHaveBeenCalledTimes(1);
      expect(mockedPool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE o.id = $1'),
        ['1']
      );
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        orders: receiptRows,
      });
    });
  
    it('should return 500 if db query fails', async () => {
      mockedPool.query.mockRejectedValueOnce(new Error('DB error'));
  
      const req = mockRequest(undefined, undefined, undefined, { id: '1' });
      const res = mockResponse();
  
      await getReceipt(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Something went wrong',
      });
    });
  });
    
  describe('getFrontReceipt (unit)', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return front receipts successfully', async () => {
      const frontReceipts = [
        {
          order_id: 1,
          order_code: 'ORD-001',
          email: 'a@test.com',
          customer_name: 'John Doe',
          order_total: 200,
          created_at: '2024-01-01',
          subtotal_sum: 200,
          items: [
            {
              product_id: 5,
              product_name: 'Product A',
              price: 50,
              quantity: 2,
              subtotal: 100,
            },
            {
              product_id: 6,
              product_name: 'Product B',
              price: 100,
              quantity: 1,
              subtotal: 100,
            },
          ],
        },
      ];
  
      mockedPool.query.mockResolvedValueOnce({ rows: frontReceipts });
  
      const req = mockRequest();
      const res = mockResponse();
  
      await getFrontReceipt(req, res);
  
      expect(mockedPool.query).toHaveBeenCalledTimes(1);
  
      // Avoid brittle SQL string comparison
      expect(mockedPool.query).toHaveBeenCalledWith(
        expect.stringContaining('FROM orders o')
      );
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        orders: frontReceipts,
      });
    });
  
    it('should return 500 if db query fails', async () => {
      mockedPool.query.mockRejectedValueOnce(new Error('DB error'));
  
      const req = mockRequest();
      const res = mockResponse();
  
      await getFrontReceipt(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Something went wrong',
      });
    });
  });
describe('getSingleUserReceipt (unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if customer id param is missing', async () => {
    const req = mockRequest(); // no params
    const res = mockResponse();

    await getSingleUserReceipt(req, res);

    expect(mockedPool.query).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Customer ID is required',
    });
  });

  it('should return receipts for a single customer', async () => {
    const receiptRows = [
      {
        order_id: 1,
        order_code: 'ORD-001',
        email: 'a@test.com',
        customer_name: 'John Doe',
        order_total: 200,
        created_at: '2024-01-01',
        subtotal_sum: 200,
        items: [
          {
            product_id: 5,
            product_name: 'Product A',
            price: 50,
            quantity: 2,
            subtotal: 100,
          },
        ],
      },
    ];

    mockedPool.query.mockResolvedValueOnce({ rows: receiptRows });

    const req = mockRequest(undefined, undefined, undefined, { id: '3' });
    const res = mockResponse();

    await getSingleUserReceipt(req, res);

    expect(mockedPool.query).toHaveBeenCalledTimes(1);
    expect(mockedPool.query).toHaveBeenCalledWith(
      expect.stringContaining('WHERE o.customer_id = $1'),
      ['3']
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      orders: receiptRows,
    });
  });

  it('should return 500 if db query fails', async () => {
    mockedPool.query.mockRejectedValueOnce(new Error('DB error'));

    const req = mockRequest(undefined, undefined, undefined, { id: '3' });
    const res = mockResponse();

    await getSingleUserReceipt(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Something went wrong',
    });
  });
});

describe('downloadReceipt (unit)', () => {
  let client: MockedPgClient;

  beforeEach(() => {
    jest.clearAllMocks();

    client = createMockedPgClient();
    mockedPoolConnect.connect.mockResolvedValue(client);
  });

  it('should generate receipt PDF if order belongs to user', async () => {
    const orderRow = { id: 1, customer_id: 5, total: 200 };
    const itemsRows = [
      { product_name: 'Product A', quantity: 2, subtotal: 100 },
    ];

    client.query
      .mockResolvedValueOnce({ rows: [orderRow] }) // order check
      .mockResolvedValueOnce({ rows: itemsRows }); // order items

    const req = mockRequest(
      undefined,
      undefined,
      { id: 5 },           // req.user.id
      { id: '1' }          // order id
    );

    const res = {
      ...mockResponse(),
      on: jest.fn(),
    } as unknown as Response;

    await downloadReceipt(req, res);

    expect(client.query).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('FROM orders'),
      ['1', 5]
    );

    expect(client.query).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('FROM order_items'),
      ['1']
    );

    expect(generateReceiptPDF).toHaveBeenCalledWith(
      orderRow,
      itemsRows,
      res
    );

    expect(res.status).not.toHaveBeenCalledWith(404);
  });

  it('should return 404 if order does not belong to user', async () => {
    client.query.mockResolvedValueOnce({ rows: [] }); // no order

    const req = mockRequest(
      undefined,
      undefined,
      { id: 5 },
      { id: '99' }
    );

    const res = mockResponse();

    await downloadReceipt(req, res);

    expect(client.query).toHaveBeenCalledTimes(1);
    expect(generateReceiptPDF).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Order not found',
    });
  });

  it('should return 500 if db query fails', async () => {
    client.query.mockRejectedValueOnce(new Error('DB error'));

    const req = mockRequest(
      undefined,
      undefined,
      { id: 5 },
      { id: '1' }
    );

    const res = mockResponse();

    await downloadReceipt(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Failed to generate receipt',
    });
  });

  it('should always release the client', async () => {
    client.query.mockRejectedValueOnce(new Error('DB error'));

    const req = mockRequest(
      undefined,
      undefined,
      { id: 5 },
      { id: '1' }
    );

    const res = mockResponse();

    await downloadReceipt(req, res);

    expect(client.release).toHaveBeenCalled();
  });
});
