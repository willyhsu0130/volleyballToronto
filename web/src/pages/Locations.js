import { useState, useEffect } from "react";

const useLocationSearch = (query) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      setLoading(true);
      fetch(`/locations?q=${encodeURIComponent(query)}&nameOnly=true`)
        .then((res) => res.json())
        .then((data) => setResults(data))
        .catch((err) => console.error("Error fetching locations:", err))
        .finally(() => setLoading(false));
    }, 300); // debounce 300ms

    return () => clearTimeout(timeoutId);
  }, [query]);

  return { results, loading };
};

const Locations = () => {
  

  return (
    <div className="flex flex-col items-center w-full p-6">
      <LocationQuery/>
    </div>
  );
};


const LocationQuery = () => {
  const [query, setQuery] = useState("");
  const { results, loading } = useLocationSearch(query);
  return (
    <div>
      {/* Search bar */}
      <div className="w-full max-w-lg">
        <input
          type="text"
          placeholder="Search community centers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 border rounded shadow"
        />
      </div>

      {/* Loading state */}
      {loading && <p className="mt-4">Loading...</p>}

      {/* Results as cards */}
      {results.length > 0 && (
        <div className="w-full max-w-5xl mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((loc) => (
            <div
              key={loc._id}
              className="p-6 bg-white shadow-lg rounded-lg border hover:shadow-xl cursor-pointer"
              onClick={() => setQuery(loc.LocationName)}
            >
              <h3 className="text-xl font-bold mb-2">{loc.LocationName}</h3>
              <p className="text-gray-600">Community Center</p>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && query && results.length === 0 && (
        <p className="mt-6 text-gray-500">No community centers found.</p>
      )}
    </div>
  )
}

export default Locations;