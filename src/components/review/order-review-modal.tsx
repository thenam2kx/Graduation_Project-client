import { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Star, X } from 'lucide-react'
import { checkProductReviewableFromOrder, createReview } from '@/services/review-service/review.apis'
import { toast } from 'react-toastify'

interface OrderReviewModalProps {
  orderId: string
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface ReviewableProduct {
  productId: string
  productName: string
  productImage: string
  canReview: boolean
  reviewCount: number
}

const OrderReviewModal = ({ orderId, isOpen, onClose, onSuccess }: OrderReviewModalProps) => {
  const { user } = useSelector((state: RootState) => state.auth)
  const queryClient = useQueryClient()
  
  const [reviews, setReviews] = useState<{[key: string]: {rating: number, comment: string}}>({})
  const [submitting, setSubmitting] = useState(false)

  const { data: reviewableData, isLoading } = useQuery({
    queryKey: ['reviewable-products-order', orderId],
    queryFn: () => checkProductReviewableFromOrder(orderId),
    enabled: !!orderId && isOpen,
    onSuccess: (data) => {
      console.log('Modal - reviewableData:', data)
    },
    onError: (error) => {
      console.error('Modal - error:', error)
    }
  })

  const createReviewMutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      toast.success('Đánh giá đã được gửi thành công!')
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['reviewable-products-order'] })
      if (onSuccess) onSuccess()
      onClose()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá')
    }
  })

  // Thử parse từ nhiều cấu trúc khác nhau
  const reviewableProducts: ReviewableProduct[] = 
    reviewableData?.data?.reviewableProducts || 
    reviewableData?.reviewableProducts ||
    (Array.isArray(reviewableData?.data) ? reviewableData.data : []) ||
    []
  
  console.log('Modal - Full reviewableData:', reviewableData)
  console.log('Modal - reviewableProducts:', reviewableProducts)
  console.log('Modal - reviewableData.data:', reviewableData?.data)
  console.log('Modal - reviewableData.data.reviewableProducts:', reviewableData?.data?.reviewableProducts)

  const handleRatingChange = (productId: string, rating: number) => {
    setReviews(prev => ({
      ...prev,
      [productId]: { ...prev[productId], rating }
    }))
  }

  const handleCommentChange = (productId: string, comment: string) => {
    setReviews(prev => ({
      ...prev,
      [productId]: { ...prev[productId], comment }
    }))
  }

  const handleSubmitAll = async () => {
    const reviewableItems = reviewableProducts.filter(p => p.canReview)
    const reviewsToSubmit = reviewableItems.filter(p => reviews[p.productId]?.rating && reviews[p.productId]?.comment?.trim())
    
    if (reviewsToSubmit.length === 0) {
      toast.error('Vui lòng đánh giá ít nhất một sản phẩm')
      return
    }

    setSubmitting(true)
    
    try {
      for (const product of reviewsToSubmit) {
        const review = reviews[product.productId]
        await createReviewMutation.mutateAsync({
          userId: user!._id,
          productId: product.productId,
          orderId,
          rating: review.rating,
          comment: review.comment.trim()
        })
      }
    } catch (error) {
      // Error handled by mutation
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setReviews({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden border">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Đánh giá đơn hàng</h2>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-8 overflow-y-auto max-h-[calc(95vh-140px)]">
          {isLoading ? (
            <div className="text-center py-8">Đang tải...</div>
          ) : reviewableProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-2">Không có sản phẩm nào để đánh giá</p>
              {reviewableData?.data?.debug && (
                <div className="text-xs text-left bg-gray-100 p-3 rounded mt-4">
                  <p><strong>Debug info:</strong></p>
                  <p>Order ID: {reviewableData.data.debug.orderId}</p>
                  <p>Order Status: {reviewableData.data.debug.orderStatus}</p>
                  <p>Order Items: {reviewableData.data.debug.orderItemsCount}</p>
                  <p>Message: {reviewableData.data.debug.message}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {reviewableProducts.map((product) => (
                <div key={product.productId} className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={product.productImage || '/placeholder.svg'}
                      alt={product.productName}
                      className="w-16 h-16 object-cover rounded-lg"
                      crossOrigin="anonymous"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-lg mb-2">{product.productName}</h3>
                      
                      {product.canReview ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Đánh giá sao:</label>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Button
                                  key={star}
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRatingChange(product.productId, star)}
                                  className="p-1 h-auto"
                                >
                                  <Star className={`h-6 w-6 ${
                                    (reviews[product.productId]?.rating || 0) >= star
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-muted-foreground'
                                  }`} />
                                </Button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Bình luận:</label>
                            <Textarea
                              value={reviews[product.productId]?.comment || ''}
                              onChange={(e) => handleCommentChange(product.productId, e.target.value)}
                              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                              rows={3}
                              className="resize-none"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="text-muted-foreground">
                          <p>Bạn đã đánh giá sản phẩm này rồi.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <Button variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          <Button 
            onClick={handleSubmitAll}
            disabled={submitting || reviewableProducts.filter(p => p.canReview).length === 0}
          >
            {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default OrderReviewModal