import productsData from "@/services/mockData/products.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
  async getAll() {
    await delay(300);
    return [...productsData];
  },

  async getById(id) {
    await delay(200);
    const product = productsData.find(p => p.Id === parseInt(id));
    if (!product) {
      throw new Error("Product not found");
    }
    return { ...product };
  },

  async getByCategory(category, subcategory = null) {
    await delay(350);
    let filtered = productsData.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );
    
    if (subcategory) {
      filtered = filtered.filter(p => 
        p.subcategory.toLowerCase() === subcategory.toLowerCase()
      );
    }
    
    return filtered.map(p => ({ ...p }));
  },

  async search(query, filters = {}) {
    await delay(400);
    let results = productsData.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
    );

    // Apply filters
    if (filters.category && filters.category !== "all") {
      results = results.filter(p => 
        p.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.minPrice !== undefined) {
      results = results.filter(p => p.price >= filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      results = results.filter(p => p.price <= filters.maxPrice);
    }

    if (filters.minRating !== undefined) {
      results = results.filter(p => p.rating >= filters.minRating);
    }

    if (filters.inStock) {
      results = results.filter(p => p.inStock);
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price-low":
          results.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          results.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          results.sort((a, b) => b.rating - a.rating);
          break;
        case "newest":
          results.sort((a, b) => b.Id - a.Id);
          break;
        case "name":
          results.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }
    }

    return results.map(p => ({ ...p }));
  },

  async getFeatured() {
    await delay(250);
    // Return products with high ratings and good prices
    const featured = productsData
      .filter(p => p.rating >= 4.5 && p.originalPrice > p.price)
      .slice(0, 8);
    return featured.map(p => ({ ...p }));
  },

  async getDeals() {
    await delay(280);
    // Return products with significant discounts
    const deals = productsData
      .filter(p => p.originalPrice > p.price)
      .map(p => ({
        ...p,
        discount: Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
      }))
      .sort((a, b) => b.discount - a.discount)
      .slice(0, 6);
    return deals;
  },

  async getRelated(productId, limit = 4) {
    await delay(200);
    const product = productsData.find(p => p.Id === parseInt(productId));
    if (!product) return [];

    const related = productsData
      .filter(p => 
        p.Id !== parseInt(productId) && 
        (p.category === product.category || p.subcategory === product.subcategory)
      )
      .slice(0, limit);
    
    return related.map(p => ({ ...p }));
  }
};