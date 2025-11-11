const SERVER_API = process.env.REACT_APP_SERVER_API;

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
}

interface LoginData {
    token: string;
    user: {
        _id: string;
        username: string;
        email: string;
        role: "user" | "admin";
    };
}


export const fetchDropInById = async (dropInId: number) => {
    try {
        // Fetch dropInData
        const res = await fetch(`${SERVER_API}times/${dropInId}`)
        if (!res.ok) throw new Error("Failed to fetch drop-ins");
        const data = await res.json()
        return data
    } catch (error) {
        console.error("Error:", error)
    }
}
export const fetchCommentsByDropInId = async (dropInId: number) => {
    try {
        // Fetch comments data
        const res = await fetch(`${SERVER_API}comments/${dropInId}`)
        if (!res.ok) throw new Error("Failed to fetch comments");
        const data = await res.json()
        return data
    } catch (error) {
        console.error("Error:", error)
    }
}
interface ISubmitComment {
    tempComment: {
        DropInId: number
        UserId: number
        Content: string
    },
    token: string | null
}

export const submitComment = async ({ tempComment, token }: ISubmitComment) => {
    let { DropInId, UserId, Content } = tempComment
    console.log("token is: ", token)
    console.log(Content, token, "submit commment")
    try {
        if (!UserId) throw new Error("userId is required to comment!")
        // Check if the dropInId, userId, text is valid.

        if (!Content || typeof Content !== "string") throw new Error("Comment must contain any texts")
        Content = Content.trim()

        if (!DropInId) throw new Error("Error with dropInId")

        const res = await fetch(`${SERVER_API}comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                Content: Content,
                DropInId: DropInId,
                UserId: UserId
            })
        })
        console.log(res)
        if (!res.ok) throw new Error("Error commenting")
        return {
            success: true,
            data: res
        }

    } catch (error: any) {
        console.log(error)
        return { success: false, message: error.message || "Error submitting comment" };
    }

}
export const signup = async ({
    username,
    email,
    password
}: {
    username: string
    email: string
    password: String
}) => {
    try {
        if (!username || typeof username !== "string") throw new Error("username is required to signup")
        // Check if the dropInId, userId, text is valid.

        if (!email || typeof email !== "string") throw new Error("email is required")
        email = email.trim()

        if (!password || typeof password !== "string") throw new Error("password is required to signup")

        const res = await fetch(`${SERVER_API}auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        })
        console.log(res)
        return res
    } catch (error) {
        console.log(error)
        return error
    }

}

export const login = async ({ username, password }: { username: string, password: string }) => {
    try {
        if (!username || typeof username !== "string") throw new Error("username is required to signup")
        // Check if the dropInId, userId, text is valid.

        if (!password || typeof password !== "string") throw new Error("password is required to signup")

        const res = await fetch(`${SERVER_API}auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || "Login failed");
        }
        const json = await res.json()
        return {
            success: true,
            data: json as LoginData
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message
        }
    }
}
