import { useState, useEffect } from "react";

export function meta() {
  return [
    { title: "Sports" },
    { name: "description", content: "Available drop-ins for sports" },
  ];
}

export default function Sports() {
  const [dropIns, setDropIns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/times/Volleyball?dateBegin=2025-10-1&dateEnd=2025-10-3")
      .then((res) => res.json())
      .then((data) => {
        setDropIns(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching drop-ins:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading drop-ins...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Available Drop-Ins</h2>
      {dropIns.length === 0 ? (
        <p>No programs found.</p>
      ) : (
        <ul className="mt-2 list-disc list-inside">
          {dropIns.map((item) => (
            <li key={item.DropInId}>
              <strong>{item.CourseTitle}</strong> at {item.LocationName} (
              {item.StartHour}:00 - {item.EndHour}:00)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}