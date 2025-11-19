import jwt, { JwtPayload } from "jsonwebtoken";
import { configDotenv } from "dotenv";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/classes.js";

configDotenv();

/** Shape of the JWT payload */
export interface AuthPayload extends JwtPayload {
    userId: string;
    username: string;
    role: "user" | "admin";
}

/** Request type extended with `user` */
export interface AuthRequest extends Request {
    user?: AuthPayload;
}

/** Verify JWT and inject decoded user into req.user */
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log("VerifyToken called");

    const authHeader = req.headers.authorization;
    console.log("header", authHeader);

    // Missing Authorization header
    if (!authHeader) {
        throw new AppError("No token provided", 401);
    }

    const token = authHeader.split(" ")[1]; // "Bearer <token>"

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as AuthPayload;
        console.log("decoded", decoded)
        // Attach fully typed user to request
        req.user = decoded;

        next();
    } catch (err) {
        console.error("JWT verification failed:", err);
        return res.status(403).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};