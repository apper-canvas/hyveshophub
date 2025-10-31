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
  }
};