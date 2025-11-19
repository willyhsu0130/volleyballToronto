export class AppError extends Error {
    statusCode: number;
    success: boolean;
    data?: any;

    constructor(
        message: string,
        statusCode: number = 500,

    ) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;  // ❗ errors are always success: false
        // Ensure instanceof works
        Object.setPrototypeOf(this, AppError.prototype);

        Error.captureStackTrace(this, this.constructor);
    }
}

export class SuccessResponse<T> {
    success: boolean;
    data?: T;
    message: string

    constructor(message: string, data?: T,) {
        this.success = true;
        this.data = data;
        this.message = message
    }
}
