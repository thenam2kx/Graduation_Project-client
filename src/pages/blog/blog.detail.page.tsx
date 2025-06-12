import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router'
import { BLOG_KEYS } from '@/services/blog-service/blog.keys'
import { fetchBlogDetail, fetchListBlog } from '@/services/blog-service/blog.apis'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { ChevronRightIcon, Calendar, Clock, Tag, Share2, Facebook, Twitter, Linkedin, Copy, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6 }
  }
}

const BlogDetailPage = () => {
  const { blogId } = useParams()
  const navigate = useNavigate()

  // Fetch blog detail
  const { data: blogDetail, isLoading, isError } = useQuery({
    queryKey: [BLOG_KEYS.FETCH_BLOG_DETAIL, blogId],
    queryFn: () => fetchBlogDetail(blogId as string),
    select: (res) => res?.data,
    enabled: !!blogId
  })

  // Fetch related blogs
  const { data: relatedBlogs } = useQuery({
    queryKey: [BLOG_KEYS.FETCH_LIST_BLOG, 'related', blogDetail?.categoryBlogId],
    queryFn: () => fetchListBlog({
      pageSize: 3,
      categoryBlogId: blogDetail?.categoryBlogId,
      exclude: blogId
    }),
    select: (res) => res.data?.results?.filter((blog: any) => blog._id !== blogId) || [],
    enabled: !!blogDetail?.categoryBlogId
  })

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [blogId])

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  )

  if (isError || !blogDetail) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau!</p>
        <p className="mt-2">ID bài viết: {blogId}</p>
      </div>
    </div>
  )

  // Format date
  const formattedDate = new Date(blogDetail.createdAt).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

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
                <BreadcrumbLink className='font-medium cursor-pointer text-gray-600 text-sm md:text-base hover:text-purple-600 transition-colors'>
                  <a href='/blogs'>Tin tức</a>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRightIcon className='w-[5px] h-[10.14px] text-gray-600' />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink className='font-medium cursor-pointer text-purple-600 text-sm md:text-base truncate max-w-[200px]'>
                  {blogDetail.title}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <button
            onClick={() => navigate('/blogs')}
            className="flex items-center text-purple-600 hover:text-purple-700 transition-colors mb-2"
          >
            <ArrowLeft size={16} className="mr-1" />
            <span>Quay lại danh sách</span>
          </button>
        </div>
      </header>

      <div className='container mx-auto'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Main content */}
          <motion.div
            className='flex-1 min-w-0'
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className='bg-white rounded-xl shadow-lg overflow-hidden mb-8'>
              {/* Blog header */}
              <div className="relative">
                <img
                  src={blogDetail.image || 'https://via.placeholder.com/1200x600'}
                  alt={blogDetail.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                {blogDetail.categoryBlogName && (
                  <div className="absolute top-4 left-4 bg-purple-600 text-white text-xs px-3 py-1.5 rounded-full">
                    {blogDetail.categoryBlogName}
                  </div>
                )}
              </div>

              <div className="p-4 md:p-8">
                <h1 className="text-2xl md:text-4xl font-bold mb-4">{blogDetail.title}</h1>

                <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1.5" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1.5" />
                    <span>5 phút đọc</span>
                  </div>
                  {blogDetail.categoryBlogName && (
                    <div className="flex items-center">
                      <Tag size={16} className="mr-1.5" />
                      <span>{blogDetail.categoryBlogName}</span>
                    </div>
                  )}
                </div>

                {blogDetail.description && (
                  <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6 italic text-gray-700">
                    {blogDetail.description}
                  </div>
                )}

                {/* Blog content */}
                <div
                  className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-a:text-purple-600 prose-img:rounded-lg"
                  dangerouslySetInnerHTML={{ __html: blogDetail.content || '' }}
                />

                {/* Share buttons */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-gray-700 font-medium flex items-center">
                      <Share2 size={16} className="mr-1.5" />
                      Chia sẻ:
                    </span>
                    <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                      <Facebook size={16} />
                    </button>
                    <button className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors">
                      <Twitter size={16} />
                    </button>
                    <button className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors">
                      <Linkedin size={16} />
                    </button>
                    <button className="p-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors">
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Related blogs */}
            {relatedBlogs && relatedBlogs.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl md:text-2xl font-bold mb-4 flex items-center">
                  <div className="w-1 h-6 bg-purple-600 rounded-full mr-2"></div>
                  Bài viết liên quan
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedBlogs.map((blog: any) => (
                    <div
                      key={blog._id}
                      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                      onClick={() => navigate(`/blogs/${blog._id}`)}
                    >
                      <div className="relative">
                        <img
                          src={blog.image || 'https://via.placeholder.com/400x200'}
                          alt={blog.title}
                          className="w-full h-48 object-cover"
                        />
                        {blog.categoryBlogName && (
                          <div className="absolute top-3 right-3 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                            {blog.categoryBlogName}
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2 line-clamp-2 hover:text-purple-700 transition-colors">
                          {blog.title}
                        </h3>
                        <div className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {blog.description?.slice(0, 100) ||
                            blog.content?.replace(/<[^>]+>/g, '').slice(0, 100) || ''}
                          ...
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar size={14} className="mr-1" />
                          <span>{new Date(blog.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24">
              {/* Author info */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 mb-6">
                <h3 className='font-bold text-lg mb-4 flex items-center'>
                  <div className="w-1 h-6 bg-purple-600 rounded-full mr-2"></div>
                  Tác giả
                </h3>
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-purple-600">
                      {(blogDetail.author?.name || 'Admin').charAt(0)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold">{blogDetail.author?.name || 'Admin'}</h4>
                    <p className="text-sm text-gray-600">Biên tập viên</p>
                  </div>
                </div>
              </div>

              {/* Popular tags */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 mb-6">
                <h3 className='font-bold text-lg mb-4 flex items-center'>
                  <div className="w-1 h-6 bg-purple-600 rounded-full mr-2"></div>
                  Tags phổ biến
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-purple-100 hover:text-purple-700 cursor-pointer transition-colors">
                    Nước hoa
                  </span>
                  <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-purple-100 hover:text-purple-700 cursor-pointer transition-colors">
                    Mùi hương
                  </span>
                  <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-purple-100 hover:text-purple-700 cursor-pointer transition-colors">
                    Xu hướng
                  </span>
                  <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-purple-100 hover:text-purple-700 cursor-pointer transition-colors">
                    Làm đẹp
                  </span>
                  <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-purple-100 hover:text-purple-700 cursor-pointer transition-colors">
                    Thương hiệu
                  </span>
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg p-4 text-white">
                <h3 className='font-bold text-lg mb-3'>Đăng ký nhận tin</h3>
                <p className="text-sm mb-4 text-white/90">
                  Nhận thông báo về bài viết mới và khuyến mãi đặc biệt
                </p>
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="w-full h-10 px-4 rounded-lg mb-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="w-full py-2 bg-white text-purple-700 font-medium rounded-lg hover:bg-purple-100 transition-colors">
                  Đăng ký
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogDetailPage
