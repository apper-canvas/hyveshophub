import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="relative">
              <div className="text-[150px] md:text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400 leading-none">
                404
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <ApperIcon 
                  name="ShoppingCart" 
                  size={80} 
                  className="text-primary-300 animate-float" 
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-secondary-800 mb-4">
              Oops! Page Not Found
            </h1>
            <p className="text-lg text-secondary-600 max-w-md mx-auto leading-relaxed">
              The page you're looking for doesn't exist or may have been moved. 
              Let's help you find what you're looking for!
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <div className="max-w-md mx-auto">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search for products..."
                autoFocus={false}
              />
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12"
          >
            <Link to="/">
              <Button size="lg" icon="Home">
                Go to Homepage
              </Button>
            </Link>
            
            <Button 
              size="lg" 
              variant="outline" 
              onClick={handleGoBack}
              icon="ArrowLeft"
            >
              Go Back
            </Button>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <Link 
              to="/deals"
              className="group p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-center"
            >
              <ApperIcon 
                name="Zap" 
                size={24} 
                className="text-primary-500 mx-auto mb-2 group-hover:scale-110 transition-transform" 
              />
              <div className="text-sm font-medium text-secondary-800">Today's Deals</div>
            </Link>

            <Link 
              to="/category/electronics"
              className="group p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-center"
            >
              <ApperIcon 
                name="Smartphone" 
                size={24} 
                className="text-primary-500 mx-auto mb-2 group-hover:scale-110 transition-transform" 
              />
              <div className="text-sm font-medium text-secondary-800">Electronics</div>
            </Link>

            <Link 
              to="/category/fashion"
              className="group p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-center"
            >
              <ApperIcon 
                name="Shirt" 
                size={24} 
                className="text-primary-500 mx-auto mb-2 group-hover:scale-110 transition-transform" 
              />
              <div className="text-sm font-medium text-secondary-800">Fashion</div>
            </Link>

            <Link 
              to="/category/home"
              className="group p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-center"
            >
              <ApperIcon 
                name="Home" 
                size={24} 
                className="text-primary-500 mx-auto mb-2 group-hover:scale-110 transition-transform" 
              />
              <div className="text-sm font-medium text-secondary-800">Home & Garden</div>
            </Link>
          </motion.div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-12 text-sm text-secondary-500"
          >
            <p>
              Still can't find what you're looking for? 
              <a href="#" className="text-primary-600 hover:text-primary-700 ml-1">
                Contact our support team
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;