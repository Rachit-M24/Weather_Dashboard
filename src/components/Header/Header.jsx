import { Link, useNavigate } from "react-router-dom";
import { MapPin, Navigation, Wind } from "lucide-react";
import { useGeoLocation } from "../customHooks/UseGeoLocation";

const Header = () => {
  let {
    long,
    lat,
    city,
    state,
    country,
    error: locationError,
  } = useGeoLocation();
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Wind className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-800"> 
              Air Quality Dashboard
            </h1>
          </Link> 
          <nav className="hidden md:flex gap-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-blue-500 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/aqi-info"
              className="text-gray-600 hover:text-blue-500 transition-colors"
            >
              AQI Info
            </Link>
            <Link
              to="/about"
              className="text-gray-600 hover:text-blue-500 transition-colors"
            >
              About
            </Link>
          </nav>

          <Link
            to="/search-page"
            className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors cursor-pointer group"
          >
            <MapPin className="h-5 w-5 text-blue-500 group-hover:text-blue-600" />
            <span className="text-gray-700 group-hover:text-gray-900">
              {city}, {state}, {country}
            </span>
            <Navigation className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
