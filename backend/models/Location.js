import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
    _id: { type: Number, required: true }, // Unique row identifier from Open Data
    LocationID: { type: Number, required: true, unique: true }, // Unique identifier of location
    ParentLocationID: { type: Number }, // Parent location ID (same as LocationID if none)
    LocationName: { type: String, required: true }, // Name of the location
    LocationType: { type: String }, // e.g., park, crc, arena
    Accessibility: { type: String }, // Accessibility type/level
    Intersection: { type: String }, // "Near: Intersection"
    TTCInformation: { type: String }, // TTC guidelines
    District: { type: String }, // Administrative district
    StreetNo: { type: String }, // Street number
    StreetNoSuffix: { type: String }, // Suffix (e.g., A, B, etc.)
    StreetName: { type: String }, // Street name
    StreetType: { type: String }, // Rd, St, Ave, etc.
    StreetDirection: { type: String }, // N, S, E, W
    PostalCode: { type: String }, // Postal code
    Description: { type: String }, // Long description (can include HTML)
}, { collection: "locations" }); // explicitly set collection name

export const Location = mongoose.model("Location", locationSchema);