import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductGrid from "@/components/organisms/ProductGrid";
import ProductFilters from "@/components/organisms/ProductFilters";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { categoryService } from "@/services/api/categoryService";

const Category = () => {
  const { categoryName } = useParams();
  const [category, setCategory] = useState(null);
  const [filters, setFilters] = useState({ category: categoryName });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCategory();
  }, [categoryName]);

  const loadCategory = async () => {
    try {
      setLoading(true);
      setError("");
      const categoryData = await categoryService.getByName(categoryName);
      setCategory(categoryData);
      setFilters({ category: categoryData.name });
    } catch (err) {
      setError(err.message || "Category not found");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({
      ...newFilters,
      category: category?.name // Always maintain the category filter
    });
  };

  const handleRetry = () => {
    loadCategory();
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !category) {
    return (
      <Error 
        message={error || "Category not found"} 
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={category.image}
              alt={category.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold text-secondary-800">
                {category.name}
              </h1>
              <p className="text-secondary-600 mt-1">
                Explore our {category.name.toLowerCase()} collection
              </p>
            </div>
          </div>

          {/* Subcategories */}
          <div className="flex flex-wrap gap-2">
            {category.subcategories.map((subcategory, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-primary-50 hover:border-primary-300 transition-colors"
              >
                {subcategory}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-semibold text-secondary-800">
              {category.name} Products
            </h2>
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            icon="Filter"
            className="lg:hidden"
          >
            Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? "block" : "hidden lg:block"}`}>
            <ProductFilters
              onFilterChange={handleFilterChange}
              activeFilters={filters}
            />
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            <ProductGrid
              category={category.name}
              filters={filters}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;