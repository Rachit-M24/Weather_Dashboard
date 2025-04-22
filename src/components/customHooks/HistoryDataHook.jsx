import { useState, useEffect } from 'react';
import axios from 'axios';

export const useHistoricalAirPollution = (
  lat,
  lon,
  start,
  end,
  apiKey
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!lat || !lon || !start || !end || !apiKey) {
          throw new Error('Missing required parameters from historical air pollution hook');
        }

        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_AQI_HISTORY_READ_API}`,
          {
            params: {
              lat,
              lon,
              start,
              end,
              appid: apiKey
            }
          }
        );
        
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch historical air pollution data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lat, lon]);

  return { data, loading, error };
};