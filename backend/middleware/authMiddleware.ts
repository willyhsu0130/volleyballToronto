import jwt, { JwtPayload } from "jsonwebtoken";
import { configDotenv } from "dotenv";

import { Request, Response, NextFunction } from "express";

try {
    configDotenv();
} catch (err) {
    console.error("Failed to load .env:", err);
}

interface AuthRequest extends Request {
    user?: string | JwtPayload;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log("VerifyToken called")
    const authHeader = req.headers.authorization;
    console.log("header", authHeader)

    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // "Bearer <token>"

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded; // attach user info to request
        next(); // continue to the route
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error("JWT verification failed:", err.message);
        } else {
            console.error("JWT verification failed:", err);
        }
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};