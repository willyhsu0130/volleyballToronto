import { useState, useEffect, } from "react"

const Sports = () => {
  const [dropIns, setDropIns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/times/Volleyball?dateBegin=2025-10-1&dateEnd=2025-10-3")
      .then((res) => res.json())
      .then((data) => {
        setDropIns(data);
        setLoading(false);
        console.log(data)
      })
      .catch((err) => {
        console.error("Error fetching drop-ins:", err);
        setLoading(false);
      });
  }, []); // run once on mount

  if (loading) return <p>Loading drop-ins...</p>;

  return (
    <div>
      <h2>Available Drop-Ins</h2>
      {dropIns.length === 0 ? (
        <p>No programs found.</p>
      ) : (
        <ul>
          {dropIns?.map((item) => (
            <li key={item.DropInId}>
              <strong>{`${item.CourseTitle} `}</strong>
              at {`${item.LocationName}`}
              ({item.StartHour}:00 - {item.EndHour}:00)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}



export default Sports;
