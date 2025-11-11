import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { DropInsProvider } from "./context/DropInContext";
import { FilterProvider } from "./context/FiltersContext"
import { useState } from "react";
import DropIns from "./pages/DropIns";
import Locations from "./pages/Locations";
import CommunityCenter from "./pages/CommunityCenter";
import DropInProgram from "./pages/DropInProgram";
import Login from "./pages/(auth)/Login";
import Signup from "./pages/(auth)/SignUp";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorScreen} from "./components/errors/ErrorFallBack"
import { AuthProvider } from "./context/AuthContext";

const REACT_APP_SERVER_API = process.env.REACT_APP_SERVER_API || "localhost:3000";

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
        <div className="h-[8%] flex items-center justify-between bg-black">
          <div className="flex items-center gap-10 px-20 text-white">
            <Link to="/" className="font-bold text-xl">DropInToronto</Link>
            <Link to="/dropins" className="text-sm font-bold">Dropins</Link>
            <Link to="/locations" className="text-sm font-bold">Locations</Link>
          </div>
          <div className="text-white flex items-center gap-10 px-5">
            <Link to="/login" className="text-sm font-bold">Login</Link>
          </div>
        </div>

        {/* Main content */}
        <ErrorBoundary
          FallbackComponent={ErrorScreen}
          onReset={() => {
            // You can reset any state or navigation here
            window.location.reload();
          }}
        >
          <AuthProvider>
            <FilterProvider>
              <DropInsProvider>
                <div className="h-[92%] flex-1 w-full">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/dropins" element={<DropIns />} />
                    <Route path="/locations" element={<Locations />} />
                    <Route path="/locations/:communityCenterId" element={<CommunityCenter />} />
                    <Route path="/dropins/:dropInId" element={<DropInProgram />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                  </Routes>
                </div>
              </DropInsProvider>
            </FilterProvider>
          </AuthProvider>
        </ErrorBoundary>
      </Router>
    </div>
  );
}