/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { ShoppingCart } from 'lucide-react'
import CartItem, { CartItemWithProduct } from './cart_items.page'
import { useNavigate } from 'react-router'

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
    const cartRes = await axios.get('http://localhost:8080/api/v1/carts', {
      params: { userId }
    })
    console.log('Cart response:', cartRes.data)
    const carts = cartRes.data.data.results
    if (!carts || carts.length === 0) throw new Error('Không có cart trả về')
    const cart = carts[0]
    const itemsRes = await axios.get('http://localhost:8080/api/v1/cartitems', {
      params: { cartId: cart._id }
    })
    console.log('Items response:', itemsRes.data)
    return {
      cart,
      items: itemsRes.data.data.results,
      products: []
    }
  } catch (err) {
    console.error('Fetch cart error:', err)
    throw err
  }
}


const CartPage: React.FC = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const userId = getUserIdFromLocalStorage()
  // console.log('User ID from localStorage:', userId)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['cartFull', userId],
    queryFn: () => fetchCart(userId!),
    enabled: !!userId
  })

  const updateQty = useMutation({
    mutationFn: ({ id, qty }: { id: string; qty: number }) =>
      axios.put(`http://localhost:8080/api/v1/cartitems/${id}`, { quantity: qty }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cartFull', userId] })
  })

  const removeItem = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      axios.delete(`http://localhost:8080/api/v1/cartitems/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cartFull', userId] })
  })

  if (isLoading) return <div>Đang tải giỏ hàng...</div>
  if (isError || !data) return <div>Không thể tải giỏ hàng. Vui lòng thử lại sau.</div>
  if (!data.items.length) return <div>Giỏ hàng trống.</div>

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

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold flex items-center mb-6">
        <ShoppingCart className="w-8 h-8 mr-3" /> Giỏ hàng
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-8 gap-8">
        <div className="xl:col-span-5 space-y-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-800">Sản phẩm trong giỏ</h2>
            <p className="text-slate-500 text-sm">Xem lại và chỉnh sửa đơn hàng</p>
          </div>

          {items.map((item) => (
            <CartItem
              key={item.cart_item._id}
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
          ))}
        </div>

        <div className="xl:col-span-3 bg-white p-6 rounded-2xl shadow">
          <div className="text-lg font-semibold">Tổng thanh toán</div>
          <div className="text-2xl font-bold text-red-600">{total.toLocaleString()}đ</div>
          <button
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg disabled:opacity-50"
            onClick={() => navigate('/checkout')}
          >
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartPage
