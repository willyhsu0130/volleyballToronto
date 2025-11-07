import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ResultCards } from "../components/ResultCards.tsx";
import { CalendarSchedule } from "../components/CalendarSchedule.tsx";
import { FilterChips } from "../components/FilterChips.tsx"
import { useFilters } from "../context/FiltersContext.tsx";

const REACT_APP_SERVER_API = process.env.REACT_APP_SERVER_API;

const DropIns = () => {
  const [searchParams] = useSearchParams();

  // Let sports FromUrl always an array. If it's singular, we use [{value}]
  let sportsFromUrl
  if (searchParams?.get("sports")) {
    sportsFromUrl = [searchParams.get("sports")]
  } else {
    sportsFromUrl = ""
  }
  console.log(sportsFromUrl)

  // const { dropIns, loading } = useDropIns()

  return (
    <div className="h-full flex flex-col bg-black">
      <SearchBar className="bg-white h-[10%] flex items-center gap-4 px-5" />
      <div className="h-[90%] w-screen flex">
        <ResultCards className="w-[40%] h-full p-3 overflow-y-auto flex flex-col gap-y-3" linkToLocation />
        <CalendarSchedule className="w-[60%] flex flex-col bg-white p-5 items-center justify-center font-bold" />
      </div>
    </div>
  );
};




const SearchBar = ({ className }: { className: string }) => {

  const { setFilters } = useFilters()
  const [searchInput, setSearchInput] = useState<string>()

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const utcDate = new Date(`${value}T00:00:00-04:00`).toISOString();

    setFilters((prev) => ({
      ...prev,
      [name]: utcDate,
    }));
  };

  const handleAddFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();


    const newSport = searchInput?.trim();

    if (!newSport) return; // ignore empty input


    setFilters((prev) => {
      const currentSports = prev.sports || [];
      // prevent duplicates (case-insensitive)
      if (currentSports.some(s => s.toLowerCase() === newSport.toLowerCase())) {
        return prev;
      }

      return {
        ...prev,
        sports: [...currentSports, newSport],
      };
    });

    setSearchInput("");
  }

  const handleRemoveFilter = (sportToRemove: string) => {
    setFilters((prev) => ({
      ...prev,
      sports: prev.sports.filter((s) => s !== sportToRemove),
    }));
  };

  return (
    <div className={`${className}`}>
      <div className="w-[40%] flex gap-x-2">
        <div className="w-[80%] px-3 py-2 border border-black rounded flex gap-x-1">
          <FilterChips
            className="max-w-[30%] h-full flex flex-wrap gap-2"
            handleRemoveFilter={handleRemoveFilter} />

          <input
            name="sports"
            value={searchInput}
            onChange={handleSearchInputChange}
            placeholder="Search for a sport or sports..."
            className="flex-1 h-full"
          />
        </div>

        <button
          className="w-[20%] px-3 py-2 border border-black rounded"
          onClick={handleAddFilter}
        >Add Filter</button>
      </div>

      <div className="w-[60%] flex gap-3">
        <input
          name="age"
          placeholder="Age"
          type="number"
          min="6"
          className="flex-1 px-2 py-2 border rounded"
          onChange={(e) => setFilters((prev) => ({ ...prev, age: Number(e.target.value) }))}
        />

        <input name="beginDate" type="date" className="flex-1 px-2 py-2 border rounded" onChange={handleDateChange} />
        <input name="endDate" type="date" className="flex-1 px-2 py-2 border rounded" onChange={handleDateChange} />

        <select
          name="location"
          className="flex-1 px-2 py-2 border rounded"
          onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
        >
          <option value="">Location</option>
        </select>
      </div>
    </div>
  );
};

export default DropIns;