import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { fetchListBlog } from '@/apis/apis'
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
    height: 180
  },
  {
    type: 'iframe',
    src: 'https://www.youtube.com/embed/g8TG0bbIYoY',
    height: 180
  },
  {
    type: 'iframe',
    src: 'https://www.youtube.com/embed/g8TG0bbIYoY',
    height: 180
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

const SlideshowBlog = ({ blogs }: any) => {
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
                <Link
                  to={`/blogs/${blog._id}`}
                  className='text-purple-700 font-semibold hover:underline text-xs md:text-base'
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

const BlogList = ({ blogs, fadeInUp }: any) => (
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
        <Link
          to={`/blogs/${blog._id}`}
          className='text-purple-700 font-semibold group-hover:underline transition text-xs'
        >
          Xem chi tiết
        </Link>
      </motion.div>
    ))}
  </div>
)

const adsData = [
  {
    href: 'https://shopee.vn/',
    img: 'https://cf.shopee.vn/file/sg-11134004-7rbk6-lq5x6w7v2v3v4a',
    alt: 'Shopee',
    bg: 'hover:bg-orange-50',
    title: 'Mua sắm Shopee',
    desc: 'Ưu đãi mỗi ngày!'
  },
  {
    href: 'https://tiki.vn/',
    img: 'https://salt.tikicdn.com/ts/upload/ab/9c/9c/6c6b6b7b4c7e4e1e8b8e7b7b7b7b7b7b.png',
    alt: 'Tiki',
    bg: 'hover:bg-blue-50',
    title: 'Tiki Siêu Sale',
    desc: 'Freeship toàn quốc'
  },
  {
    href: 'https://www.lazada.vn/',
    img: 'https://icms-image.slatic.net/images/ims-web/2e1e7e2b-6e2e-4e2e-8e2e-2e2e2e2e2e2.png',
    alt: 'Lazada',
    bg: 'hover:bg-indigo-50',
    title: 'Lazada Deal Hot',
    desc: 'Giảm giá đến 50%'
  }
]

const RightTopBox = () => (
  <div className='bg-white rounded-xl shadow border p-4 mb-4 h-56 flex flex-col items-center justify-center gap-3'>
    {adsData.map((ad, idx) => (
      <a
        key={idx}
        href={ad.href}
        target='_blank'
        rel='noopener noreferrer'
        className={`w-full flex items-center gap-2 ${ad.bg} rounded p-2 transition`}
      >
        <img
          src={ad.img}
          alt={ad.alt}
          className='w-10 h-10 rounded'
        />
        <div>
          <div className='font-semibold text-sm'>{ad.title}</div>
          <div className='text-xs text-gray-500'>{ad.desc}</div>
        </div>
      </a>
    ))}
  </div>
)

const Sidebar = ({ dataIframe }: any) => (
  <div className='w-full lg:w-80 flex-shrink-0'>
    <div className='flex flex-col gap-4'>
      <div className='bg-gray-50 rounded-xl p-4 shadow border'>
        <h2 className='font-bold text-lg mb-3'>Mã nhúng nổi bật</h2>
        {dataIframe.map((item: any, idx: number) =>
          item.type === 'iframe' ? (
            <div className='mb-4' key={idx}>
              <iframe
                width='100%'
                height={item.height}
                src={item.src}
                title={item.title}
                frameBorder='0'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
              ></iframe>
            </div>
          ) : null
        )}
      </div>
      {/* Thêm các box nhỏ khác nếu muốn */}
    </div>
  </div>
)

const BlogPage = () => {
  const [current, setCurrent] = useState(1)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['blogs', current],
    queryFn: () => fetchListBlog({ current, pageSize: PAGE_SIZE }),
    select: (res) => res.data,
    keepPreviousData: true
  })

  if (isLoading) return <div>Đang tải...</div>
  if (isError) return <div>Có lỗi xảy ra!</div>

  const blogs = Array.isArray(data?.results) ? data.results : []
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
                  <a href='/blogs'>Bài viết</a>
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
            <SlideshowBlog blogs={blogs} />
          </div>
          <div className='w-full lg:w-80 flex-shrink-0 mt-4 lg:mt-0'>
            <RightTopBox />
          </div>
        </div>
        {/* Main: Danh sách blog + Sidebar */}
        <div className='flex flex-col lg:flex-row gap-6'>
          <div className='flex-1 min-w-0'>
            <h2 className='text-2xl font-bold mb-4'>Bài viết nổi bật</h2>
            <BlogList blogs={blogs} fadeInUp={fadeInUp} />
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
