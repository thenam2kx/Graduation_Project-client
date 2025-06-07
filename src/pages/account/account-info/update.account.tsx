import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'


const UpdateAccount = () => {
  return (
    <form action="">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cập nhật thông tin</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fullname" className="text-sm font-medium text-gray-700">
              Họ và tên <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullname"
              placeholder="Nhập họ và tên"
              className="h-12 bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Số điện thoại <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              placeholder="Nhập số điện thoại"
              className="h-12 bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <Button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 h-12 font-medium transition-colors"
        >
          Lưu
        </Button>
        <Button
          type="button"
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 h-12 font-medium transition-colors"
        >
          Đóng
        </Button>
      </div>
    </form>
  )
}

export default UpdateAccount
