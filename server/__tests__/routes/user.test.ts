import request from 'supertest';
import express from 'express';
import { signUpRouter } from '../../routes/user';
import { describe, it, expect, beforeEach, jest} from '@jest/globals'
import { loginController, logoutController, registerController } from '../../controller/user';
const app = express();

jest.mock('../../controller/user');


const mockedLoginController = loginController as jest.MockedFunction<typeof loginController>;
const mockedRegisterController = registerController as jest.MockedFunction<typeof registerController>;
const mockedLogoutController = logoutController as jest.MockedFunction<typeof logoutController>;

app.use(express.json());
app.use('/users', signUpRouter);

describe('User Routes', () => {
    describe('POST /users/login', () => {
      it('POST /users/login should return success message', async () => {
        mockedLoginController.mockImplementation(async (_req, res) => {
          return res.status(200).json({ success: true, message: "Login successful (from cache)" });
        });
      const res = await request(app)
        .post('/users/login')
        .send({email: "ringo@mail.com", password: "RingO123!"})
        .expect(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Login successful (from cache)");
        expect(mockedLoginController).toHaveBeenCalledTimes(1);
    });
  });
    describe('POST /users/register', () => {
      it('POST /users/register should return success message', async () => {
        mockedRegisterController.mockImplementation(async (_req, res) => {
          return res.status(201).json({ success: true, message: "User registered successfully!welcome Test User" });
        });
        const uniqueEmail = `test${Date.now()}@example.com`
        const res = await request(app)
          .post('/users/register')
          .send({ 
            name: 'Test',
            surname: 'User',
            email: uniqueEmail,
            password: 'TestPass123!',
            verifyPassword: 'TestPass123!'
          }).expect(201);
          
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("User registered successfully!welcome Test User");
      });
    });
    describe('Auth Router - logout', () => {
      let app: express.Express;
    
      beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/users', signUpRouter);
        jest.clearAllMocks();
       
      });
    
      it('should call logoutController and return its response', async () => {
        mockedLogoutController.mockImplementation(async (_req, res) => {
          return res.status(200).json({ success: true });
        });
    
        const res = await request(app)
          .post('/users/logout')
          .set('Cookie', ['token=valid.token']);
    
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ success: true });
    
        expect(mockedLogoutController).toHaveBeenCalledTimes(1);
      });
    });
   
}); 
