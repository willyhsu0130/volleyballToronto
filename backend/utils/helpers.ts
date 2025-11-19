import { SuccessResponse } from "./classes";
import { AppError } from "./classes";
import { Response } from "express"

export const sendSuccess = <T>(
    res: Response,
    message: string,
    statusCode: number = 200,
    data?: T,
) => {
    return res.status(statusCode).json(new SuccessResponse<T>(message, data));
};