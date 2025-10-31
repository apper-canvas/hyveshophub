import reviewsData from "@/services/mockData/reviews.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const reviewService = {
  async getByProductId(productId) {
    await delay(250);
    const reviews = reviewsData.filter(r => r.productId === productId.toString());
    return reviews.map(r => ({ ...r }));
  },

  async create(review) {
    await delay(300);
    const newReview = {
      Id: Math.max(...reviewsData.map(r => r.Id)) + 1,
      ...review,
      date: new Date().toISOString().split('T')[0],
      helpful: 0
    };
    reviewsData.push(newReview);
    return { ...newReview };
  },

  async markHelpful(reviewId) {
    await delay(150);
    const review = reviewsData.find(r => r.Id === parseInt(reviewId));
    if (!review) {
      throw new Error("Review not found");
    }
    review.helpful += 1;
    return { ...review };
  }
};