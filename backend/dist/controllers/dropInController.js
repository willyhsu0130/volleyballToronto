import { getSportFromDB, getDropInById as DBgetDropInById } from "../services/dropInService.js";
// Utility: escape special characters to prevent regex injection
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export const getDropIns = async (req, res, next) => {
    try {
        const { sports, beginDate, endDate, locationId, age } = req.query;
        let sportsArray = [];
        if (typeof sports === "string" && sports.trim().length > 0) {
            sportsArray = sports.split(",").map(s => s.trim()).filter(Boolean);
        }
        // -------- Validation --------
        let parsedBeginDate = null;
        let parsedEndDate = null;
        if (beginDate) {
            const d = new Date(beginDate);
            if (isNaN(d.getTime())) {
                return res.status(400).json({ error: "Invalid beginDate" });
            }
            parsedBeginDate = d.toISOString();
        }
        if (endDate) {
            const d = new Date(endDate);
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
        let safeLocation = null;
        if (locationId) {
            const parsedLocationId = Number(locationId);
            if (isNaN(parsedLocationId)) {
                return res.status(400).json({ error: "Location ID must be a number" });
            }
            safeLocation = escapeRegex(locationId);
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
    }
    catch (err) {
        console.error("Error in getTimes controller:", err);
        next(err); // pass error to global handler
    }
};
export const getDropInById = async (req, res, next) => {
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
    }
    catch (error) {
        console.error("Error fetching drop-in:", error);
        next(error); // Pass to global error handler
    }
};
