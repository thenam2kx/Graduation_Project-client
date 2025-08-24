import ReviewList from './review-list'

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Đánh giá sản phẩm</h3>
      {/* Danh sách đánh giá */}
      <ReviewList productId={productId} />
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-blue-800 text-sm">
          💡 <strong>Lưu ý:</strong> Để đánh giá sản phẩm, bạn cần mua sản phẩm và sau khi nhận hàng, 
          vào phần "Quản lý đơn hàng" để đánh giá.
        </p>
      </div>
    </div>
  )
}

export default ProductReviews