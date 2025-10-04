import mongoose from "mongoose";

const docTransform = (doc, ret) => {
  // ret = plain JS object representation of the doc

  // flatten location info if it’s populated
  if (ret.LocationRef && ret.LocationRef.LocationName) {
    ret.LocationName = ret.LocationRef.LocationName;
  }

  // remove the raw LocationRef if you don’t need it
  delete ret.LocationRef;
  delete ret.__v;

  return ret;
}

const dropInSchema = new mongoose.Schema({
  DropInId: { type: Number, required: true, unique: true },               // Unique row ID from Open Data
  LocationId: { type: Number, required: true },        // Link to Location collection
  LocationRef: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
  CourseId: { type: Number, required: true },
  CourseTitle: { type: String, required: true },       // Title of drop-in course
  Section: { type: String },                           // Section (if available)
  AgeMin: { type: String },                            // Min age (in months)
  AgeMax: { type: String },                            // Max age (in months)
  BeginDate: { type: Date },                           // First date course runs
  EndDate: { type: Date },                            // Last date course runs
}, {
  timestamps: true,
  toJSON: { virtuals: true, transform: docTransform },
  toObject: { virtuals: true, transform: docTransform }
});


export const DropIn = mongoose.model("DropIn", dropInSchema);

