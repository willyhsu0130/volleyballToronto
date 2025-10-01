import express from "express";
import {
  connectDB,
  updateFromToronto,
  getSportFromDB
} from "./db.js";

const app = express();
const PORT = process.env.PORT || 3000;

const { dropResult } = await connectDB();

const updateFromTorontoResponse = await updateFromToronto();
console.log(updateFromTorontoResponse)

app.get("/", (req, res) => {
  res.send("<h1>Welcome, Express + MongoDB is working! </h1>");
});

app.listen(PORT, () => {
  console.log(`Server running at https://localhost:${PORT}`);
});


app.get("/times/:sport", async (req, res) => {
  const sport = req.params.sport
  const {dateBegin, dateEnd, timeBegin, timeEnd, location} = req.query
  console.log(sport)
  const results = await getSportFromDB({
    sport: sport,
    dateBegin: dateBegin,
    dateEnd: dateEnd,
    timeBegin: timeBegin,
    timeEnd: timeEnd,
    location: location
  })
  
  console.log(results)
  res.json(JSON.stringify(results, null, 2))
})