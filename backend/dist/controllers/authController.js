import { signUp } from "../services/authService.js";
import { AppError } from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";
export const signupController = catchAsync(async (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        throw new AppError("All fields are required", 400);
    }
    const user = await signUp({ username, email, password });
    res.status(201).json({ success: true, user });
});
export const loginController = catchAsync(async (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        throw new AppError("All fields are required", 400);
    }
    const user = await signUp({ username, email, password });
    res.status(201).json({ success: true, user });
});
