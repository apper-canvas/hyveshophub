import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import { orderService } from '@/services/api/orderService';
import { toast } from 'react-toastify';

function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);
  const [trackingInfo, setTrackingInfo] = useState(null);

  useEffect(() => {
    loadTrackingInfo();
  }, [orderId]);

  async function loadTrackingInfo() {
    try {
      setLoading(true);
      setError(null);
      
      const orderData = await orderService.getById(orderId);
      const tracking = await orderService.getTrackingInfo(orderId);
      
      setOrder(orderData);
      setTrackingInfo(tracking);
    } catch (err) {
      console.error('Error loading tracking info:', err);
      setError(err.message || 'Failed to load tracking information');
      toast.error('Unable to load tracking information');
    } finally {
      setLoading(false);
    }
  }

  function handleRetry() {
    loadTrackingInfo();
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  function getStatusColor(status) {
    const colors = {
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-yellow-100 text-yellow-800',
      shipped: 'bg-purple-100 text-purple-800',
      'out-for-delivery': 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  function getStatusIcon(status) {
    const icons = {
      confirmed: 'CheckCircle2',
      processing: 'Package',
      shipped: 'Truck',
      'out-for-delivery': 'MapPin',
      delivered: 'Home'
    };
    return icons[status] || 'Package';
  }

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Error 
        message={error}
        onRetry={handleRetry}
      />
    );
  }

  if (!order || !trackingInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="p-8 text-center">
            <ApperIcon name="PackageX" size={64} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Tracking Information Not Available
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't find tracking information for this order.
            </p>
            <Link to="/orders">
              <Button>Back to Orders</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link to="/orders">
            <Button variant="ghost" icon="ArrowLeft">
              Back to Orders
            </Button>
          </Link>
          <Badge className={getStatusColor(order.status)}>
            {order.status.replace('-', ' ').toUpperCase()}
          </Badge>
        </div>

        {/* Tracking Header Card */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Track Your Order
              </h1>
              <p className="text-gray-600">
                Order #{order.Id} • Placed {formatDate(order.date)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Estimated Delivery</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(trackingInfo.estimatedDelivery)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-600 mb-1">Carrier</p>
              <p className="font-semibold text-gray-900">{trackingInfo.carrier}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
              <p className="font-semibold text-gray-900 font-mono text-sm">
                {trackingInfo.trackingNumber}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Shipping Address</p>
              <p className="font-semibold text-gray-900">
                {order.shippingAddress.city}, {order.shippingAddress.state}
              </p>
            </div>
          </div>
        </Card>

        {/* Tracking Timeline */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Tracking History</h2>
          
          <div className="space-y-6">
            {trackingInfo.events.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-8 pb-6 last:pb-0"
              >
                {/* Timeline line */}
                {index < trackingInfo.events.length - 1 && (
                  <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-gray-200" />
                )}
                
                {/* Status icon */}
                <div className={`absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center ${
                  index === 0 ? 'bg-blue-500' : 'bg-gray-300'
                }`}>
                  <ApperIcon 
                    name={getStatusIcon(event.status)} 
                    size={14} 
                    className="text-white"
                  />
                </div>

                {/* Event content */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {event.description}
                    </h3>
                    <Badge className={getStatusColor(event.status)} size="sm">
                      {event.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 space-x-4">
                    <span className="flex items-center">
                      <ApperIcon name="Calendar" size={14} className="mr-1" />
                      {formatDate(event.timestamp)}
                    </span>
                    <span className="flex items-center">
                      <ApperIcon name="Clock" size={14} className="mr-1" />
                      {formatTime(event.timestamp)}
                    </span>
                  </div>
                  
                  {event.location && (
                    <div className="mt-2 flex items-center text-sm text-gray-600">
                      <ApperIcon name="MapPin" size={14} className="mr-1" />
                      {event.location}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Order Items Summary */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Package" size={24} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total Amount</span>
              <span className="text-2xl font-bold text-gray-900">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/orders" className="flex-1">
            <Button variant="outline" className="w-full" icon="Package">
              View All Orders
            </Button>
          </Link>
          <Link to="/" className="flex-1">
            <Button className="w-full" icon="ShoppingBag">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default OrderTracking;