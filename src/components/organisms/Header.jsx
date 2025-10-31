import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cartService } from "@/services/api/cartService";
import { categoryService } from "@/services/api/categoryService";

const Header = () => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadCartCount();
    loadCategories();
  }, []);

  const loadCartCount = () => {
    const count = cartService.getItemCount();
    setCartItemCount(count);
  };

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = () => {
      loadCartCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top header */}
      <div className="bg-secondary-800 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="flex items-center gap-1">
                <ApperIcon name="Truck" size={14} />
                Free shipping on orders over $75
              </span>
              <span className="hidden md:flex items-center gap-1">
                <ApperIcon name="Shield" size={14} />
                30-day money back guarantee
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="hidden md:inline">Call us: (555) 123-4567</span>
              <Link to="/orders" className="hover:text-primary-300 transition-colors">
                Track Order
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="ShoppingBag" size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text hidden sm:block">
              ShopHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <div 
              className="relative"
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
            >
              <Button variant="ghost" icon="Menu" className="text-secondary-700">
                All Categories
              </Button>
              
              {/* Categories Dropdown */}
              {showCategories && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-xl rounded-lg border border-secondary-200 z-50">
                  <div className="py-2">
                    {categories.map((category) => (
                      <Link
                        key={category.Id}
                        to={`/category/${category.name.toLowerCase()}`}
                        className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 hover:text-primary-600 transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Link to="/deals" className="text-secondary-700 hover:text-primary-600 font-medium transition-colors">
              Today's Deals
            </Link>
            <Link to="/orders" className="text-secondary-700 hover:text-primary-600 font-medium transition-colors">
              Orders
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-4 hidden md:block">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-3">
            <Link to="/cart">
              <Button 
                variant="ghost" 
                size="sm"
                className="relative text-secondary-700 hover:text-primary-600"
              >
                <ApperIcon name="ShoppingCart" size={20} />
                {cartItemCount > 0 && (
                  <Badge 
                    variant="primary" 
                    size="sm" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs"
                  >
                    {cartItemCount}
                  </Badge>
                )}
                <span className="hidden sm:inline ml-2">Cart</span>
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-secondary-700"
            >
              <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-secondary-200">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-4">
            <div>
              <h3 className="font-semibold text-secondary-800 mb-2">Categories</h3>
              <div className="space-y-1">
                {categories.slice(0, 6).map((category) => (
                  <Link
                    key={category.Id}
                    to={`/category/${category.name.toLowerCase()}`}
                    className="block py-2 text-secondary-600 hover:text-primary-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="border-t border-secondary-200 pt-4 space-y-2">
              <Link
                to="/deals"
                className="block py-2 text-secondary-700 hover:text-primary-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Today's Deals
              </Link>
              <Link
                to="/orders"
                className="block py-2 text-secondary-700 hover:text-primary-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Orders
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;