import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "@/components/molecules/ProductCard";
import CategoryCard from "@/components/molecules/CategoryCard";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { productService } from "@/services/api/productService";
import { categoryService } from "@/services/api/categoryService";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [dealsProducts, setDealsProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [featured, deals, categoriesData] = await Promise.all([
        productService.getFeatured(),
        productService.getDeals(),
        categoryService.getAll()
      ]);
      
      setFeaturedProducts(featured);
      setDealsProducts(deals);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    loadData();
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={handleRetry} />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-500 to-accent-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Amazing 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Products & Deals
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Your ultimate shopping destination for quality products at unbeatable prices. 
              Shop with confidence and discover something new every day.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/deals">
                <Button size="xl" variant="secondary" icon="Zap">
                  Today's Deals
                </Button>
              </Link>
              <Link to="/category/electronics">
                <Button size="xl" variant="ghost" className="text-white border-white hover:bg-white/10" icon="ShoppingBag">
                  Shop Electronics
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="text-center">
              <ApperIcon name="Truck" size={32} className="mx-auto mb-3 text-yellow-400" />
              <h3 className="font-semibold text-lg mb-2">Free Shipping</h3>
              <p className="text-primary-200">On orders over $75</p>
            </div>
            <div className="text-center">
              <ApperIcon name="Shield" size={32} className="mx-auto mb-3 text-yellow-400" />
              <h3 className="font-semibold text-lg mb-2">Secure Shopping</h3>
              <p className="text-primary-200">100% secure payments</p>
            </div>
            <div className="text-center">
              <ApperIcon name="RotateCcw" size={32} className="mx-auto mb-3 text-yellow-400" />
              <h3 className="font-semibold text-lg mb-2">Easy Returns</h3>
              <p className="text-primary-200">30-day money back guarantee</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Today's Deals Section */}
      {dealsProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="warning" className="text-sm font-bold">
                    LIMITED TIME
                  </Badge>
                  <ApperIcon name="Clock" size={20} className="text-yellow-600" />
                </div>
                <h2 className="text-3xl font-bold text-secondary-800">Today's Best Deals</h2>
                <p className="text-secondary-600 mt-2">Don't miss out on these amazing discounts</p>
              </div>
              <Link to="/deals">
                <Button variant="outline" icon="ArrowRight" iconPosition="right">
                  View All Deals
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {dealsProducts.map((product, index) => (
                <motion.div
                  key={product.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-16 bg-gradient-to-br from-secondary-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-800 mb-4">Shop by Category</h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Explore our wide range of categories and find exactly what you're looking for
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.Id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <CategoryCard category={category} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge variant="primary" className="mb-4">
                STAFF PICKS
              </Badge>
              <h2 className="text-3xl font-bold text-secondary-800 mb-4">Featured Products</h2>
              <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
                Hand-picked products with the highest ratings and best value
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/search">
                <Button size="lg" icon="Search">
                  Browse All Products
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-secondary-800 to-secondary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-white/10 backdrop-blur border-white/20 glass">
            <div className="text-center">
              <ApperIcon name="Mail" size={48} className="mx-auto mb-6 text-yellow-400" />
              <h2 className="text-3xl font-bold mb-4">Stay in the Loop</h2>
              <p className="text-xl mb-8 text-secondary-200 max-w-2xl mx-auto">
                Be the first to know about new arrivals, exclusive deals, and special offers. 
                Join thousands of happy shoppers!
              </p>
              
              <div className="max-w-md mx-auto flex space-x-3">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 backdrop-blur"
                />
                <Button variant="secondary" size="lg" icon="Send">
                  Subscribe
                </Button>
              </div>
              
              <p className="text-sm text-secondary-300 mt-4">
                <ApperIcon name="Shield" size={16} className="inline mr-1" />
                We respect your privacy and never share your email
              </p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;