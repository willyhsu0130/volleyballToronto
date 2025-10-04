import { useState, useEffect, } from "react"

const Sports = () => {
  const [dropIns, setDropIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilter] = useState({
    query: "",
    sport: "Volleyball",
    age: "",
    time: "",
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
    if (filters.time) params.append("time", filters.time);
    if (filters.location) params.append("location", filters.location);

    // final URL (use sport as the path param)
    const url = `https://volleyballtoronto.onrender.com/times/${filters.sport}?${params.toString()}`
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

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    // If it's a date input, convert it into UTC before saving
    if (name === "beginDate" || name === "endDate") {
      // The value from <input type="date"> is local YYYY-MM-DD
      const localDate = new Date(value);

      // Convert local -> UTC ISO string (so DB is consistent)
      const utcDate = new Date(
        localDate.getTime() - localDate.getTimezoneOffset() * 60000
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
          onChange={handleOnChange}
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
            onChange={handleOnChange}
          />
        </div>


        {/* Time filter */}
        <select
          className="flex-1 px-2 py-2 border rounded "
          name="time"
          onChange={handleOnChange}>
          <option value="">Time</option>
          <option value="morning">Morning (6am–12pm)</option>
          <option value="afternoon">Afternoon (12pm–5pm)</option>
          <option value="evening">Evening (5pm–10pm)</option>
        </select>

        {/* Date Begin filter */}
        <input
          name="beginDate"
          type="date"
          className="flex-1 px-2 py-2 border rounded"
          onChange={handleOnChange}
        />

        <input
          name="endDate"
          type="date"
          className="flex-1 px-2 py-2 border rounded"
          onChange={handleOnChange}
        />

        {/* Location filter */}
        <select
          name="location"
          className="flex-1 px-2 py-2 border rounded "
          onChange={handleOnChange}>
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


  const formattedDate = begin.toLocaleDateString("en-US", {
    timeZone: "America/Toronto",
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  console.log(formattedDate)

  const formattedTime = `${begin.toLocaleTimeString("en-US", {
    timeZone: "America/Toronto", 
    hour: "numeric",
    minute: "2-digit"
  })} – ${end.toLocaleTimeString("en-US", {
    timeZone: "America/Toronto", 
    hour: "numeric",
    minute: "2-digit"
  })}`;

  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-md transition">
      <h3 className="font-bold text-lg">{item.CourseTitle}</h3>
      <p className="text-gray-700">{item.LocationName}</p>
      <span className="text-sm text-gray-500 mr-4">
        {formattedTime}
      </span>
      <span className="text-sm text-gray-500 mr-4">
        {formattedDate}
      </span>
      <span className="text-sm text-gray-500">
        {item.AgeMax === "None"
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