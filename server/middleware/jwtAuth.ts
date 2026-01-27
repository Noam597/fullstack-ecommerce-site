import jwt  from 'jsonwebtoken';
import type {JwtPayload} from 'jsonwebtoken'
import dotenv from 'dotenv'
import type { NextFunction, Request, Response } from 'express';

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

const secretToken = process.env.TOKEN_SECRET || "token_secret";


export const createToken = (user:User) =>{
    const {password, ...safeUser} = user
    const accesToken = jwt.sign(safeUser, secretToken);
    return accesToken
}


export const authToken = (req:Request, res:Response, next:NextFunction): void=>{

    let token = req.cookies?.token;

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
      const decoded = jwt.verify(token, secretToken) as User;

      req.user = decoded;
      next()
    }catch(err){
       res.status(403).json({ success: false, message: "User is Not Authorized" });
        return
    }
    }

