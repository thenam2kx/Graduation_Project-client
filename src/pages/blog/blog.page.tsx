import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { BLOG_KEYS } from '@/services/blog-service/blog.keys'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { ChevronRightIcon, Calendar, Clock, Tag, Search } from 'lucide-react'
import { fetchListBlog, fetchListCateBlog } from '@/services/blog-service/blog.apis'
import { useNavigate } from 'react-router'

const PAGE_SIZE = 9

const dataIframe = [
  {
    type: 'iframe',
    src: 'https://www.youtube.com/embed/g8TG0bbIYoY',
    height: 180,
    title: 'Tin tức thể thao nổi bật'
  },
  {
    type: 'iframe',
    src: 'https://www.youtube.com/embed/g8TG0bbIYoY',
    height: 180,
    title: 'Tin tức thể thao nổi bật'
  },
  {
    type: 'iframe',
    src: 'https://www.youtube.com/embed/g8TG0bbIYoY',
    height: 180,
    title: 'Tin tức thể thao nổi bật'
  }
]

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 }
  })
}

const SlideshowBlog = ({ blogs, navigate }: any) => {
  if (!blogs || blogs.length === 0) return null
  return (
    <div className='w-full bg-white rounded-xl shadow-lg overflow-hidden mb-6'>
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        loop
        spaceBetween={12}
        slidesPerView={1}
        className='w-full'
      >
        {blogs.slice(0, 6).map((blog: any) => (
          <SwiperSlide key={blog._id}>
            <div className='flex flex-col md:flex-row items-center'>
              <div className="relative w-full md:w-[320px] h-48 md:h-64 overflow-hidden">
                <img
                  src={blog.image || 'https://via.placeholder.com/600x300'}
                  alt={blog.title}
                  className='w-full h-full object-cover transition-transform duration-500 hover:scale-110'
                />
                <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent w-full h-1/2"></div>
                <div className="absolute bottom-3 left-3 flex items-center text-white text-xs">
                  <Calendar size={14} className="mr-1" />
                  <span>{new Date(blog.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
              <div className='p-4 md:p-6 flex-1 w-full'>
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <Tag size={14} className="mr-1 text-purple-500" />
                  <span>{blog.categoryBlogName || 'Tin tức'}</span>
                  <span className="mx-2">•</span>
                  <Clock size={14} className="mr-1" />
                  <span>5 phút đọc</span>
                </div>
                <h3 className='font-bold text-lg md:text-2xl mb-2 line-clamp-2 hover:text-purple-700 transition-colors cursor-pointer'
                  onClick={() => navigate(`/blogs/${blog._id}`)}
                >
                  {blog.title}
                </h3>
                <div className='text-gray-600 text-sm md:text-base mb-3 line-clamp-3'>
                  {blog.description?.slice(0, 150) ||
                    blog.content?.replace(/<[^>]+>/g, '').slice(0, 150) || ''}
                  ...
                </div>
                <button
                  onClick={() => navigate(`/blogs/${blog._id}`)}
                  className='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center'
                >
                  Xem chi tiết
                  <ChevronRightIcon size={16} className="ml-1" />
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

const BlogList = ({ blogs, fadeInUp, navigate }: any) => (
  <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
    {blogs.map((blog: any, idx: number) => (
      <motion.div
        key={blog._id}
        className='bg-white rounded-xl border border-gray-100 shadow-lg hover:shadow-xl transition p-3 flex flex-col group cursor-pointer h-full'
        custom={idx}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={fadeInUp}
        whileHover={{ y: -5 }}
        onClick={() => navigate(`/blogs/${blog._id}`)}
      >
        <div className="relative overflow-hidden rounded-lg mb-3">
          <img
            src={blog.image || 'https://via.placeholder.com/400x200'}
            alt={blog.title}
            className='w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110'
          />
          <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent w-full h-1/2"></div>
          <div className="absolute bottom-3 left-3 flex items-center text-white text-xs">
            <Calendar size={14} className="mr-1" />
            <span>{new Date(blog.createdAt).toLocaleDateString('vi-VN')}</span>
          </div>
          {blog.categoryBlogName && (
            <div className="absolute top-3 right-3 bg-purple-600 text-white text-xs px-2 py-1 rounded">
              {blog.categoryBlogName}
            </div>
          )}
        </div>
        <h3 className='font-bold text-lg mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors'>
          {blog.title}
        </h3>
        <div className='text-gray-600 text-sm mb-3 line-clamp-3 flex-1'>
          {blog.description?.slice(0, 100) ||
            blog.content?.replace(/<[^>]+>/g, '').slice(0, 100) || ''}
          ...
        </div>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500 flex items-center">
            <Clock size={14} className="mr-1" />
            5 phút đọc
          </span>
          <span className='text-purple-700 font-medium text-sm group-hover:underline transition'>
            Xem chi tiết
          </span>
        </div>
      </motion.div>
    ))}
  </div>
)

const BlogCategories = ({ onSelectCategory }: { onSelectCategory: (id: string | null) => void }) => {
  const { data: cateData } = useQuery({
    queryKey: [BLOG_KEYS.FETCH_LIST_CATE_BLOG],
    queryFn: fetchListCateBlog,
    select: (res) => res.data?.results || []
  })

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Lấy tất cả bài viết
  const { data: allBlogs } = useQuery({
    queryKey: [BLOG_KEYS.FETCH_LIST_BLOG, 'all'],
    queryFn: () => fetchListBlog({ pageSize: 100 }),
    select: (res) => res.data?.results || []
  })

  // Xử lý khi chọn danh mục
  const handleSelectCategory = (categoryId: string) => {
    const newSelected = selectedCategory === categoryId ? null : categoryId
    setSelectedCategory(newSelected)
    onSelectCategory(newSelected)
  }

  // Lọc bài viết theo danh mục đã chọn
  const categoryBlogs = selectedCategory
    ? allBlogs?.filter((blog: any) => blog.categoryBlogId === selectedCategory && blog.isPublic !== false)
    : []

  return (
    <div className='bg-white rounded-xl shadow-lg border border-gray-100 p-4 mb-6'>
      <h3 className='font-bold text-lg mb-4 flex items-center'>
        <div className="w-1 h-6 bg-purple-600 rounded-full mr-2"></div>
        Danh mục tin tức
      </h3>
      <div className='overflow-y-auto max-h-56'>
        {cateData?.map((category: any) => {
          const count = allBlogs?.filter((blog: any) =>
            blog.categoryBlogId === category._id && blog.isPublic !== false
          ).length || 0
          return (
            <div
              key={category._id}
              className={`cursor-pointer p-2.5 mb-1 rounded-lg transition flex justify-between items-center ${selectedCategory === category._id ? 'bg-purple-100 text-purple-700 font-medium' : 'hover:bg-gray-50'}`}
              onClick={() => handleSelectCategory(category._id)}
            >
              <span>{category.name}</span>
              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                {count}
              </span>
            </div>
          )
        })}
      </div>

      {selectedCategory && categoryBlogs?.length > 0 && (
        <div className='mt-4 pt-4 border-t border-gray-100'>
          <div className='text-sm font-semibold mb-2 flex items-center'>
            <Tag size={14} className="mr-1.5 text-purple-600" />
            Bài viết liên quan: ({categoryBlogs.length})
          </div>
        </div>
      )}
    </div>
  )
}

const Sidebar = ({ dataIframe, searchTerm, onSearch, onSearchSubmit }: any) => (
  <div className='w-full lg:w-80 flex-shrink-0'>
    <div className='flex flex-col gap-6'>
      {/* Search box */}
      <div className='bg-white rounded-xl shadow-lg border border-gray-100 p-4'>
        <h3 className='font-bold text-lg mb-4 flex items-center'>
          <div className="w-1 h-6 bg-purple-600 rounded-full mr-2"></div>
          Tìm kiếm
        </h3>
        <form onSubmit={onSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            className="w-full h-10 px-4 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
          >
            <Search size={18} />
          </button>
        </form>
      </div>

      {/* Featured videos */}
      <div className='bg-gradient-to-br from-white to-purple-50 rounded-xl p-4 shadow-lg border border-gray-100'>
        <h3 className='font-bold text-lg mb-4 flex items-center'>
          <div className="w-1 h-6 bg-purple-600 rounded-full mr-2"></div>
          Video nổi bật
        </h3>

        {dataIframe.map((item: any, idx: number) =>
          item.type === 'iframe' ? (
            <div className='mb-5 last:mb-0 transform transition-all duration-300 hover:scale-[1.02]' key={idx}>
              <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                <div className="relative pb-2 mb-2 border-b border-gray-100">
                  <div className="flex space-x-1 absolute left-1 top-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <iframe
                  width='100%'
                  height={item.height}
                  src={item.src}
                  title={item.title || `Video nhúng ${idx + 1}`}
                  frameBorder='0'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                  className="rounded"
                ></iframe>
                <div className="mt-2 text-xs text-gray-500 font-medium px-1">
                  {item.title || `Video nhúng ${idx + 1}`}
                </div>
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  </div>
)

const BlogPage = () => {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Reset về trang đầu tiên khi thay đổi danh mục hoặc tìm kiếm
  useEffect(() => {
    setCurrent(1)
  }, [selectedCategory, searchQuery])

  // Lấy danh sách danh mục
  const { data: cateData } = useQuery({
    queryKey: [BLOG_KEYS.FETCH_LIST_CATE_BLOG],
    queryFn: fetchListCateBlog,
    select: (res) => res.data?.results || []
  })

  // Lấy tất cả bài viết để tìm kiếm client-side
  const { data: allBlogsData } = useQuery({
    queryKey: [BLOG_KEYS.FETCH_LIST_BLOG, 'all-for-search'],
    queryFn: () => fetchListBlog({ pageSize: 100 }),
    select: (res) => res.data?.results || []
  })

  const { data, isLoading, isError } = useQuery({
    queryKey: [BLOG_KEYS.FETCH_LIST_BLOG, current, selectedCategory],
    queryFn: () => fetchListBlog({
      current,
      pageSize: PAGE_SIZE,
      ...(selectedCategory ? { categoryBlogId: selectedCategory } : {})
    }),
    select: (res) => res.data,
    keepPreviousData: true
  })

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  )

  if (isError) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau!</p>
      </div>
    </div>
  )

  // Filter out blogs where isPublic is false
  let blogs = Array.isArray(data?.results)
    ? data.results.filter((blog: any) => blog.isPublic !== false)
    : []

  // Nếu có từ khóa tìm kiếm, lọc bài viết client-side
  if (searchQuery && allBlogsData) {
    blogs = allBlogsData
      .filter((blog: any) =>
        blog.isPublic !== false &&
        blog.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)
  }

  const total = searchQuery
    ? allBlogsData?.filter((blog: any) =>
      blog.isPublic !== false &&
      blog.title.toLowerCase().includes(searchQuery.toLowerCase())
    ).length || 0
    : data?.meta?.total || 0

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className='bg-gradient-to-b from-[#b7d1d2]/30 to-gray-50 min-h-screen p-3 md:p-6'>
      {/* Header */}
      <header className='container mx-auto mb-6'>
        <div className='bg-white rounded-xl shadow-lg p-4 md:p-6'>
          <Breadcrumb className='mb-2'>
            <BreadcrumbList className='flex items-center gap-[15px]'>
              <BreadcrumbItem>
                <BreadcrumbLink className='font-medium cursor-pointer text-gray-600 text-sm md:text-base hover:text-purple-600 transition-colors'>
                  <a href='/'>Trang chủ</a>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRightIcon className='w-[5px] h-[10.14px] text-gray-600' />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink className='font-medium cursor-pointer text-purple-600 text-sm md:text-base'>
                  <a href='/blogs'>Tin tức</a>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">Tin tức & Bài viết</h1>
          <p className="text-gray-600">
            Khám phá những bài viết mới nhất về nước hoa, xu hướng và bí quyết làm đẹp
          </p>
        </div>
      </header>

      <section className='container mx-auto'>
        <div className='flex flex-col lg:flex-row gap-6'>
          {/* Main content */}
          <div className='flex-1 min-w-0'>
            {/* Featured blogs slider */}
            <SlideshowBlog blogs={blogs} navigate={navigate} />

            {/* Blog listing */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className='text-xl md:text-2xl font-bold flex items-center'>
                  {searchQuery ?
                    `Kết quả tìm kiếm: "${searchQuery}"` :
                    selectedCategory ?
                      `${cateData?.find((cat: any) => cat._id === selectedCategory)?.name || 'Danh mục'}` :
                      'Bài viết mới nhất'}
                  {(selectedCategory || searchQuery) && (
                    <button
                      onClick={() => {
                        setSelectedCategory(null)
                        setSearchTerm('')
                        setSearchQuery('')
                      }}
                      className="ml-3 text-sm font-normal text-gray-500 hover:text-purple-600"
                    >
                      (Xóa bộ lọc)
                    </button>
                  )}
                </h2>
                <div className="text-sm text-gray-500">
                  Hiển thị {blogs.length} / {total} bài viết
                </div>
              </div>

              <BlogList blogs={blogs} fadeInUp={fadeInUp} navigate={navigate} />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className='flex justify-center items-center gap-2 mt-8'>
                  <button
                    className='px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                    disabled={current === 1}
                    onClick={() => setCurrent((c) => Math.max(1, c - 1))}
                  >
                    &lt;
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      className={`px-3 py-2 rounded-lg border ${current === i + 1 ? 'bg-purple-600 text-white' : 'bg-white hover:bg-gray-50'}`}
                      onClick={() => setCurrent(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    className='px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                    disabled={current === totalPages}
                    onClick={() => setCurrent((c) => Math.min(totalPages, c + 1))}
                  >
                    &gt;
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24">
              <BlogCategories onSelectCategory={setSelectedCategory} />
              <Sidebar
                dataIframe={dataIframe}
                searchTerm={searchTerm}
                onSearch={setSearchTerm}
                onSearchSubmit={(e: React.FormEvent) => {
                  e.preventDefault()
                  setSearchQuery(searchTerm)
                  setCurrent(1)
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BlogPage
