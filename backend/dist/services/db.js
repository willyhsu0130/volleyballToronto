// db.js is in charge of getting of pulling data from the toronto by importing the torontoData service 
// then it pushes the data into mongodb
import mongoose from "mongoose";
import { getTorontoData } from "./torontoData.js";
import { configDotenv } from "dotenv";
try {
    configDotenv();
}
catch (err) {
    console.log(err);
}
export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "toronto",
        });
        console.log("MongoDB connected");
        // Fetch data from the database
        const dropResult = {};
        // Return the object needed 
        return { dropResult: dropResult };
    }
    catch (err) {
        console.error("MongoDB connection error:", err.message);
        process.exit(1); // stop the server if DB can't connect
    }
}
export const updateFromToronto = async () => {
    console.log("updateFromToronto fired");
    const { APIdropResults, APIlocationResults } = await getTorontoData();
    // Check if we got a result
    if (!Array.isArray(APIlocationResults) || !Array.isArray(APIdropResults)) {
        console.error("No location data received");
        return;
    }
    const updateDBLocation = async () => {
        try {
            for (const APIlocationResult of APIlocationResults) {
                const response = await Location.updateOne({ LocationId: APIlocationResult.LocationID }, {
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
                }, { upsert: true });
            }
        }
        catch (err) {
            console.log(err);
            return (err);
        }
    };
    const updateDBDropIn = async () => {
        try {
            for (const APIdropResult of APIdropResults) {
                // Use a start date and time object instead of hours
                const { FirstDate, StartHour, StartMinute, LastDate, EndHour, EndMinute } = APIdropResult;
                const beginDate = dateDataMerge({
                    date: FirstDate,
                    hour: StartHour,
                    minute: StartMinute
                });
                const endDate = dateDataMerge({
                    date: LastDate,
                    hour: EndHour,
                    minute: EndMinute
                });
                const locationDoc = await Location.findOne({ LocationId: APIdropResult.LocationID });
                const response = await DropIn.updateOne({ DropInId: APIdropResult.id }, {
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
                }, { upsert: true });
            }
        }
        catch (err) {
            console.log(err);
            return err;
        }
    };
    const response1 = await updateDBLocation();
    console.log("updateLocation response: ", response1);
    const response2 = await updateDBDropIn();
    console.log("updateDropIn response: ", response2);
    return "Succesfully Updated DB";
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
