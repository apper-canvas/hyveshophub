import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/molecules/ProductCard";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { productService } from "@/services/api/productService";

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("discount");

  useEffect(() => {
    loadDeals();
  }, [sortBy]);

  const loadDeals = async () => {
    try {
      setLoading(true);
      setError("");
      let dealsData = await productService.getDeals();
      
      // Apply sorting
      if (sortBy === "discount") {
        dealsData.sort((a, b) => b.discount - a.discount);
      } else if (sortBy === "price-low") {
        dealsData.sort((a, b) => a.price - b.price);
      } else if (sortBy === "price-high") {
        dealsData.sort((a, b) => b.price - a.price);
      } else if (sortBy === "rating") {
        dealsData.sort((a, b) => b.rating - a.rating);
      }
      
      setDeals(dealsData);
    } catch (err) {
      setError(err.message || "Failed to load deals");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    loadDeals();
  };

  if (loading) {
    return <Loading variant="grid" />;
  }

  if (error) {
    return <Error message={error} onRetry={handleRetry} />;
  }

  if (deals.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Empty
            title="No deals available"
            description="Check back soon for amazing deals and discounts on your favorite products!"
            icon="Zap"
            action={() => window.location.href = "/"}
            actionLabel="Browse All Products"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <ApperIcon name="Zap" size={32} className="text-yellow-400" />
              <Badge variant="warning" size="lg" className="text-primary-800">
                LIMITED TIME
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Today's Best
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Deals & Discounts
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto mb-8">
              Don't miss out on these incredible savings! Limited quantities available.
            </p>
            
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center gap-2">
                <ApperIcon name="Clock" size={20} className="text-yellow-400" />
                <span>Limited Time Offers</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="TrendingDown" size={20} className="text-yellow-400" />
                <span>Up to 70% Off</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="Truck" size={20} className="text-yellow-400" />
                <span>Free Shipping</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Deals Header and Controls */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-secondary-800">
              {deals.length} Amazing Deals Found
            </h2>
            <p className="text-secondary-600 mt-1">
              Save big on quality products from top brands
            </p>
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
              <option value="discount">Highest Discount</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Deals Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-primary-600 mb-1">
              {Math.max(...deals.map(d => d.discount))}%
            </div>
            <div className="text-sm text-secondary-600">Max Discount</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600 mb-1">
              ${Math.max(...deals.map(d => d.originalPrice - d.price)).toFixed(0)}
            </div>
            <div className="text-sm text-secondary-600">Max Savings</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {deals.filter(d => d.rating >= 4.5).length}
            </div>
            <div className="text-sm text-secondary-600">Top Rated</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {deals.filter(d => d.price < 100).length}
            </div>
            <div className="text-sm text-secondary-600">Under $100</div>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {deals.map((product, index) => (
            <motion.div
              key={product.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <div className="relative">
                <ProductCard product={product} />
                
                {/* Discount Badge Overlay */}
                <div className="absolute top-2 right-2 z-10">
                  <Badge 
                    variant="error" 
                    size="lg"
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg animate-pulse"
                  >
                    SAVE ${(product.originalPrice - product.price).toFixed(0)}
                  </Badge>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16 py-12 bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl"
        >
          <ApperIcon name="Gift" size={48} className="text-primary-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-secondary-800 mb-4">
            Don't Miss Out!
          </h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto mb-8">
            These incredible deals won't last long. Shop now and save big on your favorite products 
            with our best prices of the year.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button size="lg" icon="ShoppingBag">
              Shop All Deals
            </Button>
            <Button size="lg" variant="outline" icon="Bell">
              Get Deal Alerts
            </Button>
          </div>
          
          <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-secondary-500">
            <div className="flex items-center gap-2">
              <ApperIcon name="Truck" size={16} />
              <span>Free shipping on orders over $75</span>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="Shield" size={16} />
              <span>100% secure checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="RotateCcw" size={16} />
              <span>30-day return policy</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Deals;