
import { Location } from "../models/Location.js";


export const getLocations = async ({ q, nameOnly }: { q: string | undefined, nameOnly: boolean }) => {
    // Build filter object
    const filter = q
        ? { LocationName: { $regex: q, $options: "i" } } // case-insensitive search
        : {};

    // Base query
    let query = Location.find(filter);

    // If we only want name + id
    if (nameOnly) {
        query = query.select("LocationName _id");
        // Or "LocationName LocationId" if you have your own LocationId field
    }

    // Limit results to avoid returning all 35k
    const results = await query.limit(50).lean();
    return results;
};


export const getLocation = async ({ locationId }: { locationId: number }) => {
    // Build filter object

    let results = Location.findOne(
        { LocationId: locationId }
    );

    return results;
};






