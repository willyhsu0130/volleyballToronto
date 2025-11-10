import express from "express";
import cors from "cors";
import {
  connectDB,
  getSportFromDB,
  getLocations,
  getLocation,
  getDropInById,
  updateComment,
  getCommentsByDropInId,
  signUp
} from "./db.js";
import validator from "validator"

const app = express();
const PORT = process.env.PORT || 4000;


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json([])
});

const startServer = async () => {
  try {
    const { dropResult } = await connectDB(); // your DB connection
    console.log("Database connected:", !!dropResult);

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Error connecting to database:", err);
    // Even if DB fails, keep the server alive to avoid Render timeout
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running without DB connection on port ${PORT}`);
    });
  }
};

startServer()

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

    // Fetch drop in 
    const dropInResults = await getDropInById({ dropInId })

    if (!dropInResults) {
      return res.status(404).json({ error: "Drop In not found" });
    }

    res.json(dropInResults);

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

app.get("/comments/:dropInId", async (req, res) => {
  try {
    const { dropInId } = req.params

    if (!dropInId) {
      return res.status(400).json({ error: "Drop In ID is required" });
    }

    // Fetch drop in 
    const commentResults = await getCommentsByDropInId({ dropInId })

    if (!commentResults) res.status(404).json({ error: "comments not found" })

    res.json(commentResults)

  } catch (error) {
    console.log(error)
  }

})

app.post("/comments", async (req, res) => {
  console.log("Comments endpoint received")
  console.log(req.body)
  const { Content, DropInId, UserId } = req.body
  console.log("Received comment:", Content, "for dropIn:", DropInId, "userId", UserId,);
  const response = await updateComment({ Content, DropInId, UserId })
  res.json({ success: true, message: "Comment received!" });
})

app.post("/signup", async (req, res) => {
  try {
    let { username, email, password } = req.body;

    // ----------- BASIC VALIDATION & SANITIZATION -----------
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Trim whitespace
    username = username.trim();
    email = email.trim();
    password = password.trim();

    // Validate username
    if (username.length < 3 || username.length > 20) {
      return res
        .status(400)
        .json({ error: "Username must be between 3 and 20 characters." });
    }

    // Sanitize username (remove unsafe characters)
    username = validator.blacklist(username, "<>{}()$%&/\\'\"`~|;:");

    // Check if username exists

    // // Validate email format
    // if (!validator.isEmail(email)) {
    //   return res.status(400).json({ error: "Invalid email format." });
    // }

    // // Normalize email (lowercase + canonical form)
    // email = validator.normalizeEmail(email);

    // // Validate password length
    // if (password.length < 8) {
    //   return res
    //     .status(400)
    //     .json({ error: "Password must be at least 8 characters long." });
    // }

    // // Optional: enforce strong password
    // if (
    //   !validator.isStrongPassword(password, {
    //     minLength: 8,
    //     minLowercase: 1,
    //     minUppercase: 1,
    //     minNumbers: 1,
    //     minSymbols: 0
    //   })
    // ) {
    //   return res.status(400).json({
    //     error:
    //       "Password must include uppercase, lowercase, and numbers."
    //   });
    // }

    // ----------- SAFE CALL TO SIGNUP SERVICE -----------
    const signUpResponse = await signUp({ username, email, password });
    console.log("signupResponse", signUpResponse)
    console.log(signUpResponse.Error)
    return res.status(200).json(signUpResponse);
  } catch (error) {
    console.error("Error in /signup:", Error);
    return res.status(500).json({ error });
  }
});