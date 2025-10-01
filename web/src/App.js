import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Sports from "./pages/Sports.js";
import Locations from "./pages/Locations.js";

export default function App() {
  return (
    <Router>
      <nav>
        <Link to="/sportsl">Sports</Link> |{" "}
        <Link to="/locations">Locations</Link>
      </nav>

      <Routes>
        <Route path="/sportsl" element={<Sports/>} />
        <Route path="/locations" element={<Locations />} />
      </Routes>
    </Router>
  );
}