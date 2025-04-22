import { useState } from "react";

const useAQIByCity = () => {
  const [aqiData, setAqiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAQIByCity = async (cityName) => {
    if (!cityName) return;

    setLoading(true);
    setError(null);
    setAqiData(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_WAQI_API}/${encodeURIComponent(cityName)}/?token=${
          import.meta.env.VITE_WAQI_API_KEY
        }`
      );
      const data = await response.json();

      if (data.status === "ok") {
        const transformedData = {
          aqi: data.data.aqi,
          time: data.data.time.s,
          city: {
            name: data.data.city.name,
            geo: data.data.city.geo,
          },
          pollutants: data.data.iaqi,
        };
        setAqiData(transformedData);
      } else {
        throw new Error(data.message || "Failed to fetch AQI data");
      }
    } catch (err) {
      setError(err.message || "Error fetching AQI data");
    } finally {
      setLoading(false);
    }
  };

  return { aqiData, loading, error, fetchAQIByCity };
};

export default useAQIByCity;
