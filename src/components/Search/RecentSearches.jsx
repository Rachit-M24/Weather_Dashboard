import React from 'react';
import { Clock, MapPin } from 'lucide-react';

const RecentSearches = ({ searches, onSearchClick }) => {
  if (searches.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium text-gray-800 flex items-center">
          <Clock className="h-4 w-4 mr-2 text-gray-500" />
          Recent Searches
        </h3>
      </div>
      
      <div className="space-y-2">
        {searches.map((location, index) => (
          <button
            key={`recent-${index}`}
            onClick={() => onSearchClick(location)}
            className="w-full flex items-center justify-between p-2 rounded-md hover:bg-blue-50 transition-colors group"
          >
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-blue-500 mr-2" />
              <div className="text-left">
                <div className="font-medium text-gray-800">{location.name}</div>
                <div className="text-xs text-gray-500">
                  {location.state && `${location.state}, `}{location.country}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;