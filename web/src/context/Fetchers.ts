const SERVER_API = process.env.REACT_APP_SERVER_API;

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
export const submitComment = async ({
    DropInId,
    UserId,
    Content
}: {
    DropInId: number
    UserId: number
    Content: string
}) => {
    console.log("submit commenting")
    console.log("Content", Content)
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
            },
            body: JSON.stringify({
                Content: Content,
                DropInId: DropInId,
                UserId: UserId
            })
        })
        console.log(res)
        if (!res.ok) throw new Error("Error commenting")
        const updated = await fetchDropInById(DropInId);
        return updated;

    } catch (error) {
        console.log(error)
        return error
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

        const res = await fetch(`${SERVER_API}signup`, {
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
