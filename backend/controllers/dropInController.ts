import { Request, Response, NextFunction } from "express";
import validator from "validator";
import { getSportFromDB, getDropInById as DBgetDropInById } from "../services/dropInService.js";

// Utility: escape special characters to prevent regex injection
const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getDropIns = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { sports, beginDate, endDate, locationId, age } = req.query;

        let sportsArray: string[] = [];
        if (typeof sports === "string" && sports.trim().length > 0) {
            sportsArray = sports.split(",").map(s => s.trim()).filter(Boolean);
        }

        // -------- Validation --------
        let parsedBeginDate: string | null = null;
        let parsedEndDate: string | null = null;

        if (beginDate) {
            const d = new Date(beginDate as string);
            if (isNaN(d.getTime())) {
                return res.status(400).json({ error: "Invalid beginDate" });
            }
            parsedBeginDate = d.toISOString();
        }

        if (endDate) {
            const d = new Date(endDate as string);
            if (isNaN(d.getTime())) {
                return res.status(400).json({ error: "Invalid endDate" });
            }
            parsedEndDate = d.toISOString();
        }

        if (age) {
            const parsedAge = Number(age);
            if (isNaN(parsedAge)) {
                return res.status(400).json({ error: "Age must be a number" });
            }
        }

        let safeLocation: string | null = null;
        if (locationId) {
            const parsedLocationId = Number(locationId);
            if (isNaN(parsedLocationId)) {
                return res.status(400).json({ error: "Location ID must be a number" });
            }
            safeLocation = escapeRegex(locationId as string);
        }

        // -------- Database call --------
        const results = await getSportFromDB({
            sports: sportsArray,
            beginDate: parsedBeginDate,
            endDate: parsedEndDate,
            locationId: safeLocation,
            age
        });

        return res.status(200).json(results);
    } catch (err) {
        console.error("Error in getTimes controller:", err);
        next(err); // pass error to global handler
    }
};

export const getDropInById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { dropInId } = req.params;

        if (!dropInId) {
            return res.status(400).json({ error: "Drop In ID is required" });
        }

        const dropInResults = await DBgetDropInById({ dropInId });

        if (!dropInResults) {
            return res.status(404).json({ error: "Drop In not found" });
        }

        return res.status(200).json(dropInResults);
    } catch (error) {
        console.error("Error fetching drop-in:", error);
        next(error); // Pass to global error handler
    }
};