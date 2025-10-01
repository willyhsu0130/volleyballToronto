// db.js is in charge of getting of pulling data from the toronto by importing the torontoData service 
// then it pushes the data into mongodb

import mongoose from "mongoose";
import { getTorontoData } from "./services/torontoData.js";
import { configDotenv } from "dotenv";
import { Location } from "./models/location.js";
import { DropIn } from "./models/DropIns.js";

configDotenv()

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
    const { APIdropResults, APIlocationResults } = await getTorontoData()
    // console.log(APIdropResults)
    // console.log(APIlocationResults)


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
                            DateRange: APIdropResult.DateRange,
                            StartHour: APIdropResult.StartHour,
                            StartMinute: APIdropResult.StartMinute,
                            EndHour: APIdropResult.EndHour,
                            EndMinute: APIdropResult.EndMinute,
                            FirstDate: APIdropResult.FirstDate,
                            LastDate: APIdropResult.LastDate,
                        }
                    },
                    { upsert: true }
                )
            }
        } catch (err) {
            return err
        }

    }

    const response1 = await updateDBLocation()
    const response2 = await updateDBDropIn()

    return "Succesfully Updated DB"
}


export const getSportFromDB = async ({
    sport,
    dateBegin,
    dateEnd,
    timeBegin,
    timeEnd,
    location
}) => {
    const filter = {};

    if (sport) filter.CourseTitle = sport;
    if (location) filter.LocationId = location;

    // Example date filter (if your DB stores FirstDate/LastDate as Date objects)
    if (dateBegin || dateEnd) {
        filter.FirstDate = {};
        if (dateBegin) filter.FirstDate.$gte = new Date(dateBegin);
        if (dateEnd) filter.FirstDate.$lte = new Date(dateEnd);
    }

    // Example time filter
    if (timeBegin) filter.StartHour = { $gte: Number(timeBegin) };
    if (timeEnd) filter.EndHour = { $lte: Number(timeEnd) };
    if (location) filter.LocationName = new RegExp(`^${location}$`, "i"); 

    console.log("Final filter:", filter);

    const results = await DropIn.find(filter)
        .populate(
            "LocationRef", "LocationName District StreetName StreetType"
        )


    return results;
};
// q is a string rn.

export const getLocations = async ({q, nameOnly}) => {
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