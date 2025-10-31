import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const parseCategoryData = (dbCategory) => {
  if (!dbCategory) return null;
  
  return {
    Id: dbCategory.Id,
    name: dbCategory.name_c || '',
    image: dbCategory.image_c || '',
    subcategories: dbCategory.subcategories_c ? JSON.parse(dbCategory.subcategories_c) : []
  };
};

export const categoryService = {
  async getAll() {
    await delay(200);
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords('category_c', {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "subcategories_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return (response.data || []).map(parseCategoryData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
      return [];
    }
  },

  async getById(id) {
    await delay(150);
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.getRecordById('category_c', parseInt(id), {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "subcategories_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Category not found');
      }

      return parseCategoryData(response.data);
    } catch (error) {
      console.error('Error fetching category:', error);
      toast.error('Failed to load category');
      throw error;
    }
  },

  async getByName(name) {
    await delay(150);
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords('category_c', {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "subcategories_c"}}
        ],
        where: [
          {
            FieldName: 'name_c',
            Operator: 'EqualTo',
            Values: [name]
          }
        ]
      });

      if (!response.success || !response.data || response.data.length === 0) {
        console.error(response.message || 'Category not found');
        toast.error('Category not found');
        throw new Error('Category not found');
      }

      return parseCategoryData(response.data[0]);
    } catch (error) {
      console.error('Error fetching category by name:', error);
      toast.error('Failed to load category');
      throw error;
    }
  }
};