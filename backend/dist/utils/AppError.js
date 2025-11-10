export class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // marks known errors
        Error.captureStackTrace(this, this.constructor);
    }
}
