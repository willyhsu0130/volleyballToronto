import { useEffect, useState } from "react";
import { fetchLocations } from "../services/fetchers";
import { GoogleMaps } from "./GoogleMaps";

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
  const [hoverLocation, setHoverLocation] = useState("")

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
  const filteredLocations = locations.filter((loc) => {
    if (!searchTerm) {
      return {}
    }
    return loc.LocationName.toLowerCase().includes(searchTerm.toLowerCase())

  }

  );

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-5 w-4/5 h-[70%] animate-fadeIn flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-[20%]">
          <h2 className="text-xl font-semibold mb-4">Select a Location</h2>

          {/* Search bar */}
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search locations..."
            className="w-full px-3 py-2 mb-4 border rounded"
          />
        </div>

        <div className="flex h-full gap-x-3">
          <div className="w-3/5 h-[80%] overflow-y-auto">
            <ul className="flex flex-col gap-2">

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
                    onMouseEnter={() => setHoverLocation(loc.LocationName)}
                  >
                    {loc.LocationName}
                  </button>
                </li>
              ))}

              {filteredLocations.length === 0 && (
                <p className="text-gray-500 text-center py-4">No matching locations</p>
              )}
            </ul>
          </div>
          <GoogleMaps address={hoverLocation} className="w-full pointer-events-auto touch-pan-y" />
        </div>


      </div>
    </div>
  );
};