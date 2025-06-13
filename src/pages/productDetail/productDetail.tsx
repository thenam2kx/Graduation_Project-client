import {
  ShoppingCart,
  Shield,
  Truck,
  RotateCcw
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Skeleton, Alert } from 'antd'
import ProductDescription from './productDescription'
import ProductsSimilar from './productSimilar'
import { useParams } from 'react-router-dom'

const fetchProductDetail = async (id: string) => {
  const res = await axios.get(`http://localhost:8080/api/v1/products/${id}`)
  return res.data?.data
}

const ProductDetail = () => {
  const { id } = useParams()
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [availableSizes, setAvailableSizes] = useState<string[]>([])
  const [mainImage, setMainImage] = useState<string | null>(null)
  const [thumbnails, setThumbnails] = useState<string[]>([])

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['productDetail', id],
    queryFn: () => fetchProductDetail(id as string),
    enabled: !!id
  })

  useEffect(() => {
    if (product) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      const allImages = product.variants?.map(v => v.image).filter(Boolean) || []
      const filtered = allImages.filter(img => img !== product.image)

      setMainImage(product.image)
      setThumbnails(filtered)

      const sizes = product.variants
        ?.map(variant => {
          const attr = variant.variant_attributes?.find(a => a.attributeId?.value || a.value)
          return attr?.value || null
        })
        .filter((val): val is string => Boolean(val))

      setAvailableSizes(sizes)
      if (sizes.length && !selectedSize) {
        setSelectedSize(sizes[0])
      }
    }
  }, [id, product])

  const handleThumbnailClick = (clickedImg: string) => {
    if (!mainImage || clickedImg === mainImage) return

    setMainImage(clickedImg)
    setThumbnails(prev => {
      return [mainImage, ...prev.filter(img => img !== clickedImg)]
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isError && (
          <Alert type="error" message="Không thể tải dữ liệu sản phẩm" showIcon />
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Images */}
          <div className="flex gap-4">
            {/* Thumbnails */}
            <div className="flex flex-col gap-3 items-center justify-center">
              {thumbnails.map((thumb: string) => (
                <div
                  key={thumb}
                  onClick={() => handleThumbnailClick(thumb)}
                  className={`w-20 h-28 border-2 rounded-lg overflow-hidden cursor-pointer transition-colors ${
                    thumb === mainImage
                      ? 'border-black'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={thumb || '/placeholder.svg'}
                    alt="Thumbnail"
                    className="w-full h-full object-contain bg-white"
                  />
                </div>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 bg-white rounded-2xl overflow-hidden flex items-center justify-center h-[500px]">
              {isLoading ? (
                <Skeleton.Image style={{ width: '100%', height: 500 }} />
              ) : (
                <img
                  src={mainImage || '/placeholder.svg'}
                  alt={product?.name || 'Sản phẩm'}
                  className="max-h-full max-w-full object-contain bg-white"
                />
              )}
            </div>
          </div>

          {/* Right side - Product Details */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {isLoading ? (
                <Skeleton.Input active size="large" style={{ width: 300 }} />
              ) : product?.name}
            </h1>
            <div className="text-sm text-gray-500">
              {isLoading ? (
                <Skeleton.Input size="small" style={{ width: 150 }} />
              ) : `Thương hiệu: ${product?.brand?.name || 'Không xác định'}`}
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                {availableSizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-lg border-2 font-medium transition-colors ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button className="flex items-center justify-center px-8 py-3 rounded-lg font-medium bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-base transition-colors" style={{ minWidth: 140 }}>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Thêm vào giỏ hàng
              </button>
              <div className="flex items-center justify-center px-8 py-3 border border-gray-300 rounded-lg bg-white">
                <span className="text-xl font-bold text-gray-900">
                  {isLoading ? (
                    <Skeleton.Input size="small" />
                  ) : (
                    `₫${product?.price?.toLocaleString('vi-VN')}`
                  )}
                </span>
              </div>
            </div>

            <hr className="my-8 border-gray-200" />

            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">Chính hãng 100%</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">Freeship toàn quốc</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">Đổi trả miễn phí</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductDescription product={product} />
      <ProductsSimilar />
    </div>
  )
}

export default ProductDetail
