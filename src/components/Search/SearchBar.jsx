import React, { useState, useRef, useEffect } from "react";
import { Search, X, MapPin } from "lucide-react";

const SearchBar = ({
  value,
  onChange,
  locations,
  onLocationSelect,
  isLoading,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  const clearSearch = () => {
    onChange("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleLocationClick = (location) => {
    onLocationSelect(location);
    setIsFocused(false);
  };

  return (
    <div className="relative">
      <div
        className={`
        flex items-center border-2 rounded-lg overflow-hidden transition-all duration-200
        ${isFocused ? "border-blue-500 shadow-md" : "border-gray-300"}
      `}
      >
        <div className="pl-3">
          <Search
            className={`h-5 w-5 ${
              isFocused ? "text-blue-500" : "text-gray-400"
            }`}
          />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          placeholder="Search for a city or location..."
          className="w-full py-3 px-2 focus:outline-none text-gray-800"
          aria-label="Search locations"
        />
        {value && (
          <button
            onClick={clearSearch}
            className="px-3 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Search suggestions dropdown */}
      {isFocused && value.length >= 2 && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto"
        >
          {isLoading ? (
            <div className="px-4 py-3 text-gray-500">Searching...</div>
          ) : locations?.length > 0 ? (
            <ul>
              {locations.map((location, index) => (
                <li key={`${location.name}-${index}`}>
                  <button
                    onClick={() => handleLocationClick(location)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-start"
                  >
                    <MapPin className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium">{location.name}</div>
                      <div className="text-sm text-gray-500">
                        {location.state && `${location.state}, `}
                        {location.country}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : value.length >= 3 ? (
            <div className="px-4 py-3 text-gray-500">No locations found</div>
          ) : (
            <div className="px-4 py-3 text-gray-500">
              Type at least 3 characters to search
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;