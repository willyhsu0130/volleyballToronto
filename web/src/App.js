import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Sports from "./pages/Sports.js";
import Locations from "./pages/Locations.js";

export default function App() {
  return (
    <Router>
      <div className="h-full bg-amber-950">
        <nav>
          <Link to="/sports" className='text-red-100'>Sports</Link> |{" "}
          <Link to="/locations">Locations</Link>
        </nav>

        <Routes>
          <Route path="/sports" element={<Sports />} />
          <Route path="/locations" element={<Locations />} />
        </Routes>
      </div>
    </Router>
  );
}