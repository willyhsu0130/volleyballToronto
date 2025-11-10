import express from "express";
import {
    getDropIns,
    getDropInById
}
    from "../controllers/dropInController.ts";

const router = express.Router();

router.get("/", getDropIns);
router.get("/:dropInId", getDropInById);

export default router;