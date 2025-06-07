import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useParams } from 'react-router'
import AccountAddress from './address.card'
import { useQuery } from '@tanstack/react-query'
import { fetchUserAPI } from '@/services/user-service/user.apis'
import { toast } from 'react-toastify'

const AccountPage = () => {
  const { id } = useParams<{ id: string }>()

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
    <>
      <h2 className="mt-4 lg:mt-5 font-bold text-[#3c4242] text-lg md:text-[22px] tracking-[0.44px] leading-[33.5px]">
        Thông tin liên hệ
      </h2>

      {/* Contact Information Sections */}
      <div className="space-y-4 lg:space-y-6">
        {/* Full Name Section */}
        <section className="w-full py-3 lg:py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 sm:gap-0">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-base lg:text-lg text-[#807d7e]">
                Họ và tên
              </label>
              <span className="font-semibold text-base lg:text-lg text-[#3c4242]">
                {userInfo && userInfo.fullName}
              </span>
            </div>
            <Button
              variant="link"
              className="font-semibold text-sm text-[#3c4242] p-0 h-auto self-start sm:self-auto"
            >
              Sửa
            </Button>
          </div>
        </section>

        <Separator className="my-2" />

        {/* Phone Section */}
        <section className="w-full py-3 lg:py-4">
          <Card className="border-none shadow-none">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 sm:gap-0">
                <div className="flex flex-col gap-2">
                  <span className="text-[#807d7e] font-semibold text-base lg:text-lg">
                    Số điện thoại
                  </span>
                  <span className="text-[#3c4242] font-semibold text-base lg:text-lg">
                    {userInfo && userInfo.phone}
                  </span>
                </div>
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold text-[#3c4242] text-sm self-start sm:self-auto"
                >
                  Sửa
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-2" />

        {/* Email Section */}
        <div className="w-full py-3 lg:py-4">
          <div className="flex flex-col space-y-2">
            <span className="font-semibold text-[#807d7e] text-base lg:text-lg">
              Email
            </span>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-[#3c4242] text-base lg:text-lg break-all">
                {userInfo && userInfo.email}
              </span>
            </div>
          </div>
        </div>

        <Separator className="my-2" />

        {/* Address Section Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
          <h2 className="font-bold text-[#3c4242] text-lg md:text-[22px] tracking-[0.44px] leading-[33.5px]">
            Địa chỉ
          </h2>
          <Button
            variant="ghost"
            className="font-semibold text-[#3c4242] text-sm lg:text-lg self-start sm:self-auto"
          >
            Thêm mới
          </Button>
        </div>

        {/* Address Component */}
        <div className="w-full">
          <AccountAddress />
        </div>
      </div>
    </>
  )
}

export default AccountPage
