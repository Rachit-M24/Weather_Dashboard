import { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

export const useAirPollution = (lat, lon, apiKey) => {
  const [data, setData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        debugger

        if (!lat || !lon || !apiKey) {
          throw new Error('Missing required parameters from air pollution hook');
        }

        setLoading(true);
        
        // Fetch current data
        const currentResponse = await axios.get(
          `${import.meta.env.VITE_WEATHER_API}`,
          {
            params: { lat, lon, appid: apiKey }
          }
        );
        
        setData(currentResponse.data);
      
        const end = Math.floor(Date.now() / 1000);
        const start = end - 24 * 3600;
        
        const historicalResponse = await axios.get(
          `${import.meta.env.VITE_AQI_HISTORY_READ_API}`,
          {
            params: { 
              lat, 
              lon, 
              appid: apiKey,
              start,
              end
            }
          }
        );
        
        const processedData = processHistoricalData(historicalResponse.data);
        setHistoricalData(processedData);
        
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch air pollution data');
      } finally {
        setLoading(false);
      }
    };

    const processHistoricalData = (data) => {
      return data.list.map(item => ({
        time: dayjs.unix(item.dt).format('h A'),
        aqi: item.main.aqi,
        pm25: item.components?.pm2_5 || 0,
        pm10: item.components?.pm10 || 0,
      }));
    };

    fetchData();
  }, [lat, lon, apiKey]);

  return { data, historicalData, loading, error };
};