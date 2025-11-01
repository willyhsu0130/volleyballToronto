// db.js is in charge of getting of pulling data from the toronto by importing the torontoData service 
// then it pushes the data into mongodb

import mongoose from "mongoose";
import { getTorontoData } from "./services/torontoData.js";
import { configDotenv } from "dotenv";
import { Location } from "./models/Location.js";
import { DropIn } from "./models/DropIns.js";

try {
    configDotenv()
} catch (err) {
    console.log(err)
}


export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "toronto",
        });
        console.log("MongoDB connected");
        // Fetch data from the database

        const dropResult = {}
        // Return the object needed 
        return { dropResult: dropResult }

    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        process.exit(1); // stop the server if DB can't connect
    }
}

export const updateFromToronto = async () => {
    console.log("updateFromToronto fired")
    const { APIdropResults, APIlocationResults } = await getTorontoData()

    // Check if we got a result
    if (!Array.isArray(APIlocationResults) || !Array.isArray(APIdropResults)) {
        console.error("No location data received");
        return;
    }

    const updateDBLocation = async () => {
        try {
            for (const APIlocationResult of APIlocationResults) {
                const response = await Location.updateOne(
                    { LocationId: APIlocationResult.LocationID },
                    {
                        $set: {
                            LocationId: APIlocationResult.LocationID,
                            LocationName: APIlocationResult.LocationName,
                            LocationType: APIlocationResult.LocationType,
                            Accessibility: APIlocationResult.Accessibility,
                            Intersection: APIlocationResult.Intersection,
                            TTCInformation: APIlocationResult.TTCInformation,
                            District: APIlocationResult.District,
                            StreetNo: APIlocationResult.StreetNo,
                            StreetNoSuffix: APIlocationResult.StreetNoSuffix,
                            StreetName: APIlocationResult.StreetName,
                            StreetType: APIlocationResult.StreetType,
                            StreetDirection: APIlocationResult.StreetDirection,
                            PostalCode: APIlocationResult.PostalCode,
                            Description: APIlocationResult.Description,
                        }
                    },
                    { upsert: true }

                )
                console.log(response)
            }
        } catch (err) {
            return (err)
        }

    }

    const updateDBDropIn = async () => {
        try {
            for (const APIdropResult of APIdropResults) {
                // Use a start date and time object instead of hours
                const { FirstDate, StartHour, StartMinute, LastDate, EndHour, EndMinute } = APIdropResult

                const beginDate = dateDataMerge({
                    date: FirstDate,
                    hour: StartHour,
                    minute: StartMinute
                })
                const endDate = dateDataMerge({
                    date: LastDate,
                    hour: EndHour,
                    minute: EndMinute
                })


                const locationDoc = await Location.findOne({ LocationId: APIdropResult.LocationID })
                const response = await DropIn.updateOne(
                    { DropInId: APIdropResult.id },
                    {
                        $set: {
                            DropInId: APIdropResult.id,
                            LocationId: APIdropResult.LocationID,
                            LocationRef: locationDoc ? locationDoc._id : null,
                            CourseId: APIdropResult.CourseID,
                            CourseTitle: APIdropResult.CourseTitle,
                            Section: APIdropResult.Section,
                            AgeMin: APIdropResult.AgeMin,
                            AgeMax: APIdropResult.AgeMax,
                            BeginDate: beginDate,
                            EndDate: endDate
                        }
                    },
                    { upsert: true }
                )
                console.log(response)
            }

        } catch (err) {
            console.log(err)
            return err
        }
    }

    const response1 = await updateDBLocation()
    console.log("updateLocation response: ", response1)
    const response2 = await updateDBDropIn()
    console.log("updateDropIn response: ", response2)
    return "Succesfully Updated DB"
}


export const getSportFromDB = async ({
    sports,
    beginDate,
    endDate,
    locationId,
    age
}) => {
    console.log("getSport from DB")
    const filter = {};

    if (Array.isArray(sports) && sports.length > 0) {
        filter.CourseTitle = { $in: sports };
    } else if (typeof sports === "string" && sports.trim() !== "") {
        filter.CourseTitle = sports.trim();
    }

    // Location filter (by name, case-insensitive)
    if (locationId) {
        filter.LocationId = locationId
    }

    // Date filter
    if (beginDate || endDate) {
        filter.BeginDate = {};
        if (beginDate) filter.BeginDate.$gte = new Date(beginDate);
        if (endDate) filter.BeginDate.$lte = new Date(endDate);
    }

    // Age filter

    if (age) {
        filter.$and = [
            { AgeMin: { $lte: age } },
            {
                $or: [
                    { AgeMax: { $gte: age } },
                    { AgeMax: { $exists: false } },
                    { AgeMax: null },
                ],
            },
        ];
    }

    console.log("Final filter:", filter);

    const results = await DropIn.find(filter)
        .populate("LocationRef", "LocationName District StreetName StreetType")
        .sort({ BeginDate: 1 });

    console.log(results)
    return results;
};
// q is a string rn.

export const getLocations = async ({ q, nameOnly }) => {
    // Build filter object
    const filter = q
        ? { LocationName: { $regex: q, $options: "i" } } // case-insensitive search
        : {};

    // Base query
    let query = Location.find(filter);

    // If we only want name + id
    if (nameOnly) {
        query = query.select("LocationName _id");
        // Or "LocationName LocationId" if you have your own LocationId field
    }

    // Limit results to avoid returning all 35k
    const results = await query.limit(50).lean();
    return results;
};


export const getLocation = async ({ locationId }) => {
    // Build filter object

    let results = Location.findOne(
        { LocationId: locationId }
    );
    return results;
};

const dateDataMerge = ({ date, hour, minute }) => {
    if (!date) {
        console.error("Missing date:", { date, hour, minute });
        return null;
    }

    const returnDate = new Date(date);

    if (isNaN(returnDate.getTime())) {
        console.error("Invalid base date:", date);
        return null;
    }

    returnDate.setHours(hour ?? 0, minute ?? 0, 0, 0);
    return returnDate;
};