// Order service using localStorage for persistence
const ORDERS_STORAGE_KEY = "shophub_orders";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getOrdersFromStorage = () => {
  try {
    const orders = localStorage.getItem(ORDERS_STORAGE_KEY);
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    console.error("Error reading orders from localStorage:", error);
    return [];
  }
};

const saveOrdersToStorage = (orders) => {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error("Error saving orders to localStorage:", error);
  }
};

export const orderService = {
  async createOrder(orderData) {
    await delay(500);
    
    const orders = getOrdersFromStorage();
    const newOrder = {
      Id: orders.length > 0 ? Math.max(...orders.map(o => o.Id)) + 1 : 1,
      ...orderData,
      date: new Date().toISOString(),
      status: "confirmed"
    };

    orders.push(newOrder);
    saveOrdersToStorage(orders);
    
    return { ...newOrder };
  },

  async getOrders() {
    await delay(300);
    const orders = getOrdersFromStorage();
    return orders.map(order => ({ ...order }));
  },

  async getById(id) {
    await delay(200);
    const orders = getOrdersFromStorage();
    const order = orders.find(o => o.Id === parseInt(id));
    if (!order) {
      throw new Error("Order not found");
    }
    return { ...order };
  },

  async updateStatus(id, status) {
    await delay(250);
    const orders = getOrdersFromStorage();
    const orderIndex = orders.findIndex(o => o.Id === parseInt(id));
    
    if (orderIndex >= 0) {
      orders[orderIndex].status = status;
      saveOrdersToStorage(orders);
      return { ...orders[orderIndex] };
    }
throw new Error("Order not found");
  },

  async getTrackingInfo(id) {
    await delay(300);
    const orders = getOrdersFromStorage();
    const order = orders.find(o => o.Id === parseInt(id));
    
    if (!order) {
      throw new Error("Order not found");
    }

    const carriers = ['FedEx', 'UPS', 'USPS'];
    const carrier = carriers[order.Id % carriers.length];
    const trackingNumber = `${carrier.substring(0, 2).toUpperCase()}${Math.random().toString().substring(2, 14)}`;

    const orderDate = new Date(order.date);
    const statusDays = {
      confirmed: 0,
      processing: 1,
      shipped: 2,
      'out-for-delivery': 4,
      delivered: 5
    };

    const currentStatusDay = statusDays[order.status] || 0;
    const estimatedDeliveryDays = order.status === 'delivered' ? currentStatusDay : 5;
    const estimatedDelivery = new Date(orderDate);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + estimatedDeliveryDays);

    const events = [];
    const statusProgression = [
      { status: 'confirmed', description: 'Order confirmed and payment received', location: null },
      { status: 'processing', description: 'Order is being prepared for shipment', location: 'Warehouse - Processing Center' },
      { status: 'shipped', description: 'Package has been shipped', location: 'Distribution Center' },
      { status: 'out-for-delivery', description: 'Out for delivery', location: `${order.shippingAddress.city}, ${order.shippingAddress.state}` }
    ];

    if (order.status === 'delivered') {
      statusProgression.push({
        status: 'delivered',
        description: 'Package delivered successfully',
        location: order.shippingAddress.address
      });
    }

    const currentStatusIndex = statusProgression.findIndex(s => s.status === order.status);
    const eventsToShow = currentStatusIndex >= 0 ? statusProgression.slice(0, currentStatusIndex + 1) : statusProgression.slice(0, 1);

    eventsToShow.reverse().forEach((statusEvent, index) => {
      const eventDate = new Date(orderDate);
      const daysToAdd = statusDays[statusEvent.status] || 0;
      eventDate.setDate(eventDate.getDate() + daysToAdd);
      eventDate.setHours(9 + (index * 3), Math.floor(Math.random() * 60), 0, 0);

      events.push({
        status: statusEvent.status,
        description: statusEvent.description,
        location: statusEvent.location,
        timestamp: eventDate.toISOString()
      });
    });

    return {
      carrier,
      trackingNumber,
      estimatedDelivery: estimatedDelivery.toISOString(),
      events
    };
  }
};