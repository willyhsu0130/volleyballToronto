// db.js is in charge of getting of pulling data from the toronto by importing the torontoData service 
// then it pushes the data into mongodb


import mongoose from "mongoose";
import { pullTorontoPackage } from "./services/torontoData.js";
import { Location } from "./models/location.js";
import { DropIns } from "./models/DropIns.js";
import { configDotenv } from "dotenv";

configDotenv()

export async function connectDB() {
    await mongoose.connect(process.env.MONGO_URI, { dbName: "toronto" });
    console.log("MongoDB connected");
}

export const updateFromToronto = async () =>{
    const pkg = await pullTorontoPackage()
    // Test if pullTorontoPackage work here
    console.log(pkg, "pkg works")
    const datastoreResources = pkg.resources.filter((r) => r.datastore_active);

    // Drop-ins
    const dropins = await getDatastoreResource(datastoreResources[1]);
    //   await DropIn.insertMany(dropins, { ordered: false }).catch(() => {});
    //   console.log(`Synced ${dropins.length} drop-ins`);

    // Locations
    const locations = await getDatastoreResource(datastoreResources[0]);
    //   await Location.insertMany(locations, { ordered: false }).catch(() => {});
    //   console.log(`Synced ${locations.length} locations`);
}