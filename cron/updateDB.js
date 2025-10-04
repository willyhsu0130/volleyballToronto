import {
  updateFromToronto,
} from "../backend/db.js";

// Function to update database
const updateDB = async () => {
  const updateFromTorontoResponse = await updateFromToronto();
  console.log(updateFromTorontoResponse)
}