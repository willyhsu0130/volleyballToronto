import express, { Express } from "express";
import cors from "cors";
import app from "./app.js";
import { connectDB } from "./services/db.js";

// Port type should always be number, so explicitly convert
const PORT: number = Number(process.env.PORT) || 4000;

// Ensure middleware is set on the main app (if not already in app.ts)
app.use(cors());
app.use(express.json());

const startServer = async (): Promise<void> => {
  try {
    const { dropResult } = await connectDB(); // Connect to MongoDB
    console.log("Database connected:", !!dropResult);

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error connecting to database:", err.message);
    } else {
      console.error("Unknown error connecting to database:", err);
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.warn(`Server running without DB connection on port ${PORT}`);
    });
  }
};

void startServer(); 