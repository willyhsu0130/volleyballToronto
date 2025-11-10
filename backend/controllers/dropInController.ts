import { Request, Response, NextFunction } from "express";
import { getSportFromDB, getDropInById as DBgetDropInById } from "../services/dropInService";

// Utility: escape special characters (useful for string filters)
const escapeRegex = (str: string): string => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getDropIns = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { sports, beginDate, endDate, locationId, age } = req.query;

    // --- sports ---
    let sportsArray: string[] = [];
    if (typeof sports === "string" && sports.trim().length > 0) {
      sportsArray = sports.split(",").map((s) => s.trim()).filter(Boolean);
    }

    // --- dates ---
    let parsedBeginDate: Date | null = null;
    let parsedEndDate: Date | null = null;

    if (beginDate) {
      const d = new Date(beginDate as string);
      if (isNaN(d.getTime())) {
        res.status(400).json({ error: "Invalid beginDate" });
        return;
      }
      parsedBeginDate = d;
    }

    if (endDate) {
      const d = new Date(endDate as string);
      if (isNaN(d.getTime())) {
        res.status(400).json({ error: "Invalid endDate" });
        return;
      }
      parsedEndDate = d;
    }

    // --- age ---
    let parsedAge: number | null = null;
    if (age) {
      const num = Number(age);
      if (isNaN(num)) {
        res.status(400).json({ error: "Age must be a number" });
        return;
      }
      parsedAge = num;
    }

    // --- location ---
    let safeLocation: number | null = null;
    if (locationId) {
      const parsedLocationId = Number(locationId);
      if (isNaN(parsedLocationId)) {
        res.status(400).json({ error: "Location ID must be a number" });
        return;
      }
      safeLocation = parsedLocationId;
    }

    // --- Query DB ---
    const results = await getSportFromDB({
      sports: sportsArray,
      beginDate: parsedBeginDate,
      endDate: parsedEndDate,
      locationId: safeLocation,
      age: parsedAge,
    });

    res.status(200).json(results);
  } catch (err) {
    console.error("Error in getDropIns controller:", err);
    next(err);
  }
};

// ---------------------------

export const getDropInById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { dropInId } = req.params;

    const idNum = Number(dropInId);
    if (!dropInId || isNaN(idNum)) {
      res.status(400).json({ error: "Valid DropIn ID is required" });
      return;
    }

    const dropInResults = await DBgetDropInById({ dropInId: idNum });

    if (!dropInResults) {
      res.status(404).json({ error: "DropIn not found" });
      return;
    }

    res.status(200).json(dropInResults);
  } catch (error) {
    console.error("Error fetching drop-in:", error);
    next(error);
  }
};