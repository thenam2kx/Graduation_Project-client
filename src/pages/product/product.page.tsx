import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  ChevronDown,
  ChevronUp,
  Star,
  Search,
  ChevronRightIcon
} from 'lucide-react'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

const BRANDS = [
  'Dior', 'Chanel', 'Gucci', 'Versace', 'Calvin Klein', 'Jo Malone', 'Le Labo', 'Hermès', 'Tom Ford'
]
const FRAGRANCE_FAMILIES = [
  'Hương hoa', 'Hương gỗ', 'Hương phương Đông', 'Hương biển', 'Hương trái cây', 'Hương da thuộc', 'Hương gia vị'
]
const USAGE_TIMES = ['Ban ngày', 'Ban đêm', 'Cả ngày', 'Xuân', 'Hạ', 'Thu', 'Đông']
const TYPES = ['Eau de Toilette (EDT)', 'Eau de Parfum (EDP)', 'Parfum', 'Body Mist', 'Cologne']
const VOLUMES = ['10ml', '30ml', '50ml', '100ml', '150ml+']
const GENDERS = ['Nam', 'Nữ', 'Unisex']
const RATINGS = [4, 3, 2, 1]
const STOCK_STATUS = ['Còn hàng', 'Hết hàng']
const RELEASE_YEARS = [
  { label: '2020–2024', value: '2020-2024' },
  { label: '2010–2020', value: '2010-2020' },
  { label: 'Trước 2010', value: 'before-2010' }
]

const PAGE_SIZE = 9

const ProductPage = () => {
  const [showBrandMore, setShowBrandMore] = useState(false)
  const [showPrice, setShowPrice] = useState(true)
  const [showVolume, setShowVolume] = useState(true)
  const [showGender, setShowGender] = useState(true)
  const [showBrand, setShowBrand] = useState(true)
  const [showFragrance, setShowFragrance] = useState(true)
  const [showUsage, setShowUsage] = useState(true)
  const [showRelease, setShowRelease] = useState(true)
  const [showType, setShowType] = useState(true)
  const [showRating, setShowRating] = useState(true)
  const [showStock, setShowStock] = useState(true)

  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [meta, setMeta] = useState({ current: 1, pageSize: PAGE_SIZE, pages: 1, total: 0 })
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  // Fetch products with pagination and search
  const fetchProducts = async (page = 1, searchValue = '') => {
    setLoading(true)
    try {
      const params: any = {
        current: page,
        pageSize: PAGE_SIZE
      }
      if (searchValue) params.qs = `name=/${searchValue}/i`
      const res = await axios.get('http://localhost:8080/api/v1/products', { params })
      setProducts(res.data?.data?.results || [])
      setMeta(res.data?.data?.meta || { current: 1, pageSize: PAGE_SIZE, pages: 1, total: 0 })
    } catch (err) {
      setProducts([])
      setMeta({ current: 1, pageSize: PAGE_SIZE, pages: 1, total: 0 })
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts(meta.current, search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.current, search])

  // Xử lý chuyển trang
  const handlePageChange = (page: number) => {
    setMeta((prev) => ({ ...prev, current: page }))
  }

  // Xử lý tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setMeta((prev) => ({ ...prev, current: 1 }))
    setSearch(searchInput.trim())
  }

  return (
    <div className="bg-white min-h-screen py-4">
      <div className="mx-auto max-w-[1440px] px-2 md:px-8 lg:px-16">
        {/* Breadcrumb & Title */}
        <header className="mb-8">
          <div className="bg-white rounded-xl shadow p-4 md:p-6">
            <Breadcrumb className="mb-2">
              <BreadcrumbList className="flex items-center gap-[15px]">
                <BreadcrumbItem>
                  <BreadcrumbLink className="font-medium cursor-pointer text-gray-600 text-sm md:text-base hover:text-purple-600 transition-colors">
                    <a href="/">Trang chủ</a>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRightIcon className="w-[5px] h-[10.14px] text-gray-600" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink className="font-medium cursor-pointer text-purple-600 text-sm md:text-base">
                    <a href="/shop">Cửa hàng</a>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">Tất cả sản phẩm</h1>
            <p className="text-gray-600">
              Khám phá những sản phẩm nước hoa mới nhất, chính hãng, đa dạng thương hiệu và mức giá.
            </p>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-[300px] flex-shrink-0 bg-white rounded-xl shadow border border-gray-200 p-5 h-fit overflow-y-auto max-h-[85vh]">
            {/* Tìm kiếm */}
            <form onSubmit={handleSearch} className="flex items-center gap-2 mb-6">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-purple-500 w-full"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
              />
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-3 py-2 flex items-center gap-1"
              >
                <Search size={18} /> 
              </button>
            </form>
            <h2 className="text-xl font-bold mb-6 border-b border-gray-200 pb-2 tracking-wide text-purple-700">Bộ lọc</h2>
            {/* Price Range */}
            <section className="mb-5">
              <button type="button" className="flex justify-between items-center w-full font-semibold text-gray-900 mb-3"
                onClick={() => setShowPrice(v => !v)}>
                Mức giá
                {showPrice ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {showPrice && (
                <div>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="price" className="accent-purple-600" />
                      0–500K
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="price" className="accent-purple-600" />
                      500K–1 triệu
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="price" className="accent-purple-600" />
                      1–2 triệu
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="price" className="accent-purple-600" />
                      2 triệu trở lên
                    </label>
                  </div>
                </div>
              )}
            </section>
            {/* Volume */}
            <section className="mb-5">
              <button type="button" className="flex justify-between items-center w-full font-semibold text-gray-900 mb-3"
                onClick={() => setShowVolume(v => !v)}>
                Dung tích
                {showVolume ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {showVolume && (
                <div className="flex flex-col gap-2">
                  {VOLUMES.map(v => (
                    <label key={v} className="flex items-center gap-2">
                      <input type="checkbox" className="accent-purple-600" />
                      {v}
                    </label>
                  ))}
                </div>
              )}
            </section>
            {/* Gender */}
            <section className="mb-5">
              <button type="button" className="flex justify-between items-center w-full font-semibold text-gray-900 mb-3"
                onClick={() => setShowGender(v => !v)}>
                Giới tính
                {showGender ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {showGender && (
                <div className="flex flex-col gap-2">
                  {GENDERS.map(g => (
                    <label key={g} className="flex items-center gap-2">
                      <input type="radio" name="gender" className="accent-purple-600" />
                      {g}
                    </label>
                  ))}
                </div>
              )}
            </section>
            {/* Brand */}
            <section className="mb-5">
              <button type="button" className="flex justify-between items-center w-full font-semibold text-gray-900 mb-3"
                onClick={() => setShowBrand(v => !v)}>
                Thương hiệu
                {showBrand ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {showBrand && (
                <div className="flex flex-col gap-2">
                  {(showBrandMore ? BRANDS : BRANDS.slice(0, 5)).map(b => (
                    <label key={b} className="flex items-center gap-2">
                      <input type="checkbox" className="accent-purple-600" />
                      {b}
                    </label>
                  ))}
                  {BRANDS.length > 5 && (
                    <button
                      type="button"
                      className="text-purple-600 text-sm flex items-center gap-1 mt-1"
                      onClick={() => setShowBrandMore(v => !v)}
                    >
                      {showBrandMore ? <>Ẩn bớt <ChevronUp size={16} /></> : <>Xem thêm <ChevronDown size={16} /></>}
                    </button>
                  )}
                </div>
              )}
            </section>
            {/* Fragrance Family */}
            <section className="mb-5">
              <button type="button" className="flex justify-between items-center w-full font-semibold text-gray-900 mb-3"
                onClick={() => setShowFragrance(v => !v)}>
                Nhóm hương
                {showFragrance ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {showFragrance && (
                <div className="flex flex-col gap-2">
                  {FRAGRANCE_FAMILIES.map(f => (
                    <label key={f} className="flex items-center gap-2">
                      <input type="checkbox" className="accent-purple-600" />
                      {f}
                    </label>
                  ))}
                </div>
              )}
            </section>
            {/* Usage Time */}
            <section className="mb-5">
              <button type="button" className="flex justify-between items-center w-full font-semibold text-gray-900 mb-3"
                onClick={() => setShowUsage(v => !v)}>
                Thời điểm sử dụng
                {showUsage ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {showUsage && (
                <div className="flex flex-col gap-2">
                  {USAGE_TIMES.map(u => (
                    <label key={u} className="flex items-center gap-2">
                      <input type="checkbox" className="accent-purple-600" />
                      {u}
                    </label>
                  ))}
                </div>
              )}
            </section>
            {/* Release Year */}
            <section className="mb-5">
              <button type="button" className="flex justify-between items-center w-full font-semibold text-gray-900 mb-3"
                onClick={() => setShowRelease(v => !v)}>
                Năm phát hành
                {showRelease ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {showRelease && (
                <div className="flex flex-col gap-2">
                  {RELEASE_YEARS.map(y => (
                    <label key={y.value} className="flex items-center gap-2">
                      <input type="radio" name="release" className="accent-purple-600" />
                      {y.label}
                    </label>
                  ))}
                </div>
              )}
            </section>
            {/* Type */}
            <section className="mb-5">
              <button type="button" className="flex justify-between items-center w-full font-semibold text-gray-900 mb-3"
                onClick={() => setShowType(v => !v)}>
                Loại sản phẩm
                {showType ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {showType && (
                <div className="flex flex-col gap-2">
                  {TYPES.map(t => (
                    <label key={t} className="flex items-center gap-2">
                      <input type="checkbox" className="accent-purple-600" />
                      {t}
                    </label>
                  ))}
                </div>
              )}
            </section>
            {/* Rating */}
            <section className="mb-5">
              <button type="button" className="flex justify-between items-center w-full font-semibold text-gray-900 mb-3"
                onClick={() => setShowRating(v => !v)}>
                Đánh giá
                {showRating ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {showRating && (
                <div className="flex flex-col gap-2">
                  {RATINGS.map(r => (
                    <label key={r} className="flex items-center gap-1">
                      <input type="radio" name="rating" className="accent-purple-600" />
                      <span className="flex items-center">
                        {[...Array(r)].map((_, i) => <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" fill="currentColor" />)}
                        <span className="ml-1 text-xs text-gray-600">{r} sao trở lên</span>
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </section>
            {/* Stock Status */}
            <section>
              <button type="button" className="flex justify-between items-center w-full font-semibold text-gray-900 mb-3"
                onClick={() => setShowStock(v => !v)}>
                Tình trạng kho
                {showStock ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {showStock && (
                <div className="flex flex-col gap-2">
                  {STOCK_STATUS.map(s => (
                    <label key={s} className="flex items-center gap-2">
                      <input type="radio" name="stock" className="accent-purple-600" />
                      {s}
                    </label>
                  ))}
                </div>
              )}
            </section>
          </aside>

          {/* Main Content */}
          <section className="flex-1">
            {/* Không còn form tìm kiếm ở đây */}
            {loading ? (
              <div className="text-center py-10 text-gray-500">Đang tải sản phẩm...</div>
            ) : (
              <>
                <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="bg-white rounded-xl border-2 border-gray-200 shadow hover:shadow-xl transition p-4 flex flex-col items-center group cursor-pointer"
                    >
                      <img
                        src={product.image || product.img || 'https://via.placeholder.com/300x400?text=No+Image'}
                        alt={product.name}
                        className="w-full h-60 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="font-bold text-lg mb-1 text-center line-clamp-2 h-12 flex items-center justify-center">
                        {product.name}
                      </div>
                      <div className="text-purple-600 font-medium text-sm group-hover:underline transition text-center line-clamp-2 h-10">
                        {product.desc || product.description || 'Khám phá ngay!'}
                      </div>
                      <div className="bg-neutral-100 rounded-lg px-4 py-2 font-bold text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition mt-2">
                        {typeof product.price === 'number' ? product.price.toLocaleString() : product.price}₫
                      </div>
                    </div>
                  ))}
                </div>
                {/* Pagination */}
                {meta.pages > 1 && (
                  <div className="flex justify-center mt-10">
                    <nav className="inline-flex items-center gap-1">
                      <button
                        className="px-3 py-1 rounded border text-gray-700 hover:bg-purple-100"
                        disabled={meta.current === 1}
                        onClick={() => handlePageChange(meta.current - 1)}
                      >
                        &lt
                      </button>
                      {Array.from({ length: meta.pages }, (_, i) => (
                        <button
                          key={i + 1}
                          className={`px-3 py-1 rounded border ${meta.current === i + 1 ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-purple-100'}`}
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        className="px-3 py-1 rounded border text-gray-700 hover:bg-purple-100"
                        disabled={meta.current === meta.pages}
                        onClick={() => handlePageChange(meta.current + 1)}
                      >
                        &gt
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default ProductPage
