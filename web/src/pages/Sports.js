import { useState, useEffect, } from "react"

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
      const localDate = new Date(value);

      // force interpret it as Toronto time
      const torontoTime = new Date(
        localDate.toLocaleString("en-US", { timeZone: "America/Toronto" })
      );

      // convert that to UTC ISO string
      const utcDate = new Date(
        torontoTime.getTime() - torontoTime.getTimezoneOffset() * 60000
      ).toISOString();

      setFilter((prev) => ({
        ...prev,
        [name]: utcDate
      }));
    } else {
      // Everything else (age, time, location, query, etc.)
      setFilter((prev) => ({
        ...prev,
        [name]: value
      }));
    }
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


const ResultCard = ({ item }) => {

  // Begin is in UTC
  const begin = new Date(item.BeginDate);

  // End is in UTC
  const end = new Date(item.EndDate);


  const formattedDateTime = begin.toLocaleString("en-CA", {
    timeZone: "America/Toronto",
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });

  const formattedEndTime = end.toLocaleTimeString("en-CA", {
    timeZone: "America/Toronto",
    hour: "numeric",
    minute: "2-digit"
  });

  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-md transition">
      <h3 className="font-bold text-lg">{item.CourseTitle}</h3>
      <p className="text-gray-700">{item.LocationName}</p>
      <span className="text-sm text-gray-500 mr-4">
        {formattedDateTime} - {formattedEndTime}
      </span>
      <span className="text-sm text-gray-500">
        {item.AgeMax == null || item.AgeMax === 0
          ? `${item.AgeMin}+`
          : `${item.AgeMin}–${item.AgeMax}`}
      </span>
    </div>
  );
}


const ResultCards = ({ className, list }) => {
  return (
    <>
      {list.length === 0 ? (
        <div className={`${className} flex flex-col items-center justify-center`}>
          <p className="text-white font-bold">No programs found</p>
        </div>

      ) : (
        <div className={`${className}`}>
          <p className="text-white">Search Results ( {list.length} )</p>
          {list?.map((item) => (
            <ResultCard item={item} />
          ))}
        </div>
      )}
    </>
  )
}


const Calendar = ({ className }) => {

  return (
    <div className={`${className}`}>
      <h3>Calendar</h3>
    </div>
  )
}
export default Sports;