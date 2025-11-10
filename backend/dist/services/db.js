import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import { getTorontoData } from "./torontoData.js";
import { Location } from "../models/Location.js";
import { DropIn } from "../models/DropIns.js";
// Load environment variables
try {
    configDotenv();
}
catch (err) {
    console.error("Failed to load .env:", err);
}
// ---------- Database Connection ----------
export async function connectDB() {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri)
            throw new Error("Missing MONGO_URI in environment variables");
        await mongoose.connect(uri, { dbName: "toronto" });
        console.log("✅ MongoDB connected");
        return { dropResult: {} };
    }
    catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    }
}
// ---------- Merge Date and Time ----------
const dateDataMerge = ({ date, hour, minute }) => {
    if (!date) {
        console.error("Missing date:", { date, hour, minute });
        return null;
    }
    const baseDate = new Date(date);
    if (isNaN(baseDate.getTime())) {
        console.error("Invalid base date:", date);
        return null;
    }
    baseDate.setHours(hour ?? 0, minute ?? 0, 0, 0);
    return baseDate;
};
// ---------- Update DB from Toronto API ----------
export const updateFromToronto = async () => {
    console.log("updateFromToronto fired");
    const { APIdropResults, APIlocationResults } = await getTorontoData();
    if (!Array.isArray(APIdropResults) || !Array.isArray(APIlocationResults)) {
        console.error("No valid API data received");
        return;
    }
    // --- Update Locations ---
    const updateDBLocation = async () => {
        try {
            for (const loc of APIlocationResults) {
                await Location.updateOne({ LocationId: loc.LocationID }, {
                    $set: {
                        LocationId: loc.LocationID,
                        LocationName: loc.LocationName,
                        LocationType: loc.LocationType,
                        Accessibility: loc.Accessibility,
                        Intersection: loc.Intersection,
                        TTCInformation: loc.TTCInformation,
                        District: loc.District,
                        StreetNo: loc.StreetNo,
                        StreetNoSuffix: loc.StreetNoSuffix,
                        StreetName: loc.StreetName,
                        StreetType: loc.StreetType,
                        StreetDirection: loc.StreetDirection,
                        PostalCode: loc.PostalCode,
                        Description: loc.Description,
                    },
                }, { upsert: true });
            }
        }
        catch (err) {
            console.error("Error updating locations:", err);
            throw err;
        }
    };
    // --- Update DropIns ---
    const updateDBDropIn = async () => {
        try {
            for (const drop of APIdropResults) {
                const beginDate = dateDataMerge({
                    date: drop.FirstDate,
                    hour: drop.StartHour,
                    minute: drop.StartMinute,
                });
                const endDate = dateDataMerge({
                    date: drop.LastDate,
                    hour: drop.EndHour,
                    minute: drop.EndMinute,
                });
                const locationDoc = await Location.findOne({ LocationId: drop.LocationID });
                await DropIn.updateOne({ DropInId: drop.id }, {
                    $set: {
                        DropInId: drop.id,
                        LocationId: drop.LocationID,
                        LocationRef: locationDoc ? locationDoc._id : null,
                        CourseId: drop.CourseID,
                        CourseTitle: drop.CourseTitle,
                        Section: drop.Section,
                        AgeMin: drop.AgeMin,
                        AgeMax: drop.AgeMax,
                        BeginDate: beginDate,
                        EndDate: endDate,
                    },
                }, { upsert: true });
            }
        }
        catch (err) {
            console.error("Error updating drop-ins:", err);
            throw err;
        }
    };
    await updateDBLocation();
    console.log("✅ Locations updated");
    await updateDBDropIn();
    console.log("✅ Drop-ins updated");
    return "Successfully updated DB";
};
