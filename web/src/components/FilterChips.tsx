import { FilterState, useFilters } from "../context/FiltersContext.tsx";

interface FilterChipsProps {
    className: string
    handleRemoveFilter: (sportToRemove: string) => void
}

export const FilterChips = ({ className, handleRemoveFilter }: FilterChipsProps) => {

    const { filters } = useFilters()
    if (!filters) return null
    const sports = filters.sports

    // Check if it is an array
    if (sports.length === 1 && !sports[0]) {
        return null
    }

    console.log(sports)
    return (
        <div className={`${className}`}>
            {sports &&
                sports.map((item, index) => (
                    <FilterChip
                        key={index}
                        filterKey={index}
                        filterValue={item}
                        handleRemoveFilter={() => handleRemoveFilter(item)} />
                ))}
        </div>
    );
};


interface FilterChipProps {
    filterValue: String
    handleRemoveFilter: () => void
}



const FilterChip = ({ filterValue, handleRemoveFilter }: FilterChipProps) => {

    return (
        <div className="bg-gray-200 text-[10px] px-2 py-1 flex items-center gap-2 rounded-sm">
            <span>{filterValue}</span>
            <button

                className="ml-1 text-gray-500 hover:text-red-600"
                onClick={handleRemoveFilter}
            >
                ✕
            </button>
        </div>
    );
};