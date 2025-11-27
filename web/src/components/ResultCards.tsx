"react";
import { Link } from "react-router-dom";
import { useDropIns, DropIn } from "../context/DropInContext";
import { useEffect } from "react";
import { Virtuoso } from "react-virtuoso";

import { lightTheme, darkTheme } from "../components/Themes"


interface ResultCardProps {
  item: DropIn
  linkToLocation: boolean
  setSelect?: React.Dispatch<React.SetStateAction<number | undefined>>;

}
const ResultCard = ({ item, linkToLocation, setSelect }: ResultCardProps) => {

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
    <div
      className={`p-4 flex flex-col items-start cursor-pointer 
    transition 
    bg-bgLight
    rounded-[24px]
    border-[3px]
    border-bgLight
    border-t-border
    shadow-lg
    hover:bg-bgDark
    mb-3
  `}
      onClick={() => setSelect?.(item.DropInId)}
    >
      <Link to={`/dropins/${item.DropInId}`}>
        <h3 className="font-bold text-lg hover:underline inline-block">{item.CourseTitle}</h3>
      </Link>
      {linkToLocation ? (
        <Link to={`/locations/${item.LocationId}`}>
          <p className="text-gray-700 hover:underlineinline-block">{item.LocationName}</p>
        </Link>
      ) : (
        <p className="text-gray-700 inline-block">{item.LocationName}</p>
      )}
      <div>
        <span className="text-sm text-gray-500 mr-4 inline">
          {formattedDateTime} - {formattedEndTime}
          UTC time: {item.BeginDate} - {item.EndDate}
        </span>

        <span className="text-sm text-gray-500 inline-block">
          {item.AgeMax == null || item.AgeMax === 0 || item.AgeMax === "None"
            ? `${item.AgeMin}+`
            : `${item.AgeMin}-${item.AgeMax}`}
        </span>
      </div>

    </div>
  );
};


interface ResultCardsProps {
  className: string
  linkToLocation: boolean
  setSelect?: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export const ResultCards = ({
  className,
  linkToLocation,
  setSelect

}: ResultCardsProps) => {

  const { loading, dropIns } = useDropIns()
  // useEffect(() => {
  //   if (dropIns[0]?.DropInId && setSelect) {
  //     setSelect(dropIns[0]?.DropInId)
  //   }

  // },[dropIns, setSelect])

  const displayMessage = () => {
    if (loading) {
      return "Loading Results..."
    } else {
      return dropIns && <p>Search Results {dropIns?.length}</p>
    }
  }

  return (
    <div className={`${className}`}>
      <div className="text-white">{displayMessage()}</div>
      <Virtuoso
        data={dropIns}
        itemContent={(_, item) =>(
          <ResultCard item={item} key={item.DropInId} linkToLocation={linkToLocation} setSelect={setSelect} />
        )}
      
      />

      {/* {
        dropIns?.map((item, index) => (
          <ResultCard item={item} key={item.DropInId} linkToLocation={linkToLocation} setSelect={setSelect} />
        ))
      } */}
    </div>
  )

}

