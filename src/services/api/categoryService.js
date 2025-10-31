import categoriesData from "@/services/mockData/categories.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const categoryService = {
  async getAll() {
    await delay(200);
    return [...categoriesData];
  },

  async getById(id) {
    await delay(150);
    const category = categoriesData.find(c => c.Id === parseInt(id));
    if (!category) {
      throw new Error("Category not found");
    }
    return { ...category };
  },

  async getByName(name) {
    await delay(150);
    const category = categoriesData.find(c => 
      c.name.toLowerCase() === name.toLowerCase()
    );
    if (!category) {
      throw new Error("Category not found");
    }
    return { ...category };
  }
};