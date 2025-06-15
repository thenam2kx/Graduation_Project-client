/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ShoppingCart, ArrowLeft, ShoppingBag, CreditCard, ChevronRight } from 'lucide-react'
import CartItem, { CartItemWithProduct } from './cart_items.page'
import { useNavigate } from 'react-router'
import { fetchAllCarts, fetchAllCartItems, updateCartItem, deleteCartItem } from '@/apis/apis'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

// Interface
interface CartAPI {
  cart: { _id: string };
  items: Array<{ _id: string; cartId: string; productId: string; variantId: string; quantity: number; price: number }>;
  products: Array<{ _id: string; title: string; author: string; image: string; category: string }>;
}

// Lấy userId từ localStorage
const getUserIdFromLocalStorage = (): string | null => {
  try {
    const root = localStorage.getItem('persist:root')
    if (!root) return null

    const parsedRoot = JSON.parse(root)
    const authStr = parsedRoot.auth
    if (!authStr) return null

    const auth = JSON.parse(authStr)
    return auth.user?._id || null
  } catch (err) {
    console.error('Lỗi khi đọc userId từ localStorage:', err)
    return null
  }
}

// Gọi API để lấy giỏ hàng và cart items
const fetchCart = async (userId: string): Promise<CartAPI> => {
  try {
    const cartRes = await fetchAllCarts({ userId })
    const carts = cartRes.data.results
    if (!carts || carts.length === 0) throw new Error('Không có giỏ hàng')
    
    const cart = carts[0]
    const itemsRes = await fetchAllCartItems({ cartId: cart._id })
    
    return {
      cart,
      items: itemsRes.data.results,
      products: []
    }
  } catch (err) {
    console.error('Fetch cart error:', err)
    throw err
  }
}

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const CartPage: React.FC = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const userId = getUserIdFromLocalStorage()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['cartFull', userId],
    queryFn: () => fetchCart(userId!),
    enabled: !!userId
  })

  const updateQty = useMutation({
    mutationFn: ({ id, qty }: { id: string; qty: number }) =>
      updateCartItem(id, { quantity: qty }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cartFull', userId] })
  })

  const removeItem = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      deleteCartItem(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cartFull', userId] })
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Đang tải giỏ hàng...</p>
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-lg">
          <div className="text-red-500 mb-4 flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Không thể tải giỏ hàng</h2>
          <p className="text-gray-600 mb-6">Đã xảy ra lỗi khi tải giỏ hàng của bạn. Vui lòng thử lại sau.</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center mx-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại trang chủ
          </button>
        </div>
      </div>
    )
  }

  if (!data.items.length) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 py-12 px-4"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="max-w-3xl mx-auto text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-blue-500 mb-6 flex justify-center">
            <ShoppingCart className="h-24 w-24" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Giỏ hàng của bạn đang trống</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm và tận hưởng trải nghiệm mua sắm tuyệt vời.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-white border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại trang chủ
            </button>
            <button 
              onClick={() => navigate('/products')}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <ShoppingBag className="w-5 h-5 mr-2" /> Mua sắm ngay
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  const items: CartItemWithProduct[] = data.items.map((ci) => ({ 
    cart_item: ci,
    product:
    data.products.find((p) => p._id === ci.productId) || {
      _id: '',
      title: 'Sản phẩm không tồn tại',
      author: '',
      image: '',
      category: ''
    }
  }))

  const total = items.reduce((sum, i) => sum + i.cart_item.price * i.cart_item.quantity, 0)
  const totalItems = items.reduce((sum, i) => sum + i.cart_item.quantity, 0)

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 py-8 px-4"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <Breadcrumb className='hidden sm:block'>
            <BreadcrumbList className='flex items-center gap-[15px]'>
              <BreadcrumbItem>
                <BreadcrumbLink className='font-medium cursor-pointer text-[#807d7e] text-sm md:text-lg'>
                  <a href='/'>Trang chủ</a>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className='w-[5px] h-[10.14px] text-[#807d7e]' />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink className='font-medium cursor-pointer text-[#807d7e] text-sm md:text-lg'>
                  <a href='/cart'>Giỏ hàng</a>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate('/')}
            className="mr-4 p-2 rounded-full bg-white shadow hover:bg-gray-50"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-3xl font-bold flex items-center">
            <ShoppingCart className="w-8 h-8 mr-3 text-blue-600" /> 
            Giỏ hàng <span className="ml-2 text-lg font-normal text-gray-500">({totalItems} sản phẩm)</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            className="lg:col-span-2 space-y-4"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">Sản phẩm trong giỏ</h2>
                <p className="text-gray-500 text-sm">Xem lại và chỉnh sửa đơn hàng của bạn</p>
              </div>
              
              <div className="divide-y divide-gray-100">
                {items.map((item, index) => (
                  <motion.div key={item.cart_item._id} variants={itemAnimation}>
                    <CartItem
                      item={item}
                      onIncrease={(id) => {
                        const cur = items.find((i) => i.cart_item._id === id)
                        if (cur) updateQty.mutate({ id, qty: cur.cart_item.quantity + 1 })
                      }}
                      onDecrease={(id) => {
                        const cur = items.find((i) => i.cart_item._id === id)
                        if (cur && cur.cart_item.quantity > 1)
                          updateQty.mutate({ id, qty: cur.cart_item.quantity - 1 })
                      }}
                      onRemove={(id) => removeItem.mutate({ id })}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="lg:col-span-1"
            variants={itemAnimation}
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-6 pb-4 border-b border-gray-100">Tổng thanh toán</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính ({totalItems} sản phẩm)</span>
                  <span>{total.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="text-green-600">Miễn phí</span>
                </div>
              </div>
              
              <div className="flex justify-between font-bold text-lg pt-4 border-t border-gray-100">
                <span>Tổng cộng</span>
                <span className="text-red-600">{total.toLocaleString()}đ</span>
              </div>
              
              <button
                className="w-full mt-6 bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center font-medium"
                onClick={() => navigate('/checkout')}
              >
                <CreditCard className="w-5 h-5 mr-2" /> Thanh toán ngay
              </button>
              
              <button
                className="w-full mt-3 border border-blue-600 text-blue-600 py-3 rounded-xl hover:bg-blue-50 transition-colors"
                onClick={() => navigate('/products')}
              >
                Tiếp tục mua sắm
              </button>
              
              <div className="mt-6 pt-6 border-t border-gray-100 text-sm text-gray-500">
                <p className="flex items-center mb-2">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Miễn phí vận chuyển cho đơn hàng trên 500.000đ
                </p>
                <p className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Đảm bảo hoàn tiền trong 30 ngày
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default CartPage
