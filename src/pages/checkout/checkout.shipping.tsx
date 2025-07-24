import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLocation } from 'react-router'
import { formatCurrencyVND } from '@/utils/utils'
import { IApplyDiscountResponse } from '@/services/discount-service/discount.apis'
import { CheckoutDiscount } from '@/components/discount/checkout-discount'
import { GHNAddressSelector, GHNAddressData } from '@/components/shipping/GHNAddressSelector'
import { useGHNShipping } from '@/hooks/useGHNShipping'
import { Loader2 } from 'lucide-react'
import { SHOP_PROVINCE } from '@/services/shipping-service/shipping-rates'

const CheckoutShipping = () => {
  const location = useLocation()
  const { appliedDiscount: initialDiscount, subtotal: initialSubtotal, cartItems: initialCartItems = [] } = location.state || {}
  const [appliedDiscount, setAppliedDiscount] = useState<IApplyDiscountResponse | null>(initialDiscount || null)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [addressType, setAddressType] = useState<'same' | 'different'>('same')
  const [addressData, setAddressData] = useState<GHNAddressData | null>(null)
  
  // Sử dụng hook useGHNShipping để tính phí vận chuyển
  const {
    shippingMethod,
    setShippingMethod,
    shippingFee,
    loading: loadingShipping,
    estimatedDeliveryTime
  } = useGHNShipping({
    addressData,
    cartItems: initialCartItems
  })
  
  const subtotal = initialSubtotal || 0
  const discountAmount = appliedDiscount?.discountAmount || 0
  const total = subtotal + shippingFee - discountAmount

  // Kiểm tra địa chỉ có hợp lệ không
  const isAddressValid = () => {
    if (addressType === 'same') return true;
    
    return !!(
      addressData?.fullName &&
      addressData?.phone &&
      addressData?.provinceId &&
      addressData?.districtId &&
      addressData?.wardCode &&
      addressData?.address
    );
  };

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
              <RadioGroup 
                value={addressType} 
                onValueChange={(value) => setAddressType(value as 'same' | 'different')} 
                className='space-y-4'
              >
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
              
              {addressType === 'different' && (
                <div className='mt-4 border p-4 rounded-md bg-gray-50'>
                  <h3 className='font-medium mb-3'>Thông tin địa chỉ giao hàng</h3>
                  <GHNAddressSelector onChange={setAddressData} />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shipping Method Section - Chỉ hiển thị khi đã chọn địa chỉ */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg font-semibold text-gray-900'>Phương thức vận chuyển</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {!isAddressValid() ? (
                <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md border border-yellow-200">
                  <p className="font-medium">Vui lòng chọn địa chỉ giao hàng trước</p>
                  <p className="text-sm mt-1">Các phương thức vận chuyển và phí ship sẽ được hiển thị sau khi bạn chọn địa chỉ.</p>
                </div>
              ) : (
                <div>
                  <Label htmlFor="shippingMethod">Chọn phương thức vận chuyển</Label>
                  <Select value={shippingMethod} onValueChange={setShippingMethod}>
                    <SelectTrigger id="shippingMethod" className="mt-1 w-full">
                      <SelectValue placeholder="Chọn phương thức vận chuyển" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">
                        Giao hàng tiêu chuẩn ({estimatedDeliveryTime}) - 
                        {loadingShipping ? ' Đang tính...' : ` ${formatCurrencyVND(shippingMethod === 'standard' ? shippingFee : Math.round(shippingFee / 1.5))}`}
                      </SelectItem>
                      <SelectItem value="express-ghn">
                        Giao hàng nhanh - GHN ({estimatedDeliveryTime}) - 
                        {loadingShipping ? ' Đang tính...' : ` ${formatCurrencyVND(shippingMethod === 'express-ghn' ? shippingFee : Math.round(shippingFee * 1.5 / 2))}`}
                      </SelectItem>
                      <SelectItem value="express">
                        Giao hàng hỏa tốc ({estimatedDeliveryTime}) - 
                        {loadingShipping ? ' Đang tính...' : ` ${formatCurrencyVND(shippingMethod === 'express' ? shippingFee : Math.round(shippingFee * 2 / 1.5))}`}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {loadingShipping && (
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Đang tính phí vận chuyển...
                    </div>
                  )}
                  
                  {addressData?.provinceName && (
                    <div className="mt-2 text-sm text-gray-600">
                      Phí vận chuyển được tính dựa trên khoảng cách từ {SHOP_PROVINCE} đến {addressData.provinceName}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Method Section */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg font-semibold text-gray-900'>Phương thức thanh toán</CardTitle>
              <p className='text-sm text-gray-600'>Tất cả giao dịch đều được bảo mật và mã hóa.</p>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div>
                <Label htmlFor="paymentMethod">Chọn phương thức thanh toán</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger id="paymentMethod" className="mt-1 w-full">
                    <SelectValue placeholder="Chọn phương thức thanh toán" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="momo">Thanh toán MoMo</SelectItem>
                    <SelectItem value="vnpay">Thanh toán VNPay</SelectItem>
                    <SelectItem value="cash">Thanh toán khi nhận hàng</SelectItem>
                  </SelectContent>
                </Select>
                
                {paymentMethod === 'momo' && (
                  <div className='mt-3 p-3 bg-gray-50 rounded-md'>
                    <p className='text-sm text-gray-600'>Quét mã QR hoặc đăng nhập MoMo để thanh toán.</p>
                  </div>
                )}
                
                {paymentMethod === 'vnpay' && (
                  <div className='mt-3 p-3 bg-gray-50 rounded-md'>
                    <p className='text-sm text-gray-600'>Bạn sẽ được chuyển đến cổng thanh toán VNPay.</p>
                  </div>
                )}
                
                {paymentMethod === 'cash' && (
                  <div className='mt-3 p-3 bg-gray-50 rounded-md'>
                    <p className='text-sm text-gray-600'>Thanh toán bằng tiền mặt khi nhận hàng.</p>
                  </div>
                )}
              </div>
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
                <span>
                  {!isAddressValid() ? (
                    <span className="text-yellow-600 italic">Chưa xác định</span>
                  ) : loadingShipping ? (
                    <span className="flex items-center">
                      <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                      Đang tính...
                    </span>
                  ) : (
                    formatCurrencyVND(shippingFee)
                  )}
                </span>
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
            disabled={!isAddressValid() || loadingShipping}
          >
            {!isAddressValid() ? 'Vui lòng chọn địa chỉ giao hàng' : 'Thanh toán ngay'}
          </Button>
        </form>
      </div>
    </div>
  )
}
export default CheckoutShipping