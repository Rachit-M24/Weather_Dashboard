export const AQI_RANGES = [
  { min: 0, max: 50, status: "Good", color: "#00E400", emoji: "😊" },
  { min: 51, max: 100, status: "Moderate", color: "#FFFF00", emoji: "😐" },
  { min: 101, max: 150, status: "Unhealthy for Sensitive Groups", color: "#FF7E00", emoji: "😷" },
  { min: 151, max: 200, status: "Unhealthy", color: "#FF0000", emoji: "🤢" },
  { min: 201, max: 300, status: "Very Unhealthy", color: "#8F3F97", emoji: "🤮" },
  { min: 301, max: 500, status: "Hazardous", color: "#7E0023", emoji: "💀" },
];

export const getAQICategory = (value) => 
  AQI_RANGES.find(range => value >= range.min && value <= range.max) || AQI_RANGES[0];

export const getHealthImplications = (value) => {
  const aqi = getAQICategory(value);
  
  switch (aqi.status) {
    case "Good":
      return "Air quality is satisfactory with little to no risk.";
    case "Moderate":
      return "Acceptable air quality, but some pollutants may affect sensitive individuals.";
    case "Unhealthy for Sensitive Groups":
      return "Members of sensitive groups may experience health effects (children, elderly, respiratory conditions).";
    case "Unhealthy":
      return "Increased likelihood of adverse effects in general public and more serious effects in sensitive groups.";
    case "Very Unhealthy":
      return "Health alert - risk of serious effects for everyone.";
    case "Hazardous":
      return "Health warning of emergency conditions - entire population likely affected.";
    default:
      return "Air quality data not available.";
  }
};

export const getPollutantGuidelines = (pollutant) => {
  const guidelines = {
    pm2_5: {
      good: 12,
      moderate: 35,
      unhealthySensitive: 55,
      unhealthy: 150,
      veryUnhealthy: 250
    },
    pm10: {
      good: 45,
      moderate: 100,
      unhealthySensitive: 150,
      unhealthy: 200,
      veryUnhealthy: 300
    },
    no2: {
      good: 25,
      moderate: 50,
      unhealthySensitive: 100,
      unhealthy: 200,
      veryUnhealthy: 400
    },
    o3: {
      good: 60,
      moderate: 100,
      unhealthySensitive: 140,
      unhealthy: 180,
      veryUnhealthy: 240
    },
    so2: {
      good: 20,
      moderate: 50,
      unhealthySensitive: 100,
      unhealthy: 200,
      veryUnhealthy: 350
    },
    co: {
      good: 4,
      moderate: 9,
      unhealthySensitive: 15,
      unhealthy: 30,
      veryUnhealthy: 50
    }
  };

  return guidelines[pollutant] || {};
};  