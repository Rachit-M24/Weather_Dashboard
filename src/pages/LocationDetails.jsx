import { useLocation } from "react-router-dom";
import { MapPin, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useAirPollution } from "../components/customHooks/UseAirPollution";
import { getAQICategory } from "../components/Helpers/HealthImplications";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

const LocationDetails = () => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const city = searchParams.get("city");
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  debugger
  const { data, historicalData, loading, error } = useAirPollution(
    lat,
    lon,
    apiKey
  );

  const chartData = {
    labels: data.map((item) => item.time),
    datasets: [
      {
        label: "PM2.5 (µg/m³)",
        data: data.map((item) => item.pm25),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "PM10 (µg/m³)",
        data: data.map((item) => item.pm10),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "24-Hour Air Quality History",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Concentration (µg/m³)",
        },
      },
    },
  };
  const currentAQI = data?.list?.[0]?.main?.aqi || 0;

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <Link to="/" className="flex items-center gap-2 text-blue-500 mb-4">
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <MapPin className="w-8 h-8 text-blue-500" />
        <h2 className="text-2xl font-bold text-gray-800">
          Detailed Air Quality for {city}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Location Information</h3>
          <div className="space-y-3">
            <p>
              <span className="font-medium">Coordinates:</span> {lat}, {lon}
            </p>
            <p>
              <span className="font-medium">City:</span> {city}
            </p>
            <p>
              <span className="font-medium">Current AQI:</span> {currentAQI}
            </p>
            <p
              className="text-lg font-medium"
              style={{ color: getAQICategory(currentAQI).color }}
            >
              {getAQICategory(currentAQI).status}{" "}
              {getAQICategory(currentAQI).emoji}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            Current Pollutant Levels
          </h3>
          {data?.list?.[0]?.components && (
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(data.list[0].components).map(([key, value]) => (
                <div key={key} className="bg-white p-3 rounded shadow">
                  <p className="font-medium capitalize">{key}</p>
                  <p>{value} µg/m³</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">
          24-Hour Air Quality History
        </h3>
        {historicalData.length > 0 ? (
          <div className="h-96">
            <Bar data={chartData} options={options} />;
          </div>
        ) : (
          <p>No historical data available</p>
        )}
      </div>
    </div>
  );
};

export default LocationDetails;
