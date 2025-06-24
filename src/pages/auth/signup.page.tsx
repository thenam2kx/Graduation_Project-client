import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@radix-ui/react-checkbox'
import authImg from '@/assets/images/auth-img.jpg'
import googleIcon from '@/assets/images/Google.png'
import twitterIcon from '@/assets/images/twitter.png'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { signupAPI } from '@/services/auth-service/auth.apis'
import { createCartAPI } from '@/services/cart-service/cart.apis'

const formSchema = z.object({
  email: z.string().email().min(2, {
    message: 'Email không được để trống.'
  }),

  password: z.string().min(6, {
    message: 'Mật khẩu phải có ít nhất 6 ký tự.'
  })
})

const SignupPage = () => {
  const navigate = useNavigate()

  const createCartMutation = useMutation({
    mutationFn: async (userId: string) => {
      const res = await createCartAPI(userId)
      if (res.data) {
        console.log('Cart created successfully')
      }
    },
    onError: (error) => {
      console.error('Error creating cart:', error)
      toast.error('Không thể tạo giỏ hàng. Vui lòng thử lại.')
    }
  })

  const signupMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = await signupAPI(data)
      if (res.data) {
        return res.data
      } else {
        throw new Error('Đăng ký không thành công. Vui lòng thử lại.')
      }
    },
    onSuccess: (data) => {
      navigate('/verification?email=' + form.getValues('email'), { replace: true } )
      toast.success('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản của bạn.')
      createCartMutation.mutate(data.user._id)
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.log('🚀 ~ SignupPage ~ error:', error)
      toast.error('Đăng ký không thành công. Vui lòng thử lại.')
    }
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    signupMutation.mutate(values)
  }

  return (
    <div className="flex flex-row justify-center w-screen h-screen overflow-hidden p-0 m-0">
      <div className="w-full relative">
        {/* Main Content */}
        <div className="flex">
          {/* Left Image */}
          <div className="flex-1/2 h-[952px] relative">
            <img
              className="w-full h-full object-cover"
              alt="And machines"
              src={authImg}
            />
          </div>

          {/* Right Form */}
          <div className="flex-1/2 mx-[77px] my-[171px]">
            <h1 className="[font-family:'Core_Sans_C-65Bold',Helvetica] font-bold text-[#333333] text-[34px]">
              Đăng ký
            </h1>

            <p className="mt-[42px] [font-family:'Causten-Medium',Helvetica] font-medium text-[#666666cc] text-base">
              Đăng ký miễn phí để truy cập vào bất kỳ sản phẩm nào của chúng tôi
            </p>

            {/* Social Login Buttons */}
            <div className="mt-7 space-y-4">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-lg border border-solid border-[#3c4242]"
              >
                <img className="w-5 h-5" alt="Google" src={googleIcon} />
                <span className="[font-family:'Causten-Medium',Helvetica] font-medium text-[#8a33fd] text-[22px]">
                  Tiếp tục với Google
                </span>
              </Button>

              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-lg border border-solid border-[#3c4242]"
              >
                <img className="w-5 h-5" alt="Twitter" src={twitterIcon} />
                <span className="[font-family:'Causten-Medium',Helvetica] font-medium text-[#8a33fd] text-[22px]">
                  Tiếp tục với Facebook
                </span>
              </Button>
            </div>

            <div className="mt-10">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="example@gmail.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Checkboxes */}
                  <div className="mt-8 space-y-4">
                    <div className="flex items-start gap-3">
                      <Checkbox id="terms" className="mt-1" />
                      <label
                        htmlFor="terms"
                        className="[font-family:'Causten-Medium',Helvetica] font-medium text-[#807d7e] text-sm"
                      >
                        Bằng cách đăng ký, bạn đồng ý với <Link to='/' className="underline">Điều khoản</Link>{' '}
                        và <Link to='/' className="underline">Chính sách bảo mật</Link> của chúng tôi.
                      </label>
                    </div>
                  </div>

                  <Button type="submit" className="mt-10 w-[167px] flex items-center justify-center gap-3 px-5 py-4 bg-[#8a33fd] rounded-lg [font-family:'Causten-Medium',Helvetica] font-medium text-white text-lg">Đăng ký</Button>
                </form>
              </Form>
            </div>

            {/* Login Link */}
            <p className="mt-5 [font-family:'Causten-Regular',Helvetica] font-normal text-[#3c4242] text-base tracking-[0.05px]">
              Bạn đã có tài khoản?{' '}
              <Link to="/signin" className="underline">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
