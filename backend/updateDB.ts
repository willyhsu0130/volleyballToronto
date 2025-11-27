import { exit } from "process";
import {
  updateFromToronto,
  connectDB
} from "./services/db.js"

const connectResult = await connectDB();
console.log(connectResult)

// Function to update database
const updateDB = async () => {
  const updateFromTorontoResponse = await updateFromToronto();
  console.log(updateFromTorontoResponse)
}

await updateDB()
exit()