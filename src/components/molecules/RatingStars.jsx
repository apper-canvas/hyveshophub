import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const RatingStars = ({ rating, maxRating = 5, size = "md", showCount = false, reviewCount = 0, className }) => {
  const sizes = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20
  };

  const iconSize = sizes[size];
  
  const renderStars = () => {
    const stars = [];
    
    for (let i = 1; i <= maxRating; i++) {
      let starType = "empty";
      
      if (rating >= i) {
        starType = "full";
      } else if (rating >= i - 0.5) {
        starType = "half";
      }
      
      stars.push(
        <div key={i} className="relative">
          <ApperIcon
            name="Star"
            size={iconSize}
            className="text-secondary-300 fill-current"
          />
          {starType === "full" && (
            <ApperIcon
              name="Star"
              size={iconSize}
              className="absolute top-0 left-0 text-accent-500 fill-current"
            />
          )}
          {starType === "half" && (
            <div className="absolute top-0 left-0 overflow-hidden w-1/2">
              <ApperIcon
                name="Star"
                size={iconSize}
                className="text-accent-500 fill-current"
              />
            </div>
          )}
        </div>
      );
    }
    
    return stars;
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {renderStars()}
      </div>
      
      {showCount && reviewCount > 0 && (
        <span className="text-sm text-secondary-600 ml-1">
          ({reviewCount})
        </span>
      )}
      
      <span className="text-sm text-secondary-600 ml-1">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

export default RatingStars;