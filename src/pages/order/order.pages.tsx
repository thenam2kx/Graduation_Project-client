
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router'
import instance from '@/config/axios.customize'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { IOrder, OrderItem } from '@/types/order'
import { getPaymentMethodLabel, ORDER_STATUS, CANCEL_REASONS, REFUND_REASONS } from './order.constant.pages'
import { confirmReceivedOrderAPI } from '@/services/order-service/order.apis'
import { toast } from 'react-toastify'
import Modal from './order.modal.pages'
import ReasonSelector from './order.reason.selector.pages'


type TabType = (typeof ORDER_STATUS)[number]['key']

const OrdersPages = () => {
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 })
  const [searchParams, setSearchParams] = useSearchParams()
  const defaultTab = (searchParams.get('tab') as TabType) || 'pending'
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab)
  const [showReasonModal, setShowReasonModal] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<'cancelled' | 'refunded' | null>(null)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [selectedReason, setSelectedReason] = useState('')
  const [customReason, setCustomReason] = useState('')

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['orders', pagination.page, pagination.pageSize, activeTab],
    queryFn: async () => {
      const res = await instance.get('/api/v1/orders/by-user/683f11fbc1c5cb3b5e991c17', {
        params: {
          page: pagination.page,
          limit: pagination.pageSize,
          status: activeTab
        }
      })
      return res.data
    }
  })

  const orders: IOrder[] = data?.results || []

  const updateStatus = useMutation({
    mutationFn: async ({ orderId, status, reason }: { orderId: string; status: string; reason?: string }) => {
      const res = await instance.patch(`/api/v1/orders/${orderId}/status`, { status, reason })
      return res.data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      toast.success(variables.status === 'cancelled' ? 'Hủy đơn hàng thành công' : 'Hoàn tiền thành công')
      setActiveTab(variables.status as TabType)
      setShowReasonModal(false)
      resetModal()
    }
  })

  const confirmReceived = useMutation({
    mutationFn: confirmReceivedOrderAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      toast.success('Xác nhận đã nhận hàng thành công!')
      setActiveTab('completed')
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi xác nhận đã nhận hàng')
    }
  })

  const resetModal = () => {
    setSelectedOrderId(null)
    setSelectedStatus(null)
    setSelectedReason('')
    setCustomReason('')
  }

  const openReasonModal = (orderId: string, status: 'cancelled' | 'refunded') => {
    setSelectedOrderId(orderId)
    setSelectedStatus(status)
    setSelectedReason('')
    setCustomReason('')
    setShowReasonModal(true)
  }

  const handleSubmitReason = () => {
    const reason = selectedReason === 'Khác' ? customReason.trim() : selectedReason

    if (!reason) {
      toast.error('Vui lòng chọn lý do')
      return
    }

    if (selectedReason === 'Khác' && customReason.trim().length < 10) {
      toast.error('Lý do cụ thể phải có ít nhất 10 ký tự')
      return
    }

    if (selectedOrderId && selectedStatus) {
      updateStatus.mutate({ orderId: selectedOrderId, status: selectedStatus, reason })
    }
  }

  const tabs: { id: TabType; label: string }[] = ORDER_STATUS.map((s) => ({
    id: s.key,
    label: s.label
  }))

  const formatOrders = (orders: IOrder[]): OrderItem[] => {
    return orders.map((order) => {
      const items = order.items || []
      const firstItem = items[0]
      const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 0), 0)
      const totalAmount = order.totalPrice - (order.shippingPrice || 0)

      return {
        id: order._id,
        orderNumber: order._id,
        orderDate: new Date(order.createdAt).toLocaleString(),
        estimatedDelivery: order.estimatedDeliveryDate || 'Chưa xác định',
        status: order.status,
        statusLabel: order.statusLabel,
        paymentMethod: order.paymentMethod,
        statusUpdatedAt: new Date(order.updatedAt || order.createdAt).getTime(),
        product: {
          name: `Đơn hàng (${items.length} sản phẩm)`,
          quantity: totalQuantity,
          total: `${totalAmount.toLocaleString()} đ`,
          image: firstItem?.productId?.image?.[0] || '/placeholder.svg'
        }
      }
    })
  }

  const filteredOrders = formatOrders(orders).sort((a, b) => b.statusUpdatedAt - a.statusUpdatedAt)

  const currentReasons = selectedStatus === 'cancelled' ? CANCEL_REASONS : REFUND_REASONS
  const modalTitle = selectedStatus === 'cancelled' ? 'Hủy đơn hàng' : 'Yêu cầu hoàn tiền'

  return (

    <div className='max-w-4xl mx-auto p-6 bg-white'>
      <div className='flex border-b border-gray-200'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id)
              setPagination({ page: 1, pageSize: pagination.pageSize })
              setSearchParams({ tab: tab.id })
            }}
            className={cn(
              'flex-1 py-4 px-1 text-center font-medium text-sm transition-colors',
              'border-b-2 border-transparent',
              activeTab === tab.id ? 'text-purple-700 border-purple-700' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className='mt-8'>
        {isLoading ? (
          <div className='text-center py-12 text-gray-500'>Đang tải đơn hàng...</div>
        ) : (
          <>
            {filteredOrders.length > 0 ? (
              <div className='space-y-6'>
                {filteredOrders.map((order) => (
                  <Card key={order.id} className='border border-gray-200 shadow-sm'>
                    <CardContent className='p-6'>
                      <div className='flex justify-between items-start mb-4'>
                        <div className='space-y-1'>
                          <h3 className='font-semibold text-gray-900'>Mã đơn: {order.orderNumber}</h3>
                          <div className='flex gap-8 text-sm text-gray-500'>
                            <span>Ngày đặt: {order.orderDate}</span>
                            <span>Trạng thái: {order.statusLabel}</span>
                          </div>
                          <div className='flex gap-8 text-sm text-gray-500'>
                            <span>Ngày giao dự kiến: {order.estimatedDelivery}</span>
                            <span>Thanh toán: {getPaymentMethodLabel(order.paymentMethod)}</span>
                          </div>
                        </div>
                      </div>

                      <div className='flex items-center justify-between mt-6'>
                        <div className='flex items-center gap-4'>
                          <div className='w-20 h-20 bg-gray-100 rounded-lg overflow-hidden'>
                            <img
                              src={order.product.image || '/placeholder.svg'}
                              alt={order.product.name}
                              className='w-full h-full object-cover'
                              crossOrigin='anonymous'
                            />
                          </div>
                          <div className='space-y-1'>
                            <h4 className='font-medium text-gray-900'>{order.product.name}</h4>
                            <p className='text-sm text-gray-500'>Tổng số lượng: {order.product.quantity} sản phẩm</p>
                            <p className='text-sm font-medium text-gray-900'>Tổng tiền: {order.product.total}</p>
                          </div>
                        </div>

                        <div className='flex gap-x-4'>
                          <Button
                            onClick={() => navigate(`detail/${order.id}?tab=${activeTab}`)}
                            className='bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg'
                          >
                            Xem chi tiết
                          </Button>
                          {['pending', 'confirmed', 'processing'].includes(order.status) && (
                            <Button
                              onClick={() => openReasonModal(order.id, 'cancelled')}
                              className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg'
                            >
                              Hủy đơn
                            </Button>
                          )}
                          {['delivered'].includes(order.status) && (
                            <>
                              <Button
                                onClick={() => confirmReceived.mutate(order.id)}
                                disabled={confirmReceived.isPending}
                                className='bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg'
                              >
                                {confirmReceived.isPending ? 'Đang xử lý...' : 'Đã nhận được hàng'}
                              </Button>
                              <Button
                                onClick={() => openReasonModal(order.id, 'refunded')}
                                className='bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg'
                              >
                                Hoàn tiền
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className='text-center py-12 text-gray-500'>Không có đơn hàng ở trạng thái này.</div>
            )}

            {data?.meta?.pages > 1 && (
              <div className='flex justify-center mt-6 gap-2'>
                {[...Array(data.meta.pages)].map((_, index) => {
                  const page = index + 1
                  return (
                    <button
                      key={page}
                      onClick={() => setPagination((prev) => ({ ...prev, page }))}
                      className={cn(
                        'px-4 py-2 border rounded',
                        pagination.page === page ? 'bg-purple-700 text-white' : 'bg-white text-black'
                      )}
                    >
                      {page}
                    </button>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>

      <Modal
        title={modalTitle}
        show={showReasonModal}
        onClose={() => {
          setShowReasonModal(false)
          resetModal()
        }}
        onConfirm={handleSubmitReason}
      >
        <ReasonSelector
          reasons={currentReasons}
          selectedReason={selectedReason}
          onReasonChange={setSelectedReason}
          customReason={customReason}
          onCustomReasonChange={setCustomReason}
          placeholder={
            selectedStatus === 'cancelled' ? 'Mô tả lý do hủy đơn hàng...' : 'Mô tả lý do yêu cầu hoàn tiền...'
          }
        />
      </Modal>
    </div>
  )
}

export default OrdersPages
