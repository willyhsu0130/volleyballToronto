import { useEffect, useState } from "react";
import { fetchLocations } from "../services/fetchers";

// Minimal type used by the popup
export interface LocationNameOnly {
  LocationId: number;
  LocationName: string;
}

export const LocationMenu = ({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (location: LocationNameOnly) => void;

}) => {

  const [locations, setLocations] = useState<LocationNameOnly[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch nameOnly locations ONCE
  useEffect(() => {
    const fetchLocs = async () => {
      const response = await fetchLocations(true); // your signature: (nameOnly: boolean)
      if (response.data) {
        setLocations(response.data as LocationNameOnly[]);
      }
    };
    fetchLocs();
  }, []);

  if (!open) return null;

  // Filter by search term
  const filteredLocations = locations.filter((loc) =>
    loc.LocationName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-5 w-4/5 max-h-[70vh] overflow-y-auto animate-fadeIn"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <h2 className="text-xl font-semibold mb-4">Select a Location</h2>

        {/* Search bar */}
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search locations..."
          className="w-full px-3 py-2 mb-4 border rounded"
        />

        <ul className="flex flex-col gap-2">

          {/* ⭐ "All Locations" option */}
          <li>
            <button
              className="w-full text-left px-3 py-2 rounded hover:bg-gray-200 border border-gray-300 font-semibold"
              onClick={() => {
                onSelect({
                  LocationId: 0,
                  LocationName: "All Locations"
                });
                onClose();
              }}
            >
            All Locations
            </button>
          </li>

          {/* Render filtered locations */}
          {filteredLocations.map((loc) => (
            <li key={loc.LocationId}>
              <button
                className="w-full text-left px-3 py-2 rounded hover:bg-gray-200 border border-gray-300"
                onClick={() => {
                  onSelect(loc);
                  onClose();
                }}
              >
                {loc.LocationName}
              </button>
            </li>
          ))}

          {filteredLocations.length === 0 && (
            <p className="text-gray-500 text-center py-4">No matching locations</p>
          )}
        </ul>

        <button
          className="mt-4 w-full py-2 border rounded bg-gray-100 hover:bg-gray-200"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};