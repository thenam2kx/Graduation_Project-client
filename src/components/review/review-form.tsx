import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { checkUserReviewCount, createReview } from '@/services/review-service/review.apis'
import { REVIEW_QUERY_KEYS } from '@/services/review-service/review.keys'
import { Rate, Input, Button, Upload, message, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { UploadFile, UploadProps } from 'antd/es/upload/interface'
import { useAppSelector } from '@/redux/hooks'

const { TextArea } = Input

interface ReviewFormProps {
  productId: string;
  orderId?: string;
  onSuccess?: () => void;
}

const ReviewForm = ({ productId, orderId, onSuccess }: ReviewFormProps) => {
  const [rating, setRating] = useState<number>(5)
  const [comment, setComment] = useState<string>('')
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [previewOpen, setPreviewOpen] = useState<boolean>(false)
  const [previewImage, setPreviewImage] = useState<string>('')
  const [previewTitle, setPreviewTitle] = useState<string>('')
  const [submitting, setSubmitting] = useState<boolean>(false)

  const queryClient = useQueryClient()
  const user = useAppSelector((state) => state.auth.user)
  const userId = user?._id

  // Kiểm tra số lần đánh giá của người dùng
  const { data: reviewCountData, isLoading: checkingReviewCount } = useQuery({
    queryKey: [REVIEW_QUERY_KEYS.CHECK_USER_REVIEW_COUNT, userId, productId],
    queryFn: () => checkUserReviewCount(userId as string, productId),
    enabled: !!userId && !!productId
  })

  const canReview = reviewCountData?.data?.canReview
  const reviewCount = reviewCountData?.data?.count || 0

  // Mutation để tạo đánh giá
  const createReviewMutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      message.success('Đánh giá của bạn đã được gửi và hiển thị thành công!')
      setRating(5)
      setComment('')
      setFileList([])
      queryClient.invalidateQueries({ queryKey: [REVIEW_QUERY_KEYS.CHECK_USER_REVIEW_COUNT] })
      queryClient.invalidateQueries({ queryKey: [REVIEW_QUERY_KEYS.FETCH_BY_PRODUCT] })
      if (onSuccess) onSuccess()
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá')
    },
    onSettled: () => {
      setSubmitting(false)
    }
  })

  // Xử lý khi submit form
  const handleSubmit = async () => {
    if (!userId) {
      message.error('Vui lòng đăng nhập để đánh giá sản phẩm')
      return
    }

    if (!comment.trim()) {
      message.error('Vui lòng nhập nội dung đánh giá')
      return
    }

    setSubmitting(true)

    // Xử lý upload ảnh nếu có
    const images = fileList
      .filter((file) => file.status === 'done' && file.response)
      .map((file) => file.response.url)

    createReviewMutation.mutate({
      userId,
      productId,
      orderId,
      rating,
      comment,
      images
    })
  }

  // Xử lý preview ảnh
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj!)
    }

    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1))
  }

  const handleCancel = () => setPreviewOpen(false)

  // Xử lý upload ảnh
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList)
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Thêm ảnh</div>
    </div>
  )

  // Chuyển file thành base64 để preview
  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })

  if (checkingReviewCount) {
    return <div>Đang kiểm tra...</div>
  }

  if (!canReview) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        {reviewCount === 0 ? (
          <p>Bạn cần mua sản phẩm này trước khi đánh giá.</p>
        ) : (
          <p>Bạn đã đạt giới hạn đánh giá cho sản phẩm này (tối đa 2 lần).</p>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg">
      {reviewCount === 1 && (
        <div className="text-sm text-gray-500 mb-4">
          Bạn còn 1 lần đánh giá cho sản phẩm này
        </div>
      )}
      <div className="mb-4">
        <p className="mb-2">Đánh giá của bạn:</p>
        <Rate value={rating} onChange={setRating} />
      </div>
      <div className="mb-4">
        <p className="mb-2">Nhận xét:</p>
        <TextArea
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
        />
      </div>
      <div className="mb-4">
        <p className="mb-2">Hình ảnh (tùy chọn):</p>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          action="/api/v1/files/upload"
          name="file"
          maxCount={5}
        >
          {fileList.length >= 5 ? null : uploadButton}
        </Upload>
        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
          <img alt="preview" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
      <Button
        type="primary"
        onClick={handleSubmit}
        loading={submitting}
        disabled={!comment.trim() || submitting}
      >
        Gửi đánh giá
      </Button>
      <p className="text-xs text-gray-500 mt-2">
        Đánh giá của bạn sẽ được hiển thị ngay sau khi gửi.
      </p>
    </div>
  )
}

export default ReviewForm