import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode
} from "react"

import { useFilters } from "./FiltersContext";

import { CommentType } from "../components/Comments";

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

interface DropInsContextType {
    dropIns: DropIn[];
    setDropIns: React.Dispatch<React.SetStateAction<DropIn[]>>;
    // fetchDropIns: ((url: string) => Promise<void>);
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    fetchDropInById: (dropInId: number) => Promise<DropIn | null>
    fetchCommentsByDropInId: (dropInId: number) => Promise<CommentType[] | null>
    signup: (data: {
        username: string
        email: string
        password: string
    }) => void
    submitComment: (comment: {
        DropInId: number
        UserId: number
        Content: string
    }) => void
}


const SERVER_API = process.env.REACT_APP_SERVER_API;


const DropInsContext = createContext<DropInsContextType | undefined>(undefined);

export const DropInsProvider = ({ children }: { children: ReactNode }) => {

    const [dropIns, setDropIns] = useState<DropIn[]>([])
    const [loading, setLoading] = useState(true)
    const { filters } = useFilters()

    useEffect(() => {
        const params = new URLSearchParams()

        // Turn sports into a comma seperate list

        if (Array.isArray(filters.sports) && filters.sports.length > 0) {
            params.append("sports", filters.sports.join(","));
        }
        if (filters.beginDate) params.append("beginDate", filters.beginDate.toISOString());
        if (filters.endDate) params.append("endDate", filters.endDate.toISOString());
        if (filters.age) params.append("age", filters.age.toString());
        if (filters.locationId) params.append("locationId", filters.locationId.toString());
        console.log("Params", params.toString())

        // Find out if filters.sports is an array of strings or a string 
        const query = params.toString();
        const url = `${SERVER_API}dropIns${query ? `?${query}` : ""}`;

        console.log(url)
        const fetchDropIns = async () => {
            try {
                const res = await fetch(url)
                if (!res.ok) throw new Error("Failed to fetch drop-ins");
                const data = await res.json()
                setDropIns(data)
                setLoading(false)

            } catch (err) {
                console.error("Error: ", err)
            }
        }

        fetchDropIns()
    }, [filters, loading])

    const fetchDropInById = async (dropInId: number) => {
        try {
            // Fetch dropInData
            const res = await fetch(`${SERVER_API}dropIns/${dropInId}`)
            if (!res.ok) throw new Error("Failed to fetch drop-ins");
            const data = await res.json()
            return data
        } catch (error) {
            console.error("Error:", error)
        }
    }
    const fetchCommentsByDropInId = async (dropInId: number) => {
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
    const submitComment = async ({
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
            if (!res.ok) throw new Error("Error commenting")
            const updated = await fetchDropInById(DropInId);
            return updated;

        } catch (error) {
            console.log(error)
            return error
        }

    }
    const signup = async ({
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
        } catch (error) {
            console.log(error)
        }

    }

    return (
        <DropInsContext.Provider value={{
            dropIns,
            setDropIns,
            loading,
            setLoading,
            fetchDropInById,
            submitComment,
            fetchCommentsByDropInId,
            signup
        }}>
            {children}
        </DropInsContext.Provider>
    )
}

export const useDropIns = () => {
    const context = useContext(DropInsContext);
    if (!context) {
        throw new Error("useDropIns must be used within a DropInsProvider");
    }
    return context;
};
