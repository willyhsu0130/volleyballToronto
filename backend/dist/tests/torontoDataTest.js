const ddateDataMerge = ({ date, hour, minute }) => {
    console.log(date, hour, minute);
    if (!date)
        return null;
    if (hour == null)
        return null;
    if (minute == null)
        minute = 0;
    const [y, m, d] = date.split("-").map(Number);
    console.log(y, m, d);
    if (!y || !m || !d)
        return null;
    const hh = Number(hour);
    const mm = Number(minute);
    const torontoString = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")} ${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
    console.log(torontoString);
    const parsed = new Date(torontoString);
    return parsed;
};
const data = {
    "id": 14616,
    "LocationID": 675,
    "CourseID": 86137,
    "CourseTitle": "Volleyball",
    "Section": "Sports - Drop-In",
    "AgeMin": 19,
    "AgeMax": "",
    "FirstDate": "2025-11-27",
    "LastDate": "2025-11-27",
    "StartHour": 19,
    "StartMinute": 0,
    "EndHour": 22,
    "EndMinute": null
};
const UTCDate = ddateDataMerge({ date: data.FirstDate, hour: data.StartHour, minute: data.StartMinute });
console.log("Database Date", UTCDate);
const formattedDateTime = UTCDate?.toLocaleString("en-CA", {
    timeZone: "America/Toronto",
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
});
console.log("Converted back", formattedDateTime);
export {};
