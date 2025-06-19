import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import CheckoutShipping from './checkout.shipping'


const CheckoutForm = () => {
  const [saveInfo, setSaveInfo] = useState(false)
  const orderItems = [
    {
      id: 1,
      name: 'Nước Hoa Hương Thơm',
      variant: '100ml',
      quantity: 1,
      price: 29.0,
      image: 'https://cdn.vuahanghieu.com/unsafe/0x500/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/product/2024/12/nuoc-hoa-nam-dior-sauvage-elixir-eau-de-parfum-100ml-67614857649b4-17122024164559.jpg'
    },
    {
      id: 2,
      name: 'Nuớc Hoa Hương Thơm',
      variant: '150ml',
      quantity: 2,
      price: 119.0,
      image: 'https://cdn.vuahanghieu.com/unsafe/0x500/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/product/2024/12/nuoc-hoa-nam-dior-sauvage-elixir-eau-de-parfum-100ml-67614857649b4-17122024164559.jpg'
    },
    {
      id: 3,
      name: 'Nước Hoa Hương Thơm',
      variant: '150ml',
      quantity: 2,
      price: 123.0,
      image: 'https://cdn.vuahanghieu.com/unsafe/0x500/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/product/2024/12/nuoc-hoa-nam-dior-sauvage-elixir-eau-de-parfum-100ml-67614857649b4-17122024164559.jpg'
    }
  ]

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <div className='bg-white p-6 rounded-lg shadow-sm'>
            <div className="relative mb-6">
              <div className="absolute left-0 top-3 h-12 border-l-4 border-purple-500" />
              <div className="pl-6">
                <h1 className='text-2xl font-bold text-purple-700 uppercase tracking-wide'>Thanh Toán</h1>
                <h2 className='text-xl font-semibold text-gray-800 mt-1'>Thông Tin Thanh Toán</h2>
              </div>
            </div>
            <form className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='firstName' className='text-sm font-medium text-gray-700'>
                    Họ
                  </Label>
                  <Input id='firstName' placeholder='Họ' className='mt-1' />
                </div>
                <div>
                  <Label htmlFor='lastName' className='text-sm font-medium text-gray-700'>
                    Tên
                  </Label>
                  <Input id='lastName' placeholder='Tên' className='mt-1' />
                </div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='country' className='text-sm font-medium text-gray-700'>
                    Quốc Gia / Khu Vực
                  </Label>
                  <Input id='country' placeholder='Quốc gia / Khu vực' className='mt-1' />
                </div>
                <div>
                  <Label htmlFor='apartment' className='text-sm font-medium text-gray-700'>
                    Căn hộ, tầng, phòng
                  </Label>
                  <Input
                    id='apartment'
                    placeholder='Căn hộ, tầng, phòng,...'
                    className='mt-1'
                  />
                </div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='streetAddress' className='text-sm font-medium text-gray-700'>
                    Địa Chỉ
                  </Label>
                  <Input
                    id='streetAddress'
                    placeholder='Số nhà và tên đường'
                    className='mt-1'
                  />
                </div>
                <div>
                  <Label htmlFor='phone' className='text-sm font-medium text-gray-700'>
                    Số Điện Thoại
                  </Label>
                  <Input id='phone' placeholder='Số điện thoại' className='mt-1' />
                </div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <Label htmlFor='ward' className='text-sm font-medium text-gray-700'>
                    Phường / Xã
                  </Label>
                  <Input id='ward' placeholder='Phường / Xã' className='mt-1' />
                </div>
                <div>
                  <Label htmlFor='district' className='text-sm font-medium text-gray-700'>
                    Quận / Huyện
                  </Label>
                  <Input id='district' placeholder='Quận / Huyện' className='mt-1' />
                </div>
                <div>
                  <Label htmlFor='city' className='text-sm font-medium text-gray-700'>
                    Thành Phố
                  </Label>
                  <Input id='city' placeholder='Thành phố' className='mt-1' />
                </div>
              </div>
              <div className='pt-2'>
                <Button
                  type='submit'
                  className='w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md font-medium'
                >
                  Tiếp tục giao hàng
                </Button>
              </div>

              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='saveInfo'
                  checked={saveInfo}
                  onCheckedChange={(checked) => {
                    setSaveInfo(checked as boolean)
                  }}
                />
                <Label htmlFor='saveInfo' className='text-sm text-gray-600'>
                  Lưu thông tin để thanh toán nhanh hơn
                </Label>
              </div>
            </form>

            <div className='mt-8'>
              <CheckoutShipping />
            </div>
          </div>
          {/* Order Summary */}
          <div className='bg-white p-6 rounded-lg shadow-sm h-fit lg:sticky lg:top-[80px]'>
            <h2 className='text-lg font-medium text-gray-900 mb-6 scroll-mt-24'> Đơn Hàng</h2>
            <div className='space-y-4'>
              {orderItems.map((item) => (
                <div key={item.id} className='flex items-center space-x-4'>
                  <div className='w-16 h-16 bg-gray-100 rounded-md overflow-hidden'>
                    <img
                      src={item.image || '/placeholder.svg'}
                      alt={item.name}
                      className='w-full h-full object-cover'
                    />
                  </div>
                  <div className='flex-1'>
                    <h3 className='text-sm font-medium text-gray-900'>
                      {item.name} x {item.quantity}
                    </h3>
                    <p className='text-sm text-gray-500'>Dung tích: {item.variant}</p>
                  </div>
                  <div className='text-sm font-medium text-gray-900'>${item.price.toFixed(2)}</div>
                </div>
              ))}
            </div>
            <Separator className='my-6' />
            <div className='space-y-3'>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>
                  Tạm tính ({orderItems.reduce((acc, item) => acc + item.quantity, 0)} sản phẩm)
                </span>
                <span className='font-medium'>$</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Tiết kiệm</span>
                <span className='font-medium text-green-600'>$</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Phí vận chuyển</span>
                <span className='font-medium text-green-600'>$</span>
              </div>
              <Separator className='my-4' />
              <div className='flex justify-between text-lg font-semibold'>
                <span>Tổng cộng</span>
                <span>$</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default CheckoutForm
