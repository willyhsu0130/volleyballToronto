// services/authService.ts
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import jwt from "jsonwebtoken";
export const signUp = async ({ username, email, password }) => {
    console.log("signedUp service called");
    const existing = await User.findOne({ email: email });
    console.log(existing);
    if (existing)
        throw new AppError("Email already in use", 409);
    // Hashing
    const newUser = new User({
        username: username,
        email: email,
        password: password
    });
    console.log(newUser);
    const signUpResults = await newUser.save();
    console.log("signUpResults", signUpResults);
    return (signUpResults);
};
export const login = async ({ username, password }) => {
    const user = await User.findOne({ username: username }).select("+Password");
    if (!user) {
        throw new AppError("Username not found", 401);
    }
    // compare provided password with stored hash
    // comparePassword is an instance method on the schema
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new AppError("Invalid credentials", 401);
    }
    const { password: _, ...userWithoutPassword } = user.toObject();
    // optional JWT
    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET || "dev-secret", { expiresIn: "1d" });
    // return the safe user (no Password)
    return { token, user: userWithoutPassword };
};
