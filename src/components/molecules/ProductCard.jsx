import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import RatingStars from "@/components/molecules/RatingStars";
import ApperIcon from "@/components/ApperIcon";
import { cartService } from "@/services/api/cartService";
import { toast } from "react-toastify";

const ProductCard = ({ product, variant = "grid" }) => {
  const discount = product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await cartService.addItem(product, 1);
      toast.success("Added to cart!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  if (variant === "list") {
    return (
      <Link to={`/product/${product.Id}`}>
        <Card hover className="product-card p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-shrink-0">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              {discount > 0 && (
                <Badge
                  variant="warning"
                  size="sm"
                  className="absolute -top-2 -right-2"
                >
                  -{discount}%
                </Badge>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-secondary-800 truncate">
                {product.name}
              </h3>
              <p className="text-sm text-secondary-600 line-clamp-2 mt-1">
                {product.description}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <RatingStars rating={product.rating} size="sm" />
                <span className="text-sm text-secondary-500">
                  ({product.reviewCount})
                </span>
              </div>
            </div>
            
            <div className="flex-shrink-0 text-right">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl font-bold gradient-text">
                  ${product.price}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-secondary-400 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              <Button
                onClick={handleAddToCart}
                size="sm"
                icon="ShoppingCart"
                disabled={!product.inStock}
              >
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link to={`/product/${product.Id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <Card hover className="product-card h-full">
          <div className="relative">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            {discount > 0 && (
              <Badge
                variant="warning"
                size="sm"
                className="absolute top-2 left-2"
              >
                -{discount}% OFF
              </Badge>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-t-lg">
                <Badge variant="error" size="lg">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>
          
          <div className="p-4 space-y-3">
            <h3 className="text-lg font-semibold text-secondary-800 line-clamp-2 min-h-[3.5rem]">
              {product.name}
            </h3>
            
            <div className="flex items-center gap-2">
              <RatingStars rating={product.rating} size="sm" />
              <span className="text-sm text-secondary-500">
                ({product.reviewCount})
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold gradient-text">
                    ${product.price}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-secondary-400 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
                {product.inStock && product.stockCount <= 10 && (
                  <p className="text-xs text-yellow-600">
                    Only {product.stockCount} left!
                  </p>
                )}
              </div>
            </div>
            
            <Button
              onClick={handleAddToCart}
              className="w-full"
              icon="ShoppingCart"
              disabled={!product.inStock}
            >
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
};

export default ProductCard;