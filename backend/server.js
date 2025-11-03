import express from "express";
import cors from "cors";
import {
  connectDB,
  getSportFromDB,
  getLocations,
  getLocation,
  getDropInById,
  updateComment
} from "./db.js";

const app = express();
const PORT = process.env.PORT || 4000;
const { dropResult } = await connectDB();

app.use(cors());
app.use(express.json()); // <-- THIS IS REQUIRED

app.get("/", (req, res) => {
  return res.status(200).json([])
});

app.listen(PORT, () => {
  console.log(`Server running at https://localhost:${PORT}`);
});

app.get("/times", async (req, res) => {
  try {
    const { sports, beginDate, endDate, locationId, age } = req.query;
    console.log(sports, beginDate, endDate, locationId, age)

    let sportsArray = []

    // Turn sports into sports Array
    if (typeof sports === "string" && sports.trim().length > 0) {
      sportsArray = sports
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }
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

    const results = await getSportFromDB({
      sports: sportsArray,
      beginDate: parsedBeginDate,
      endDate: parsedEndDate,
      locationId: safeLocation,
      age: age
    });

    res.json(results)

  } catch (err) {
    console.error("Error in /times route:", err);
    res.status(500).json({ error: "Internal server error" });
  }
})

app.get("/times/:dropInId", async (req, res) => {
  try {
    const { dropInId } = req.params;

    if (!dropInId) {
      return res.status(400).json({ error: "Drop In ID is required" });
    }

    const results = await getDropInById({ dropInId });

    if (!results) {
      return res.status(404).json({ error: "Drop In not found" });
    }

    console.log("getDropInById result:", results);
    return res.json(results);

  } catch (error) {
    console.error("Error fetching drop-in:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
})


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


app.post("/comments", async (req, res) => {
  console.log("Comments endpoint received")
  console.log(req.body)
  const { Content, DropInId, UserId } = req.body
  console.log("Received comment:", Content, "for dropIn:", DropInId, "userId", UserId,);
  const response = await updateComment({ Content, DropInId, UserId })
  res.json({ success: true, message: "Comment received!" });
})