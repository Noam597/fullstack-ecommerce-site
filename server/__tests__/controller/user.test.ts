// loginRegister.test.ts
import { jest, describe, it, expect, beforeEach} from '@jest/globals'
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';


// Mock dependencies
jest.mock('../../db', () => ({
  __esModule: true,              // <-- ensures Jest treats it as an ES module
  default: { query: jest.fn() }, // <-- mock the default export
}));

jest.mock('../../redis', () => ({
  connectRedisOnce: jest.fn(),
  redisClient: {
    del: jest.fn(),
  },
}));
import { loginController, logoutController, registerController } from '../../controller/user.js';
import  pool  from '../../db.js';
import * as redisModule from '../../redis.js';

const mockedConnectRedisOnce = redisModule.connectRedisOnce as jest.MockedFunction<typeof redisModule.connectRedisOnce>;

const mockedRedisClientDel = redisModule.redisClient.del as jest.MockedFunction<(key: string) => Promise<number>>;


jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

// ---- Logout controller dependencies ----
jest.mock('jsonwebtoken', () => ({
  decode: jest.fn(),
}));



import jwt from 'jsonwebtoken';

const mockResponse = (): Response => {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    clearCookie: jest.fn().mockReturnThis(),
  } as unknown as Response;
};
const mockRequest = (cookies?: Record<string, string>, body?: any): Request => {
  return {
    cookies: cookies || {},
    body: body || {},
  } as unknown as Request;
};
// --- Fake Validation Regex ---
(global as any).passwordCheck = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
(global as any).emailCheck = /^([a-zA-Z0-9\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,3})?$/i;




describe("loginController - input validation only", () => {

  it("should return 400 if email is missing", async () => {
    const req = { body: { password: "1234" } } as Request;
    const res = mockResponse();

    await loginController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "All fields are required",
    });
  });

  it("should return 400 if password is missing", async () => {
    const req = { body: { email: "test@example.com" } } as Request;
    const res = mockResponse();

    await loginController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "All fields are required",
    });
  });

  it("should return 400 if both email and password are missing", async () => {
    const req = { body: {} } as Request;
    const res = mockResponse();

    await loginController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "All fields are required",
    });
  });
});


describe('registerController (unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const baseReq = {
    name: 'John',
    surname: 'Doe',
    email: 'john@example.com',
    password: 'PassworD123!',
    verifyPassword: 'PassworD123!',
  };

  it('should return 400 if a field is missing', async () => {
    const req = { body: { ...baseReq, email: '' } } as Request;
    const res = mockResponse();

    await (pool.query as any).mockResolvedValue({ rows: [] });

    await registerController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'All fields are required',
    });
  });
it('should return 400 if password does not meet strength requirements', async () => {
    const req = {
      body: { ...baseReq, password: 'weakpass', verifyPassword: 'weakpass' },
    } as Request;
    const res = mockResponse();

    (pool.query as any).mockResolvedValue({ rows: [] });

    await registerController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message:
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character',
    });
  });

  it('should return 400 if email format is invalid', async () => {
    const req = { body: { ...baseReq, email: 'invalidemail' } } as Request;
    const res = mockResponse();

    (pool.query as any).mockResolvedValue({ rows: [] });

    await registerController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid email address',
    });
  });

it('should return 400 if passwords do not match', async () => {
    const req = { body: { ...baseReq, verifyPassword: 'WrongPass123!' } } as Request;
    const res = mockResponse();

    (pool.query as any).mockResolvedValue({ rows: [] });

    await registerController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Passwords do not match',
    });
  });
  
  it('should return 400 if user already exists', async () => {
    const req = { body: baseReq } as Request;
    const res = mockResponse();

    (pool.query as any).mockResolvedValue({ rows: [{ email: baseReq.email }] });

    await registerController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'User already exists',
    });
  });

  

  
  

  it('should return 201 if registration succeeds', async () => {
    const req = { body: baseReq } as Request;
    const res = mockResponse();

      (pool.query as any).mockResolvedValueOnce({ rows: [] }); // no existing user
      (bcrypt.hash as any).mockResolvedValue('hashedPassword');
    (pool.query as any).mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          name: 'John',
          surname: 'Doe',
          role: 'buyer',
          email: 'john@example.com',
          created_at: new Date(),
        },
      ],
    });

    await registerController(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: expect.stringContaining('User registered successfully'),
      })
    );
  });
});

describe('logoutController (unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedConnectRedisOnce.mockResolvedValue(undefined);

  // mock redisClient.del to succeed
    mockedRedisClientDel.mockResolvedValue(1);
  });

  it('should clear cookie, delete redis session, and return 200', async () => {
    const req = mockRequest({token: 'valid.token'}) 

    const res = {
      clearCookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    (jwt.decode as jest.Mock).mockReturnValue({
      email: 'john@example.com',
    });

    await logoutController(req, res);

    expect(mockedConnectRedisOnce).toHaveBeenCalledTimes(1);

    expect(jwt.decode).toHaveBeenCalledWith('valid.token');

    expect(mockedRedisClientDel).toHaveBeenCalledWith(
      'user:john@example.com'
    );

    expect(res.clearCookie).toHaveBeenCalledWith('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  it('should still succeed if no token is present', async () => {
    const req = mockRequest();
    const res = mockResponse();

    await logoutController(req, res);

    expect(jwt.decode).not.toHaveBeenCalled();
    expect(mockedRedisClientDel).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  it('should return 500 if redis connection fails', async () => {
    const req = mockRequest({token: 'valid.token'}) 

    const res = mockResponse();

    mockedConnectRedisOnce.mockRejectedValueOnce(
      new Error('Redis down')
    );
    await logoutController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false });
  });
});
