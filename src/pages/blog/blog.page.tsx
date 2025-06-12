import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { fetchListBlog, fetchListCateBlog, fetchBlogDetail } from '@/apis/apis'
import { Link } from 'react-router'
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
import { ChevronRightIcon } from 'lucide-react'

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
  // ...thêm các mã nhúng khác nếu muốn
]

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 }
  })
}

const SlideshowBlog = ({ blogs, onSelectBlog }: any) => {
  if (!blogs || blogs.length === 0) return null
  return (
    <div className='w-full bg-white rounded-xl shadow overflow-hidden mb-4'>
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        spaceBetween={12}
        slidesPerView={1}
        className='w-full'
      >
        {blogs.slice(0, 6).map((blog: any) => (
          <SwiperSlide key={blog._id}>
            <div className='flex flex-col md:flex-row items-center'>
              <img
                src={blog.image || 'https://via.placeholder.com/600x300'}
                alt={blog.title}
                className='w-full md:w-[320px] h-40 md:h-56 object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none'
                style={{ maxWidth: '100%', minHeight: '160px', background: '#f3f3f3' }}
              />
              <div className='p-3 md:p-6 flex-1 w-full'>
                <div className='font-bold text-base md:text-xl mb-2 line-clamp-2'>{blog.title}</div>
                <div className='text-zinc-500 text-xs md:text-sm mb-2 line-clamp-3'>
                  {blog.description?.slice(0, 120) ||
                    blog.content?.replace(/<[^>]+>/g, '').slice(0, 120) || ''}
                  ...
                </div>
                <div
                  onClick={() => onSelectBlog(blog._id)}
                  className='text-purple-700 font-semibold hover:underline text-xs md:text-base cursor-pointer'
                >
                  Xem chi tiết
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

const BlogList = ({ blogs, fadeInUp, onSelectBlog }: any) => (
  <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
    {blogs.map((blog: any, idx: number) => (
      <motion.div
        key={blog._id}
        className='bg-white rounded-xl border border-gray-200 shadow p-3 flex flex-col group cursor-pointer h-full'
        custom={idx}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={fadeInUp}
        whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}
        onClick={() => onSelectBlog(blog._id)}
      >
        <img
          src={blog.image || 'https://via.placeholder.com/400x200'}
          alt={blog.title}
          className='w-full h-32 object-cover rounded-lg mb-2'
        />
        <div className='font-bold text-base mb-1 line-clamp-2'>{blog.title}</div>
        <div className='text-zinc-500 text-xs mb-2 line-clamp-2 flex-1'>
          {blog.description?.slice(0, 60) ||
            blog.content?.replace(/<[^>]+>/g, '').slice(0, 60) || ''}
          ...
        </div>
        <div
          className='text-purple-700 font-semibold group-hover:underline transition text-xs cursor-pointer'
        >
          Xem chi tiết
        </div>
      </motion.div>
    ))}
  </div>
)

const BlogCategories = ({ onSelectCategory }: { onSelectCategory: (id: string | null) => void }) => {
  const { data: cateData } = useQuery({
    queryKey: ['blogCategories'],
    queryFn: fetchListCateBlog,
    select: (res) => res.data?.results || []
  })

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Lấy tất cả bài viết
  const { data: allBlogs } = useQuery({
    queryKey: ['allBlogs'],
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
    <div className='bg-white rounded-xl shadow border p-4 mb-4 h-56 flex flex-col'>
      <h3 className='font-bold text-lg mb-3'>Danh mục tin tức</h3>
      <div className='overflow-y-auto flex-1'>
        {cateData?.map((category: any) => {
          const count = allBlogs?.filter((blog: any) =>
            blog.categoryBlogId === category._id && blog.isPublic !== false
          ).length || 0
          return (
            <div
              key={category._id}
              className={`cursor-pointer p-2 mb-1 rounded transition ${selectedCategory === category._id ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'}`}
              onClick={() => handleSelectCategory(category._id)}
            >
              {category.name} ({count})
            </div>
          )
        })}
      </div>

      {selectedCategory && categoryBlogs?.length > 0 && (
        <div className='mt-2 pt-2 border-t'>
          <div className='text-sm font-semibold mb-1'>Bài viết liên quan: ({categoryBlogs.length})</div>
          <div className='text-xs text-purple-600 hover:underline'>
          </div>
        </div>
      )}
    </div>
  )
}

const Sidebar = ({ dataIframe }: any) => (
  <div className='w-full lg:w-80 flex-shrink-0'>
    <div className='flex flex-col gap-4'>
      <div className='bg-gradient-to-br from-white to-purple-50 rounded-xl p-4 shadow-md border border-purple-100'>
        <div className="flex items-center mb-4">
          <div className="w-1 h-6 bg-purple-600 rounded-full mr-2"></div>
          <h2 className='font-bold text-lg text-gray-800'>Mã nhúng nổi bật</h2>
        </div>
        
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
  const [current, setCurrent] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedBlog, setSelectedBlog] = useState<string | null>(null)

  // Lấy danh sách danh mục
  const { data: cateData } = useQuery({
    queryKey: ['blogCategories'],
    queryFn: fetchListCateBlog,
    select: (res) => res.data?.results || []
  })
  
  // Lấy chi tiết bài viết khi chọn
  const { data: blogDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ['blogDetail', selectedBlog],
    queryFn: () => selectedBlog ? fetchBlogDetail(selectedBlog) : null,
    select: (res) => res?.data,
    enabled: !!selectedBlog
  })

  const { data, isLoading, isError } = useQuery({
    queryKey: ['blogs', current],
    queryFn: () => fetchListBlog({
      current,
      pageSize: PAGE_SIZE
    }),
    select: (res) => res.data,
    keepPreviousData: true
  })

  if (isLoading) return <div>Đang tải...</div>
  if (isError) return <div>Có lỗi xảy ra!</div>

  // Filter out blogs where isPublic is false and filter by selected category if any
  const blogs = Array.isArray(data?.results) 
    ? data.results.filter((blog: any) => 
        blog.isPublic !== false && 
        (!selectedCategory || blog.categoryBlogId === selectedCategory)
      ) 
    : []
  const total = data?.meta?.total || 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className='bg-[#b7d1d2] min-h-screen p-3'>
      {/* Header */}
      <header className='container mx-auto mb-4'>
        <div className='bg-white rounded-xl shadow p-4 flex flex-col gap-2 items-start'>
          {/* Breadcrumb */}
          <Breadcrumb className='hidden sm:block'>
            <BreadcrumbList className='flex items-center gap-[15px]'>
              <BreadcrumbItem>
                <BreadcrumbLink className='font-medium cursor-pointer text-[#807d7e] text-sm md:text-lg'>
                  <a href='/'>Trang chủ</a>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRightIcon className='w-[5px] h-[10.14px] text-[#807d7e]' />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink className='font-medium cursor-pointer text-[#807d7e] text-sm md:text-lg'>
                  <a href='/blogs'>Tin tức</a>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <section className='container mx-auto rounded-xl p-2 md:p-8 mb-5 bg-white'>
        {/* Top: Slideshow + Box nhỏ */}
        <div className='flex flex-col lg:flex-row gap-6 mb-8'>
          <div className='flex-1 min-w-0'>
            <SlideshowBlog blogs={blogs} onSelectBlog={setSelectedBlog} />
          </div>
          <div className='w-full lg:w-80 flex-shrink-0 mt-4 lg:mt-0'>
            <BlogCategories onSelectCategory={setSelectedCategory} />
          </div>
        </div>
        {/* Main: Danh sách blog + Sidebar */}
        <div className='flex flex-col lg:flex-row gap-6'>
          <div className='flex-1 min-w-0'>
            <h2 className='text-2xl font-bold mb-4'>
              {selectedCategory ? 
                `Tin tức: ${cateData?.find((cat: any) => cat._id === selectedCategory)?.name || ''}` : 
                'Tin tức nổi bật'}
            </h2>
            {!selectedBlog ? (
              <BlogList blogs={blogs} fadeInUp={fadeInUp} onSelectBlog={setSelectedBlog} />
            ) : isLoadingDetail ? (
              <div className="text-center py-10">Đang tải chi tiết bài viết...</div>
            ) : (
              <div className="bg-white rounded-xl p-4 shadow">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-2xl font-bold">{blogDetail?.title}</h1>
                  <button 
                    onClick={() => setSelectedBlog(null)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                  >
                    Quay lại danh sách
                  </button>
                </div>
                
                {blogDetail?.image && (
                  <img 
                    src={blogDetail.image} 
                    alt={blogDetail.title} 
                    className="w-full max-h-[400px] object-cover rounded-lg mb-4"
                  />
                )}
                
                <div className="text-sm text-gray-500 mb-4">
                  Ngày đăng: {new Date(blogDetail?.createdAt).toLocaleDateString('vi-VN')}
                </div>
                
                {blogDetail?.description && (
                  <div className="text-lg font-medium mb-4 italic">
                    {blogDetail.description}
                  </div>
                )}
                
                <div 
                  className="blog-content max-w-none" 
                  dangerouslySetInnerHTML={{ __html: blogDetail?.content || '' }}
                />
              </div>
            )}
            {/* Pagination */}
            <div className='flex justify-center items-center gap-2 mt-8'>
              <button
                className='px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200'
                disabled={current === 1}
                onClick={() => setCurrent((c) => Math.max(1, c - 1))}
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 rounded border ${current === i + 1 ? 'bg-purple-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                  onClick={() => setCurrent(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className='px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200'
                disabled={current === totalPages}
                onClick={() => setCurrent((c) => Math.min(totalPages, c + 1))}
              >
                &gt;
              </button>
            </div>
          </div>
          <Sidebar dataIframe={dataIframe} />
        </div>
      </section>
    </div>
  )
}

export default BlogPage
