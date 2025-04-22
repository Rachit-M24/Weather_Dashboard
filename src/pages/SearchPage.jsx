import React, { useState, useEffect } from "react";
import SearchBar from "../components/Search/SearchBar";
import AQICard from "../components/Cards/AQICard";
// import RecentSearches from "../components/Search/RecentSearches";
// import { searchLocation } from "../Service/airQualityService";
import { Loader, AlertCircle } from "lucide-react";
import useAQIByCity from "../components/customHooks/UseAQIByCity";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { aqiData, fetchAQIByCity } = useAQIByCity();
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }, [recentSearches]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim().length < 3) return;

    setIsLoading(true);
    setError(null);

    try {
      await fetchAQIByCity(query);
    } catch (err) {
      setError("Error searching for locations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Search Air Quality
        </h1>
        <p className="text-gray-600">
          Enter a city or location to check the current air quality index and
          pollutant levels.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <SearchBar
              value={searchQuery}
              onChange={handleSearch}
              isLoading={isLoading}
            />

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
            {/* 
            <div className="mt-8">
              <RecentSearches
                searches={recentSearches}
                onSearchClick={handleRecentSearchClick}
              />
            </div> */}
          </div>
        </div>

        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-md">
              <Loader className="h-8 w-8 text-blue-500 animate-spin" />
              <span className="ml-2 text-gray-600">Loading data...</span>
            </div>
          ) : aqiData ? (
            <AQICard
              aqiData={aqiData}
              // Make sure your AQICard component expects these props:
              // - location: { name, lat, lon }
              // - aqiData: { aqi, time, city: { name, geo }, pollutants }
            />
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center border-2 border-dashed border-gray-200">
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                No Data to Display
              </h3>
              <p className="text-gray-500">
                Search for a location to view air quality information
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
