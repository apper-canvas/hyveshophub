import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No items found", 
  description = "Try adjusting your search or filters to find what you're looking for.",
  action,
  actionLabel = "Start Shopping",
  icon = "Search"
}) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon 
              name={icon} 
              size={32} 
              className="text-primary-600" 
            />
          </div>
          <h3 className="text-xl font-semibold text-secondary-800 mb-2">
            {title}
          </h3>
          <p className="text-secondary-600 leading-relaxed">
            {description}
          </p>
        </div>

        {action && (
          <button
            onClick={action}
            className="btn-primary text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <ApperIcon name="ShoppingBag" size={18} />
            {actionLabel}
          </button>
        )}

        <div className="mt-6 grid grid-cols-3 gap-4 text-xs text-secondary-500">
          <div className="text-center">
            <ApperIcon name="Truck" size={20} className="mx-auto mb-1 text-primary-500" />
            Fast Delivery
          </div>
          <div className="text-center">
            <ApperIcon name="Shield" size={20} className="mx-auto mb-1 text-primary-500" />
            Secure Shopping
          </div>
          <div className="text-center">
            <ApperIcon name="RotateCcw" size={20} className="mx-auto mb-1 text-primary-500" />
            Easy Returns
          </div>
        </div>
      </div>
    </div>
  );
};

export default Empty;