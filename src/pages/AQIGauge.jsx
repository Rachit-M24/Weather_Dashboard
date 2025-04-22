// import React from 'react';
// import { getAQICategory } from '../components/Helpers/HealthImplications';

// const AQIGauge = ({ value }) => {
//   const aqiStatus = getAQICategory(value);
//   const percentage = Math.min(value / 5, 100); // Cap at 500 AQI (100%)
  
//   const needleRotation = Math.min((value / 500) * 180, 180);

//   return (
//     <div className="relative w-full h-full">
//       {/* Gauge background */}
//       <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
      
//       {/* Colored segments */}
//       <div className="absolute inset-0 overflow-hidden rounded-full">
//         <div 
//           className="absolute top-0 left-0 w-full h-full"
//           style={{
//             background: `conic-gradient(
//               #00E400 0% 10%,
//               #FFFF00 10% 20%,
//               #FF7E00 20% 30%,
//               #FF0000 30% 40%,
//               #8F3F97 40% 60%,
//               #7E0023 60% 100%
//             )`
//           }}
//         ></div>
//       </div>
      
//       {/* Center mask */}
//       <div className="absolute inset-4 bg-white rounded-full"></div>
      
//       {/* Labels */}
//       <div className="absolute bottom-0 left-0 right-0 text-center text-xs font-medium text-gray-600">
//         <span className="absolute left-2">0</span>
//         <span className="absolute left-1/4">125</span>
//         <span className="absolute left-1/2 -translate-x-1/2">250</span>
//         <span className="absolute right-1/4">375</span>
//         <span className="absolute right-2">500+</span>
//       </div>
      
//       {/* Needle */}
//       <div 
//         className="absolute left-1/2 bottom-0 w-1 h-1/2 bg-red-600 origin-bottom transform -translate-x-1/2 z-10"
//         style={{ rotate: `${needleRotation}deg` }}
//       >
//         <div className="absolute -top-1 left-1/2 w-3 h-3 bg-red-600 rounded-full transform -translate-x-1/2"></div>
//       </div>
      
//       {/* Current value */}
//       <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
//         <div className="text-3xl font-bold" style={{ color: aqiStatus.color }}>
//           {value}
//         </div>
//         <div className="text-xs text-gray-500">AQI</div>
//       </div>
//     </div>
//   );
// };

// export default AQIGauge;