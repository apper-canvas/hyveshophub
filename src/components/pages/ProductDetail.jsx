import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import ProductCard from "@/components/molecules/ProductCard";
import RatingStars from "@/components/molecules/RatingStars";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { productService } from "@/services/api/productService";
import { reviewService } from "@/services/api/reviewService";
import { cartService } from "@/services/api/cartService";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    loadProductData();
  }, [id]);

  const loadProductData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [productData, reviewsData, relatedData] = await Promise.all([
        productService.getById(id),
        reviewService.getByProductId(id),
        productService.getRelated(id, 4)
      ]);
      
      setProduct(productData);
      setReviews(reviewsData);
      setRelatedProducts(relatedData);
    } catch (err) {
      setError(err.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product || addingToCart) return;
    
    try {
      setAddingToCart(true);
      await cartService.addItem(product, quantity);
      
      // Dispatch event for header to update cart count
      window.dispatchEvent(new Event("cartUpdated"));
      
      toast.success(`${product.name} added to cart!`, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleRetry = () => {
    loadProductData();
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !product) {
    return (
      <Error 
        message={error || "Product not found"} 
        onRetry={handleRetry}
      />
    );
  }

  const discount = product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-secondary-500 mb-8">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <ApperIcon name="ChevronRight" size={14} />
          <Link to={`/category/${product.category.toLowerCase()}`} className="hover:text-primary-600">
            {product.category}
          </Link>
          <ApperIcon name="ChevronRight" size={14} />
          <span className="text-secondary-800 font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
              {discount > 0 && (
                <Badge
                  variant="warning"
                  size="lg"
                  className="absolute top-4 left-4"
                >
                  -{discount}% OFF
                </Badge>
              )}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                  <Badge variant="error" size="lg">
                    Out of Stock
                  </Badge>
                </div>
              )}
            </div>
            
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer transition-all ${
                      selectedImage === index
                        ? "ring-2 ring-primary-500 opacity-100"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-secondary-800 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <RatingStars 
                  rating={product.rating} 
                  size="lg" 
                  showCount 
                  reviewCount={product.reviewCount} 
                />
                <Link to="#reviews" className="text-primary-600 hover:text-primary-700 text-sm">
                  Read Reviews
                </Link>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold gradient-text">
                  ${product.price}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-xl text-secondary-400 line-through">
                      ${product.originalPrice}
                    </span>
                    <Badge variant="success" size="lg">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </Badge>
                  </>
                )}
              </div>
              
              {product.inStock ? (
                <div className="flex items-center gap-2 text-green-600">
                  <ApperIcon name="CheckCircle" size={16} />
                  <span className="font-medium">In Stock</span>
                  {product.stockCount <= 10 && (
                    <span className="text-yellow-600">
                      - Only {product.stockCount} left!
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <ApperIcon name="XCircle" size={16} />
                  <span className="font-medium">Out of Stock</span>
                </div>
              )}
            </div>

            <p className="text-secondary-600 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="font-medium text-secondary-700">Quantity:</label>
                <div className="flex items-center border border-secondary-300 rounded-lg">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="border-0 rounded-l-lg"
                  >
                    <ApperIcon name="Minus" size={16} />
                  </Button>
                  <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={product.stockCount && quantity >= product.stockCount}
                    className="border-0 rounded-r-lg"
                  >
                    <ApperIcon name="Plus" size={16} />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="flex-1"
                  icon="ShoppingCart"
                  disabled={!product.inStock}
                  loading={addingToCart}
                >
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  icon="Heart"
                  className="px-4"
                >
                  Save
                </Button>
              </div>
            </div>

            {/* Shipping Info */}
            <Card className="bg-blue-50 border-blue-200">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <ApperIcon name="Truck" size={20} className="text-blue-600" />
                  <div>
                    <p className="font-medium text-secondary-800">Free Shipping</p>
                    <p className="text-sm text-secondary-600">On orders over $75</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ApperIcon name="RotateCcw" size={20} className="text-blue-600" />
                  <div>
                    <p className="font-medium text-secondary-800">Easy Returns</p>
                    <p className="text-sm text-secondary-600">30-day return policy</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-12">
          <Card>
            <div className="border-b border-secondary-200">
              <nav className="flex space-x-8 px-6 py-4">
                {[
                  { id: "description", label: "Description" },
                  { id: "specifications", label: "Specifications" },
                  { id: "reviews", label: `Reviews (${reviews.length})` },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-2 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-primary-500 text-primary-600 font-medium"
                        : "border-transparent text-secondary-600 hover:text-secondary-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "description" && (
                <div className="space-y-4">
                  <p className="text-secondary-700 leading-relaxed">
                    {product.description}
                  </p>
                  {product.features && product.features.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-secondary-800 mb-3">Key Features:</h3>
                      <ul className="space-y-2">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <ApperIcon name="CheckCircle" size={16} className="text-green-500" />
                            <span className="text-secondary-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "specifications" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-secondary-100">
                      <span className="font-medium text-secondary-700">{key}:</span>
                      <span className="text-secondary-600">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "reviews" && (
                <div id="reviews" className="space-y-6">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review.Id} className="border-b border-secondary-200 pb-6 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-4">
                            <span className="font-medium text-secondary-800">{review.userName}</span>
                            <RatingStars rating={review.rating} size="sm" />
                          </div>
                          <span className="text-sm text-secondary-500">{review.date}</span>
                        </div>
                        <h4 className="font-medium text-secondary-800 mb-2">{review.title}</h4>
                        <p className="text-secondary-700 mb-3">{review.comment}</p>
                        <div className="flex items-center gap-4 text-sm text-secondary-500">
                          <button className="hover:text-secondary-700">
                            <ApperIcon name="ThumbsUp" size={14} className="inline mr-1" />
                            Helpful ({review.helpful})
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <ApperIcon name="MessageSquare" size={48} className="mx-auto mb-4 text-secondary-300" />
                      <p className="text-secondary-600">No reviews yet. Be the first to review this product!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-secondary-800 mb-8">
              You might also like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <ProductCard product={relatedProduct} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;