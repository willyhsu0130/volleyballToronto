import express from "express";
import cors from "cors";
import dropInRoutes from "./routes/dropInRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
const app = express();
app.use(cors());
app.use(express.json());
// Default route
app.get("/", (req, res) => {
    return res.status(200).json({ message: "🏐 DropInToronto API running!" });
});
// Mount routes
app.use("/dropIns", dropInRoutes);
app.use("/locations", locationRoutes);
app.use("/auth", authRoutes);
app.use("/comments", commentRoutes);
app.use("/profile", profileRoutes);
app.use(errorHandler);
export default app;
