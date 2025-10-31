// Cart service using localStorage for persistence
const CART_STORAGE_KEY = "shophub_cart";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getCartFromStorage = () => {
  try {
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : { items: [], subtotal: 0, tax: 0, shipping: 0, total: 0 };
  } catch (error) {
    console.error("Error reading cart from localStorage:", error);
    return { items: [], subtotal: 0, tax: 0, shipping: 0, total: 0 };
  }
};

const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

const calculateCartTotals = (items) => {
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.0875; // 8.75% tax
  const shipping = subtotal >= 75 ? 0 : 9.99; // Free shipping over $75
  const total = subtotal + tax + shipping;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    total: Math.round(total * 100) / 100
  };
};

export const cartService = {
  async getCart() {
    await delay(200);
    return getCartFromStorage();
  },

  async addItem(product, quantity = 1, selectedOptions = {}) {
    await delay(250);
    const cart = getCartFromStorage();
    
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => 
      item.productId === product.Id.toString() && 
      JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
    );

    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      const cartItem = {
        productId: product.Id.toString(),
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
        quantity: quantity,
        selectedOptions: selectedOptions,
        inStock: product.inStock,
        stockCount: product.stockCount
      };
      cart.items.push(cartItem);
    }

    // Recalculate totals
    const totals = calculateCartTotals(cart.items);
    Object.assign(cart, totals);

    saveCartToStorage(cart);
    return { ...cart };
  },

  async updateQuantity(productId, selectedOptions, quantity) {
    await delay(200);
    const cart = getCartFromStorage();
    
    const itemIndex = cart.items.findIndex(item => 
      item.productId === productId.toString() && 
      JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
    );

    if (itemIndex >= 0) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        cart.items.splice(itemIndex, 1);
      } else {
        // Update quantity
        cart.items[itemIndex].quantity = quantity;
      }

      // Recalculate totals
      const totals = calculateCartTotals(cart.items);
      Object.assign(cart, totals);

      saveCartToStorage(cart);
    }

    return { ...cart };
  },

  async removeItem(productId, selectedOptions = {}) {
    await delay(200);
    const cart = getCartFromStorage();
    
    cart.items = cart.items.filter(item => 
      !(item.productId === productId.toString() && 
        JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions))
    );

    // Recalculate totals
    const totals = calculateCartTotals(cart.items);
    Object.assign(cart, totals);

    saveCartToStorage(cart);
    return { ...cart };
  },

  async clearCart() {
    await delay(150);
    const emptyCart = { items: [], subtotal: 0, tax: 0, shipping: 0, total: 0 };
    saveCartToStorage(emptyCart);
    return { ...emptyCart };
  },

  getItemCount() {
    const cart = getCartFromStorage();
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  }
};