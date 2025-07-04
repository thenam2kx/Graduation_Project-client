import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  ChevronDown,
  ChevronUp,
  Star,
  Search,
  Heart
} from 'lucide-react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { addToWishlist, removeFromWishlist, checkProductInWishlist } from '@/services/wishlist-service/wishlist.apis';
import { RootState } from '@/redux/store';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';

const BRANDS = [
  'Dior', 'Chanel', 'Gucci', 'Versace', 'Calvin Klein', 'Jo Malone', 'Le Labo', 'Hermès', 'Tom Ford'
]

const VOLUMES = ['10ml', '30ml', '50ml', '100ml', '150ml+'];
const RATINGS = [4, 3, 2, 1];

const PRICE_RANGES = [
  { label: '0–500K', min: 0, max: 500000 },
  { label: '500K–1 triệu', min: 500000, max: 1000000 },
  { label: '1–2 triệu', min: 1000000, max: 2000000 },
  { label: '2 triệu trở lên', min: 2000000, max: null }
];

const PAGE_SIZE = 12;

const ProductPage = () => {
  // UI state
  const [showBrandMore, setShowBrandMore] = useState(false);
  const [showPrice, setShowPrice] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [showBrand, setShowBrand] = useState(true);

  const [showRating, setShowRating] = useState(true);

  // Filter state
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [selectedVolumes, setSelectedVolumes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  // Data state
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({ current: 1, pageSize: PAGE_SIZE, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [wishlistStatus, setWishlistStatus] = useState<Record<string, boolean>>({});

  const navigate = useNavigate();
  const { isSignin, user } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();

  // Reset to page 1 when filters/search change
  useEffect(() => {
    if (meta.current !== 1) {
      setMeta(prev => ({ ...prev, current: 1 }));
    } else {
      fetchProducts(1, search);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    search,
    selectedPriceRange,
    selectedVolumes,
    selectedBrands,

    selectedRating
  ]);

  // Handle pagination changes
  useEffect(() => {
    fetchProducts(meta.current, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.current]);
  const fetchProducts = async (page = 1, searchValue = '') => {
    setLoading(true)
    try {
      const params: any = {
        current: page,
        pageSize: PAGE_SIZE,
      };
      let qsArr: string[] = [];
      if (searchValue) qsArr.push(`name=/${searchValue}/i`);
      if (selectedPriceRange !== null) {
        const priceRange = PRICE_RANGES[selectedPriceRange];
        if (priceRange.max) {
          qsArr.push(`price>=${priceRange.min}&price<=${priceRange.max}`);
        } else {
          qsArr.push(`price>=${priceRange.min}`);
        }
      }
      if (selectedVolumes.length > 0) qsArr.push(`volume=${selectedVolumes.join('|')}`);
      if (selectedBrands.length > 0) qsArr.push(`brand=${selectedBrands.join('|')}`);

      if (selectedRating !== null) qsArr.push(`rating>=${selectedRating}`);
      if (qsArr.length > 0) params.qs = qsArr.join('&');
      const res = await axios.get('http://localhost:8080/api/v1/products', { params });
      if (res.data && res.data.data) {
        const productResults = res.data.data.results || [];
        setProducts(productResults);
        // Chỉ check wishlist khi có sản phẩm mới và user đã đăng nhập
        if (productResults.length > 0 && isSignin && user) {
          const productIds = productResults.map(product => product._id).filter(Boolean);
          const hasNewProducts = productIds.some(id => !(id in wishlistStatus));
          if (hasNewProducts) {
            checkWishlistStatus(productIds);
          }
        }
        setMeta({
          current: page,
          pageSize: PAGE_SIZE,
          pages: res.data.data.meta?.pages || 1,
          total: res.data.data.meta?.total || 0,
        });
      } else {
        setProducts([]);
      }
    } catch (err) {
      setProducts([]);
      setMeta(prev => ({
        ...prev,
        pages: 1,
        total: 0,
      }));
    } finally {
      setLoading(false);
    }
  };

  // Xử lý chuyển trang
  const handlePageChange = (page: number) => {
    setMeta(prev => ({ ...prev, current: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Xử lý tìm kiếm
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    clearTimeout((window as any).searchTimeout);
    (window as any).searchTimeout = setTimeout(() => {
      setSearch(e.target.value.trim());
    }, 500);
  };

  // Xử lý lọc theo giá
  const handlePriceChange = (index: number) => {
    setSelectedPriceRange(selectedPriceRange === index ? null : index);
    setMeta((prev) => ({ ...prev, current: 1 }));
  };
  // Xử lý lọc theo dung tích
  const handleVolumeChange = (volume: string) => {
    setSelectedVolumes(prev => prev.includes(volume) ? prev.filter(v => v !== volume) : [...prev, volume]);
    setMeta((prev) => ({ ...prev, current: 1 }));
  };
  // Xử lý lọc theo thương hiệu
  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
    setMeta((prev) => ({ ...prev, current: 1 }));
  };

  // Xử lý lọc theo đánh giá
  const handleRatingChange = (rating: number) => {
    setSelectedRating(selectedRating === rating ? null : rating);
    setMeta((prev) => ({ ...prev, current: 1 }));
  };

  // Kiểm tra trạng thái wishlist cho tất cả sản phẩm (tối ưu hóa)
  const checkWishlistStatus = async (productIds: string[]) => {
    if (!isSignin || !user || productIds.length === 0) return;
    try {
      // Chỉ check những sản phẩm chưa được check
      const uncheckedIds = productIds.filter(id => !(id in wishlistStatus));
      if (uncheckedIds.length === 0) return;
      
      const statusPromises = uncheckedIds.map(async (productId) => {
        try {
          const response = await checkProductInWishlist(productId);
          return { productId, isInWishlist: response.data.data.isInWishlist };
        } catch (error) {
          return { productId, isInWishlist: false };
        }
      });
      const results = await Promise.all(statusPromises);
      const statusMap = results.reduce((acc, { productId, isInWishlist }) => {
        acc[productId] = isInWishlist;
        return acc;
      }, {} as Record<string, boolean>);
      setWishlistStatus(prev => ({ ...prev, ...statusMap }));
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  // Toggle wishlist
  const handleToggleWishlist = async (productId: string) => {
    if (!isSignin || !user) {
      toast.error('Vui lòng đăng nhập để thêm vào yêu thích');
      navigate('/auth/signin');
      return;
    }
    try {
      const isCurrentlyInWishlist = wishlistStatus[productId];
      if (isCurrentlyInWishlist) {
        await removeFromWishlist(productId);
        toast.success('Đã xóa khỏi danh sách yêu thích!');
        setWishlistStatus(prev => ({ ...prev, [productId]: false }));
      } else {
        await addToWishlist(productId);
        toast.success('Đã thêm vào danh sách yêu thích!');
        setWishlistStatus(prev => ({ ...prev, [productId]: true }));
        // Invalidate wishlist query để update số lượng ở header
        queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        navigate(`/account/${user._id}/wishlist`);
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  // Xóa toàn bộ filter
  const handleClearFilters = () => {
    setSelectedPriceRange(null);
    setSelectedVolumes([]);
    setSelectedBrands([]);

    setSelectedRating(null);
    setMeta(prev => ({ ...prev, current: 1 }));
  };

  return (
    <div className="bg-white min-h-screen py-4">
      <div className="mx-auto max-w-[1440px] px-2 md:px-8 lg:px-16">
        {/* Breadcrumb & Title */}


        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-[300px] flex-shrink-0 bg-white rounded-xl shadow border border-gray-200 p-5 h-fit overflow-y-auto max-h-[85vh]">
            {/* Tìm kiếm */}
            <div className="flex items-center gap-2 mb-6">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-purple-500 w-full pr-10"
                  value={searchInput}
                  onChange={handleSearchInput}
                />
                <Search size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
              <h2 className="text-xl font-bold tracking-wide text-purple-700">Bộ lọc</h2>
              {(selectedPriceRange !== null || selectedVolumes.length > 0 || selectedBrands.length > 0 ||
                selectedRating !== null) && (
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
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
                    {PRICE_RANGES.map((range, index) => (
                      <label key={index} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="price"
                          className="accent-purple-600 cursor-pointer"
                          checked={selectedPriceRange === index}
                          onChange={() => handlePriceChange(index)}
                        />
                        {range.label}
                      </label>
                    ))}
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
                    <label key={v} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="accent-purple-600 cursor-pointer"
                        checked={selectedVolumes.includes(v)}
                        onChange={() => handleVolumeChange(v)}
                      />
                      {v}
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
                    <label key={b} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="accent-purple-600 cursor-pointer"
                        checked={selectedBrands.includes(b)}
                        onChange={() => handleBrandChange(b)}
                      />
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
                    <label key={r} className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        className="accent-purple-600 cursor-pointer"
                        checked={selectedRating === r}
                        onChange={() => handleRatingChange(r)}
                      />
                      <span className="flex items-center">
                        {[...Array(r)].map((_, i) => <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" fill="currentColor" />)}
                        <span className="ml-1 text-xs text-gray-600">{r} sao trở lên</span>
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </section>
          </aside>

          {/* Main Content */}
          <section className="flex-1 product-section">
            {/* Product Count and Active Filters */}
            {(!loading || meta.total > 0 || selectedPriceRange !== null || selectedVolumes.length > 0 ||
              selectedBrands.length > 0 || selectedRating !== null || search) && (
              <div className="bg-white rounded-xl shadow p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">
                    Tìm thấy <span className="text-purple-700 font-bold">{meta.total}</span> sản phẩm
                    {search && <span className="ml-1 text-gray-500">cho từ khóa "<span className="italic">{search}</span>"</span>}
                  </span>
                  {(selectedPriceRange !== null || selectedVolumes.length > 0 || selectedBrands.length > 0 ||
                    selectedRating !== null) && (
                    <span className="text-sm text-gray-500">Đang lọc theo {(selectedPriceRange !== null ? 1 : 0) + selectedVolumes.length + selectedBrands.length + (selectedRating !== null ? 1 : 0)} tiêu chí</span>
                  )}
                </div>
                {(selectedPriceRange !== null || selectedVolumes.length > 0 || selectedBrands.length > 0 ||
                  selectedRating !== null) && (
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="font-medium text-gray-700">Bộ lọc đang áp dụng:</span>
                    {selectedPriceRange !== null && (
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        {PRICE_RANGES[selectedPriceRange].label}
                        <button
                          onClick={() => setSelectedPriceRange(null)}
                          className="ml-1 hover:text-purple-600"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {selectedVolumes.map(volume => (
                      <span key={volume} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        {volume}
                        <button
                          onClick={() => handleVolumeChange(volume)}
                          className="ml-1 hover:text-purple-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {selectedBrands.map(brand => (
                      <span key={brand} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        {brand}
                        <button
                          onClick={() => handleBrandChange(brand)}
                          className="ml-1 hover:text-purple-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}

                    {selectedRating !== null && (
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        {selectedRating} sao trở lên
                        <button
                          onClick={() => setSelectedRating(null)}
                          className="ml-1 hover:text-purple-600"
                        >
                          ×
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {loading ? (
              <div className="text-center py-10">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                </div>
                <div className="mt-4 text-gray-500">Đang tải sản phẩm...</div>
              </div>
            ) : (
              <>
                {products && products.length > 0 ? (
                  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {products.map((product) => (
                      <div
                        key={product._id}
                        className="relative bg-white rounded-xl border-2 border-gray-200 shadow hover:shadow-xl transition p-4 flex flex-col items-center group cursor-pointer"
                        onClick={() => navigate(`/productDetail/${product._id}`)}
                      >
                        {/* Heart icon ở góc trên phải */}
                        <button
                          className="absolute top-3 right-3 z-10 bg-white rounded-full p-1 shadow hover:bg-purple-100 transition"
                          onClick={e => {
                            e.stopPropagation();
                            handleToggleWishlist(product._id);
                          }}
                          aria-label="Thêm vào yêu thích"
                        >
                          <Heart
                            size={22}
                            className={`transition-colors ${
                              wishlistStatus[product._id]
                                ? 'text-red-500 fill-red-500'
                                : 'text-gray-400 hover:text-red-500'
                            }`}
                          />
                        </button>
                        <img
                          src={product.image || product.img || 'https://via.placeholder.com/300x400?text=No+Image'}
                          alt={product.name}
                          className="w-full h-60 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-200"
                        />
                        <div 
                          className="font-bold text-lg mb-1 text-center line-clamp-2 min-h-[3rem] flex items-center justify-center leading-tight"
                          dangerouslySetInnerHTML={{ __html: product.name || '' }}
                        />
                        <div 
                          className="text-purple-600 font-medium text-sm group-hover:underline transition text-center line-clamp-2 h-10"
                          dangerouslySetInnerHTML={{ __html: product.desc || product.description || 'Khám phá ngay!' }}
                        />
                        <div className="bg-neutral-100 rounded-lg px-4 py-2 font-bold text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition mt-2">
                          {typeof product.price === 'number' ? product.price.toLocaleString() : product.price}₫
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow p-10 text-center">
                    <div className="text-gray-500 text-lg mb-2">Không tìm thấy sản phẩm nào phù hợp</div>
                    <p className="text-gray-400">Vui lòng thử lại với các bộ lọc khác</p>
                  </div>
                )}
                {/* Pagination */}
                {meta.pages > 1 && (
                  <div className="flex justify-center mt-10">
                    <nav className="inline-flex items-center gap-1">
                      <button
                        className="px-3 py-1 rounded border text-gray-700 hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={meta.current === 1}
                        onClick={() => handlePageChange(meta.current - 1)}
                      >
                        &lt
                      </button>
                      {meta.current > 3 && (
                        <button
                          className="px-3 py-1 rounded border text-gray-700 hover:bg-purple-100"
                          onClick={() => handlePageChange(1)}
                        >
                          1
                        </button>
                      )}
                      {meta.current > 3 && (
                        <span className="px-2 py-1 text-gray-500">...</span>
                      )}
                      {Array.from({ length: meta.pages }, (_, i) => i + 1)
                        .filter(page => page === 1 || page === meta.pages || Math.abs(page - meta.current) <= 1)
                        .map(page => (
                          <button
                            key={page}
                            className={`px-3 py-1 rounded border ${meta.current === page ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-purple-100'}`}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        ))
                      }
                      {meta.current < meta.pages - 2 && (
                        <span className="px-2 py-1 text-gray-500">...</span>
                      )}
                      {meta.current < meta.pages - 2 && (
                        <button
                          className="px-3 py-1 rounded border text-gray-700 hover:bg-purple-100"
                          onClick={() => handlePageChange(meta.pages)}
                        >
                          {meta.pages}
                        </button>
                      )}
                      <button
                        className="px-3 py-1 rounded border text-gray-700 hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
