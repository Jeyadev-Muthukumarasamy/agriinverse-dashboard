import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="text-center">
        {/* Animated 404 Text */}
        <div className="relative">
          <h1 className="text-9xl font-bold text-gray-900 animate-bounce">
            4
            <span className="inline-block animate-pulse">0</span>
            4
          </h1>
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>

        {/* Illustration */}
        <div className="mt-8 mb-6">
          <svg
            className="w-64 h-64 mx-auto animate-float"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#FFD93D"
              d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.3,88.2,-1.5C86.4,13.3,80.2,26.7,73.4,39.4C66.6,52.1,59.2,64.2,49.9,74.9C40.6,85.6,29.3,94.9,17.2,97.9C5.1,100.9,-7.8,97.6,-19.9,92.4C-32,87.2,-43.3,80.1,-53.2,70.9C-63.1,61.7,-71.6,50.4,-78.9,38.2C-86.2,26,-92.3,12.9,-91.9,0.3C-91.5,-12.3,-84.6,-24.7,-77.1,-36.4C-69.6,-48.1,-61.5,-59.2,-51.9,-68.9C-42.3,-78.6,-31.2,-86.9,-19.3,-91.9C-7.4,-96.9,5.3,-98.6,17.9,-97.1C30.5,-95.6,43,-90.9,44.7,-76.4Z"
              transform="translate(100 100)"
            />
            <path
              fill="#FF6B6B"
              d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.3,88.2,-1.5C86.4,13.3,80.2,26.7,73.4,39.4C66.6,52.1,59.2,64.2,49.9,74.9C40.6,85.6,29.3,94.9,17.2,97.9C5.1,100.9,-7.8,97.6,-19.9,92.4C-32,87.2,-43.3,80.1,-53.2,70.9C-63.1,61.7,-71.6,50.4,-78.9,38.2C-86.2,26,-92.3,12.9,-91.9,0.3C-91.5,-12.3,-84.6,-24.7,-77.1,-36.4C-69.6,-48.1,-61.5,-59.2,-51.9,-68.9C-42.3,-78.6,-31.2,-86.9,-19.3,-91.9C-7.4,-96.9,5.3,-98.6,17.9,-97.1C30.5,-95.6,43,-90.9,44.7,-76.4Z"
              transform="translate(100 100)"
              opacity="0.5"
            />
          </svg>
        </div>

        {/* Error Message */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track!
        </p>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 