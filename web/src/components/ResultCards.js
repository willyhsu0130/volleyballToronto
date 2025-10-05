import { Link } from "react-router-dom";
const ResultCard = ({ item, linkToLocation }) => {
  // Begin is in UTC
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
      <h3 className="font-bold text-lg">{item.CourseTitle}</h3>
      {
        linkToLocation ?
          <Link to={`/locations/${item.LocationId}`}>
            <p className="text-gray-700 hover:underline">{item.LocationName}</p>
          </Link> :
          <p className="text-gray-700">{item.LocationName}</p>
      }

      <span className="text-sm text-gray-500 mr-4">
        {formattedDateTime} - {formattedEndTime}
      </span>
      <span className="text-sm text-gray-500">
        {item.AgeMax == null || item.AgeMax === 0
          ? `${item.AgeMin}+`
          : `${item.AgeMin}–${item.AgeMax}`}
      </span>
    </div>

  );
};


export const ResultCards = ({
  className,
  list,
  linkToLocation
}) => {
  if (!list) {
    return (<div>List not found</div>)
  }
  return (
    <>
      {list.length === 0 ? (
        <div className={`${className} flex flex-col items-center justify-center`}>
          <p className="text-white font-bold">No programs found</p>
        </div>

      ) : (
        <div className={`${className}`}>
          <p className="text-white">Search Results ( {list.length} )</p>
          {list?.map((item) => (
            <ResultCard item={item} linkToLocation={linkToLocation} />
          ))}
        </div>
      )}
    </>
  )
}