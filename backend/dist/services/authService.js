// services/authService.ts
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
export const signUp = async ({ username, email, password }) => {
    const existing = await User.findOne({ Email: email });
    console.log(existing);
    if (existing)
        throw new AppError("Email already in use", 409);
    let signUpResults = await User.create({
        Username: username,
        Email: email,
        Password: password
    });
    console.log(signUpResults);
    return (signUpResults);
};
