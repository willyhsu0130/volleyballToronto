import { getSportFromDB, getDropInById as DBgetDropInById } from "../services/dropInService.js";
import { AppError } from "../utils/classes.js";
import { sendSuccess } from "../utils/helpers.js";
// Utility: escape special characters (useful for string filters)
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export const getDropIns = async (req, res, next) => {
    try {
        const { sports, beginDate, endDate, locationId, age } = req.query;
        // --- sports ---
        let sportsArray = [];
        if (typeof sports === "string" && sports.trim().length > 0) {
            sportsArray = sports.split(",").map((s) => s.trim()).filter(Boolean);
        }
        // --- dates ---
        let parsedBeginDate = null;
        let parsedEndDate = null;
        if (beginDate) {
            const d = new Date(beginDate);
            if (isNaN(d.getTime()))
                new AppError("Invalid beginDate", 400);
            parsedBeginDate = d;
        }
        if (endDate) {
            const d = new Date(endDate);
            if (isNaN(d.getTime()))
                new AppError("Invalid endDate", 400);
            parsedEndDate = d;
        }
        // --- age ---
        let parsedAge = null;
        if (age) {
            const num = Number(age);
            if (isNaN(num))
                new AppError("Age must be a number", 400);
            parsedAge = num;
        }
        // --- location ---
        let safeLocation = null;
        if (locationId) {
            const parsedLocationId = Number(locationId);
            if (isNaN(parsedLocationId))
                new AppError("LocationId must be a number", 400);
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
        sendSuccess(res, "DropIns Fetched", 200, results);
    }
    catch (err) {
        next(err);
    }
};
// ---------------------------
export const getDropInById = async (req, res, next) => {
    const { dropInId } = req.params;
    const idNum = Number(dropInId);
    if (!dropInId || isNaN(idNum))
        throw new AppError("DropInId not valid", 400);
    const dropInResults = await DBgetDropInById({ dropInId: idNum });
    if (!dropInResults)
        throw new AppError("DropIn not found", 404);
    sendSuccess(res, "DropIn Found", 203, dropInResults);
};
