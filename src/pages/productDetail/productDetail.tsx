import { ShoppingCartIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { QuantityInput } from '@/components/quantity-input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { PRODUCT_KEYS } from '@/services/product-service/product.keys'
import { useParams } from 'react-router'
import { fetchInfoProduct } from '@/services/product-service/product.apis'
import { formatCurrencyVND } from '@/utils/utils'
import { addToCartAPI } from '@/services/cart-service/cart.apis'
import { CART_KEYS } from '@/services/cart-service/cart.keys'
import { useAppSelector } from '@/redux/hooks'
import { toast } from 'react-toastify'

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1)
  const [scents, setScents] = useState<{ id: string; name: string }[]>([])
  const [selectedScents, setSelectedScents] = useState<string | undefined>(scents[0]?.id)
  const [capacity, setCapacity] = useState<{ id: string; name: string }[]>([])
  const [price, setPrice] = useState<number>(0)
  const queryClient = useQueryClient()
  const { id } = useParams<{ id: string }>()
  const cartId = useAppSelector((state) => state.cart.IdCartUser)

  const { data: product, isLoading, error } = useQuery({
    queryKey: [PRODUCT_KEYS.FETCH_INFO_PRODUCT, id],
    queryFn: async () => {
      const res = await fetchInfoProduct(id as string)
      if (res && res.data) {
        return res.data
      } else {
        toast.error('Sản phẩm không tồn tại hoặc đã bị xóa.')
        throw new Error('Product not found')
      }
    }
  })

  useEffect(() => {
    if (product && product.variants) {
      const newCapacity = new Map<string, { id: string; name: string }>()
      const newScents = new Map<string, { id: string; name: string }>()

      product.variants.forEach((variant) => {
        variant.variant_attributes.forEach((attr) => {
          if (attr.attributeId.slug === 'dung-tich') {
            newCapacity.set(attr.value, { id: attr._id || '', name: attr.value })
          } else if (attr.attributeId.slug === 'mui-huong') {
            newScents.set(attr.value, { id: attr._id || '', name: attr.value })
          }
        })
      })

      setCapacity(Array.from(newCapacity.values()))
      setScents(Array.from(newScents.values()))
    }
  }, [product])

  useEffect(() => {
    if (capacity.length > 0 && !selectedScents) {
      setSelectedScents(capacity[0].id)
    }
  }, [capacity, selectedScents])

  // Set initial selected capacity
  useEffect(() => {
    if (product && product.variants && selectedScents) {
      const selectedVariant = product.variants.find((variant) =>
        variant.variant_attributes.some((attr) => attr._id === selectedScents)
      )
      if (selectedVariant) {
        setPrice(selectedVariant.price * quantity)
      }
    }
  }, [selectedScents, product, quantity])


  const handleSelectedScents = (id: string) => {
    setSelectedScents(id)
  }

  const addToCartMutation = useMutation({
    mutationFn: ({ variantId, quantity }: { variantId: string; quantity: number }) =>
      addToCartAPI(cartId || '', product?._id || '', variantId, quantity),
    onSuccess: () => {
      toast.success('Thêm sản phẩm vào giỏ hàng thành công!')
      queryClient.invalidateQueries({ queryKey: [CART_KEYS.FETCH_CART_INFO, cartId] })
    },
    onError: () => {
      toast.error('Lỗi khi thêm sản phẩm vào giỏ hàng.')
    }
  })

  const handleAddToCart = () => {
    if (product && product.variants && selectedScents) {
      const selectedVariant = product.variants.find((variant) =>
        variant.variant_attributes.some((attr) => attr._id === selectedScents)
      )
      if (selectedVariant) {
        addToCartMutation.mutate({ variantId: selectedVariant._id || '', quantity })
      } else {
        toast.error('Bạn chưa chọn biến thể nào.')
      }
    }
  }


  if (isLoading) {
    return (
      <div className="bg-white flex flex-row justify-center w-full">
        <div className="bg-white overflow-hidden w-full max-w-[1440px] relative">
          <div className="flex items-center justify-center h-96 mt-[108px]">
            <div className="text-lg text-[#807d7e]">Loading product...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white flex flex-row justify-center w-full">
        <div className="bg-white overflow-hidden w-full max-w-[1440px] relative">
          <div className="flex items-center justify-center h-96 mt-[108px]">
            <div className="text-lg text-red-500">Error loading product</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white overflow-hidden w-full max-w-[1440px] relative">
        <div className="flex mt-[108px]">
          <div className="relative w-[200px] h-[784px] bg-[#f6f6f6]">
            <div className="flex flex-col items-center gap-[24.34px] absolute top-[225px] left-[111px]">
              <div className="flex flex-col items-center justify-center gap-[22.68px]">
                {
                  product?.image && product?.image.length > 0 && product?.image.map((img: string, index: number) => (
                    <div className="w-[75.6px] h-[75.6px] relative" key={index}>
                      <div className="relative w-[77px] h-[77px] rounded-[12.1px]">
                        <img
                          className="absolute h-full w-full top-0 left-0 object-cover rounded cursor-pointer"
                          alt="Product thumbnail"
                          src={img}
                          crossOrigin='anonymous'
                        />
                        <div className="absolute w-[77px] h-[77px] top-0 left-0 rounded-[12.1px] border-[0.76px] border-solid border-[#3c4242]" />
                      </div>
                    </div>

                  ))
                }
              </div>
            </div>
          </div>

          <img
            className="w-[520px] h-[785px] object-cover"
            alt={product?.name}
            src={product?.image?.[0]}
            crossOrigin='anonymous'
          />

          {/* Product Details Section */}
          <div className="flex flex-col ml-[67px] max-w-[534px]">
            {/* Breadcrumb */}
            <Breadcrumb className="mt-[30px]">
              <BreadcrumbList className="flex items-center gap-[15px]">
                <BreadcrumbItem>
                  <BreadcrumbLink className="[font-family:'Causten-Medium',Helvetica] font-medium text-[#807d7e] text-lg">
                    Shop
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <img
                    className="w-[5px] h-[10.14px]"
                    alt="Left stroke"
                    src="/left--stroke-.svg"
                    crossOrigin='anonymous'
                  />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink className="[font-family:'Causten-Medium',Helvetica] font-medium text-[#807d7e] text-lg capitalize">
                    {product?.categoryId?.name || 'Category'}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <img
                    className="w-[5px] h-[10.14px]"
                    alt="Left stroke"
                    src="/left--stroke-.svg"
                    crossOrigin='anonymous'
                  />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink className="[font-family:'Causten-Medium',Helvetica] font-medium text-[#807d7e] text-lg">
                    Product
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Product Title */}
            <h1 className="mt-[26px] [font-family:'Core_Sans_C-65Bold',Helvetica] font-bold text-[#3c4242] text-[34px] tracking-[0.68px] leading-[47.6px]">
              {product?.name}
            </h1>

            {/* Size Selection */}
            <div className="flex flex-col gap-[25px] mt-[32px]">
              <div className="flex items-start gap-5">
                <span className="[font-family:'Causten-SemiBold',Helvetica] font-semibold text-[#3f4646] text-lg">
                  Chọn dung tích
                </span>
              </div>

              <div className="flex items-center gap-5">
                {capacity && capacity.map((cap, index) => (
                  <div key={index} className="relative w-[80px] h-[42px]">
                    <button
                      onClick={() => handleSelectedScents(cap.id)}
                      className={`relative w-full h-[38px] rounded-xl transition-colors ${
                        selectedScents === cap.id
                          ? 'bg-[#3c4141]'
                          : 'border-[1.5px] border-solid border-[#bebbbc] hover:border-[#3c4141]'
                      }`}
                    >
                      <div
                        className={`w-full h-[17px] [font-family:'Causten-Medium',Helvetica] font-medium text-sm text-center ${
                          selectedScents === cap.id ? 'text-white' : 'text-[#3c4242]'
                        }`}
                      >
                        {`${cap.name} ml`}
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="flex flex-col gap-[25px] mt-[32px]">
              <span className="[font-family:'Causten-SemiBold',Helvetica] font-semibold text-[#3f4646] text-lg">
                Số lượng
              </span>
              <QuantityInput
                value={quantity}
                onChange={setQuantity}
                min={1}
                max={10}
                className="w-fit"
              />
            </div>

            {/* Add to Cart and Price */}
            <div className="flex gap-4 mt-[45px]">
              <Button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-3 px-10 py-3 bg-[#8a33fd] rounded-lg hover:bg-[#7a2de8] transition-colors"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                <span className="[font-family:'Causten-SemiBold',Helvetica] font-semibold text-white text-lg cursor-pointer">
                  {addToCartMutation.isPending ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                </span>
              </Button>
              {
                selectedScents && (
                  <Button
                    variant="outline"
                    className="flex items-center justify-center px-10 py-3 rounded-lg border border-solid border-[#3c4242]"
                  >
                    <span className="[font-family:'Causten-Bold',Helvetica] font-bold text-[#3c4242] text-lg">
                      {formatCurrencyVND(price)}
                    </span>
                  </Button>
                )
              }
            </div>

            <Separator className="mt-[37px]" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
