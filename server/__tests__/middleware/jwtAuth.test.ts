import type { Request, Response, NextFunction } from "express";
import { jest, describe, it, expect, beforeEach} from '@jest/globals';
import jwt from 'jsonwebtoken';
import { createToken , authToken} from '../../middleware/jwtAuth.ts';

// Mock jsonwebtoken
jest.mock('jsonwebtoken');
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

process.env.TOKEN_SECRET = 'token_secret';

jest.mock('dotenv', () => ({
  config: jest.fn()
}));

describe("testing JSON web token",()=>{
    beforeEach(() => {
          jest.clearAllMocks();    
        });
    describe('Creating JSON web token', () => {
        
            it("creating a JWT without password field",()=>{
                const mockUser ={
                    id: 1,
                    name:"John",
                    surname: "Smith",
                    role:"admin",
                    email:"john.smith@mail.com",
                    password:"johnsmith123"
                }

                const userPayload = {
                    id: 1,
                    name:"John",
                    surname: "Smith",
                    role:"admin",
                    email:"john.smith@mail.com"
                }

                mockedJwt.sign.mockReturnValue("json.test.token" as any);

                const token = createToken(mockUser as any);
                expect(mockedJwt.sign).toHaveBeenCalledTimes(1)
                expect(mockedJwt.sign).toHaveBeenCalledWith(userPayload,'token_secret');
                expect(token).toBe("json.test.token");


    })
})
    describe("Authenticating Token middleware",()=>{
        let req: Partial<Request>
        let res: Partial<Response>;
        let next: NextFunction;

        beforeEach(()=>{
          jest.clearAllMocks(); 
          req = { headers: {}};
          res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          } as Partial<Response>;;
          next = jest.fn();
        })
        
        
        it("returns 401 when Auth header is missing",()=>{
            authToken(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: "Missing Token"});
            expect(next).not.toHaveBeenCalled();
        })

        it("returns 403 when token is invalid", () => {
            req.headers = { authorization: "Bearer bad.token" };
            // (mockedJwt.verify as jest.Mock).mockImplementation((_t , _s, cb : any) =>{
            //     cb(new Error('Invalid'))
            // })
            (mockedJwt.verify as jest.Mock).mockImplementation(() => {
                throw new Error("Invalid");
              });
            authToken(req as Request, res as Response, next);

            expect(mockedJwt.verify).toHaveBeenCalledWith(
                'bad.token',
                'token_secret',
                // expect.any(Function)
            );

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: "User is Not Authorized"});
            expect(next).not.toHaveBeenCalled();
        })
        it("calls next and decodes valid user token",()=>{
            req.headers = { authorization: "Bearer good.token" };
            const decoded = {id:1 , name:"John" };
            // (mockedJwt.verify as jest.Mock).mockImplementation((_t , _s, cb : any) =>{
            //     cb(null, decoded)
            // })
            (mockedJwt.verify as jest.Mock).mockReturnValue(decoded);


            authToken(req as Request, res as Response, next);

            expect(mockedJwt.verify).toHaveBeenCalledWith(
                "good.token",
                "token_secret",
                // expect.any(Function)
            );

            expect(req.user).toEqual(decoded);
            expect(next).toHaveBeenCalledTimes(1);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalledWith();
        })





        })
    })
