import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { toast } from 'react-toastify'

const OrderReviewPage = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  
  useEffect(() => {
    toast.info('Đánh giá sản phẩm giờ được thực hiện trực tiếp từ trang quản lý đơn hàng')
    navigate(`/account/${user?._id}/order?tab=completed`)
  }, [navigate, user])

  return (
    <div className="max-w-4xl mx-auto p-6 text-center">
      <p>Đang chuyển hướng...</p>
    </div>
  )
}

export default OrderReviewPage