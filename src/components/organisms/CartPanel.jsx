import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import CartItem from "@/components/molecules/CartItem";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { cartService } from "@/services/api/cartService";

const CartPanel = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      setError("");
      const cartData = await cartService.getCart();
      setCart(cartData);
    } catch (err) {
      setError(err.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleItemUpdate = () => {
    loadCart();
    // Dispatch cart update event for header
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleProceedToCheckout = () => {
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadCart} />;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Empty
          title="Your cart is empty"
          description="Looks like you haven't added any items to your cart yet. Start shopping to find amazing deals!"
          icon="ShoppingCart"
          action={handleContinueShopping}
          actionLabel="Start Shopping"
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-secondary-800">Shopping Cart</h1>
        <Button
          variant="ghost"
          onClick={handleContinueShopping}
          icon="ArrowLeft"
        >
          Continue Shopping
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <Card padding="none">
            <div className="p-6 border-b border-secondary-200">
              <h2 className="text-xl font-semibold text-secondary-800">
                Items in your cart ({cart.items.length})
              </h2>
            </div>
            
            <div className="divide-y divide-secondary-200">
              {cart.items.map((item) => (
                <div key={`${item.productId}-${JSON.stringify(item.selectedOptions)}`} className="p-6">
                  <CartItem
                    item={item}
                    onUpdate={handleItemUpdate}
                    onRemove={handleItemUpdate}
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Recommended Products */}
          <Card>
            <h3 className="text-lg font-semibold text-secondary-800 mb-4">
              You might also like
            </h3>
            <div className="text-center text-secondary-500">
              <ApperIcon name="Heart" size={48} className="mx-auto mb-2 text-secondary-300" />
              <p>Recommendations will appear here</p>
            </div>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-semibold text-secondary-800 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-secondary-600">Subtotal ({cart.items.length} items)</span>
                <span className="font-medium">${cart.subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-secondary-600">Shipping</span>
                <span className="font-medium">
                  {cart.shipping === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `$${cart.shipping.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-secondary-600">Estimated Tax</span>
                <span className="font-medium">${cart.tax.toFixed(2)}</span>
              </div>

              {cart.shipping > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <ApperIcon name="Info" size={16} className="inline mr-1" />
                    Add ${(75 - cart.subtotal).toFixed(2)} more for free shipping
                  </p>
                </div>
              )}

              <div className="border-t border-secondary-200 pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Order Total</span>
                  <span className="gradient-text">${cart.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button
                onClick={handleProceedToCheckout}
                className="w-full"
                size="lg"
                icon="CreditCard"
              >
                Proceed to Checkout
              </Button>

              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-sm text-secondary-500">
                  <ApperIcon name="Shield" size={16} />
                  <span>Secure checkout with SSL encryption</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Trust Indicators */}
          <Card>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Truck" size={20} className="text-primary-500" />
                <div>
                  <p className="font-medium text-secondary-800">Fast Delivery</p>
                  <p className="text-sm text-secondary-600">Free shipping on orders over $75</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <ApperIcon name="RotateCcw" size={20} className="text-primary-500" />
                <div>
                  <p className="font-medium text-secondary-800">Easy Returns</p>
                  <p className="text-sm text-secondary-600">30-day return policy</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <ApperIcon name="Shield" size={20} className="text-primary-500" />
                <div>
                  <p className="font-medium text-secondary-800">Secure Payment</p>
                  <p className="text-sm text-secondary-600">Your data is protected</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPanel;