import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies?.accessToken;
    if(!token){
        const authHeader = req.headers.authorization;
        if(authHeader && authHeader.startsWith("Bearer ")){
            token = authHeader.split(" ")[1];
        }
    }
    if(!token){
        return res.status(401).json({
            success: false,
            message: "Unauthorized, No token is provided"
        })
    }
    try {
        const secret = process.env.JWT_SECRET || "secretkey"
        const decoded = jwt.verify(token, secret);
        (req as any).user = decoded
        next();
    }
    catch(err){
        res.status(403).json({
            success: false,
            message: "Invalid or expired token"
        })
    }
}