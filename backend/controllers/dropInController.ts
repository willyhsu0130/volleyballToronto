import { Request, Response, NextFunction } from "express";
import { getSportFromDB, getDropInById as DBgetDropInById } from "../services/dropInService.js";
import { AppError } from "../utils/classes.js";
import { sendSuccess } from "../utils/helpers.js";


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
      if (isNaN(d.getTime())) new AppError("Invalid beginDate", 400)
      parsedBeginDate = d;
    }

    if (endDate) {
      const d = new Date(endDate as string);
      if (isNaN(d.getTime())) new AppError("Invalid endDate", 400)
      parsedEndDate = d;
    }

    // --- age ---
    let parsedAge: number | null = null;
    if (age) {
      const num = Number(age);
      if (isNaN(num)) new AppError("Age must be a number", 400)
      parsedAge = num;
    }

    // --- location ---
    let safeLocation: number | null = null;
    if (locationId) {
      const parsedLocationId = Number(locationId);
      if (isNaN(parsedLocationId)) new AppError("LocationId must be a number", 400)
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
    sendSuccess(res, "DropIns Fetched", 200, results)
  } catch (err) {
    next(err);
  }
};

// ---------------------------

export const getDropInById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { dropInId } = req.params;
  const idNum = Number(dropInId);

  if (!dropInId || isNaN(idNum))
    throw new AppError("DropInId not valid", 400);

  const dropInResults = await DBgetDropInById({ dropInId: idNum });

  if (!dropInResults)
    throw new AppError("DropIn not found", 404);

  sendSuccess(res, "DropIn Found", 203, dropInResults);
};