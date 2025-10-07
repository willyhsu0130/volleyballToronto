import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import DropIns from "./pages/DropIns.js";
import Locations from "./pages/Locations.js";
import CommunityCenter from "./pages/CommunityCenter.js";

const REACT_APP_SERVER_API = process.env.REACT_APP_SERVER_API;

function HomePage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!query.trim()) return;
    navigate(`/dropins?sports=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-[60%]">
        <h3 className="text-black font-bold text-[50px] mb-[80px]">
          What do you want to play today?
        </h3>
        <div className="flex items-center w-[60%]">
          <input
            placeholder="Type a sport..."
            className="w-[70%] h-[40px] px-3 border rounded"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()} // enter key support
          />
          <button
            className="w-[30%] ml-5 bg-black text-white rounded-xl h-[40px]"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  // Warm up server
  fetch(REACT_APP_SERVER_API).then(() => console.log("Server warmed up"));

  return (
    <div className="h-screen bg-white flex flex-col">
      <title>DropInToronto</title>
      <Router>
        {/* Top nav */}
        <div className="h-[8%] flex items-center justify-start bg-black gap-10 px-20 text-white">
          <Link to="/" className="font-bold text-xl">DropInToronto</Link>
          <Link to="/dropins" className="text-sm font-bold">Dropins</Link>
          <Link to="/locations" className="text-sm font-bold">Locations</Link>
        </div>

        {/* Main content */}
        <div className="h-[92%] flex-1 w-full">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dropins" element={<DropIns />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/locations/:communityCenterId" element={<CommunityCenter />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}