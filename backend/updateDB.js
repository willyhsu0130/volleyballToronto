import {
  updateFromToronto,
  connectDB
} from "./db.js";

const connectResult = await connectDB();
console.log(connectResult)

// Function to update database
const updateDB = async () => {
  const updateFromTorontoResponse = await updateFromToronto();
  console.log(updateFromTorontoResponse)
}

updateDB()