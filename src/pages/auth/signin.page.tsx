import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import authImg from '@/assets/images/auth-img.jpg'
import googleIcon from '@/assets/images/Google.png'
import twitterIcon from '@/assets/images/twitter.png'
import { Link, useNavigate } from 'react-router'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { signinAPI } from '@/services/auth-service/auth.apis'
import { useAppDispatch } from '@/redux/hooks'
import { setAccessToken, setStateSignin } from '@/redux/slices/auth.slice'


const formSchema = z.object({
  email: z.string().email().min(2, {
    message: 'Email không được để trống.'
  }),

  password: z.string().min(6, {
    message: 'Mật khẩu phải có ít nhất 6 ký tự.'
  })
})


const SigninPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const signinMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = await signinAPI(data)
      if (res.data) {
        return res.data
      } else {
        throw new Error('Đăng nhập không thành công. Vui lòng thử lại.')
      }
    },
    onSuccess: (data: IAuth) => {
      dispatch(setStateSignin(true))
      dispatch(setAccessToken(data.access_token))
      toast.success('Đăng nhập thành công!')
      navigate('/')
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.log('🚀 ~ SigninPage ~ error:', error)
      toast.error('Đăng nhập không thành công. Vui lòng thử lại.')
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
    signinMutation.mutate(values)
  }

  return (
    <div className="flex flex-row justify-center w-screen h-screen overflow-hidden p-0 m-0">
      <div className="w-full relative">
        {/* Main Content */}
        <div className="flex">
          {/* Left Image */}
          <div className="flex-1/2 h-screen relative">
            <img className="w-full h-full object-cover" alt="Fashion models" src={authImg} />
          </div>
          {/* Right Sign In Form */}
          <div className="flex-1/2 mx-[77px] mt-[171px]">
            <h1 className="[font-family:'Core_Sans_C-65Bold',Helvetica] font-bold text-[#333333] text-[34px] tracking-[0.68px]">
              Đăng nhập
            </h1>
            <div className="mt-[83px]">
              {/* Social Login Buttons */}
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-lg border border-solid border-[#3c4242] [font-family:'Causten-Medium',Helvetica] font-medium text-[#8a33fd] text-[22px]"
              >
                <img className="w-5 h-5" alt="Google" src={googleIcon} />
                Tiếp tục với Google
              </Button>
              <Button
                variant="outline"
                className="w-full mt-[30px] flex items-center justify-center gap-3 px-5 py-4 rounded-lg border border-solid border-[#3c4242] [font-family:'Causten-Medium',Helvetica] font-medium text-[#8a33fd] text-[22px]"
              >
                <img className="w-5 h-5" alt="Twitter" src={twitterIcon} />
                Tiếp tục với Twitter
              </Button>
              {/* OR Divider */}
              <div className="flex items-center justify-center mt-[30px]">
                <Separator className="w-[248px] bg-[#66666640]" />
                <span className="mx-5 [font-family:'Core_Sans_C-45Regular',Helvetica] font-normal text-[#666666] text-lg">
                  Hoặc
                </span>
                <Separator className="w-[248px] bg-[#66666640]" />
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

                    <div className="flex justify-end mt-2">
                      <Link
                        to="#"
                        className="[font-family:'Causten-Regular',Helvetica] font-normal text-[#3c4242] text-base underline"
                      >
                        Quên mật khẩu?
                      </Link>
                    </div>

                    <Button type="submit" className="mt-10 w-[167px] flex items-center justify-center gap-3 px-5 py-4 bg-[#8a33fd] rounded-lg [font-family:'Causten-Medium',Helvetica] font-medium text-white text-lg">
                      Đăng nhập
                    </Button>
                  </form>
                </Form>

                <p className="mt-[20px] [font-family:'Causten-Regular',Helvetica] font-normal text-[#3c4242] text-base">
                  Chưa có tài khoản?{' '}
                  <Link to="/signup" className="underline">
                    Đăng ký
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SigninPage
