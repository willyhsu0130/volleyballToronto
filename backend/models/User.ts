import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12; // safe default for modern CPUs

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserDocument = Document & IUser & IUserMethods;

const userSchema = new mongoose.Schema<IUser, Model<IUser, {}, IUserMethods>, IUserMethods>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    }
  },
  { timestamps: true }
);

// Pre-save hook — hash with salt automatically
userSchema.pre("save", async function (next) {
  console.log("Hook running")
  if (!this.isModified("password")) {
    console.log("password not modfied")
    return next();
  }

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare raw password to stored hash
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model("User", userSchema);