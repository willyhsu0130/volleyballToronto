import { SuccessResponse } from "./classes.js";
export const sendSuccess = (res, message, statusCode = 200, data) => {
    return res.status(statusCode).json(new SuccessResponse(message, data));
};
