const ratingSchema = new mongoose.Schema({
  dropIn: { type: mongoose.Schema.Types.ObjectId, ref: "DropIn", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  value: { type: Number, min: 1, max: 5, required: true },
  comment: String
}, { timestamps: true });


export const Rating = mongoose.model("Rating", ratingSchema);

