import React, { useEffect, useState } from 'react';
import { Thermometer, Droplets, Wind, Gauge, Sunrise, Sunset, Cloud, CloudRain, CloudSun } from 'lucide-react';

const WeatherCard = ({ lat, lon, city, country }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}&units=metric`
        );
        if (!response.ok) throw new Error('Weather data not available');
        const data = await response.json();
        setWeatherData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (lat && lon) fetchWeatherData();
  }, [lat, lon]);

  const getWeatherIcon = (main) => {
    switch (main) {
      case 'Clear':
        return <Sunrise className="w-6 h-6 text-yellow-500" />;
      case 'Rain':
        return <CloudRain className="w-6 h-6 text-blue-500" />;
      case 'Clouds':
        return <Cloud className="w-6 h-6 text-gray-500" />;
      case 'Snow':
        return <CloudSnow className="w-6 h-6 text-blue-200" />;
      default:
        return <CloudSun className="w-6 h-6 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 h-full flex items-center justify-center text-center">
        <div>
          <Cloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Weather data unavailable</p>
        </div>
      </div>
    );
  }

  if (!weatherData) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        {getWeatherIcon(weatherData.weather[0].main)}
        Current Weather
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 flex items-center justify-between mb-2">
          <div>
            <p className="text-gray-600">{city}, {country}</p>
            <p className="text-2xl font-bold">{Math.round(weatherData.main.temp)}°C</p>
            <p className="text-sm text-gray-500 capitalize">
              {weatherData.weather[0].description}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              Feels like {Math.round(weatherData.main.feels_like)}°C
            </p>
            <p className="text-sm text-gray-500">
              Humidity: {weatherData.main.humidity}%
            </p>
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-blue-600">
            <Thermometer className="w-5 h-5" />
            <span className="text-sm font-medium">High/Low</span>
          </div>
          <p className="text-lg font-semibold mt-1">
            {Math.round(weatherData.main.temp_max)}°/{Math.round(weatherData.main.temp_min)}°
          </p>
        </div>

        <div className="bg-green-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-green-600">
            <Droplets className="w-5 h-5" />
            <span className="text-sm font-medium">Humidity</span>
          </div>
          <p className="text-lg font-semibold mt-1">
            {weatherData.main.humidity}%
          </p>
        </div>

        <div className="bg-purple-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-purple-600">
            <Wind className="w-5 h-5" />
            <span className="text-sm font-medium">Wind</span>
          </div>
          <p className="text-lg font-semibold mt-1">
            {Math.round(weatherData.wind.speed * 3.6)} km/h
          </p>
        </div>

        <div className="bg-yellow-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-600">
            <Gauge className="w-5 h-5" />
            <span className="text-sm font-medium">Pressure</span>
          </div>
          <p className="text-lg font-semibold mt-1">
            {weatherData.main.pressure} hPa
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;