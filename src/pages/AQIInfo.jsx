import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AQI_RANGES } from "../components/Helpers/HealthImplications";

const AQIInfo = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <Link to="/" className="flex items-center gap-2 text-blue-500 mb-4">
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </Link>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Air Quality Index (AQI) Information</h2>
      
      <div className="prose max-w-none">
        <p className="text-gray-700 mb-6">
          The Air Quality Index (AQI) is an index for reporting daily air quality. It tells you how clean or polluted your air is, 
          and what associated health effects might be a concern for you.
        </p>
        
        <h3 className="text-xl font-semibold mb-4">AQI Scale</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {AQI_RANGES.map((range, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border-l-4`}
              style={{ 
                backgroundColor: `${range.color}10`,
                borderLeftColor: range.color
              }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{range.emoji}</span>
                <div>
                  <h4 className="font-semibold text-gray-800">{range.status}</h4>
                  <p className="text-gray-600 text-sm mb-2">{range.min}-{range.max} AQI</p>
                  <p className="text-gray-700 text-sm">
                    {range.min === 0 ? 'Air quality is satisfactory with little to no risk.' :
                     range.min === 51 ? 'Acceptable air quality, but some pollutants may affect sensitive individuals.' :
                     range.min === 101 ? 'Members of sensitive groups may experience health effects.' :
                     range.min === 151 ? 'Increased likelihood of adverse effects in general public.' :
                     range.min === 201 ? 'Health alert - risk of serious effects for everyone.' :
                     'Health warning of emergency conditions.'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <h3 className="text-xl font-semibold mb-4">Understanding AQI</h3>
        <p className="text-gray-700 mb-4">
          The AQI is divided into six categories. Each category corresponds to a different level of health concern.
        </p>
        
        <h3 className="text-xl font-semibold mb-4">Health Recommendations</h3>
        <ul className="list-disc pl-5 text-gray-700 mb-6 space-y-2">
          <li><strong>Good (0-50):</strong> Air quality is considered satisfactory with little to no risk.</li>
          <li><strong>Moderate (51-100):</strong> Air quality is acceptable; however, sensitive individuals should consider limiting prolonged outdoor exertion.</li>
          <li><strong>Unhealthy for Sensitive Groups (101-150):</strong> Children, elderly, and people with respiratory or heart conditions should limit outdoor activities.</li>
          <li><strong>Unhealthy (151-200):</strong> Everyone may begin to experience health effects; sensitive groups should avoid prolonged outdoor exertion.</li>
          <li><strong>Very Unhealthy (201-300):</strong> Health alert - everyone may experience more serious health effects.</li>
          <li><strong>Hazardous (301-500):</strong> Health warnings of emergency conditions - entire population is likely affected.</li>
        </ul>
      </div>
    </div>
  );
};

export default AQIInfo;