"react";
import { Link } from "react-router-dom";
import { useDropIns, DropIn } from "../context/DropInContext";


interface ResultCardProps {
  item: DropIn
  linkToLocation: boolean

}
const ResultCard = ({ item, linkToLocation }: ResultCardProps) => {

  if (!item.BeginDate || !item.EndDate) return null;

  const begin = new Date(item.BeginDate);
  const end = new Date(item.EndDate);

  const formattedDateTime = begin.toLocaleString("en-CA", {
    timeZone: "America/Toronto",
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const formattedEndTime = end.toLocaleTimeString("en-CA", {
    timeZone: "America/Toronto",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-md hover:bg-gray-50 transition cursor-pointer">
      <Link to={`/dropins/${item.DropInId}`}>
        <h3 className="font-bold text-lg hover:underline">{item.CourseTitle}</h3>
      </Link>
      {linkToLocation ? (
        <Link to={`/locations/${item.LocationId}`}>
          <p className="text-gray-700 hover:underline">{item.LocationName}</p>
        </Link>
      ) : (
        <p className="text-gray-700">{item.LocationName}</p>
      )}

      <span className="text-sm text-gray-500 mr-4">
        {formattedDateTime} - {formattedEndTime}
      </span>
      <span className="text-sm text-gray-500">
        {item.AgeMax == null || item.AgeMax === 0 || item.AgeMax === "None"
          ? `${item.AgeMin}+`
          : `${item.AgeMin}-${item.AgeMax}`}
      </span>
    </div>
  );
};


interface ResultCardsProps {
  className: string
  linkToLocation: boolean

}

export const ResultCards = ({
  className,
  linkToLocation
}: ResultCardsProps) => {

  const { loading, dropIns } = useDropIns()

  const displayMessage = () => {
    if (loading) {
      return "Loading Results..."
    } else {
      return dropIns && <p>Search Results {dropIns?.length}</p>
    }
  }

  return (
    <div className={`${className}`}>
      <p className="text-white">{displayMessage()}</p>
      {
        dropIns?.map((item, index) => (
          <ResultCard item={item} key={index} linkToLocation={linkToLocation} />
        ))
      }
    </div>
  )

}

