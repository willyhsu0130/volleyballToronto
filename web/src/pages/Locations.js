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
                .then(res => res.json())
                .then(data => setResults(data))
                .catch(err => console.error("Error fetching locations:", err))
                .finally(() => setLoading(false));
        }, 300); // debounce 300ms

        return () => clearTimeout(timeoutId);
    }, [query]);

    return { results, loading };
}

const Locations = () => {
  const [query, setQuery] = useState("");
  const { results, loading } = useLocationSearch(query);

  return (
    <div style={{ width: "300px", margin: "20px auto" }}>
      <input
        type="text"
        placeholder="Search community centers..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: "100%", padding: "8px" }}
      />

      {loading && <p>Loading...</p>}

      {results.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, marginTop: "8px", border: "1px solid #ccc" }}>
          {results.map(loc => (
            <li 
              key={loc._id} 
              style={{ padding: "8px", cursor: "pointer" }}
              onClick={() => {
                setQuery(loc.LocationName);
              }}
            >
              {loc.LocationName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Locations