import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { orderService } from "@/services/api/orderService";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const ordersData = await orderService.getOrders();
      // Sort orders by date (newest first)
      const sortedOrders = ordersData.sort((a, b) => new Date(b.date) - new Date(a.date));
      setOrders(sortedOrders);
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    loadOrders();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "success";
      case "processing":
        return "warning";
      case "shipped":
        return "info";
      case "delivered":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={handleRetry} />;
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Empty
            title="No orders yet"
            description="You haven't placed any orders yet. Start shopping to see your order history here!"
            icon="Package"
            action={() => window.location.href = "/"}
            actionLabel="Start Shopping"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary-800">Your Orders</h1>
            <p className="text-secondary-600 mt-1">
              Track and manage your order history
            </p>
          </div>
          <Link to="/">
            <Button variant="outline" icon="ShoppingBag">
              Continue Shopping
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card hover className="cursor-pointer">
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h2 className="text-lg font-semibold text-secondary-800">
                          Order #{order.Id}
                        </h2>
                        <p className="text-sm text-secondary-600">
                          Placed on {formatDate(order.date)}
                        </p>
                      </div>
                      <Badge variant={getStatusColor(order.status)} size="lg">
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="mt-4 sm:mt-0 text-right">
                      <p className="text-2xl font-bold gradient-text">
                        ${order.total.toFixed(2)}
                      </p>
                      <p className="text-sm text-secondary-600">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-4 overflow-x-auto">
                      {order.items.slice(0, 4).map((item, itemIndex) => (
                        <div key={itemIndex} className="flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg border border-secondary-200"
                          />
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <div className="flex-shrink-0 w-16 h-16 bg-secondary-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-medium text-secondary-600">
                            +{order.items.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="mb-6">
                    <h3 className="font-medium text-secondary-800 mb-2">Shipping Address</h3>
                    <div className="text-sm text-secondary-600">
                      <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                      <p>{order.shippingAddress.address}</p>
                      <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-secondary-200">
                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                      <div className="flex items-center text-sm text-secondary-600">
                        <ApperIcon name="Truck" size={16} className="mr-1" />
                        <span>
                          {order.status === "delivered" 
                            ? "Delivered" 
                            : order.status === "shipped"
                            ? "In transit"
                            : "Preparing for shipment"
                          }
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Link to={`/order-confirmation/${order.Id}`}>
                        <Button variant="outline" size="sm" icon="Eye">
                          View Details
                        </Button>
                      </Link>
                      
                      {order.status !== "cancelled" && order.status !== "delivered" && (
                        <Button variant="ghost" size="sm" icon="MapPin">
                          Track Package
                        </Button>
                      )}
                      
                      {order.status === "delivered" && (
                        <Button variant="ghost" size="sm" icon="RotateCcw">
                          Return Items
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Help Section */}
        <Card className="mt-12 bg-blue-50 border-blue-200">
          <div className="text-center">
            <ApperIcon name="Headphones" size={48} className="text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-secondary-800 mb-2">
              Need Help with an Order?
            </h2>
            <p className="text-secondary-600 mb-6 max-w-2xl mx-auto">
              Our customer service team is here to help with any questions about your orders, 
              returns, or shipping information.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Button variant="primary" icon="MessageCircle">
                Contact Support
              </Button>
              <Button variant="outline" icon="HelpCircle">
                Order FAQ
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Orders;