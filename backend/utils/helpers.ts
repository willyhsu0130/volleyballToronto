import { SuccessResponse } from "./classes.js";
import { Response } from "express"

export const sendSuccess = <T>(
    res: Response,
    message: string,
    statusCode: number = 200,
    data?: T,
) => {
    return res.status(statusCode).json(new SuccessResponse<T>(message, data));
};