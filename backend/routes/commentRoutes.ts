import express from "express";
import { getCommentsByDropIn, postComment } from "../controllers/commentController.js";

const router = express.Router();

// GET /comments/:dropInId
router.get("/:dropInId", getCommentsByDropIn);

// POST /comments
router.post("/", postComment);

export default router;