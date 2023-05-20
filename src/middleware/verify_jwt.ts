import { NextFunction, Request, Response } from "express";

import jwt, { VerifyErrors } from 'jsonwebtoken';


export interface AuthRequest extends Request {
    userId: string;
}

// Middleware function to verify the JWT token
export function tokenMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    let jwt_secret_key = process.env.ACCESS_SECRET_KEY as string;
    // console.log(token)

    if (!token) {
        return res.status(401).send({ message: 'No token provided', verified: false });
    }
    else {
        jwt.verify(token, jwt_secret_key, (err, user) => {
            if (err) {
                return res.status(403).send({ message: 'Failed to authenticate token', verified: false });
            }
            // return res.send({ message: "verification completed", verified: true })
            if (user) {
                res.locals.user = user;
                // console.log(user)
                next();
            }

        })
    }
}