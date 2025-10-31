import React, { useState, useEffect } from "react";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { productService } from "@/services/api/productService";

const ProductGrid = ({ 
  products: initialProducts = null,
  category = null,
  searchQuery = "",
  filters = {},
  viewMode = "grid" 
}) => {
  const [products, setProducts] = useState(initialProducts || []);
  const [loading, setLoading] = useState(!initialProducts);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    if (!initialProducts) {
      loadProducts();
    }
  }, [category, searchQuery, filters, sortBy, initialProducts]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      
      let data;
      
      if (searchQuery) {
        data = await productService.search(searchQuery, { ...filters, sortBy });
      } else if (category) {
        data = await productService.getByCategory(category);
        // Apply sorting and filters to category results
        data = await productService.search("", { category, ...filters, sortBy });
      } else {
        data = await productService.getAll();
        // Apply sorting
        if (sortBy === "price-low") {
          data.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price-high") {
          data.sort((a, b) => b.price - a.price);
        } else if (sortBy === "rating") {
          data.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === "name") {
          data.sort((a, b) => a.name.localeCompare(b.name));
        }
      }
      
      setProducts(data);
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    loadProducts();
  };

  if (loading) {
    return <Loading variant="grid" />;
  }

  if (error) {
    return <Error message={error} onRetry={handleRetry} />;
  }

  if (products.length === 0) {
    return (
      <Empty
        title="No products found"
        description={searchQuery 
          ? `No products match your search for "${searchQuery}". Try different keywords or adjust your filters.`
          : "No products are currently available in this category."
        }
        icon="Search"
        action={() => window.location.href = "/"}
        actionLabel="Browse All Products"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Results header and controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <p className="text-secondary-600">
            {products.length} product{products.length !== 1 ? "s" : ""} found
            {searchQuery && <span> for "{searchQuery}"</span>}
            {category && <span> in {category}</span>}
          </p>
          
          <div className="hidden md:flex items-center space-x-2">
            <Button
              size="sm"
              variant={viewMode === "grid" ? "primary" : "ghost"}
              onClick={() => {/* viewMode handler would go here */}}
            >
              <ApperIcon name="Grid3X3" size={16} />
            </Button>
            <Button
              size="sm"
              variant={viewMode === "list" ? "primary" : "ghost"}
              onClick={() => {/* viewMode handler would go here */}}
            >
              <ApperIcon name="List" size={16} />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <label htmlFor="sort" className="text-sm text-secondary-600">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-secondary-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </div>

      {/* Product grid */}
      {viewMode === "list" ? (
        <div className="space-y-4">
          {products.map((product) => (
            <ProductCard
              key={product.Id}
              product={product}
              variant="list"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.Id}
              product={product}
              variant="grid"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;