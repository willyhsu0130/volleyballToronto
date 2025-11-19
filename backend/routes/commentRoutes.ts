import express from "express";
import { getCommentsByDropIn, postComment, postCommentLike } from "../controllers/commentController.js";
import { verifyToken } from "../middleware/authMiddleware.js"

const router = express.Router();

// GET /comments/:dropInId
router.get("/:dropInId", getCommentsByDropIn);

// POST /comments
router.post("/", verifyToken, postComment);

router.post("/:commentId", verifyToken, postCommentLike);

export default router;