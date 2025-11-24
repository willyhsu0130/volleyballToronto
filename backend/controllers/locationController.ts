import { Request, Response, NextFunction } from "express";
import { getLocations, getLocation } from "../services/locationService.js";
import { sendSuccess } from "../utils/helpers.js";
import { AppError } from "../utils/classes.js";

// GET /locations
export const getLocationsList = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { q, nameOnly } = req.query;

    // ensure q is a string
    const queryString = typeof q === "string" ? q.trim() : undefined;
    const nameFlag = nameOnly === "true";

    const results = await getLocations({
      q: queryString,
      nameOnly: nameFlag,
    });

    sendSuccess(res, "Locations Retrieved", 200, results)
  } catch (error) {
    throw new AppError("Location not retreived", 404)
  }
};

// GET /locations/:communityCenterId
export const getLocationById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("Received request for community center");

    const locationId = req.params.communityCenterId?.trim();
    if (!locationId) {
      return res.status(400).json({ error: "Community Center ID is required" });
    }

    const result = await getLocation({ locationId: Number(locationId) });

    if (!result) {
      throw new AppError("Community Center not found", 404)
    }

    sendSuccess(res, "LocationById Retrived", 200, result)
  } catch (error) {
    console.error("Error fetching community center:", error);
    next(error);
  }
};