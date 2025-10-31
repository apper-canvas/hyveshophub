import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { orderService } from "@/services/api/orderService";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError("");
      const orderData = await orderService.getById(orderId);
      setOrder(orderData);
    } catch (err) {
      setError(err.message || "Order not found");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    loadOrder();
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !order) {
    return (
      <Error 
        message={error || "Order not found"} 
        onRetry={handleRetry}
      />
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="CheckCircle" size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-secondary-800 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-lg text-secondary-600">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          <Badge variant="success" size="lg" className="mt-4">
            Order #{order.Id}
          </Badge>
        </motion.div>

        {/* Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Order Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-secondary-800">
                  Order Details
                </h2>
                <div className="text-right">
                  <p className="text-sm text-secondary-600">Order Date</p>
                  <p className="font-medium text-secondary-800">
                    {formatDate(order.date)}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={`${item.productId}-${JSON.stringify(item.selectedOptions)}`}
                       className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-secondary-800 truncate">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-secondary-600">
                          Qty: {item.quantity}
                        </span>
                        <span className="text-sm font-medium text-primary-600">
                          ${item.price} each
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-secondary-800">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Shipping Information */}
            <Card>
              <h2 className="text-xl font-semibold text-secondary-800 mb-4">
                Shipping Address
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-secondary-700">
                  <p className="font-medium">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  <div className="mt-2 text-sm">
                    <p>Email: {order.shippingAddress.email}</p>
                    <p>Phone: {order.shippingAddress.phone}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Order Notes */}
            {order.orderNotes && (
              <Card>
                <h2 className="text-xl font-semibold text-secondary-800 mb-4">
                  Order Notes
                </h2>
                <p className="text-secondary-700 italic">
                  {order.orderNotes}
                </p>
              </Card>
            )}
          </div>

          {/* Order Summary & Actions */}
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-semibold text-secondary-800 mb-6">
                Order Summary
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-secondary-600">
                    Subtotal ({order.items.length} items)
                  </span>
                  <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-secondary-600">Shipping</span>
                  <span className="font-medium">
                    {order.shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${order.shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-secondary-600">Tax</span>
                  <span className="font-medium">${order.tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-secondary-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="gradient-text">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button
                  onClick={handleContinueShopping}
                  className="w-full"
                  size="lg"
                  icon="ShoppingBag"
                >
                  Continue Shopping
                </Button>
                
                <Link to="/orders" className="block">
                  <Button
                    variant="outline"
                    className="w-full"
                    icon="Package"
                  >
                    Track Your Orders
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Next Steps */}
            <Card>
              <h3 className="text-lg font-semibold text-secondary-800 mb-4">
                What's Next?
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary-600">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-secondary-800">Order Processing</p>
                    <p className="text-sm text-secondary-600">
                      We'll prepare your order for shipment
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary-600">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-secondary-800">Shipping Notification</p>
                    <p className="text-sm text-secondary-600">
                      You'll receive tracking info via email
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary-600">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-secondary-800">Delivery</p>
                    <p className="text-sm text-secondary-600">
                      Your order will arrive in 3-5 business days
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Support */}
            <Card className="bg-blue-50 border-blue-200">
              <div className="text-center">
                <ApperIcon name="Headphones" size={32} className="text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-secondary-800 mb-2">
                  Need Help?
                </h3>
                <p className="text-sm text-secondary-600 mb-4">
                  Our customer service team is here to help with any questions about your order.
                </p>
                <Button variant="outline" size="sm">
                  Contact Support
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Email Confirmation Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12 p-6 bg-green-50 border border-green-200 rounded-lg"
        >
          <ApperIcon name="Mail" size={24} className="text-green-600 mx-auto mb-2" />
          <p className="text-green-800 font-medium mb-1">
            Confirmation Email Sent
          </p>
          <p className="text-green-700 text-sm">
            A copy of your order confirmation has been sent to {order.shippingAddress.email}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;