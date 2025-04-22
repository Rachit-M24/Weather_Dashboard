import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGeoLocation } from "../customHooks/UseGeoLocation";
import {
  Wind,
  MapPin,
  AlertTriangle,
  Info,
  Droplets,
  Thermometer,
  Activity,
  Gauge,
  Calendar,
  Sun,
  CloudRain,
  Navigation,
} from "lucide-react";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useHistoricalAirPollution } from "../customHooks/HistoryDataHook";
import {
  getHealthImplications,
  getAQICategory,
} from "../Helpers/HealthImplications";
// import AQIGauge from "../../pages/AQIGauge";
import WeatherCard from "../Cards/WeatherCard";
import PollutantInfoCard from "../Cards/PollutantInfoCard";

ChartJS.register(
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Home = () => {
  const navigate = useNavigate();
  let {
    long,
    lat,
    city,
    state,
    country,
    error: locationError,
  } = useGeoLocation();

  const end = Math.floor(Date.now() / 1000);
  const start = end - 7 * 24 * 60 * 60;

  const {
    data,
    loading,
    error: pollutionError,
  } = useHistoricalAirPollution(
    lat,
    long,
    start,
    end,
    `${import.meta.env.VITE_OPENWEATHER_API_KEY}`
  );

  const { currentAQI, aqiStatus, chartData, chartOptions, stats, pollutants } =
    useMemo(() => {
      if (!data) return {};

      const currentData = data.list[0] || {};
      const currentAQI = currentData.main?.aqi || 0;
      const aqiStatus = getAQICategory(currentAQI);

      // Process historical data for charts
      const dailyData = {};
      data.list.forEach((item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });

        if (!dailyData[date]) {
          dailyData[date] = {
            aqi: [],
            pm2_5: [],
            pm10: [],
            no2: [],
            so2: [],
            co: [],
            o3: [],
          };
        }

        Object.keys(dailyData[date]).forEach((key) => {
          if (key === "aqi") {
            dailyData[date][key].push(item.main.aqi);
          } else if (item.components[key]) {
            dailyData[date][key].push(item.components[key]);
          }
        });
      });

      // Prepare chart data
      const chartLabels = Object.keys(dailyData);
      const datasets = [
        {
          label: "AQI",
          data: chartLabels.map((date) => {
            const values = dailyData[date].aqi;
            return Math.round(
              values.reduce((a, b) => a + b, 0) / values.length
            );
          }),
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: chartLabels.map((date) => {
            const values = dailyData[date].aqi;
            const avg = values.reduce((a, b) => a + b, 0) / values.length;
            return getAQICategory(avg).color;
          }),
          pointRadius: 5,
          pointHoverRadius: 8,
          borderWidth: 3,
          yAxisID: "y",
        },
        {
          label: "PM2.5 (μg/m³)",
          data: chartLabels.map((date) => {
            const values = dailyData[date].pm2_5;
            return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(
              1
            );
          }),
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.2)",
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 7,
          yAxisID: "y1",
        },
        {
          label: "NO2 (μg/m³)",
          data: chartLabels.map((date) => {
            const values = dailyData[date].no2;
            return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(
              1
            );
          }),
          borderColor: "#f59e0b",
          backgroundColor: "rgba(245, 158, 11, 0.2)",
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 7,
          yAxisID: "y1",
        },
      ];

      const chartData = {
        labels: chartLabels,
        datasets: datasets,
      };

      const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            position: "top",
            labels: {
              color: "#1e293b",
              font: {
                size: 13,
                weight: "500",
              },
              padding: 20,
              usePointStyle: true,
              pointStyle: "circle",
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw;
                let label = context.dataset.label || "";
                if (label.includes("AQI")) {
                  const status = getAQICategory(value);
                  return `${label}: ${value} (${status.status})`;
                }
                return `${label}: ${value}`;
              },
            },
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            padding: 12,
            titleFont: { size: 14, weight: "600" },
            bodyFont: { size: 13 },
            footerFont: { size: 12 },
            borderColor: "rgba(255, 255, 255, 0.1)",
            borderWidth: 1,
            cornerRadius: 8,
          },
          title: {
            display: true,
            text: "7-Day Air Quality Trends",
            color: "#1e293b",
            font: { size: 18, weight: "600" },
            padding: { bottom: 20 },
          },
        },
        scales: {
          y: {
            type: "linear",
            display: true,
            position: "left",
            title: {
              display: true,
              text: "AQI",
              color: "#3b82f6",
              font: { weight: "bold" },
            },
            min: 0,
            max: Math.max(500, currentAQI + 50),
            ticks: {
              color: "#64748b",
              font: { size: 12 },
            },
            grid: {
              color: "rgba(100, 116, 139, 0.1)",
            },
          },
          y1: {
            type: "linear",
            display: true,
            position: "right",
            title: {
              display: true,
              text: "Pollutants (μg/m³)",
              color: "#64748b",
              font: { weight: "bold" },
            },
            ticks: {
              color: "#64748b",
              font: { size: 12 },
            },
            grid: {
              drawOnChartArea: false,
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "#64748b",
              font: { size: 12 },
            },
          },
        },
        animation: {
          duration: 1500,
          easing: "easeInOutQuart",
        },
      };

      // Stats cards data
      const stats = [
        {
          icon: <Gauge className="h-6 w-6" />,
          label: "Air Quality Index",
          value: currentAQI,
          unit: "AQI",
          color: aqiStatus.color,
          description: aqiStatus.status,
          trend: calculateTrend(data.list.map((item) => item.main.aqi)),
        },
        {
          icon: <Droplets className="h-6 w-6" />,
          label: "PM2.5",
          value: currentData.components?.pm2_5?.toFixed(1) || 0,
          unit: "μg/m³",
          safeLevel: 12,
          description: "Fine particulate matter",
          color: getPollutantColor("pm2_5", currentData.components?.pm2_5),
        },
        {
          icon: <CloudRain className="h-6 w-6" />,
          label: "PM10",
          value: currentData.components?.pm10?.toFixed(1) || 0,
          unit: "μg/m³",
          safeLevel: 45,
          description: "Coarse particulate matter",
          color: getPollutantColor("pm10", currentData.components?.pm10),
        },
        {
          icon: <Thermometer className="h-6 w-6" />,
          label: "NO2",
          value: currentData.components?.no2?.toFixed(1) || 0,
          unit: "μg/m³",
          safeLevel: 25,
          description: "Nitrogen dioxide",
          color: getPollutantColor("no2", currentData.components?.no2),
        },
        {
          icon: <Sun className="h-6 w-6" />,
          label: "O3",
          value: currentData.components?.o3?.toFixed(1) || 0,
          unit: "μg/m³",
          safeLevel: 60,
          description: "Ozone",
          color: getPollutantColor("o3", currentData.components?.o3),
        },
        {
          icon: <Activity className="h-6 w-6" />,
          label: "SO2",
          value: currentData.components?.so2?.toFixed(1) || 0,
          unit: "μg/m³",
          safeLevel: 20,
          description: "Sulfur dioxide",
          color: getPollutantColor("so2", currentData.components?.so2),
        },
      ];

      // Detailed pollutant information
      const pollutants = [
        {
          name: "PM2.5",
          value: currentData.components?.pm2_5?.toFixed(1) || 0,
          unit: "μg/m³",
          description:
            "Fine inhalable particles with diameters 2.5 micrometers and smaller",
          sources: "Vehicle emissions, power plants, wildfires, wood burning",
          effects:
            "Can penetrate deep into lungs, enter bloodstream; linked to heart and lung disease",
          safeLevel: 12,
          color: getPollutantColor("pm2_5", currentData.components?.pm2_5),
        },
        {
          name: "PM10",
          value: currentData.components?.pm10?.toFixed(1) || 0,
          unit: "μg/m³",
          description:
            "Inhalable particles with diameters 10 micrometers and smaller",
          sources: "Dust, pollen, mold, construction, agriculture",
          effects:
            "Can irritate eyes, nose and throat; aggravate respiratory conditions",
          safeLevel: 45,
          color: getPollutantColor("pm10", currentData.components?.pm10),
        },
        {
          name: "NO2",
          value: currentData.components?.no2?.toFixed(1) || 0,
          unit: "μg/m³",
          description: "Nitrogen dioxide, a reddish-brown gas with sharp odor",
          sources:
            "Fuel combustion (vehicles, power plants), industrial processes",
          effects:
            "Respiratory irritant, can worsen asthma and increase susceptibility to infections",
          safeLevel: 25,
          color: getPollutantColor("no2", currentData.components?.no2),
        },
        {
          name: "O3",
          value: currentData.components?.o3?.toFixed(1) || 0,
          unit: "μg/m³",
          description:
            "Ground-level ozone (not the protective layer in upper atmosphere)",
          sources:
            "Formed when pollutants react in sunlight (vehicle emissions, industrial chemicals)",
          effects:
            "Chest pain, coughing, throat irritation; can reduce lung function",
          safeLevel: 60,
          color: getPollutantColor("o3", currentData.components?.o3),
        },
        {
          name: "SO2",
          value: currentData.components?.so2?.toFixed(1) || 0,
          unit: "μg/m³",
          description: "Sulfur dioxide, a colorless gas with sharp odor",
          sources: "Burning fossil fuels (coal, oil), industrial processes",
          effects: "Respiratory problems, aggravates asthma, forms acid rain",
          safeLevel: 20,
          color: getPollutantColor("so2", currentData.components?.so2),
        },
        {
          name: "CO",
          value: currentData.components?.co?.toFixed(1) || 0,
          unit: "mg/m³",
          description: "Carbon monoxide, a colorless, odorless gas",
          sources: "Incomplete combustion (vehicles, generators, furnaces)",
          effects:
            "Reduces oxygen delivery to body; headaches, dizziness at low levels; fatal at high levels",
          safeLevel: 4,
          color: getPollutantColor("co", currentData.components?.co),
        },
      ];

      return {
        currentAQI,
        aqiStatus,
        chartData,
        chartOptions,
        stats,
        pollutants,
      };
    }, [data]);

  // Helper function to calculate trend (up/down/stable)
  function calculateTrend(values) {
    if (!values || values.length < 2) return "stable";
    const recent = values.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const older = values.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
    const diff = recent - older;

    if (Math.abs(diff) < 5) return "stable";
    return diff > 0 ? "up" : "down";
  }

  // Helper function to get color based on pollutant levels
  function getPollutantColor(pollutant, value) {
    if (!value) return "#64748b";

    const safeLevels = {
      pm2_5: [12, 35, 55, 150, 250],
      pm10: [45, 100, 150, 200, 300],
      no2: [25, 50, 100, 200, 400],
      o3: [60, 100, 140, 180, 240],
      so2: [20, 50, 100, 200, 350],
      co: [4, 9, 15, 30, 50],
    };

    const colors = [
      "#00E400",
      "#FFFF00",
      "#FF7E00",
      "#FF0000",
      "#8F3F97",
      "#7E0023",
    ];

    for (let i = 0; i < safeLevels[pollutant].length; i++) {
      if (value <= safeLevels[pollutant][i]) return colors[i];
    }
    return colors[5];
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
            <p className="text-center mt-4 text-gray-600">
              Loading air quality data...
            </p>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Fetching latest measurements for your location
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (locationError || pollutionError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600 mb-4">
            {locationError ||
              pollutionError ||
              "Unable to fetch air quality data"}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
            <button
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors"
              onClick={() => navigate("/")}
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
    
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="h-80">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Gauge className="w-5 h-5 text-blue-500" />
                Current Air Quality
              </h2>
              <p
                className="text-lg font-medium"
                style={{ color: aqiStatus.color }}
              >
                {aqiStatus.status} {aqiStatus.emoji}
              </p>
              <p className="text-gray-600 text-sm">
                {getHealthImplications(currentAQI)}
              </p>
              {/* </div> */}
            </div>

            <WeatherCard lat={lat} lon={long} city={city} country={country} />
          </div>


          {/* Pollutant Details */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Pollutant Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pollutants.map((pollutant, index) => (
                <PollutantInfoCard
                  key={index}
                  name={pollutant.name}
                  value={pollutant.value}
                  unit={pollutant.unit}
                  description={pollutant.description}
                  sources={pollutant.sources}
                  effects={pollutant.effects}
                  safeLevel={pollutant.safeLevel}
                  color={pollutant.color}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Current Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Current Measurements
            </h2>
            <div className="space-y-4">
              {stats?.map((stat, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    {React.cloneElement(stat.icon, {
                      className: "h-5 w-5",
                      style: { color: stat.color },
                    })}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-gray-700 font-medium">
                        {stat.label}
                      </h3>
                      <p
                        className="text-lg font-semibold"
                        style={{ color: stat.color }}
                      >
                        {stat.value}{" "}
                        <span className="text-sm text-gray-500">
                          {stat.unit}
                        </span>
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {stat.description}
                    </p>
                    {stat.trend && (
                      <div className="flex items-center mt-1">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            stat.trend === "up"
                              ? "bg-red-100 text-red-800"
                              : stat.trend === "down"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {stat.trend === "up"
                            ? "Increasing"
                            : stat.trend === "down"
                            ? "Decreasing"
                            : "Stable"}
                        </span>
                        {stat.safeLevel && (
                          <span className="text-xs text-gray-500 ml-2">
                            Safe level: {stat.safeLevel}
                            {stat.unit}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Health Advisory */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Health Advisory
            </h2>
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-gray-800 font-medium">
                  {getHealthImplications(currentAQI)}
                </p>
              </div>

              {currentAQI > 100 ? (
                <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                  <p className="text-red-800 font-medium mb-2">
                    ⚠️ Recommended Precautions:
                  </p>
                  <ul className="space-y-2">
                    {currentAQI <= 150 && (
                      <li className="flex items-start gap-2">
                        <span className="text-red-500">•</span>
                        <span>
                          Sensitive groups should reduce prolonged/heavy outdoor
                          exertion
                        </span>
                      </li>
                    )}
                    {currentAQI > 150 && currentAQI <= 200 && (
                      <>
                        <li className="flex items-start gap-2">
                          <span className="text-red-500">•</span>
                          <span>
                            Everyone may begin to experience health effects
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-500">•</span>
                          <span>
                            Sensitive groups should avoid prolonged/heavy
                            exertion
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-500">•</span>
                          <span>Consider reducing outdoor activities</span>
                        </li>
                      </>
                    )}
                    {currentAQI > 200 && (
                      <>
                        <li className="flex items-start gap-2">
                          <span className="text-red-500">•</span>
                          <span>Avoid outdoor activities when possible</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-500">•</span>
                          <span>Close windows to avoid dirty outdoor air</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-500">•</span>
                          <span>Use air purifiers if available</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-500">•</span>
                          <span>Sensitive groups should remain indoors</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-500">•</span>
                          <span>
                            Monitor for symptoms like coughing or difficulty
                            breathing
                          </span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              ) : (
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <p className="text-green-800 font-medium">
                    ✅ Current air quality is generally safe for most
                    activities.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* AQI Scale */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              AQI Scale
            </h2>
            <div className="space-y-3">
              {[0, 51, 101, 151, 201, 301].map((min, index) => {
                const range = getAQICategory(min + 25); 
                const max =
                  index < 5 ? [51, 101, 151, 201, 301, 500][index] : 500;
                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer transition-all hover:shadow-sm ${
                      aqiStatus.min === min ? "ring-2 ring-blue-500" : ""
                    }`}
                    style={{
                      backgroundColor: `${range.color}10`,
                      borderLeft: `4px solid ${range.color}`,
                    }}
                    onClick={() => navigate(`/aqi-info?level=${min}-${max}`)}
                  >
                    <span className="text-2xl">{range.emoji}</span>
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {range.status}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {min}-{max} AQI
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>      
    </div>
  );
};

export default Home;
