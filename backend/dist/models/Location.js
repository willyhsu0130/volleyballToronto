import mongoose from "mongoose";
const locationSchema = new mongoose.Schema({
    LocationId: { type: Number, required: true, unique: true }, // Unique row identifier from Open Data
    ParentLocationId: { type: Number },
    LocationName: { type: String, required: true }, // Name of the location
    LocationType: { type: String },
    Accessibility: { type: String },
    Intersection: { type: String },
    TTCInformation: { type: String },
    District: { type: String },
    StreetNo: { type: String },
    StreetNoSuffix: { type: String },
    StreetName: { type: String },
    StreetType: { type: String },
    StreetDirection: { type: String },
    PostalCode: { type: String },
    Description: { type: String },
}, { collection: "locations" });
export const Location = mongoose.model("Location", locationSchema);
