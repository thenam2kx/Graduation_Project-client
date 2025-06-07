import { useQuery } from '@tanstack/react-query'
import { fetchBlogDetail } from '@/apis/apis'
import { useParams, Link } from 'react-router'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { ChevronRightIcon } from 'lucide-react'

const dataIframe = [
  {
    type: 'iframe',
    src: 'https://www.youtube.com/embed/g8TG0bbIYoY',
    height: 180
  }
  // ...thêm các mã nhúng khác nếu muốn
]

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

const RightTopBox = ({ ads }: { ads: typeof adsData }) => (
  <div className="bg-white rounded-xl shadow border p-4 mb-4 flex flex-col items-center justify-center gap-3">
    {ads.map((ad, idx) => (
      <a
        key={idx}
        href={ad.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`w-full flex items-center gap-2 ${ad.bg} rounded p-2 transition`}
      >
        <img
          src={ad.img}
          alt={ad.alt}
          className="w-10 h-10 rounded"
        />
        <div>
          <div className="font-semibold text-sm">{ad.title}</div>
          <div className="text-xs text-gray-500">{ad.desc}</div>
        </div>
      </a>
    ))}
  </div>
)

const Sidebar = ({ dataIframe }: any) => (
  <div className="w-full lg:w-80 flex-shrink-0">
    <div className="flex flex-col gap-4">
      <div className="bg-gray-50 rounded-xl p-4 shadow border">
        <h2 className="font-bold text-lg mb-3">Mã nhúng nổi bật</h2>
        {dataIframe.map((item: any, idx: number) =>
          item.type === 'iframe' ? (
            <div className="mb-4" key={idx}>
              <iframe
                width="100%"
                height={item.height}
                src={item.src}
                title={item.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : null
        )}
      </div>
    </div>
  </div>
)

const BlogDetailPage = () => {
  const { blogId } = useParams()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['blogDetail', blogId],
    queryFn: () => fetchBlogDetail(blogId),
    enabled: !!blogId,
    select: (res) => res.data
  })

  if (isLoading) return <div>Đang tải...</div>
  if (isError || !data) return <div>Không tìm thấy bài viết!</div>

  return (
    <div className="bg-[#b7d1d2] min-h-screen p-3">
      {/* Header + Breadcrumb */}
      <header className="container mx-auto mb-4">
        <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 items-start">
          <Breadcrumb className="hidden sm:block">
            <BreadcrumbList className="flex items-center gap-[15px]">
              <BreadcrumbItem>
                <BreadcrumbLink className="font-medium cursor-pointer text-[#807d7e] text-sm md:text-lg">
                  <Link to="/">Trang chủ</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRightIcon className="w-[5px] h-[10.14px] text-[#807d7e]" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink className="font-medium cursor-pointer text-[#807d7e] text-sm md:text-lg">
                  <Link to="/blogs">Bài viết</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRightIcon className="w-[5px] h-[10.14px] text-[#807d7e]" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink className="font-medium text-[#3c4242] text-sm md:text-lg">
                  {data.title}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <section className="container mx-auto rounded-xl p-2 md:p-8 mb-5 bg-white">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            <article className="bg-white rounded-xl shadow p-4 md:p-8 mb-6">
              <h1 className="text-2xl md:text-4xl font-bold mb-4">{data.title}</h1>
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                <span className="text-sm text-gray-500">
                  {data.author ? `Tác giả: ${data.author}` : ''}
                </span>
                <span className="text-sm text-gray-400">
                  {data.createdAt ? `Ngày đăng: ${new Date(data.createdAt).toLocaleDateString()}` : ''}
                </span>
              </div>
              <img
                src={data.image || 'https://images.unsplash.com/photo-1458538977777-0549b2370168?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyZnVtZXxlbnwwfHwwfHx8MA%3D%3D'}
                alt={data.title}
                className="w-full rounded-xl mb-6 object-cover max-h-96"
              />
              <div className="text-zinc-700 text-base leading-7 mb-8" dangerouslySetInnerHTML={{ __html: data.content }} />
              <div className="text-sm text-gray-400">ID: {data._id}</div>
            </article>
          </div>
          {/* Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <RightTopBox ads={adsData} />
            <Sidebar dataIframe={dataIframe} />
          </div>
        </div>
      </section>
    </div>
  )
}

export default BlogDetailPage
