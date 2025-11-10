import express from "express";
import cors from "cors";
import app from "./app.ts";
import { connectDB, } from "./services/db.js";
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());
const startServer = async () => {
    try {
        const { dropResult } = await connectDB(); // your DB connection
        console.log("Database connected:", !!dropResult);
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    }
    catch (err) {
        console.error("Error connecting to database:", err);
        // Even if DB fails, keep the server alive to avoid Render timeout
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running without DB connection on port ${PORT}`);
        });
    }
};
startServer();
