import { KnownError } from "../classes/ErrorClass";

type ErrorFallbackProps = {
    error: Error;
    resetErrorBoundary: () => void;
};

export const ErrorScreen = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
    const isKnown = error instanceof KnownError

    if (isKnown) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-transparent text-gray-800">
                <div className="bg-white shadow-md rounded-xl p-8 max-w-md text-center border border-yellow-200">

                    <h1 className="text-xl font-semibold mb-3">⚠️ Oops, something went wrong</h1>
                    <p className="text-sm text-gray-600 mb-6">
                        {error.message || "Something didn’t load correctly."}
                    </p>

                    <button
                        onClick={resetErrorBoundary}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Unknown / unexpected error (serious)
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100 text-red-800">
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center border border-red-200">

                <h1 className="text-2xl font-bold mb-2">💥 Unexpected Error</h1>

                <p className="text-sm text-red-600 mb-4">
                    {error.message || "An unexpected problem occurred."}
                </p>

                <button
                    onClick={resetErrorBoundary}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                    Reload App
                </button>
            </div>
        </div>
    );
};