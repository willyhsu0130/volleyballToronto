import express from "express";
import { connectDB, updateFromToronto } from "./db.js";

const app = express();
const PORT = process.env.PORT || 5000;

await connectDB();
await updateFromToronto();

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("<h1>Welcome, Express + MongoDB is working! 🎉</h1>");
});