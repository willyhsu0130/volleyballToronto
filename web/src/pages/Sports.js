import { useState, useEffect, } from "react"
import { ResultCards } from "../components/ResultCards"
import { Calendar } from "../components/Calendar"

const REACT_APP_SERVER_API = process.env.REACT_APP_SERVER_API

console.log(REACT_APP_SERVER_API)

const Sports = () => {
  const [dropIns, setDropIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilter] = useState({
    query: "",
    sport: "Volleyball",
    age: "",
    beginDate: "",
    endDate: "",
    location: "",
  })

  useEffect(() => {
    console.log("refreshed")
    console.log(filters)
    // don't run until filters are set or at least sport chosen
    if (!filters.sport) return;

    // build query params from filters
    const params = new URLSearchParams();

    if (filters.beginDate) params.append("beginDate", filters.beginDate);
    if (filters.beginDate) params.append("endDate", filters.endDate);
    if (filters.age) params.append("age", filters.age);
    if (filters.location) params.append("location", filters.location);

    // final URL (use sport as the path param)
    const url = `${REACT_APP_SERVER_API}times/${filters.sport}?${params.toString()}`
    console.log("URL", url)
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setDropIns(data);
        setLoading(false);
        console.log("Fetched data:", data);
      })
      .catch((err) => {
        console.error("Error fetching drop-ins:", err);
        setLoading(false);
      });
  }, [filters]);

  if (loading) return <p>Loading drop-ins...</p>;

  return (
    <div className="h-full flex flex-col m-0 bg-black">
      <SearchBar className="bg-white h-[10%] flex items-center gap-4 px-5" setFilter={setFilter} />
      <div className="h-[90%] w-screen flex">

        <ResultCards className="w-[40%] h-full p-3 overflow-y-auto flex flex-col gap-y-3"
          list={dropIns}
          linkToLocation={true}
        />
        <Calendar className="w-[60%] flex flex-col bg-white p-5 items-center justify-center font-bold" />
      </div>
    </div>
  );
}

const SearchBar = ({
  className,
  setFilter
}) => {

  const handleAgeChange = (e) => {
    const { value } = e.target
    setFilter((prev) => ({
      ...prev,
      age: value
    }))
  }

  const handleDateChange = (e) => {
    const { name, value } = e.target;

    // If it's a date input, convert it into UTC before saving
    if (name === "beginDate" || name === "endDate") {
      // The value from <input type="date"> is local YYYY-MM-DD
      const torontoDate = new Date(`${value}T00:00:00-04:00`);
      // Note: -04:00 is Toronto offset for EDT (use -05:00 for winter months)

      const utcDate = torontoDate.toISOString(); // Convert to UTC ISO
      console.log("Toronto local midnight as UTC:", utcDate);

      setFilter((prev) => ({
        ...prev,
        [name]: utcDate
      }));
    } else
      // Everything else (age, time, location, query, etc.)
      setFilter((prev) => ({
        ...prev,
        [name]: value
      }));

  };
  return (
    <div className={`${className}`}>
      {/* Left: search input */}
      <div className="w-[40%]">
        <input
          name="query"
          placeholder="Search for sport, age, location, or community center..."
          className="w-full px-3 py-2 border border-black rounded"
          onChange={() => { }}
        />
      </div>

      {/* Right: filters */}
      <div className="w-[60%] flex gap-3">
        {/* Age filter */}
        <div className="flex-1">
          <input
            name="age"
            placeholder="Age"
            type="number"
            min="6"
            className=" px-2 py-2 border rounded"
            onChange={handleAgeChange}
          />
        </div>


        {/* Date Begin filter */}
        <input
          name="beginDate"
          type="date"
          className="flex-1 px-2 py-2 border rounded"
          onChange={handleDateChange}
        />

        <input
          name="endDate"
          type="date"
          className="flex-1 px-2 py-2 border rounded"
          onChange={handleDateChange}
        />

        {/* Location filter */}
        <select
          name="location"
          className="flex-1 px-2 py-2 border rounded "
          onChange={() => { }}>
          <option value="">Location</option>
        </select>
      </div>
    </div>
  );
};

export default Sports;