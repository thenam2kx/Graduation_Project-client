import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema } from '@/validations/contacts'
import instance from '@/config/axios.customize'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { ContactFormProps } from '@/types/contact'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ContactFormProps>({
    resolver: zodResolver(contactSchema)
  })

  const onSubmit = async (data: ContactFormProps) => {
    try {
      await instance.post('/api/v1/contacts', data)
      toast.success('Gửi liên hệ thành công!')
      reset()
    } catch (error) {
      toast.error('Có lỗi xảy ra khi gửi liên hệ. Vui lòng thử lại sau.')
      console.log(error)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="shadow-md rounded-2xl">
        <CardContent className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-purple-700 uppercase">Thông Tin Liên Hệ</h1>
            <p className="text-gray-600 text-sm mt-1">Vui lòng điền đầy đủ thông tin bên dưới</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name">Tên của bạn</Label>
              <Input {...register('name')} id="name" className="bg-gray-100 focus-visible:ring-2 focus-visible:ring-purple-500" placeholder='Nhập tên của bạn'/>
              {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input {...register('email')} id="email" className="bg-gray-100 focus-visible:ring-purple-500 focus-visible:ring-2" placeholder='Nhập email của bạn' />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input {...register('phone')} id="phone" className="bg-gray-100 focus-visible:ring-2 focus-visible:ring-purple-500" placeholder='Nhập số điện thoại của bạn' />
              {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="message">Tin nhắn</Label>
              <Textarea
                {...register('message')}
                id="message"
                className="bg-gray-100 resize-none min-h-[80px] focus-visible:ring-2 focus-visible:ring-purple-500" placeholder='Nhập tin nhắn của bạn'
              />
              {errors.message && <p className="text-sm text-red-600">{errors.message.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md font-medium"
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi liên hệ'}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
