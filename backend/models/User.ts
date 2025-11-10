import mongoose from "mongoose";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12; // safe default for modern CPUs

const userSchema = new mongoose.Schema(
  {
    Username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    Email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    Password: {
      type: String,
      required: true,
      select: false
    },
    Role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    }
  },
  { timestamps: true }
);

// Pre-save hook — hash with salt automatically
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  this.Password = await bcrypt.hash(this.Password, salt);
  next();
});

// Compare raw password to stored hash
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.Password);
};

export const User = mongoose.model("User", userSchema);