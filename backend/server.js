import express from "express";
import cors from "cors";
import {
  connectDB,
  getSportFromDB,
  getLocations,
  getLocation
} from "./db.js";

const app = express();
const PORT = process.env.PORT || 4000;
const { dropResult } = await connectDB();

app.use(cors());

app.get("/", (req, res) => {
  console.log("warming up")
  return res.status(200).json([])
});

app.listen(PORT, () => {
  console.log(`Server running at https://localhost:${PORT}`);
});

app.get("/times", async (req, res) =>{
  return res.status(200).json([])
})


app.get("/times/:sports", async (req, res) => {
  try {
    // Turn to array
    const sports = req.params.sports
    
    if (!sports || typeof sports !== "string") {
      return res.status(400).json({ error: "Invalid sports parameter" });
    }

    const sportsArray = sports.split(",")                     // split by comma
      .map((s) => s.trim())            // remove spaces
      .filter((s) => s.length > 0);

    console.log(sportsArray)
    const { beginDate, endDate, locationId, age } = req.query;


    // -------- Validation & Sanitization --------


    let parsedBeginDate = null;
    let parsedEndDate = null;

    if (beginDate) {
      const d = new Date(beginDate);
      if (isNaN(d.getTime())) {
        return res.status(400).json({ error: "Invalid beginDate" });
      }
      parsedBeginDate = d.toISOString(); // sanitize
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
      const parsedLocationId = Number(locationId)
      if (isNaN(parsedLocationId)) {
        return res.status(400).json({ error: "Age must be a number" });
      }
      // trim & escape regex special chars to avoid ReDoS injection
      safeLocation = locationId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    // -------- Query DB --------
    const results = await getSportFromDB({
      sports: sportsArray,
      beginDate: parsedBeginDate,
      endDate: parsedEndDate,
      locationId: safeLocation,
      age: age
    });

    res.json(results);

  } catch (err) {
    console.error("Error in /times route:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/locations", async (req, res) => {

  const { q, nameOnly } = req.query
  const results = await getLocations(
    {
      q: q,
      name: nameOnly === "true"
    }
  )
  res.json(results)
})

app.get("/locations/:communityCenterId", async (req, res) => {
  console.log("Received request for community center");

  try {
    const locationId = req.params.communityCenterId?.trim();

    // Find a single location by LocationId
    const result = await getLocation({
      locationId: locationId
    });

    if (!result) {
      return res.status(404).json({ error: "Community center not found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error fetching community center:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});