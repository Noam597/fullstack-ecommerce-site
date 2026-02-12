import jwt  from 'jsonwebtoken';
import type {JwtPayload} from 'jsonwebtoken'
import dotenv from 'dotenv'
import type { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';

dotenv.config();
interface User extends JwtPayload{
    id: number;
    name: string;
    surname: string;
    role: string;
    password: string;
    email: string;
}
declare global {
    namespace Express {
      interface Request {
        user?: User;
      }
    }
  }

export const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "token_secret";
export const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "refresh_token_secret";

type TokenPayload = { id: number } | User;

export const createToken = (user: TokenPayload) =>{
    const {password, ...safeUser} = user as User
    const accesToken = jwt.sign({id:safeUser.id}, accessTokenSecret, { expiresIn: "15m" });
   
    return accesToken
}
export const createRefreshToken = (user:User) =>{
  const {password, ...safeUser} = user
  const tokenId = randomUUID();
  const refreshToken = jwt.sign({sub:safeUser.id,tid: tokenId}, refreshTokenSecret);
 
  return { refreshToken, tokenId };
}

export const authToken = (req:Request, res:Response, next:NextFunction): void=>{

    let token = req.cookies?.A_Token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if(token == null){
        res.status(401).json({success:false, message:"Missing Token"})
        return
    }
    try{
      const decoded = jwt.verify(token, accessTokenSecret) as User;

      req.user = decoded;
      next()
    }catch(err){
       res.status(401).json({ success: false, message: "User is Not Authorized" });
        return
    }
    }

