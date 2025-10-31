import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import PriceFilter from "@/components/molecules/PriceFilter";
import RatingStars from "@/components/molecules/RatingStars";
import ApperIcon from "@/components/ApperIcon";
import { categoryService } from "@/services/api/categoryService";

const ProductFilters = ({ onFilterChange, activeFilters = {}, className }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(activeFilters.category || "all");
  const [selectedRating, setSelectedRating] = useState(activeFilters.minRating || "");
  const [inStockOnly, setInStockOnly] = useState(activeFilters.inStock || false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    onFilterChange({
      ...activeFilters,
      category: category === "all" ? undefined : category
    });
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
    onFilterChange({
      ...activeFilters,
      minRating: rating || undefined
    });
  };

  const handleInStockChange = (inStock) => {
    setInStockOnly(inStock);
    onFilterChange({
      ...activeFilters,
      inStock
    });
  };

  const handlePriceFilterChange = (priceFilter) => {
    onFilterChange({
      ...activeFilters,
      ...priceFilter
    });
  };

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSelectedRating("");
    setInStockOnly(false);
    onFilterChange({});
  };

  const activeFilterCount = Object.keys(activeFilters).filter(key => 
    activeFilters[key] !== undefined && activeFilters[key] !== "all" && activeFilters[key] !== false
  ).length;

  return (
    <div className={className}>
      {/* Mobile filter toggle */}
      <div className="lg:hidden mb-4">
        <Button
          onClick={() => setIsCollapsed(!isCollapsed)}
          variant="outline"
          className="w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <ApperIcon name="Filter" size={16} />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="primary" size="sm">
                {activeFilterCount}
              </Badge>
            )}
          </span>
          <ApperIcon name={isCollapsed ? "ChevronDown" : "ChevronUp"} size={16} />
        </Button>
      </div>

      <div className={`space-y-6 ${isCollapsed ? "hidden lg:block" : "block"}`}>
        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-secondary-800">Filters</h2>
            {activeFilterCount > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={clearAllFilters}
                className="text-primary-600 hover:text-primary-700"
              >
                Clear All
              </Button>
            )}
          </div>

          {/* Categories */}
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold text-secondary-800">Categories</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value="all"
                  checked={selectedCategory === "all"}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span className="text-secondary-700">All Categories</span>
              </label>
              
              {categories.map((category) => (
                <label key={category.Id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={category.name}
                    checked={selectedCategory === category.name}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-secondary-700">{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <PriceFilter 
              onFilterChange={handlePriceFilterChange}
              initialMin={activeFilters.minPrice?.toString() || ""}
              initialMax={activeFilters.maxPrice?.toString() || ""}
            />
          </div>

          {/* Rating */}
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold text-secondary-800">Customer Rating</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  value=""
                  checked={selectedRating === ""}
                  onChange={(e) => handleRatingChange(e.target.value)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span className="text-secondary-700">Any Rating</span>
              </label>
              
              {[4, 3, 2, 1].map((rating) => (
                <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    value={rating.toString()}
                    checked={selectedRating === rating.toString()}
                    onChange={(e) => handleRatingChange(e.target.value)}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <div className="flex items-center space-x-1">
                    <RatingStars rating={rating} size="sm" />
                    <span className="text-secondary-700">& Up</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-4">
            <h3 className="font-semibold text-secondary-800">Availability</h3>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => handleInStockChange(e.target.checked)}
                className="text-primary-600 focus:ring-primary-500 rounded"
              />
              <span className="text-secondary-700">In Stock Only</span>
            </label>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductFilters;