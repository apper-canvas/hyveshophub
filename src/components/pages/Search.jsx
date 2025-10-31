import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "@/components/organisms/ProductGrid";
import ProductFilters from "@/components/organisms/ProductFilters";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  
  const query = searchParams.get("q") || "";

  useEffect(() => {
    // Parse filters from URL params
    const urlFilters = {};
    if (searchParams.get("category")) {
      urlFilters.category = searchParams.get("category");
    }
    if (searchParams.get("minPrice")) {
      urlFilters.minPrice = parseFloat(searchParams.get("minPrice"));
    }
    if (searchParams.get("maxPrice")) {
      urlFilters.maxPrice = parseFloat(searchParams.get("maxPrice"));
    }
    if (searchParams.get("rating")) {
      urlFilters.minRating = parseFloat(searchParams.get("rating"));
    }
    if (searchParams.get("inStock") === "true") {
      urlFilters.inStock = true;
    }
    setFilters(urlFilters);
  }, [searchParams]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== false && value !== "") {
        params.set(key, value.toString());
      }
    });
    
    setSearchParams(params);
  };

  const handleSearch = (newQuery) => {
    const params = new URLSearchParams();
    params.set("q", newQuery);
    
    // Preserve existing filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== false && value !== "") {
        params.set(key, value.toString());
      }
    });
    
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-secondary-800">
                {query ? `Search Results` : "Browse Products"}
              </h1>
              {query && (
                <p className="text-secondary-600 mt-1">
                  Showing results for "{query}"
                </p>
              )}
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

          {/* Search Bar */}
          <div className="max-w-2xl">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search for products..."
            />
          </div>
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
              searchQuery={query}
              filters={filters}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;