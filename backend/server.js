import express from "express";
import {
  connectDB,
  updateFromToronto,
  getSportFromDB,
  getLocations
} from "./db.js";

const app = express();
const PORT = process.env.PORT || 4000;
const { dropResult } = await connectDB();

// Function to update database
const updateDB = async () => {
  const updateFromTorontoResponse = await updateFromToronto();
  console.log(updateFromTorontoResponse)
}

updateDB()

app.get("/", (req, res) => {
  res.send("<h1>Welcome, Express + MongoDB is working! </h1>");
});

app.listen(PORT, () => {
  console.log(`Server running at https://localhost:${PORT}`);
});

app.get("/times/:sport", async (req, res) => {
  try {
    const sport = req.params.sport?.trim();
    const { beginDate, endDate, location } = req.query;

    // -------- Validation & Sanitization --------
    if (!sport || typeof sport !== "string") {
      return res.status(400).json({ error: "Invalid sport parameter" });
    }

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

    let safeLocation = null;
    if (location) {
      if (typeof location !== "string") {
        return res.status(400).json({ error: "Invalid location" });
      }
      // trim & escape regex special chars to avoid ReDoS injection
      safeLocation = location.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    // -------- Query DB --------
    const results = await getSportFromDB({
      sport,
      beginDate: parsedBeginDate,
      endDate: parsedEndDate,
      location: safeLocation,
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