import { getLocations, getLocation } from "../services/locationService.js";
// GET /locations
export const getLocationsList = async (req, res, next) => {
    try {
        const { q, nameOnly } = req.query;
        const results = await getLocations({
            q,
            name: nameOnly === "true"
        });
        return res.status(200).json(results);
    }
    catch (error) {
        console.error("Error fetching locations list:", error);
        next(error); // send to global error handler
    }
};
// GET /locations/:communityCenterId
export const getLocationById = async (req, res, next) => {
    try {
        console.log("Received request for community center");
        const locationId = req.params.communityCenterId?.trim();
        if (!locationId) {
            return res.status(400).json({ error: "Community Center ID is required" });
        }
        const result = await getLocation({ locationId });
        if (!result) {
            return res.status(404).json({ error: "Community center not found" });
        }
        return res.status(200).json(result);
    }
    catch (error) {
        console.error("Error fetching community center:", error);
        next(error);
    }
};
