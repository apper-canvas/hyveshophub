import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry, showRetry = true }) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon 
              name="AlertTriangle" 
              size={32} 
              className="text-red-600" 
            />
          </div>
          <h3 className="text-xl font-semibold text-secondary-800 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-secondary-600 leading-relaxed">
            {message}
          </p>
        </div>

        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="btn-primary text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <ApperIcon name="RotateCcw" size={18} />
            Try Again
          </button>
        )}

        <div className="mt-6 text-sm text-secondary-500">
          If the problem persists, please contact our support team.
        </div>
      </div>
    </div>
  );
};

export default Error;