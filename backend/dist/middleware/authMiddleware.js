import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
try {
    configDotenv();
}
catch (err) {
    console.error("Failed to load .env:", err);
}
export const verifyToken = (req, res, next) => {
    console.log("VerifyToken called");
    const authHeader = req.headers.authorization;
    console.log("header", authHeader);
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1]; // "Bearer <token>"
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // attach user info to request
        next(); // continue to the route
    }
    catch (err) {
        if (err instanceof Error) {
            console.error("JWT verification failed:", err.message);
        }
        else {
            console.error("JWT verification failed:", err);
        }
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
