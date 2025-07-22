import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchReviewsByProduct } from '@/services/review-service/review.apis';
import { REVIEW_QUERY_KEYS } from '@/services/review-service/review.keys';
import { Review } from '@/services/review-service/review.types';
import { Rate, Image, Pagination, Empty, Spin } from 'antd';
import dayjs from 'dayjs';

interface ReviewListProps {
  productId: string;
}

const ReviewList = ({ productId }: ReviewListProps) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  // Fetch đánh giá theo sản phẩm
  const { data: reviewsData, isLoading } = useQuery({
    queryKey: [REVIEW_QUERY_KEYS.FETCH_BY_PRODUCT, productId, page, limit],
    queryFn: () => fetchReviewsByProduct(productId, `page=${page}&limit=${limit}&status=approved`),
    enabled: !!productId,
  });

  const reviews = reviewsData?.data?.results || [];
  const total = reviewsData?.data?.meta?.total || 0;

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setLimit(newPageSize);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spin />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="py-8">
        <Empty description="Chưa có đánh giá nào cho sản phẩm này" />
        <p className="text-center text-sm text-gray-500 mt-2">
          Hãy là người đầu tiên đánh giá sản phẩm này
        </p>
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="text-sm text-gray-500 mb-4">{total} đánh giá</div>
      
      <div className="space-y-4">
        {reviews.map((review: Review) => {
          const user = typeof review.userId === 'object' ? review.userId : { fullName: 'Khách hàng' };
          
          return (
            <div key={review._id} className="border-b pb-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                  {user.fullName?.charAt(0) || 'K'}
                </div>
                
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{user.fullName || 'Khách hàng'}</p>
                      <div className="flex items-center mt-1">
                        <Rate disabled defaultValue={review.rating} className="text-sm" />
                        <span className="text-xs text-gray-500 ml-2">
                          {dayjs(review.createdAt).format('DD/MM/YYYY')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                  
                  {review.images && review.images.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Image.PreviewGroup>
                        {review.images.map((image, index) => (
                          <Image
                            key={index}
                            src={image}
                            alt={`review-image-${index}`}
                            width={80}
                            height={80}
                            className="object-cover rounded"
                          />
                        ))}
                      </Image.PreviewGroup>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {total > limit && (
        <div className="mt-6 flex justify-center">
          <Pagination
            current={page}
            pageSize={limit}
            total={total}
            onChange={handlePageChange}
            showSizeChanger
            pageSizeOptions={['5', '10', '20']}
          />
        </div>
      )}
    </div>
  );
};

export default ReviewList;