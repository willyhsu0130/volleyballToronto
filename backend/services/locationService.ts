
import { Location } from "../models/Location.js";


export const getLocations = async ({
    q,
    nameOnly,
}: {
    q?: string;
    nameOnly: boolean;
}) => {

    const filter: any = {};

    // Only match by q when provided
    if (q) {
        filter.LocationName = { $regex: q, $options: "i" };
    }

    // Only restrict to CRCs if that is your desired behavior
    // Otherwise remove this line
    filter.LocationType = "crc";

    // Base query
    let query = Location.find(filter);

    if (nameOnly) {
        query = query.select("LocationName LocationId");
        //       👆 include LocationId, NOT _id — based on your UI
    }

    const results = await query.lean();
    return results;
};


export const getLocation = async ({ locationId }: { locationId: number }) => {
    // Build filter object

    let results = Location.findOne(
        { LocationId: locationId }
    );

    return results;
};






