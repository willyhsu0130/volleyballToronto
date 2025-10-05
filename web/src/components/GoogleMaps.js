import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

export const GoogleMaps = ({
  address
}) => {
  const [coords, setCoords] = useState(null)

  // Fetch coords 
  useEffect(() =>{
    console.log("Address", address)
  })
  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <Map
        zoom={12}
        center={{ lat: 43.6532, lng: -79.3832 }} // Toronto
        style={{ width: "100%", height: "400px" }}
      />
    </APIProvider>
  )
}


async function getCoordinatesFromAddress(address) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
  );
  const data = await response.json();

  if (data.status === "OK") {
    const { lat, lng } = data.results[0].geometry.location;
    return { lat, lng };
  } else {
    console.error("Geocoding error:", data.status);
    return null;
  }
}