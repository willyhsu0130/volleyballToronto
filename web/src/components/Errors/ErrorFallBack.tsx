type ErrorFallbackProps = {
    error: Error;
    resetErrorBoundary: () => void;
};

const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100 text-red-800">
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center border border-red-200">
                <h1 className="text-2xl font-bold mb-2">⚠️ Something went wrong!</h1>
                <p className="text-sm text-red-600 mb-4">{error.message}</p>

                <button
                    onClick={resetErrorBoundary}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
};

export default ErrorFallback