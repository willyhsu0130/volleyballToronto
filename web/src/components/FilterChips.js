export const FilterChips = ({ filters, className, handleRemoveFilter}) => {

    if (!filters) return null;

    // Convert object to array of [key, value] pairs and filter out empty ones
    const sports = filters.sports

    if (sports.length === 0) return (
        <div>

        </div>
    );

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

const FilterChip = ({ filterValue, handleRemoveFilter }) => {

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