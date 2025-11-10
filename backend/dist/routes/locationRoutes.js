import express from "express";
import { getLocationsList, getLocationById } from "../controllers/locationController.ts";
const router = express.Router();
router.get("/", getLocationsList);
router.get("/:communityCenterId", getLocationById);
export default router;
