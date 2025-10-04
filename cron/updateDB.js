import {
  connectDB,
  updateFromToronto,
} from "./backend/services/torontoData.js";


const { dropResult } = await connectDB();

// Function to update database
const updateDB = async () => {
  const updateFromTorontoResponse = await updateFromToronto();
  console.log(updateFromTorontoResponse)
}