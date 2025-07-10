import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@radix-ui/react-label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@radix-ui/react-separator'
import { useLocation } from 'react-router'
import { formatCurrencyVND } from '@/utils/utils'
import { IApplyDiscountResponse } from '@/services/discount-service/discount.apis'
import { CheckoutDiscount } from '@/components/discount/checkout-discount'

const CheckoutShipping = () => {
  const location = useLocation()
  const { appliedDiscount: initialDiscount, subtotal: initialSubtotal, shippingFee: initialShippingFee } = location.state || {}
  const [appliedDiscount, setAppliedDiscount] = useState<IApplyDiscountResponse | null>(initialDiscount || null)
  const [shippingAddress, setShippingAddress] = useState('same')
  const [paymentMethod, setPaymentMethod] = useState('credit')
  
  const subtotal = initialSubtotal || 0
  const shippingFee = initialShippingFee || 30000
  const discountAmount = appliedDiscount?.discountAmount || 0
  const total = subtotal + shippingFee - discountAmount

  return (
    <div className='bg-gray-50 py-8'>
      <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'>
        <form className='space-y-8'>
          {/* Shipping Address Section */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg font-semibold text-gray-900'>Địa chỉ giao hàng</CardTitle>
              <p className='text-sm text-gray-600'>Chọn địa chỉ phù hợp với thẻ hoặc phương thức thanh toán của bạn.</p>
            </CardHeader>
            <CardContent>
              <RadioGroup value={shippingAddress} onValueChange={setShippingAddress} className='space-y-4'>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='same' id='same' />
                  <Label htmlFor='same' className='font-medium cursor-pointer'>
                    Giống với địa chỉ thanh toán
                  </Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='different' id='different' />
                  <Label htmlFor='different' className='font-medium cursor-pointer'>
                    Sử dụng địa chỉ giao hàng khác
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Shipping Method Section */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg font-semibold text-gray-900'>Phương thức vận chuyển</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 border-b border-gray-200 gap-2'>
                <div>
                  <p className='font-medium'>Giao hàng trước Thứ Hai, 7 tháng 6</p>
                </div>
              </div>
              <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2'>
                <div>
                  <p className='font-medium'>Phí giao hàng</p>
                  <p className='text-sm text-gray-600'>Có thể phát sinh thêm phí</p>
                </div>
                <p className='font-semibold'>$5.00</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Section */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg font-semibold text-gray-900'>Phương thức thanh toán</CardTitle>
              <p className='text-sm text-gray-600'>Tất cả giao dịch đều được bảo mật và mã hóa.</p>
            </CardHeader>
            <CardContent className='space-y-6'>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className='space-y-6'>
                {/* Momo Option */}
                <div className='space-y-4'>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='momo' id='momo' />
                    <Label htmlFor='momo' className='font-medium cursor-pointer'>
                      Thanh toán MoMo
                    </Label>
                  </div>
                  {paymentMethod === 'momo' && (
                    <div className='ml-6 space-y-4'>
                      <p className='text-sm text-gray-600'>Quét mã QR hoặc đăng nhập MoMo để thanh toán.</p>
                    </div>
                  )}
                </div>
                <Separator className='h-px bg-gray-200' />
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='vnpay' id='vnpay' />
                  <Label htmlFor='vnpay' className='font-medium cursor-pointer'>
                    Thanh toán VNPay
                  </Label>
                </div>
                <Separator className='h-px bg-gray-200' />
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='cash' id='cash' />
                  <div>
                    <Label htmlFor='cash' className='font-medium cursor-pointer'>
                      Thanh toán khi nhận hàng
                    </Label>
                    <p className='text-sm text-gray-600'>Thanh toán bằng tiền mặt khi nhận hàng.</p>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Discount Section */}
          <CheckoutDiscount
            appliedDiscount={appliedDiscount}
            subtotal={subtotal}
            onDiscountChange={setAppliedDiscount}
          />

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg font-semibold text-gray-900'>Tổng kết đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='flex justify-between'>
                <span>Tạm tính:</span>
                <span>{formatCurrencyVND(subtotal)}</span>
              </div>
              <div className='flex justify-between'>
                <span>Phí vận chuyển:</span>
                <span>{formatCurrencyVND(shippingFee)}</span>
              </div>
              {appliedDiscount && (
                <div className='flex justify-between text-green-600'>
                  <span>Giảm giá ({appliedDiscount.discount.code}):</span>
                  <span>-{formatCurrencyVND(discountAmount)}</span>
                </div>
              )}
              <Separator className='h-px bg-gray-200' />
              <div className='flex justify-between font-semibold text-lg'>
                <span>Tổng cộng:</span>
                <span>{formatCurrencyVND(total)}</span>
              </div>
            </CardContent>
          </Card>

          <Button
            type='submit'
            className='w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-semibold h-12'
          >
            Thanh toán ngay
          </Button>
        </form>
      </div>
    </div>
  )
}
export default CheckoutShipping
