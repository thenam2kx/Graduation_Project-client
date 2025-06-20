import {
  ShoppingCartIcon
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { QuantityInput } from '@/components/quantity-input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { PRODUCT_KEYS } from '@/services/product-service/product.keys'
import { useParams } from 'react-router'
import { fetchInfoProduct } from '@/services/product-service/product.apis'

// Product data
const productColors = [
  { color: "#3c4242", selected: true },
  { color: "#edd146", selected: false },
  { color: "#eb84b0", selected: false },
  { color: "#9c1f35", selected: false },
]


const productFeatures = [
  {
    icon: "/credit-card.svg",
    title: "Secure payment",
  },
  {
    icon: "/truck.svg",
    title: "Free shipping",
  },
  {
    icon: "/size---fit.svg",
    title: "Size & Fit",
  },
  {
    icon: "/free-shipping---returns.svg",
    title: "Free Shipping & Returns",
  },
]


const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1)
  const [scents, setScents] = useState<{ id: string; name: string }[]>([])
  const [selectedScents, setSelectedScents] = useState<string | undefined>(scents[0]?.id)
  const [capacity, setCapacity] = useState<{ id: string; name: string }[]>([])
  const [selectedSize, setSelectedSize] = useState('L')
  const [selectedColor, setSelectedColor] = useState('#3c4242')
  const queryClient = useQueryClient()
  const { id } = useParams<{ id: string }>()

  const { data: product, isLoading, error } = useQuery({
    queryKey: [PRODUCT_KEYS.FETCH_INFO_PRODUCT, id],
    queryFn: async () => {
      const res = await fetchInfoProduct(id as string)
      if (res && res.data) {
        return res.data
      } else {
        throw new Error('Product not found')
      }
    }
  })
  console.log('🚀 ~ ProductDetail ~ product:', product)

  useEffect(() => {
    if (product) {
      product.variants?.map((variant) => {
        return variant.variant_attributes.map((attr) => {
          if (attr.attributeId.slug === 'dung-tich') {
            setCapacity((prev) => [...prev, { id: attr._id, name: attr.value }])
          } else if (attr.attributeId.slug === 'mui-huong') {
            setScents((prev) => [...prev, { id: attr._id, name: attr.value }])
          }
          console.log('🚀 ~ returnvariant.variant_attributes.map ~ attr:', attr)
        })

      })
    }
  }, [product])

  const addToCartMutation = useMutation({
    mutationFn: (item: any) => {
      return 'ok'
    },
    onSuccess: () => {
      // Invalidate and refetch cart data
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  })

  const handleAddToCart = () => {
    // if (product) {
    //   addToCartMutation.mutate({
    //     productId: product.id,
    //     quantity: quantity,
    //   });
    // }
  }

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size)
  }

  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
  }

  if (isLoading) {
    return (
      <div className="bg-white flex flex-row justify-center w-full">
        <div className="bg-white overflow-hidden w-full max-w-[1440px] relative">
          {/* <TaskBaarSubsection /> */}
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
          {/* <TaskBaarSubsection /> */}
          <div className="flex items-center justify-center h-96 mt-[108px]">
            <div className="text-lg text-red-500">Error loading product</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white overflow-hidden w-full max-w-[1440px] relative">
        {/* <TaskBaarSubsection /> */}

        {/* Product Gallery Section */}
        <div className="flex mt-[108px]">
          <div className="relative w-[200px] h-[784px] bg-[#f6f6f6]">
            <div className="flex flex-col items-center gap-[24.34px] absolute top-[225px] left-[111px]">
              <div className="flex flex-col items-center justify-center gap-[22.68px]">
                <div className="relative w-[68.04px] h-[68.04px]">
                  <div className="w-[68px] h-[68px] rounded-[9.07px] border-[0.53px] border-solid border-white" />
                </div>

                <div className="w-[75.6px] h-[75.6px] relative">
                  <div className="relative w-[77px] h-[77px] rounded-[12.1px]">
                    <img
                      className="absolute w-[68px] h-[68px] top-[5px] left-[5px] object-cover"
                      alt="Product thumbnail"
                      src={product?.images && product?.images[0]}
                      crossOrigin='anonymous'
                    />
                    <div className="absolute w-[77px] h-[77px] top-0 left-0 rounded-[12.1px] border-[0.76px] border-solid border-[#3c4242]" />
                  </div>
                </div>

                <div className="w-[68.04px] h-[68.04px] relative">
                  <div className="w-[68px] h-[68px] rounded-[9.07px] border-[0.53px] border-solid border-white" />
                </div>
              </div>

              <div className="flex flex-col items-start gap-[12.17px]">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-[21.17px] h-[21.17px] bg-white rounded-[10.58px] shadow-[0.76px_0.76px_3.02px_#0000000a] p-0"
                >
                  <img
                    className="left-[7px] absolute w-2 h-[5px] top-2"
                    alt="Left stroke"
                    src="/left--stroke--2.svg"
                    crossOrigin='anonymous'
                  />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="w-[21.17px] h-[21.17px] bg-[#3c4242] rounded-[10.58px] rotate-180 shadow-[0.76px_0.76px_3.02px_#0000000a] p-0"
                >
                  <img
                    className="left-1.5 absolute w-2 h-[5px] top-2"
                    alt="Left stroke"
                    src="/left--stroke--3.svg"
                    crossOrigin='anonymous'
                  />
                </Button>
              </div>
            </div>
          </div>

          <img
            className="w-[520px] h-[785px] object-cover"
            alt="Product image"
            src={product?.images && product?.images[0]}
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
                      onClick={() => handleSizeSelect(cap.name)}
                      className={`relative w-full h-[38px] rounded-xl transition-colors ${
                        selectedSize === cap.name
                          ? 'bg-[#3c4141]'
                          : 'border-[1.5px] border-solid border-[#bebbbc] hover:border-[#3c4141]'
                      }`}
                    >
                      <div
                        className={`w-full h-[17px] [font-family:'Causten-Medium',Helvetica] font-medium text-sm text-center ${
                          selectedSize === cap.name ? 'text-white' : 'text-[#3c4242]'
                        }`}
                      >
                        {`${cap.name} ml`}
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="flex flex-col gap-[25px] mt-[32px]">
              <span className="[font-family:'Causten-SemiBold',Helvetica] font-semibold text-[#3f4646] text-lg">
                Colours Available
              </span>
              <div className="flex items-center gap-5">
                {productColors.map((colorOption, index) => (
                  <button
                    key={index}
                    onClick={() => handleColorSelect(colorOption.color)}
                    className={`relative transition-all ${
                      selectedColor === colorOption.color ? 'w-[30px] h-[30px]' : 'w-[22px] h-[22px]'
                    }`}
                  >
                    {selectedColor === colorOption.color ? (
                      <div className="relative h-[30px] rounded-[15px]">
                        <div
                          className="absolute w-[22px] h-[22px] top-1 left-1 rounded-[11px]"
                          style={{ backgroundColor: colorOption.color }}
                        />
                        <div className="absolute w-[30px] h-[30px] top-0 left-0 rounded-[15px] border border-solid border-[#3f4646]" />
                      </div>
                    ) : (
                      <div
                        className="w-[22px] h-[22px] rounded-[11px] hover:scale-110 transition-transform"
                        style={{ backgroundColor: colorOption.color }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="flex flex-col gap-[25px] mt-[32px]">
              <span className="[font-family:'Causten-SemiBold',Helvetica] font-semibold text-[#3f4646] text-lg">
                Quantity
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
                disabled={addToCartMutation.isPending}
                className="flex items-center justify-center gap-3 px-10 py-3 bg-[#8a33fd] rounded-lg hover:bg-[#7a2de8] transition-colors"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                <span className="[font-family:'Causten-SemiBold',Helvetica] font-semibold text-white text-lg">
                  {addToCartMutation.isPending ? 'Adding...' : 'Add to cart'}
                </span>
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center px-10 py-3 rounded-lg border border-solid border-[#3c4242]"
              >
                <span className="[font-family:'Causten-Bold',Helvetica] font-bold text-[#3c4242] text-lg">
                  ${product?.price?.toFixed(2) || '63.00'}
                </span>
              </Button>
            </div>

            {/* Success message */}
            {addToCartMutation.isSuccess && (
              <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
                <span className="text-green-800 text-sm font-medium">
                  Product added to cart successfully!
                </span>
              </div>
            )}

            <Separator className="mt-[37px]" />

            {/* Product Features */}
            <div className="grid grid-cols-2 gap-y-5 mt-[40px]">
              {productFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-[#f6f6f6] rounded-[22px] flex items-center justify-center">
                    <img
                      className="w-auto h-auto"
                      alt={feature.title}
                      src={feature.icon}
                      crossOrigin='anonymous'
                    />
                  </div>
                  <span className="[font-family:'Causten-Medium',Helvetica] font-medium text-[#3c4242] text-lg">
                    {feature.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Description Section */}
        <div className="mt-[100px] px-[100px]">
          <div className="flex items-center mb-6">
            <div className="w-1.5 h-7 bg-[#8a33fd] rounded-[10px] mr-5"></div>
            <h2 className="[font-family:'Core_Sans_C-65Bold',Helvetica] font-bold text-[#3c4242] text-[28px] tracking-[0.56px] leading-[33.5px]">
              Product Description
            </h2>
          </div>
          {/* <DescriptionSubsection description={product?.description} /> */}
        </div>

        {/* Product Table Section */}
        {/* <ProductTabelSubsection /> */}

        {/* Frame Section */}
        {/* <FrameSubsection /> */}

        {/* Similar Products Section */}
        <div className="mt-[40px] px-[100px]">
          <div className="flex items-center mb-6">
            <div className="w-1.5 h-7 bg-[#8a33fd] rounded-[10px] mr-5"></div>
            <h2 className="[font-family:'Core_Sans_C-65Bold',Helvetica] font-bold text-[#3c4242] text-[28px] tracking-[0.56px] leading-[33.5px]">
              Similar Products
            </h2>
          </div>

          {/* Similar Products Grid */}
          {/* <div className="grid grid-cols-4 gap-x-[37px] gap-y-[50px]">
            {similarProducts.map((product, index) => (
              <Card key={index} className="w-[282px] border-none">
                <CardContent className="p-0">
                  <div className="relative w-[282px] h-[370px] bg-[#f6f6f6]">
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-[27px] right-[23px] w-8 h-8 bg-white rounded-[16.18px] z-10"
                    >
                      <HeartIcon className="w-[15px] h-[13px]" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-start mt-[30px]">
                    <div>
                      <h3 className="[font-family:'Causten-SemiBold',Helvetica] font-semibold text-[#3c4242] text-base">
                        {product.title}
                      </h3>
                      <p className="[font-family:'Causten-Medium',Helvetica] font-medium text-[#807d7e] text-sm mt-1">
                        {product.brand}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-[#f6f6f6] rounded-lg px-4 py-2 border-none"
                    >
                      <span className="[font-family:'Causten-Bold',Helvetica] font-bold text-[#3c4242] text-sm">
                        {product.price}
                      </span>
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div> */}
        </div>

        {/* Need Help Section */}
        {/* <NeedHelpSectionSubsection /> */}
      </div>
    </div>
  )
}

export default ProductDetail
