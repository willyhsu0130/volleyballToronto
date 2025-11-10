import { AppError } from "../utils/AppError.js";
export const errorHandler = (err, req, res, next) => {
    console.error("Error stack:", err.stack);
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }
    return res.status(500).json({
        success: false,
        message: "Internal server error",
    });
};
