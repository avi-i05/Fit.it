import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";

const LocationMarker = ({ setLocation, setAddress }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    async click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      setPosition([lat, lng]);

      setLocation({
        type: "Point",
        coordinates: [lng, lat], 
      });


      try {
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
        );

        const data = await res.json();
        console.log(data);


        const addressParts = [
          data.locality,
          data.city || data.principalSubdivision,
          data.principalSubdivision,
          data.countryName,
        ].filter(Boolean);

        setAddress(addressParts.join(", "));
      } catch (err) {
        console.error("Map reverse geocode failed:", err);
      }
    },
  });

  return position ? <Marker position={position} /> : null;
};

const MapPicker = ({ setLocation, setAddress }) => {
  return (
    <MapContainer
      center={[28.6139, 77.2090]} // default center (Delhi)
      zoom={13}
      className="h-64 w-full rounded-xl"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationMarker
        setLocation={setLocation}
        setAddress={setAddress}
      />
    </MapContainer>
  );
};

export default MapPicker;