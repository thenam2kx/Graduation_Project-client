import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { ChevronRightIcon, HeartIcon, LogOutIcon, PackageIcon, UserIcon, MenuIcon } from 'lucide-react'
import { Outlet, useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { fetchUserAPI } from '@/services/user-service/user.apis'
import { toast } from 'react-toastify'
import { useState } from 'react'

const menuItems = [
  { icon: <PackageIcon className="w-5 h-5" />, label: 'Đơn hàng của tôi' },
  { icon: <HeartIcon className='w-5 h-5' />, label: 'Sản phẩm yêu thích' },
  { icon: <UserIcon className='w-5 h-5' />, label: 'Thông tin tài khoản', active: true },
  { icon: <LogOutIcon className='w-5 h-5' />, label: 'Đăng xuất' }
]

const LayoutAccountPage = () => {
  const { id } = useParams<{ id: string }>()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { data: userInfo } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await fetchUserAPI(id as string)
      if (res.data) {
        return res.data
      } else {
        toast.error('Đã có lỗi sảy ra!')
      }
    }
  })

  return (
    <div className="bg-white flex flex-row justify-center w-full min-h-screen">
      <div className="bg-white w-full max-w-[1440px] relative">
        {/* Breadcrumb navigation - Hidden on mobile */}
        <Breadcrumb className="mt-4 md:mt-10 mx-4 md:ml-[101px] hidden sm:block">
          <BreadcrumbList className="flex items-center gap-[15px]">
            <BreadcrumbItem>
              <BreadcrumbLink className="font-medium text-[#807d7e] text-sm md:text-lg">
                Trang chủ
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRightIcon className="w-[5px] h-[10.14px] text-[#807d7e]" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink className="font-medium text-[#807d7e] text-sm md:text-lg">
                Tài khoản
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRightIcon className="w-[5px] h-[10.14px] text-[#807d7e]" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink className="font-medium text-[#3c4242] text-sm md:text-lg">
                Thông tin tài khoản
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Mobile menu toggle */}
        <div className="sm:hidden flex justify-between items-center p-4 border-b">
          <h1 className="font-bold text-[#3c4242] text-xl">
            Thông tin tài khoản
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden"
          >
            <MenuIcon className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row mt-4 md:mt-[50px] gap-6 lg:gap-0">
          {/* Left sidebar */}
          <div className={`
            w-full lg:w-[304px]
            mx-4 lg:ml-[101px] lg:mx-0
            ${isMobileMenuOpen ? 'block' : 'hidden'}
            lg:block
          `}>
            {/* User greeting */}
            <div className="relative mb-5 p-4 lg:p-0">
              <div className="absolute w-1.5 h-7 bg-[#8a33fd] rounded-[10px] hidden lg:block" />
              <h2 className="lg:ml-[21px] font-bold text-[#3c4242] text-xl md:text-[28px] tracking-[0.56px] leading-[33.5px]">
                Xin chào {userInfo && userInfo.fullName}
              </h2>
              <p className="lg:ml-[21px] font-normal text-[#807d7e] text-sm tracking-[0.28px] leading-[33.5px]">
                Chào mừng bạn đến với tài khoản của mình
              </p>
            </div>

            {/* Navigation menu */}
            <nav className="mt-6 lg:mt-10">
              <ul className="space-y-3 lg:space-y-5">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <div
                      className={`flex items-center gap-[15px] p-3 lg:p-2 rounded-lg lg:rounded-none cursor-pointer hover:bg-gray-50 transition-colors ${
                        item.active
                          ? 'bg-gray-100 lg:bg-[url(/rectangle-748.svg)] lg:bg-[100%_100%] border-l-2 border-[#3c4242]'
                          : ''
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.icon}
                      <span className="font-semibold text-[#807d7e] text-base lg:text-lg">
                        {item.label}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Main content */}
          <div className="flex-1 mx-4 lg:ml-10 lg:mr-[101px]">
            <h1 className="font-bold text-[#3c4242] text-xl md:text-[28px] tracking-[0.56px] leading-[33.5px] text-center lg:text-left hidden lg:block">
              Thông tin tài khoản
            </h1>

            <Outlet />

          </div>
        </div>
      </div>
    </div>
  )
}

export default LayoutAccountPage
