import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Sports from "./pages/Sports.js";
import Locations from "./pages/Locations.js";
import CommunityCenter from "./pages/CommunityCenter.js";

export default function App() {
  return (
    <div className="h-screen bg-white flex flex-col">
      <Router>
        {/* Top nav (shared) */}
        <div className=" h-[8%] flex items-center justify-start bg-black gap-10 px-20 text-white">
          <Link to="/" className="font-bold text-xl">DropInToronto</Link>
          <Link to="/sports" className="text-sm font-bold">Sports</Link>
          <Link to="/locations" className="text-sm font-bold">Locations</Link>
        </div>
        {/* Main content */}
        <div className="h-[92%] flex-1 w-full">
          <Routes>
            <Route
              path="/"
              element={
                <div className="flex justify-center items-center h-full">
                  <div className="w-[60%]">
                    <h3 className="text-black font-bold text-[50px] mb-[80px]">
                      What do you want to play today?
                    </h3>
                    <div className="flex items-center w-[60%]">
                      <input
                        placeholder="Type a sport..."
                        className="w-[70%] h-[40px] px-3 border rounded"
                      />
                      <button className="w-[30%] ml-5 bg-black text-white rounded-xl h-[40px]">
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              }
            />
            <Route path="/sports" element={<Sports />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/locations/:communityCenterId" element={<CommunityCenter />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}