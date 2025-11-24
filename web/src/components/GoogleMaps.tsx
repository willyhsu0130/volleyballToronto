import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "";

export const GoogleMaps = ({ address, className }: { address: string, className: string }) => {
  const [coords, setCoords] = useState<{ lat: any, lng: any } | null>(null);
  // Get coordinates using address
  useEffect(() => {
    if (!address) return;

    const fetchCoords = async () => {
      console.log("Address:", address);
      const result = await getCoordinatesFromAddress({ address });
      setCoords(result);
    };

    fetchCoords();
  }, [address]);

  return (
    <div className={`${className}`}>
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        {coords ? (
          <Map
            zoom={12}
            center={coords}
            style={{ width: "100%", height: "400px" }}
            gestureHandling="greedy"        // enables dragging + scroll
            scrollwheel={true}              // enable zoom with wheel
            disableDoubleClickZoom={false}
            keyboardShortcuts={true}
            zoomControl={true}
            mapTypeControl={true}
            streetViewControl={false}
          >
            <Marker position={coords} />
          </Map>
        ) : (
          <div className="flex items-center justify-center h-[400px] bg-gray-100 text-gray-500">
            Loading map...
          </div>
        )}
      </APIProvider>
    </div>
  );
};

async function getCoordinatesFromAddress({ address }: { address: string }) {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();

    if (data.status === "OK") {
      const { lat, lng } = data.results[0].geometry.location;
      console.log("Geocoded result:", lat, lng);
      return { lat, lng };
    } else {
      console.error("Geocoding error:", data.status);
      return { lat: null, lng: null };
    }
  } catch (err) {
    console.error("Error fetching geocode:", err);
    return { lat: null, lng: null };;
  }
}

export const GoogleMapsEmbed = ({ address, className }: { address: string, className: string }) => {
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <div className={`${className}`}>
      <iframe
        className="h-full"
        title="GoogleMapsEmbed"
        src={mapUrl}
        width="100%"
        height="100%"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};