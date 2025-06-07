import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAppSelector } from '@/redux/hooks'
import { fetchAllAddressByUserAPI } from '@/services/user-service/user.apis'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'

const AddressCard = () => {
  const userInfo = useAppSelector((state) => state.auth.user)
  const { data: listAddress } = useQuery({
    queryKey: ['FETCH_ALL_ADDRESS_BY_USER', userInfo?._id],
    queryFn: async () => {
      const res = await fetchAllAddressByUserAPI(userInfo?._id as string)
      if (res.data) {
        return res.data
      } else {
        toast.error('Đã có lỗi sảy ra!')
      }
    }
  })
  console.log('🚀 ~ AddressCard ~ listAddress:', listAddress)


  return (
    <section className="w-full grid grid-cols-1 gap-4 lg:gap-6">
      {listAddress?.map((address: IAddress) => (
        <Card key={address._id} className="bg-[#f6f6f6] border-none rounded-xl">
          <CardContent className="p-4">
            <div className="space-y-3 lg:space-y-5">
              <p className="font-semibold text-[#3c4242] text-lg">
                {address.address}, {address.ward}, {address.district}, {address.province}
              </p>

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  className="px-3 py-1 h-auto font-semibold text-[#3c4242] text-sm lg:text-base"
                >
                  Sửa
                </Button>
                <Button
                  variant="link"
                  className="px-3 py-1 h-auto font-semibold text-[#3c4242] text-sm lg:text-base"
                >
                  Xóa
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}

export default AddressCard
