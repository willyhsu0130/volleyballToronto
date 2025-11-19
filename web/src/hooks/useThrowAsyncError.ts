import { useState, useCallback } from "react";

export function useThrowAsyncError() {
    const [error, setError] = useState<Error | null>(null);

    if (error) throw error;

    return useCallback((err: Error) => {
        setError(err);
    }, []);
}