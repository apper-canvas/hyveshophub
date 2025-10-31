import React, { useState, useEffect } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const PriceFilter = ({ onFilterChange, className, initialMin = "", initialMax = "" }) => {
  const [minPrice, setMinPrice] = useState(initialMin);
  const [maxPrice, setMaxPrice] = useState(initialMax);

  const handleApplyFilter = () => {
    const min = minPrice ? parseFloat(minPrice) : undefined;
    const max = maxPrice ? parseFloat(maxPrice) : undefined;
    
    if (min && max && min > max) {
      return; // Don't apply invalid range
    }
    
    onFilterChange({
      minPrice: min,
      maxPrice: max
    });
  };

  const handleClearFilter = () => {
    setMinPrice("");
    setMaxPrice("");
    onFilterChange({
      minPrice: undefined,
      maxPrice: undefined
    });
  };

  useEffect(() => {
    setMinPrice(initialMin);
    setMaxPrice(initialMax);
  }, [initialMin, initialMax]);

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="font-semibold text-secondary-800">Price Range</h3>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="flex-1"
            min="0"
            step="0.01"
          />
          <span className="text-secondary-400">to</span>
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="flex-1"
            min="0"
            step="0.01"
          />
        </div>
        
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={handleApplyFilter}
            className="flex-1"
            disabled={!minPrice && !maxPrice}
          >
            Apply
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleClearFilter}
            className="flex-1"
            disabled={!minPrice && !maxPrice}
          >
            Clear
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-secondary-700">Quick Ranges</h4>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Under $50", min: 0, max: 50 },
            { label: "$50 - $100", min: 50, max: 100 },
            { label: "$100 - $200", min: 100, max: 200 },
            { label: "Over $200", min: 200, max: null },
          ].map((range, index) => (
            <Button
              key={index}
              size="sm"
              variant="ghost"
              onClick={() => {
                setMinPrice(range.min.toString());
                setMaxPrice(range.max ? range.max.toString() : "");
                onFilterChange({
                  minPrice: range.min,
                  maxPrice: range.max
                });
              }}
              className="text-xs justify-start h-8"
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;