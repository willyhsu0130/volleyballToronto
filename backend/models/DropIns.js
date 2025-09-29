import mongoose from "mongoose";

const dropInSchema = new mongoose.Schema({
  _id: { type: Number, required: true },               // Unique row ID from Open Data
  LocationID: { type: Number, required: true },        // Link to Location collection
  CourseID: { type: Number, required: true, unique: true },
  CourseTitle: { type: String, required: true },       // Title of drop-in course
  Section: { type: String },                           // Section (if available)
  AgeMin: { type: Number },                            // Min age (in months)
  AgeMax: { type: Number },                            // Max age (in months)
  DateRange: { type: String },                         // Raw text of date range
  StartHour: { type: Number },                         // Start hour (24h)
  StartMinute: { type: Number },
  EndHour: { type: Number },
  EndMinute: { type: Number },
  FirstDate: { type: Date },                           // First date course runs
  LastDate: { type: Date },                            // Last date course runs
}, { timestamps: true }); // optional: auto adds createdAt + updatedAt

export const DropIns = mongoose.model("DropIn", dropInSchema);