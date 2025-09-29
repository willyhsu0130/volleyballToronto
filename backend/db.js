// db.js is in charge of getting of pulling data from the toronto by importing the torontoData service 
// then it pushes the data into mongodb


import mongoose from "mongoose";
import { getTorontoData } from "./services/torontoData.js";
import { configDotenv } from "dotenv";

configDotenv()

export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "toronto",
        });
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        process.exit(1); // stop the server if DB can't connect
    }
}

export const updateFromToronto = async () => {
    const { dropResult, locationResult } = await getTorontoData()
    // Test if pullTorontoPackage work here
    // console.log(dropResult, locationResult)

}