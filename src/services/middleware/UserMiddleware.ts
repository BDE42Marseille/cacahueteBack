import jwt from 'jsonwebtoken';
import { UserModel } from '../../models/index.js';
import type { Request, Response } from "express";


export const adminHandler = async(req: Request, res: Response, next: Function) => {
    try {
        if (res.locals.decoded?.admin)
            return next();

        return res.status(401).json({
            succes : false,
            error : "Unauthorized access",
        });
    } catch (err) {
        return res.status(500).json({
            succes : false,
            error : "Internal server error",
        });
    }
}

export const bearerTokenHandler = async(req: Request, res: Response, next: Function) => { 
    var token = req.headers['authorization'];

    try {
        if (!!token && token.startsWith('Bearer '))
            token = token.slice(7, token.length);

        if (!token)
            return res.status(401).json({
                succes : false,
                error : "Missing token",
        });
        const jwtSecret = process.env.JWT_SECRET as string;
        
        const decoded = jwt.verify(token, jwtSecret) as jwt.JwtPayload;

        const user = await UserModel
                            .findById(decoded._id)
                            .select({password: 0})
                            .lean();
        
        res.locals.decoded = user;
        return next();
    } catch (err) {
        if ((err as Error).message == "jwt expired")
            return res.status(401).json({
                succes : false,
                error : "Token expired",
            });
        if ((err as Error).message == "invalid signature")
            res.status(401).json({
                succes : false,
                error : "Invalid token",
            });
        console.error(`Bearer token handler : \n${err}\n`);
        return res.status(500).json({
            succes : false,
            error : "Internal server error",
        });
    }
};