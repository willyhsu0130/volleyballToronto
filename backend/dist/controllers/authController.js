import { signUp, login } from "../services/authService.js";
import { AppError } from "../utils/classes.js";
import { catchAsync } from "../utils/catchAsync.js";
import { sendSuccess } from "../utils/helpers.js";
export const signupController = catchAsync(async (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        throw new AppError("All fields are required", 400);
    }
    const data = await signUp({ username, email, password });
    sendSuccess(res, "Signup successful", 201, data);
});
export const loginController = catchAsync(async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password)
        throw new AppError("All fields are required", 400);
    const data = await login({ username, password });
    sendSuccess(res, "Login Successfull", 201, data);
});
