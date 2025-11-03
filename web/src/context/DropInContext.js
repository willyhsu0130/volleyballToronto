import {
    createContext,
    useContext,
    useState,
    useEffect
} from "react"


import { useFilters } from "./FiltersContext";

const SERVER_API = process.env.REACT_APP_SERVER_API;


const DropInsContext = createContext(undefined);

export const DropInsProvider = ({ children }) => {

    const [dropIns, setDropIns] = useState([])
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
        const url = `${SERVER_API}times${query ? `?${query}` : ""}`;

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

    const fetchDropInById = async (dropInId) => {
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

    const submitComment = async ({ DropInId, UserId, Content }) => {
        console.log(DropInId, UserId, Content)
        try {
            if (!UserId) throw new Error("userId is required to comment!")
            // Check if the dropInId, userId, text is valid.

            if (!Content || typeof text !== "string") throw new Error("Comment must contain any texts")
            Content = Content.trim()

            if (!DropInId) throw new Error("Error with dropInId")

            const res = await fetch(`${SERVER_API}comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    Content: Content,
                    CropInId: DropInId,
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

    return (
        <DropInsContext.Provider value={{
            dropIns,
            setDropIns,
            loading,
            setLoading,
            fetchDropInById,
            submitComment
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
