export class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.success = false; // ❗ errors are always success: false
        // Ensure instanceof works
        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
export class SuccessResponse {
    constructor(message, data) {
        this.success = true;
        this.data = data;
        this.message = message;
    }
}
