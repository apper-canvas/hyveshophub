import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cartService } from "@/services/api/cartService";
import { toast } from "react-toastify";

const CartItem = ({ item, onUpdate, onRemove }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    try {
      setQuantity(newQuantity);
      await cartService.updateQuantity(item.productId, item.selectedOptions, newQuantity);
      onUpdate?.();
    } catch (error) {
      toast.error("Failed to update quantity");
      setQuantity(item.quantity); // Revert on error
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    try {
      await cartService.removeItem(item.productId, item.selectedOptions);
      onRemove?.();
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 object-cover rounded-lg"
      />
      
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-medium text-secondary-800 truncate">
          {item.name}
        </h3>
        
        <div className="flex items-center gap-2 mt-1">
          <span className="text-lg font-bold text-primary-600">
            ${item.price}
          </span>
          {item.originalPrice > item.price && (
            <span className="text-sm text-secondary-400 line-through">
              ${item.originalPrice}
            </span>
          )}
        </div>

        {!item.inStock && (
          <p className="text-sm text-red-600 mt-1">
            Currently out of stock
          </p>
        )}
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 border border-secondary-300 rounded-lg">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1 || isUpdating}
            className="h-8 w-8 p-0 border-0 rounded-l-lg"
          >
            <ApperIcon name="Minus" size={14} />
          </Button>
          
          <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
            {quantity}
          </span>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={isUpdating || (item.stockCount && quantity >= item.stockCount)}
            className="h-8 w-8 p-0 border-0 rounded-r-lg"
          >
            <ApperIcon name="Plus" size={14} />
          </Button>
        </div>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={handleRemove}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
        >
          <ApperIcon name="Trash2" size={16} />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;