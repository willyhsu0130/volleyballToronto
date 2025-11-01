import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useFilters } from "./FilterContext"
import Constants from 'expo-constants';

const SERVER_API = Constants.expoConfig?.extra?.SERVER_API;

interface DropIn {
    DropInId: number;        // Unique row ID from Open Data
    LocationId: number;      // Link to Location collection
    LocationRef?: string;    // ID reference (if applicable)
    CourseId: number;
    CourseTitle: string;     // Title of drop-in course
    Section?: string;        // Section (if available)
    AgeMin?: number;         // Min age (in months)
    AgeMax?: number;         // Max age (in months)
    BeginDate?: string;  // ISO string or Date
    EndDate?: string;    // ISO string or Date
    createdAt?: string | Date;  // Auto timestamp
    updatedAt?: string | Date;
}

interface DropInsContextType {
    dropIns: DropIn[];
    setDropIns: React.Dispatch<React.SetStateAction<DropIn[]>>;
    // fetchDropIns: ((url: string) => Promise<void>);
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropInsContext = createContext<DropInsContextType | undefined>(undefined);

export const DropInsProvider = ({ children }: { children: ReactNode }) => {

    const [dropIns, setDropIns] = useState<DropIn[]>([])
    const [loading, setLoading] = useState(true)
    const { filters } = useFilters()

    useEffect(() => {
        console.log(filters)
        const params = new URLSearchParams()
        if (filters.beginDate) params.append("beginDate", filters.beginDate.toISOString());
        if (filters.endDate) params.append("endDate", filters.endDate.toISOString());
        if (filters.age) params.append("age", filters.age.toString());
        if (filters.locationId) params.append("locationId", filters.locationId.toString());
        console.log("Params", params.toString())

        // Find out if filters.sports is an array of strings or a string 
        const sportPath = filters.sports.join(",");
        const query = params.toString();
        const url = query
            ? `${SERVER_API}times/${sportPath}?${query}`
            : `${SERVER_API}times/${sportPath}`;

        console.log(url)
        const fetchDropIns = async () => {
            console.log("dropIns running")
            try {
                const res = await fetch(url)
                if (!res.ok) throw new Error("Failed to fetch drop-ins");
                const data: DropIn[] = await res.json()
                setDropIns(data)
                setLoading(false)

            } catch (err) {
                console.error("Error: ", err)
            }
        }
        fetchDropIns()
        setLoading(false)
    }, [filters])

    return (
        <DropInsContext.Provider value={{
            dropIns,
            setDropIns,
            loading,
            setLoading
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
