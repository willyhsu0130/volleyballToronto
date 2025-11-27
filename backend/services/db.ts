import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import { getTorontoData } from "./torontoData.js";
import { Location } from "../models/Location.js";
import { DropIn } from "../models/DropIns.js";

// Load environment variables
try {
  configDotenv();
} catch (err) {
  console.error("Failed to load .env:", err);
}

// ---------- Interfaces ----------
interface IAPILocationResult {
  LocationID: number;
  LocationName: string;
  LocationType?: string;
  Accessibility?: string;
  Intersection?: string;
  TTCInformation?: string;
  District?: string;
  StreetNo?: string;
  StreetNoSuffix?: string;
  StreetName?: string;
  StreetType?: string;
  StreetDirection?: string;
  PostalCode?: string;
  Description?: string;
}

interface IAPIDropResult {
  id: number;
  LocationID: number;
  CourseID: number;
  CourseTitle: string;
  Section?: string;
  AgeMin?: number;
  AgeMax?: number;
  FirstDate: string;
  LastDate: string;
  StartHour: number;
  StartMinute: number;
  EndHour: number;
  EndMinute: number;
}

interface IDateData {
  date: string | number | Date;
  hour?: number;
  minute?: number;
}

// ---------- Database Connection ----------
export async function connectDB(): Promise<{ dropResult: Record<string, never> }> {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("Missing MONGO_URI in environment variables");

    await mongoose.connect(uri, { dbName: "toronto" });
    console.log("MongoDB connected");

    return { dropResult: {} };
  } catch (err: any) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}

// ---------- Merge Date and Time ----------
export const dateDataMerge = ({ date, hour, minute }: {
    date: string
    hour: number | null
    minute: number | null

}) => {
    if (!date) return null
    if (hour == null) return null;

    if (minute == null) minute = 0;

    const [y, m, d] = date.split("-").map(Number);
    if (!y || !m || !d) return null;

    const hh = Number(hour);
    const mm = Number(minute);

    const torontoString = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(
        2,
        "0"
    )} ${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;

    const parsed = new Date(
        torontoString
    );
    return parsed

}

// ---------- Update DB from Toronto API ----------
export const updateFromToronto = async (): Promise<string | void> => {
  console.log("updateFromToronto fired");

  const { APIdropResults, APIlocationResults } = await getTorontoData();

  if (!Array.isArray(APIdropResults) || !Array.isArray(APIlocationResults)) {
    console.error("No valid API data received");
    return;
  }

  // --- Update Locations ---
  const updateDBLocation = async (): Promise<void> => {
    try {
      for (const loc of APIlocationResults as IAPILocationResult[]) {
        await Location.updateOne(
          { LocationId: loc.LocationID },
          {
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
          },
          { upsert: true }
        );
      }
    } catch (err) {
      console.error("Error updating locations:", err);
      throw err;
    }
  };

  // --- Update DropIns ---
  const updateDBDropIn = async (): Promise<void> => {
    try {
      for (let i = 0; i < APIdropResults.length; i++) {
        const drop = APIdropResults[i];
        console.log(`Updating drop-in ${i + 1} / ${APIdropResults.length}`);

        const beginDate = dateDataMerge({
          date: drop.FirstDate,
          hour: drop.StartHour,
          minute: drop.StartMinute || 0,
        });

        const endDate = dateDataMerge({
          date: drop.LastDate,
          hour: drop.EndHour,
          minute: drop.EndMinute || 0,
        });

        const locationDoc = await Location.findOne({ LocationId: drop.LocationID });

        await DropIn.updateOne(
          { DropInId: drop.id },
          {
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
          },
          { upsert: true }
        );
      }
    } catch (err) {
      console.error("Error updating drop-ins:", err);
      throw err;
    }
  };

  // await updateDBLocation();
  // console.log("✅ Locations updated");

  await updateDBDropIn();
  console.log("✅ Drop-ins updated");

  return "Successfully updated DB";
};