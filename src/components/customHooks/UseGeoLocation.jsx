import axios from "axios";
import { useEffect, useState } from "react";

export const useGeoLocation = (options = {}) => {
  const [location, setLocation] = useState({
    lat: null,
    long: null,
    city: null,
    state: null,
    country: null,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: "Geolocation is not supported",
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation((prev) => ({ ...prev, lat: latitude, long: longitude }));

        try {
          const apiUrl = import.meta.env.VITE_LOCATION_API;
          if (!apiUrl) throw new Error("VITE_LOCATION_API is not defined");

          const response = await axios.get(apiUrl);
          const data = response.data;

          setLocation((prev) => ({
            ...prev,
            city: data.city,
            state: data.regionName,
            country: data.country,
          }));
        } catch (error) {
          console.error("API Fetch Error:", error);
          setLocation((prev) => ({
            ...prev,
            error: "Failed to fetch location data",
          }));
        }
      },
      (error) => {
        setLocation((prev) => ({ ...prev, error: error.message }));
      },
      options
    );
  }, [location.lat, location.long]);

  return location;
};
