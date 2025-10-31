import React from "react";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Footer = () => {
  return (
    <footer className="bg-secondary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="ShoppingBag" size={20} className="text-white" />
              </div>
              <span className="text-2xl font-bold">ShopHub</span>
            </div>
            <p className="text-secondary-300 leading-relaxed">
              Your ultimate shopping destination for quality products at amazing prices. 
              Discover, compare, and shop with confidence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-secondary-400 hover:text-white transition-colors">
                <ApperIcon name="Facebook" size={20} />
              </a>
              <a href="#" className="text-secondary-400 hover:text-white transition-colors">
                <ApperIcon name="Twitter" size={20} />
              </a>
              <a href="#" className="text-secondary-400 hover:text-white transition-colors">
                <ApperIcon name="Instagram" size={20} />
              </a>
              <a href="#" className="text-secondary-400 hover:text-white transition-colors">
                <ApperIcon name="Youtube" size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="space-y-2">
              <Link to="/" className="block text-secondary-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/deals" className="block text-secondary-300 hover:text-white transition-colors">
                Today's Deals
              </Link>
              <Link to="/category/electronics" className="block text-secondary-300 hover:text-white transition-colors">
                Electronics
              </Link>
              <Link to="/category/fashion" className="block text-secondary-300 hover:text-white transition-colors">
                Fashion
              </Link>
              <Link to="/category/home" className="block text-secondary-300 hover:text-white transition-colors">
                Home & Garden
              </Link>
            </nav>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <nav className="space-y-2">
              <Link to="/orders" className="block text-secondary-300 hover:text-white transition-colors">
                Track Your Order
              </Link>
              <a href="#" className="block text-secondary-300 hover:text-white transition-colors">
                Return Policy
              </a>
              <a href="#" className="block text-secondary-300 hover:text-white transition-colors">
                Shipping Info
              </a>
              <a href="#" className="block text-secondary-300 hover:text-white transition-colors">
                Contact Us
              </a>
              <a href="#" className="block text-secondary-300 hover:text-white transition-colors">
                FAQ
              </a>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Stay Updated</h3>
            <p className="text-secondary-300">
              Subscribe to our newsletter for the latest deals and updates.
            </p>
            <div className="space-y-3">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-l-lg bg-secondary-700 border border-secondary-600 text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-r-lg transition-colors">
                  <ApperIcon name="Send" size={18} />
                </button>
              </div>
              <div className="flex items-center space-x-2 text-sm text-secondary-400">
                <ApperIcon name="Shield" size={16} />
                <span>We respect your privacy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-secondary-700 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-secondary-300">
              <span>© 2024 ShopHub. All rights reserved.</span>
              <Link to="#" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-secondary-400">Secure payments</span>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-5 bg-white rounded flex items-center justify-center">
                  <ApperIcon name="CreditCard" size={14} className="text-secondary-800" />
                </div>
                <div className="w-8 h-5 bg-white rounded flex items-center justify-center">
                  <ApperIcon name="Smartphone" size={14} className="text-secondary-800" />
                </div>
                <div className="w-8 h-5 bg-white rounded flex items-center justify-center">
                  <ApperIcon name="Shield" size={14} className="text-secondary-800" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;