import React from 'react';
import { MapPin, Calendar, Wind, Droplets, Sun, ThermometerSun, Slice } from 'lucide-react';

const AQICard = ({ location, aqiData }) => {
  const getAQICategory = (aqi) => {
    if (aqi <= 50) return { label: 'Good', color: 'bg-green-500', textColor: 'text-green-700' };
    if (aqi <= 100) return { label: 'Moderate', color: 'bg-yellow-400', textColor: 'text-yellow-700' };
    if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', color: 'bg-orange-400', textColor: 'text-orange-700' };
    if (aqi <= 200) return { label: 'Unhealthy', color: 'bg-red-500', textColor: 'text-red-700' };
    if (aqi <= 300) return { label: 'Very Unhealthy', color: 'bg-purple-500', textColor: 'text-purple-700' };
    return { label: 'Hazardous', color: 'bg-rose-800', textColor: 'text-rose-900' };
  };

  const category = getAQICategory(aqiData.aqi);
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getPollutantIcon = (name) => {
    switch (name.toLowerCase()) {
      case 'pm25':
      case 'pm10':
        return <Wind className="h-5 w-5 text-gray-500" />;
      case 'o3':
        return <Sun className="h-5 w-5 text-gray-500" />;
      case 'no2':
        return <ThermometerSun className="h-5 w-5 text-gray-500" />;
      case 'so2':
        return <Droplets className="h-5 w-5 text-gray-500" />;
      case 'co':
        return <Droplets className="h-5 w-5 text-gray-500" />;
      default:
        return <Wind className="h-5 w-5 text-gray-500" />;
    }
  };

  const getHealthRecommendation = (aqi) => {
    if (aqi <= 50) {
      return "Air quality is considered satisfactory, and air pollution poses little or no risk. Enjoy outdoor activities.";
    } else if (aqi <= 100) {
      return "Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people. Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.";
    } else if (aqi <= 150) {
      return "Members of sensitive groups may experience health effects. The general public is not likely to be affected. People with heart or lung disease, older adults, and children should reduce prolonged or heavy exertion.";
    } else if (aqi <= 200) {
      return "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects. People with heart or lung disease, older adults, and children should avoid prolonged or heavy exertion. Everyone else should reduce prolonged or heavy exertion.";
    } else if (aqi <= 300) {
      return "Health warnings of emergency conditions. The entire population is more likely to be affected. People with heart or lung disease, older adults, and children should avoid all physical activity outdoors. Everyone else should avoid prolonged or heavy exertion.";
    } else {
      return "Health alert: everyone may experience more serious health effects. Everyone should avoid all outdoor physical activity.";
    }
  };

  // Convert iaqi pollutants to array format
  const pollutants = aqiData.pollutants ? Object.entries(aqiData.pollutants).map(([name, data]) => ({
    name: name.toUpperCase(),
    value: data.v,
    unit: name === 'pm25' || name === 'pm10' ? 'µg/m³' : 
          name === 'o3' ? 'ppb' : 
          name === 'no2' ? 'ppb' : 
          name === 'so2' ? 'ppb' : 
          name === 'co' ? 'ppm' : ''
  })) : [];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:shadow-lg transition-all duration-300">
      <div className={`${category.color} py-4 px-6`}>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-white text-2xl font-bold flex items-center">
              <MapPin className="h-6 w-6 mr-2" />
              {aqiData?.city?.name}
            </h2>
            <p className="text-white opacity-90">
              {aqiData.city?.name}
            </p>
          </div>
          <div className="text-center">
            <div className="text-white text-4xl font-bold">{aqiData.aqi}</div>
            <div className="text-white text-sm uppercase tracking-wide">AQI</div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center mb-4">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${category.textColor} bg-opacity-20 ${category.color.replace('bg-', 'bg-opacity-20 bg-')}`}>
            {category.label}
          </span>
          <span className="text-gray-500 text-sm ml-2 flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            Updated: {formatDate(aqiData.time)}
          </span>
        </div>
        
        {pollutants.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {pollutants.map((pollutant) => (
              <div key={pollutant.name} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-center mb-2">
                  {getPollutantIcon(pollutant.name)}
                  <h3 className="text-gray-800 font-medium ml-2">{pollutant.name}</h3>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-bold text-gray-900">{pollutant.value}</span>
                  <span className="text-sm text-gray-500">{pollutant.unit}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-6 border-t border-gray-100 pt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Health Recommendations</h3>
          <p className="text-gray-600">
            {getHealthRecommendation(aqiData.aqi)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AQICard;