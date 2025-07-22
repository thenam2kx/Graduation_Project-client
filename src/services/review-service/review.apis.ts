import axiosInstance from '@/config/axios.customize';

// Lấy đánh giá theo ID sản phẩm
export const fetchReviewsByProduct = async (productId: string, params?: string) => {
  const url = params ? `/reviews/product/${productId}?${params}` : `/reviews/product/${productId}`;
  const response = await axiosInstance.get(url);
  return response.data;
};

// Lấy đánh giá theo ID người dùng
export const fetchReviewsByUser = async (userId: string, params?: string) => {
  const url = params ? `/reviews/user/${userId}?${params}` : `/reviews/user/${userId}`;
  const response = await axiosInstance.get(url);
  return response.data;
};

// Kiểm tra số lần đánh giá của người dùng cho sản phẩm
export const checkUserReviewCount = async (userId: string, productId: string) => {
  const response = await axiosInstance.get(`/reviews/check/${userId}/${productId}`);
  return response.data;
};

// Tạo đánh giá mới
export const createReview = async (reviewData: {
  userId: string;
  productId: string;
  orderId?: string;
  rating: number;
  comment: string;
  images?: string[];
}) => {
  const response = await axiosInstance.post('/reviews', reviewData);
  return response.data;
};