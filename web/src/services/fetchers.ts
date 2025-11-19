const SERVER_API = process.env.REACT_APP_SERVER_API;

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
}

export interface LoginData {
    token: string;
    user: {
        _id: string;
        username: string;
        email: string;
        role: "user" | "admin";
    };
}

export interface ProfileData {
    _id: string;
    username: string;
    email: string;
    role: "user" | "admin";
    createdAt: string;
    updatedAt: string;
}

export interface DropIn {
    DropInId: number;        // Unique row ID from Open Data
    LocationId: number;      // Link to Location collection
    LocationRef?: string;    // ID reference (if applicable)
    CourseId: number;
    CourseTitle: string;     // Title of drop-in course
    Section?: string;        // Section (if available)
    AgeMin?: number | "None";         // Min age (in months)
    AgeMax?: number | "None";         // Max age (in months)
    BeginDate?: string;  // ISO string or Date
    EndDate?: string;    // ISO string or Date
    createdAt?: string | Date;  // Auto timestamp
    updatedAt?: string | Date;
    LocationName?: string
}

// =====================================================
// Helper to unify response handling
// =====================================================
const handleResponse = async <T>(res: Response): Promise<ApiResponse<T>> => {
    try {
        const json = await res.json();

        // API-level error (backend responded with success: false)
        if (!json.success) return json as ApiResponse<T>;

        // Success
        return json as ApiResponse<T>;
    } catch (error) {
        // JSON parse fail or unexpected error
        return {
            success: false,
            message: "Invalid response from server"
        };
    }
};

/** Safely perform a fetch with unified error handling */
const safeFetch = async <T>(
    url: string,
    options?: RequestInit
): Promise<ApiResponse<T>> => {
    try {
        const res = await fetch(url, options);

        // Network or HTTP failure
        if (!res.ok) {
            return {
                success: false,
                message: `Request failed: ${res.status}`
            };
        }

        return handleResponse<T>(res);
    } catch (err: any) {
        return {
            success: false,
            message: err.message || "Network request failed"
        };
    }
};

// =====================================================
// FETCH DROP-INS
// =====================================================

export const fetchDropIns = async (
    query: string,
): Promise<ApiResponse<DropIn[] | []>> => {
    const url = `${SERVER_API}dropIns${query ? `?${query}` : ""}`;
    return safeFetch<any>(url);
};


// =====================================================
// FETCH DROP-IN BY ID
// =====================================================
export const fetchDropInById = async (
    DropInId: number
): Promise<ApiResponse<any>> => {
    return safeFetch<any>(`${SERVER_API}dropIns/${DropInId}`);
};

// =====================================================
// FETCH COMMENTS
// =====================================================
export const fetchCommentsByDropInId = async (
    DropInId: number
): Promise<ApiResponse<any>> => {
    return safeFetch<any>(`${SERVER_API}comments/${DropInId}`);
};

// =====================================================
// SUBMIT COMMENT
// =====================================================
interface ISubmitComment {
    comment: {
        DropInId: number;
        Content: string;
    };
    token: string | null;
}

export const submitComment = async ({
    comment,
    token
}: ISubmitComment): Promise<ApiResponse<string>> => {
    try {
        const { DropInId, Content } = comment;

        if (!token) throw new Error("Missing token. User must login before commenting.");
        if (!DropInId) throw new Error("Missing drop-in ID");
        if (!Content || typeof Content !== "string")
            throw new Error("Comment must contain text");

        return safeFetch<string>(`${SERVER_API}comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                Content: Content.trim(),
                DropInId,
            })
        });
    } catch (err: any) {
        return { success: false, message: err.message };
    }
};

// =====================================================
// FETCH COMMENTS
// ====================================================




// =====================================================
// Toggle Comment Likes
// ====================================================

interface ToggleLikeInput {
    commentId: string;
    token: string | null;
}

export const toggleCommentLike = async ({
    commentId,
    token
}: ToggleLikeInput): Promise<ApiResponse<any>> => {
    try {
        if (!token) throw new Error("Missing token. User must login before liking.");
        if (!commentId) throw new Error("Missing comment ID");

        return safeFetch<any>(`${SERVER_API}comments/${commentId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ commentId })
        });
    } catch (err: any) {
        return { success: false, message: err.message };
    }
};


// =====================================================
// SIGNUP
// =====================================================
export const signup = async ({
    username,
    email,
    password
}: {
    username: string;
    email: string;
    password: string;
}): Promise<ApiResponse<LoginData>> => {
    try {
        if (!username) throw new Error("Username is required");
        if (!email) throw new Error("Email is required");
        if (!password) throw new Error("Password is required");

        return safeFetch<LoginData>(`${SERVER_API}auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });
    } catch (err: any) {
        return { success: false, message: err.message };
    }
};

// =====================================================
// LOGIN
// =====================================================
export const login = async ({
    username,
    password
}: {
    username: string;
    password: string;
}): Promise<ApiResponse<LoginData>> => {
    try {
        if (!username) throw new Error("Username is required");
        if (!password) throw new Error("Password is required");

        return safeFetch<LoginData>(`${SERVER_API}auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
    } catch (err: any) {
        return { success: false, message: err.message };
    }
};


// =====================================================
// Fetch profile
// =====================================================

export const fetchProfile = async (
    token: string | null
): Promise<ApiResponse<ProfileData>> => {
    try {
        if (!token) {
            return {
                success: false,
                message: "Missing token — user must be logged in."
            };
        }

        return safeFetch<ProfileData>(`${SERVER_API}profile`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });
    } catch (err: any) {
        return { success: false, message: err.message };
    }
};