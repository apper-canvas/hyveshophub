import React from "react";

const Loading = ({ variant = "default" }) => {
  if (variant === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="shimmer h-48 bg-gray-200"></div>
            <div className="p-4 space-y-3">
              <div className="shimmer h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="shimmer h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="flex items-center justify-between">
                <div className="shimmer h-5 bg-gray-200 rounded w-16"></div>
                <div className="shimmer h-3 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="shimmer h-8 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="space-y-4 p-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4">
            <div className="shimmer h-20 w-20 bg-gray-200 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="shimmer h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="shimmer h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="shimmer h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="shimmer h-8 w-24 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-indigo-100">
      <div className="text-center space-y-4">
        <svg 
          className="animate-spin h-12 w-12 text-primary-500 mx-auto" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4" 
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
          />
        </svg>
        <div className="text-lg font-medium text-secondary-700">Loading amazing products...</div>
        <div className="text-sm text-secondary-500">Please wait while we fetch the latest deals</div>
      </div>
    </div>
  );
};

export default Loading;