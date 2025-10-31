import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const parseReviewData = (dbReview) => {
  if (!dbReview) return null;
  
  return {
    Id: dbReview.Id,
    productId: dbReview.product_id_c?.Id?.toString() || '',
    userName: dbReview.user_name_c || '',
    rating: parseInt(dbReview.rating_c) || 0,
    title: dbReview.title_c || '',
    comment: dbReview.comment_c || '',
    date: dbReview.date_c || '',
    helpful: parseInt(dbReview.helpful_c) || 0
  };
};

export const reviewService = {
  async getByProductId(productId) {
    await delay(250);
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.fetchRecords('review_c', {
        fields: [
          {"field": {"Name": "product_id_c"}},
          {"field": {"Name": "user_name_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "comment_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "helpful_c"}}
        ],
        where: [
          {
            FieldName: 'product_id_c',
            Operator: 'EqualTo',
            Values: [parseInt(productId)]
          }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return (response.data || []).map(parseReviewData);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
      return [];
    }
  },

  async create(review) {
    await delay(300);
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const newReview = {
        product_id_c: parseInt(review.productId),
        user_name_c: review.userName,
        rating_c: parseInt(review.rating),
        title_c: review.title,
        comment_c: review.comment,
        date_c: new Date().toISOString().split('T')[0],
        helpful_c: 0
      };

      const response = await apperClient.createRecord('review_c', {
        records: [newReview]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to create review');
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          toast.success('Review submitted successfully');
          return parseReviewData(result.data);
        } else {
          console.error('Review creation failed:', result.message);
          toast.error(result.message);
          throw new Error(result.message);
        }
      }

      throw new Error('No result returned from create operation');
    } catch (error) {
      console.error('Error creating review:', error);
      toast.error('Failed to submit review');
      throw error;
    }
  },

  async markHelpful(reviewId) {
    await delay(150);
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const getResponse = await apperClient.getRecordById('review_c', parseInt(reviewId), {
        fields: [{"field": {"Name": "helpful_c"}}]
      });

      if (!getResponse.success) {
        console.error(getResponse.message);
        toast.error(getResponse.message);
        throw new Error('Review not found');
      }

      const currentHelpful = parseInt(getResponse.data.helpful_c) || 0;

      const response = await apperClient.updateRecord('review_c', {
        records: [
          {
            Id: parseInt(reviewId),
            helpful_c: currentHelpful + 1
          }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to update review');
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return parseReviewData(result.data);
        } else {
          console.error('Review update failed:', result.message);
          toast.error(result.message);
          throw new Error(result.message);
        }
      }

      throw new Error('No result returned from update operation');
    } catch (error) {
      console.error('Error marking review helpful:', error);
      toast.error('Failed to update review');
      throw error;
    }
  }
};