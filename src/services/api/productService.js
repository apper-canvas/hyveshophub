import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const parseProductData = (dbProduct) => {
  if (!dbProduct) return null;
  
  return {
    Id: dbProduct.Id,
    name: dbProduct.name_c || '',
    description: dbProduct.description_c || '',
    price: parseFloat(dbProduct.price_c) || 0,
    originalPrice: parseFloat(dbProduct.original_price_c) || 0,
stock: dbProduct.stock_c || 0,
    rating: dbProduct.rating_c || 0,
    images: (() => {
      if (!dbProduct.images_c) return [];
      
      // If already an array, return as-is
      if (Array.isArray(dbProduct.images_c)) return dbProduct.images_c;
      
      // Try parsing as JSON first
      try {
        const parsed = JSON.parse(dbProduct.images_c);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        // If JSON parse fails, treat as comma-separated string or single URL
        const urlString = String(dbProduct.images_c).trim();
        if (!urlString) return [];
        
        // Check if it contains commas (multiple URLs)
        if (urlString.includes(',')) {
          return urlString.split(',').map(url => url.trim()).filter(url => url.length > 0);
        }
        
        // Single URL string
        return [urlString];
      }
    })(),
    reviewCount: dbProduct.review_count_c || 0,
    category: dbProduct.category_c,
    inStock: dbProduct.in_stock_c === true,
    stockCount: parseInt(dbProduct.stock_count_c) || 0,
    specifications: dbProduct.specifications_c ? JSON.parse(dbProduct.specifications_c) : {},
    features: dbProduct.features_c ? JSON.parse(dbProduct.features_c) : []
  };
};

export const productService = {
  async getAll() {
    await delay(300);
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords('product_c', {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "original_price_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "stock_count_c"}},
          {"field": {"Name": "specifications_c"}},
          {"field": {"Name": "features_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return (response.data || []).map(parseProductData);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      return [];
    }
  },

  async getById(id) {
    await delay(200);
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.getRecordById('product_c', parseInt(id), {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "original_price_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "stock_count_c"}},
          {"field": {"Name": "specifications_c"}},
          {"field": {"Name": "features_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Product not found');
      }

      return parseProductData(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
      throw error;
    }
  },

  async getByCategory(category, subcategory = null) {
    await delay(350);
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const where = [{
        FieldName: 'category_c',
        Operator: 'EqualTo',
        Values: [category]
      }];

      if (subcategory) {
        where.push({
          FieldName: 'subcategory_c',
          Operator: 'EqualTo',
          Values: [subcategory]
        });
      }

      const response = await apperClient.fetchRecords('product_c', {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "original_price_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "stock_count_c"}},
          {"field": {"Name": "specifications_c"}},
          {"field": {"Name": "features_c"}}
        ],
        where
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return (response.data || []).map(parseProductData);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      toast.error('Failed to load category products');
      return [];
    }
  },

  async search(query, filters = {}) {
    await delay(400);
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const whereGroups = {
        operator: 'OR',
        subGroups: []
      };

      if (query && query.trim()) {
        whereGroups.subGroups.push({
          conditions: [
            {
              fieldName: 'name_c',
              operator: 'Contains',
              values: [query]
            }
          ],
          operator: 'OR'
        });
        whereGroups.subGroups.push({
          conditions: [
            {
              fieldName: 'description_c',
              operator: 'Contains',
              values: [query]
            }
          ],
          operator: 'OR'
        });
      }

      const where = [];

      if (filters.category && filters.category !== 'all') {
        where.push({
          FieldName: 'category_c',
          Operator: 'EqualTo',
          Values: [filters.category]
        });
      }

      if (filters.minPrice !== undefined) {
        where.push({
          FieldName: 'price_c',
          Operator: 'GreaterThanOrEqualTo',
          Values: [filters.minPrice]
        });
      }

      if (filters.maxPrice !== undefined) {
        where.push({
          FieldName: 'price_c',
          Operator: 'LessThanOrEqualTo',
          Values: [filters.maxPrice]
        });
      }

      if (filters.minRating !== undefined) {
        where.push({
          FieldName: 'rating_c',
          Operator: 'GreaterThanOrEqualTo',
          Values: [filters.minRating]
        });
      }

      if (filters.inStock) {
        where.push({
          FieldName: 'in_stock_c',
          Operator: 'EqualTo',
          Values: [true]
        });
      }

      const orderBy = [];
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'price-low':
            orderBy.push({ fieldName: 'price_c', sorttype: 'ASC' });
            break;
          case 'price-high':
            orderBy.push({ fieldName: 'price_c', sorttype: 'DESC' });
            break;
          case 'rating':
            orderBy.push({ fieldName: 'rating_c', sorttype: 'DESC' });
            break;
          case 'newest':
            orderBy.push({ fieldName: 'Id', sorttype: 'DESC' });
            break;
          case 'name':
            orderBy.push({ fieldName: 'name_c', sorttype: 'ASC' });
            break;
        }
      }

      const params = {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "original_price_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "stock_count_c"}},
          {"field": {"Name": "specifications_c"}},
          {"field": {"Name": "features_c"}}
        ]
      };

      if (where.length > 0) {
        params.where = where;
      }

      if (whereGroups.subGroups.length > 0) {
        params.whereGroups = [whereGroups];
      }

      if (orderBy.length > 0) {
        params.orderBy = orderBy;
      }

      const response = await apperClient.fetchRecords('product_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return (response.data || []).map(parseProductData);
    } catch (error) {
      console.error('Error searching products:', error);
      toast.error('Failed to search products');
      return [];
    }
  },

  async getFeatured() {
    await delay(250);
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords('product_c', {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "original_price_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "stock_count_c"}},
          {"field": {"Name": "specifications_c"}},
          {"field": {"Name": "features_c"}}
        ],
        where: [
          {
            FieldName: 'rating_c',
            Operator: 'GreaterThanOrEqualTo',
            Values: [4.5]
          }
        ],
        orderBy: [{ fieldName: 'rating_c', sorttype: 'DESC' }],
        pagingInfo: { limit: 8, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      const products = (response.data || []).map(parseProductData);
      return products.filter(p => p.originalPrice > p.price);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      toast.error('Failed to load featured products');
      return [];
    }
  },

  async getDeals() {
    await delay(280);
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords('product_c', {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "original_price_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "stock_count_c"}},
          {"field": {"Name": "specifications_c"}},
          {"field": {"Name": "features_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      const products = (response.data || []).map(parseProductData)
        .filter(p => p.originalPrice > p.price)
        .map(p => ({
          ...p,
          discount: Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
        }))
        .sort((a, b) => b.discount - a.discount)
        .slice(0, 6);

      return products;
    } catch (error) {
      console.error('Error fetching deals:', error);
      toast.error('Failed to load deals');
      return [];
    }
  },

  async getRelated(productId, limit = 4) {
    await delay(200);
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const product = await this.getById(productId);
      if (!product) return [];

      const whereGroups = {
        operator: 'OR',
        subGroups: [
          {
            conditions: [
              {
                fieldName: 'category_c',
                operator: 'EqualTo',
                values: [product.category]
              }
            ],
            operator: 'OR'
          },
          {
            conditions: [
              {
                fieldName: 'subcategory_c',
                operator: 'EqualTo',
                values: [product.subcategory]
              }
            ],
            operator: 'OR'
          }
        ]
      };

      const response = await apperClient.fetchRecords('product_c', {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "original_price_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "review_count_c"}},
          {"field": {"Name": "in_stock_c"}},
          {"field": {"Name": "stock_count_c"}},
          {"field": {"Name": "specifications_c"}},
          {"field": {"Name": "features_c"}}
        ],
        whereGroups: [whereGroups],
        pagingInfo: { limit: limit + 1, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || [])
        .map(parseProductData)
        .filter(p => p.Id !== parseInt(productId))
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching related products:', error);
      return [];
    }
  }
};