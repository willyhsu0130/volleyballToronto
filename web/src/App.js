import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Sports from "./pages/Sports.js";
import Locations from "./pages/Locations.js";

export default function App() {
  return (
    <Router>
      <div className="h-screen bg-white flex flex-col">

        {/* Top nav (8% height) */}
        <div className="h-[8%] flex items-center justify-start bg-black gap-10 px-20 text-white">
          <Link to="/" className="font-bold text-xl">DropInToronto</Link>
          <Link to="/sports" className="text-sm">Sports</Link>
          <Link to="/locations"  className="text-sm">Locations</Link>
        </div>

        {/* Main content (84% height) */}
        <div className="flex justify-center items-center h-[84%] w-full">
          <Routes>
            <Route
              path="/"
              element={
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
              }
            />
            <Route path="/sports" element={<Sports />} />
            <Route path="/locations" element={<Locations />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}