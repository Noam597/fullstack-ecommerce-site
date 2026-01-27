import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';
import { requireAdmin } from '../../middleware/adminAuth';

const mockResponse = (): Response => {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;
};

describe('requireAdmin middleware', () => {
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    res = mockResponse();
    next = jest.fn();
  });

  it('should return 401 if user is not authenticated', () => {
    const req = {
      user: undefined,
    } as unknown as Request;

    requireAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'User not authenticated',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if user is not an admin', () => {
    const req = {
      user: { role: 'buyer' },
    } as unknown as Request;

    requireAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Admin access required',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if user is admin', () => {
    const req = {
      user: { role: 'admin' },
    } as unknown as Request;

    requireAdmin(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
