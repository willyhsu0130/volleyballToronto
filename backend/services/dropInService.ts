import { FilterQuery } from "mongoose";
import { DropIn, IDropIn } from "../models/DropIns.js";

interface IgetSportFromDB {
    sports: string[] | string | null
    beginDate: Date | null
    endDate: Date | null
    locationId: number | null
    age: number | null
}

export const getSportFromDB = async ({
    sports,
    beginDate,
    endDate,
    locationId,
    age
}: IgetSportFromDB) => {
    const filter: FilterQuery<IDropIn> = {};
    // Add the filter objects
    if (Array.isArray(sports) && sports.length > 0) {
        filter.CourseTitle = { $in: sports };
    } else if (sports && typeof sports === "string" && sports.trim() !== "") {
        filter.CourseTitle = sports.trim();
    }

    // Location filter (by name, case-insensitive)
    if (locationId) {
        filter.LocationId = locationId
    }

    // Date filter
    if (beginDate || endDate) {
        filter.BeginDate = {};
        if (beginDate) filter.BeginDate.$gte = new Date(beginDate);
        if (endDate) filter.BeginDate.$lte = new Date(endDate);
    }

    // Age filter

    if (age) {
        filter.$and = [
            { AgeMin: { $lte: age } },
            {
                $or: [
                    { AgeMax: { $gte: age } },
                    { AgeMax: { $exists: false } },
                    { AgeMax: null },
                ],
            },
        ];
    }

    const results = await DropIn.find(filter)
        .populate("LocationRef", "LocationName District StreetName StreetType")
        .sort({ BeginDate: 1 });
    return results;
};
// q is a string rn.

export const getDropInById = async ({ dropInId }: { dropInId: number }) => {
    let dropInResults = await DropIn.findOne(
        { DropInId: dropInId }
    ).populate("LocationRef", "LocationName District StreetName StreetType")
    return dropInResults;
}