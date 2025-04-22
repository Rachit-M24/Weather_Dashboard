import React from 'react';
import { Info } from 'lucide-react';
import { getPollutantGuidelines } from '../Helpers/HealthImplications';

const PollutantInfoCard = ({ 
  name, 
  value, 
  unit, 
  description, 
  sources, 
  effects, 
  safeLevel,
  color 
}) => {
  const guidelines = getPollutantGuidelines(name.toLowerCase());
  
  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
      <div 
        className="px-4 py-3 flex justify-between items-center" 
        style={{ backgroundColor: `${color}10`, borderBottom: `2px solid ${color}` }}
      >
        <h3 className="font-semibold text-gray-800">{name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold" style={{ color }}>{value}</span>
          <span className="text-sm text-gray-500">{unit}</span>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        
        <div className="mb-3">
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Main Sources</h4>
          <p className="text-sm text-gray-700">{sources}</p>
        </div>
        
        <div className="mb-3">
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Health Effects</h4>
          <p className="text-sm text-gray-700">{effects}</p>
        </div>
        
        {safeLevel && (
          <div className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
            <Info className="w-4 h-4 text-blue-500" />
            <span className="text-gray-700">
              WHO safe level: <span className="font-medium">{safeLevel}{unit}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PollutantInfoCard;