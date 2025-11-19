interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
}


export class KnownError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "KnownError";
    }
}