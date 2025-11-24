import { Request, Response, NextFunction } from "express";
import { getLocations, getLocation } from "../services/locationService.js";
import { sendSuccess } from "../utils/helpers.js";

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
    console.error("Error fetching locations list:", error);
    next(error);
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
      return res.status(404).json({ error: "Community center not found" });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching community center:", error);
    next(error);
  }
};