import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useMutation, useQuery } from '@tanstack/react-query'
import { CART_KEYS } from '@/services/cart-service/cart.keys'
import { fetchInfoCartAPI } from '@/services/cart-service/cart.apis'
import { useAppSelector } from '@/redux/hooks'
import { formatCurrencyVND } from '@/utils/utils'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { fetchAllAddressByUserAPI } from '@/services/user-service/user.apis'
import { toast } from 'react-toastify'
import { createOrderAPI } from '@/services/order-service/order.apis'
import { createVNPayPaymentAPI } from '@/services/vnpay-service/vnpay.apis'
import PaymentLoading from '@/components/payment/payment-loading'


const formSchema = z.object({
  province: z.string().min(2, {
    message: 'Thông tin không được để trống.'
  }),
  district: z.string().min(2, {
    message: 'Thông tin không được để trống.'
  }),
  ward: z.string().min(2, {
    message: 'Thông tin không được để trống.'
  }),
  address: z.string().min(2, {
    message: 'Thông tin không được để trống.'
  })
})

const CheckoutForm = () => {
  const [shippingAddress, setShippingAddress] = useState('same')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null)
  const [addressFormData, setAddressFormData] = useState({
    province: '',
    district: '',
    ward: '',
    address: ''
  })
  const cartId = useAppSelector((state) => state.cart.IdCartUser)
  const userId = useAppSelector((state) => state.auth.user?._id)

  const { data: listProductsCart } = useQuery({
    queryKey: [CART_KEYS.FETCH_LIST_CART],
    queryFn: async () => {
      const res = await fetchInfoCartAPI(cartId as string)
      if (res && res.data) {
        return res.data
      } else {
        return []
      }
    }
  })

  const { data: listAddresses } = useQuery({
    queryKey: ['fetchAllAddressByUser'],
    queryFn: async () => {
      if (!userId) return []
      const res = await fetchAllAddressByUserAPI(userId)
      if (res && res.data) {
        res.data.forEach((address) => {
          if (address.isPrimary) {
            setSelectedAddress(address)
          }
        })
        return res.data
      } else {
        return []
      }
    },
    enabled: !!cartId
  })

  const createOrderMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (data: any) => {
      const res = await createOrderAPI(data)
      return res.data || res
    },
    onSuccess: (response) => {
      console.log('🚀 ~ CheckoutForm ~ response:', response)
      const orderData = response.data || response
      if (paymentMethod === 'vnpay') {
        handleVNPayPayment(orderData._id, orderData.totalPrice)
      } else {
        toast.success('Đặt hàng thành công!')
      }
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error('Error creating order:', error)
      toast.error('Đặt hàng thất bại!')
    }
  })

  const vnpayPaymentMutation = useMutation({
    mutationFn: createVNPayPaymentAPI,
    onSuccess: (response) => {
      console.log('VNPay response:', response)
      const paymentUrl = response?.paymentUrl || response?.data?.paymentUrl
      if (paymentUrl) {
        window.location.href = paymentUrl
      } else {
        toast.error('Không nhận được URL thanh toán từ VNPay!')
      }
    },
    onError: (error) => {
      console.error('VNPay payment error:', error)
      toast.error('Không thể tạo liên kết thanh toán VNPay!')
    }
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      province: '',
      district: '',
      ward: '',
      address: ''
    }
  })


  const handleSubmitAddress = (values: z.infer<typeof formSchema>) => {
    setAddressFormData({
      province: values.province,
      district: values.district,
      ward: values.ward,
      address: values.address
    })
    toast.success('Địa chỉ đã được lưu thành công!')
  }

  const handleVNPayPayment = (orderId: string, amount: number) => {
    vnpayPaymentMutation.mutate({
      amount: amount,
      orderId: orderId,
      orderInfo: `Thanh toán đơn hàng ${orderId}`
    })
  }

  const handleCreateOrder = () => {
    const dataSubmit = {
      userId: userId,
      addressId: selectedAddress?._id || null,
      addressFree: shippingAddress === 'different' ? addressFormData : null,
      totalPrice: listProductsCart?.reduce((acc, item) => acc + (item.variantId?.price * item.quantity), 0) as number + 30000 || 0,
      shippingPrice: 30000,
      status: 'pending',
      shippingMethod: 'standard',
      paymentStatus: paymentMethod === 'cash' ? 'unpaid' : 'pending',
      paymentMethod: paymentMethod,
      items: listProductsCart?.map(item => ({
        productId: item.productId?._id,
        variantId: item.variantId?._id,
        quantity: item.quantity,
        price: item.variantId?.price
      }))
    }

    createOrderMutation.mutate(dataSubmit)
  }


  return (
    <>
      {(createOrderMutation.isPending || vnpayPaymentMutation.isPending) && (
        <PaymentLoading message={vnpayPaymentMutation.isPending ? 'Đang chuyển hướng đến VNPay...' : 'Đang tạo đơn hàng...'} />
      )}
      <div className='min-h-screen bg-gray-50 py-8'>
        <div className='max-w-8xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>

            {/* Order Summary */}
            <div className='bg-white p-6 rounded-lg shadow-sm h-fit lg:sticky lg:top-[80px]'>
              <h2 className='text-lg font-medium text-gray-900 mb-6 scroll-mt-24'> Đơn Hàng</h2>
              <div className='space-y-4'>
                {listProductsCart && listProductsCart?.map((item) => (
                  <div key={item._id} className='flex items-center space-x-4'>
                    <div className='w-16 h-16 bg-gray-100 rounded-md overflow-hidden'>
                      <img
                        src={item.productId?.image[0]}
                        alt={item.productId?.name}
                        className='w-full h-full object-cover'
                        loading='lazy'
                        crossOrigin='anonymous'
                      />
                    </div>
                    <div className='flex-1'>
                      <h3 className='text-sm font-medium text-gray-900'>
                        {item.productId?.name} x {item.quantity}
                      </h3>
                      <p className='text-sm text-gray-500'>Dung tích: {item.variantId?.sku}</p>
                    </div>
                    <div className='text-sm font-medium text-gray-900'>{formatCurrencyVND(item.variantId?.price * item.quantity)}</div>
                  </div>
                ))}
              </div>
              <Separator className='my-6' />
              <div className='space-y-3'>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>
                    Tạm tính ({listProductsCart?.reduce((acc, item) => acc + item.quantity, 0)} sản phẩm)
                  </span>
                  <span className='font-medium'>{formatCurrencyVND(listProductsCart?.reduce((acc, item) => acc + (item.variantId?.price * item.quantity), 0) || 0)}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Tiết kiệm</span>
                  <span className='font-medium text-green-600'>{formatCurrencyVND(50000)}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Phí vận chuyển</span>
                  <span className='font-medium text-green-600'>{formatCurrencyVND(30000)}</span>
                </div>
                <Separator className='my-4' />
                <div className='flex justify-between text-lg font-semibold'>
                  <span>Tổng cộng</span>
                  <span>{formatCurrencyVND(listProductsCart?.reduce((acc, item) => acc + (item.variantId?.price * item.quantity), 0) as number + 30000)}</span>
                </div>
              </div>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm'>
              <div className="relative mb-6">
                <div className="absolute left-0 top-3 h-12 border-l-4 border-purple-500" />
                <div className="pl-6">
                  <h1 className='text-2xl font-bold text-purple-700 uppercase tracking-wide'>Thanh Toán</h1>
                  <h2 className='text-xl font-semibold text-gray-800 mt-1'>Thông Tin Thanh Toán</h2>
                </div>
              </div>

              <div className='mt-8 space-y-4'>
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
                          Sử dụng địa chỉ của tôi
                        </Label>
                      </div>
                      {
                        shippingAddress === 'same' && (
                          <Select
                            defaultValue={listAddresses?.find(addr => addr.isPrimary)?._id}
                            onValueChange={(value) => {
                              const address = listAddresses?.find(addr => addr._id === value) || null
                              setSelectedAddress(address)
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Chọn địa chỉ" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Địa chỉ</SelectLabel>
                                {
                                  listAddresses && listAddresses?.map((address) => (
                                    <SelectItem key={address._id} value={address._id}>
                                      {`${address.province}, ${address.district}, ${address.ward}, ${address.address}`}
                                    </SelectItem>
                                  ))
                                }
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )
                      }

                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='different' id='different' />
                        <Label htmlFor='different' className='font-medium cursor-pointer'>
                          Sử dụng địa chỉ khác
                        </Label>
                      </div>
                      {
                        shippingAddress === 'different' && (
                          <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmitAddress)} className="space-y-8">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                  control={form.control}
                                  name="province"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Thành phố</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Thành phố" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="district"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Quận / Huyện</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Quận / Huyện" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="ward"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Phường / Xã</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Phường / Xã" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="address"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Địa chỉ nhà</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Địa chỉ nhà" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <Button type="submit" className='cursor-pointer'>Lưu</Button>
                            </form>
                          </Form>
                        )
                      }
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
                        <p className='font-medium'>Thời gian giao hàng từ 3 - 5 ngày</p>
                      </div>
                    </div>
                    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2'>
                      <div>
                        <p className='font-medium'>Phí giao hàng</p>
                        <p className='text-sm text-gray-600'>Có thể phát sinh thêm phí</p>
                      </div>
                      <p className='font-semibold'>{formatCurrencyVND(30000)}</p>
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

                <Button
                  className='w-full mt-4 cursor-pointer'
                  onClick={handleCreateOrder}
                  disabled={createOrderMutation.isPending || vnpayPaymentMutation.isPending}
                >
                  {createOrderMutation.isPending || vnpayPaymentMutation.isPending ? 'Đang xử lý...' : 'Đặt hàng'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default CheckoutForm
