import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CART_KEYS } from '@/services/cart-service/cart.keys'
import { fetchCartByUserAPI, fetchInfoCartAPI, updateCartItemAPI } from '@/services/cart-service/cart.apis'
import { useAppSelector } from '@/redux/hooks'

export default function ShoppingCartPage() {
  const userId = useAppSelector((state) => state.auth.user?._id)
  const queryClient = useQueryClient()
  const navigate = useNavigate()


  const [couponCode, setCouponCode] = useState('')

  const { data: cartUser } = useQuery({
    queryKey: [CART_KEYS.FETCH_USER_CART],
    queryFn: async () => {
      const res = await fetchCartByUserAPI(userId as string)
      if (res && res.data) {
        return res.data
      } else {
        return []
      }
    }
  })

  const updateQuantityCartMutation = useMutation({
    mutationFn: async ({ cartId, cartItemId, newQuantity }: { cartId: string; cartItemId: string; newQuantity: number }) => {
      const res = await updateCartItemAPI(cartId, cartItemId, newQuantity)
      if (res && res.data) {
        return res.data
      } else {
        throw new Error('Failed to update cart item')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CART_KEYS.FETCH_LIST_CART] })
    }
  })


  const { data: listProductsCart } = useQuery({
    queryKey: [CART_KEYS.FETCH_LIST_CART],
    queryFn: async () => {
      const res = await fetchInfoCartAPI(cartUser?._id || '')
      if (res && res.data) {
        return res.data
      } else {
        return []
      }
    }
  })
  console.log('🚀 ~ ShoppingCartPage ~ listProductsCart:', listProductsCart)

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantityCartMutation.mutate({ cartId: cartUser?._id || '', cartItemId: id, newQuantity })
  }

  const removeItem = (id: string) => {
    console.log('🚀 ~ removeItem ~ id:', id)
  }


  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 text-sm text-[#807d7e]">
          <Link to="/" className="hover:text-[#333333]">
            Trang chủ
          </Link>
          <span>›</span>
          <span className="text-[#333333]">Thêm vào giỏ hàng</span>
        </div>
      </div>

      {/* Login prompt */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <p className="text-[#807d7e] text-sm">
          Please fill in the fields below and click place order to complete your purchase!
        </p>
        <p className="text-[#807d7e] text-sm">
          Already registered?{' '}
          <Link to="/login" className="text-[#8a33fd] hover:underline">
            Please login here
          </Link>
        </p>
      </div>

      {/* Cart Table */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="bg-[#3c4242] text-white">
          <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium">
            <div className="col-span-4">CHI TIẾT</div>
            <div className="col-span-2">GIÁ</div>
            <div className="col-span-2">SỐ LƯỢNG</div>
            <div className="col-span-2">TỔNG CỘNG</div>
            <div className="col-span-2">HÀNH ĐỘNG</div>
          </div>
        </div>

        {listProductsCart && listProductsCart.map((item) => (
          <div key={item._id} className="border-b border-[#f3f3f3] p-4">
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-4 flex items-center space-x-4">
                <img
                  src={ item.variantId?.image ? `http://localhost:8080${item.variantId?.image}` : `${item.productId.image[0]}`}
                  alt={item.productId.name}
                  width={80}
                  height={80}
                  className="rounded-lg bg-[#f6f6f6]"
                  crossOrigin='anonymous'
                />
                <div>
                  <h3 className="font-medium text-[#333333] cursor-pointer" onClick={() => navigate(`/productDetail/${item.productId._id}`)}>{item.productId.name}</h3>
                  <p className="text-sm text-[#807d7e]">Mã sản phẩm: {item.variantId?.sku}</p>
                  <p className="text-sm text-[#807d7e]">Dung tích: {item.variantId?.price} ml</p>
                </div>
              </div>

              <div className="col-span-2">
                <span className="font-medium text-[#333333]">{item.variantId?.price} VND</span>
              </div>

              <div className="col-span-2">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="col-span-2">
                <span className="font-medium text-[#333333]">{(item.variantId?.price * item.quantity)} VND</span>
              </div>

              <div className="col-span-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#8a33fd] hover:text-[#6639a6]"
                  onClick={() => removeItem(item._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Discount Codes */}
          <div>
            <h3 className="text-lg font-medium text-[#333333] mb-2">Mã giảm giá</h3>
            <p className="text-sm text-[#807d7e] mb-4">Nhập mã giảm giá của bạn nếu có</p>
            <div className="flex space-x-2">
              <Input
                placeholder=""
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1"
              />
              <Button className="bg-[#8a33fd] hover:bg-[#6639a6] text-white px-6">Áp dụng mã giảm giá</Button>
            </div>
            <Button variant="outline" className="mt-4">
              Tiếp tục mua sắm
            </Button>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-[#333333]">Tổng tiền</span>
              <span className="font-medium text-[#333333]">{listProductsCart?.reduce((acc, item) => acc + (item.variantId?.price * item.quantity), 0)} VND</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#333333]">Phí ship</span>
              <span className="font-medium text-[#333333]">20.00 VND</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between">
                <span className="text-lg font-medium text-[#333333]">Tổng cộng</span>
                <span className="text-lg font-medium text-[#333333]">{listProductsCart?.reduce((acc, item) => acc + (item.variantId?.price * item.quantity), 0) as number - 20} VND</span>
              </div>
            </div>
            <Button className="w-full bg-[#8a33fd] hover:bg-[#6639a6] text-white py-3">Thanh toán</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
