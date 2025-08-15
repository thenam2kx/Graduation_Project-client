/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import googleIcon from '@/assets/images/Google.png'
import twitterIcon from '@/assets/images/twitter.png'
import { Link, useNavigate } from 'react-router'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { forgotPasswordAPI } from '@/services/auth-service/auth.apis'
import { motion } from 'framer-motion'
import { useState } from 'react'


const formSchema = z.object({
  email: z.string().email({ message: 'Email không hợp lệ.' }).min(1, { message: 'Email không được để trống.' })
})

const ForgotPasswordPage = () => {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)

  const sendEmailMutation = useMutation({
    mutationFn: async (data: { email: string }) => {
      const res = await forgotPasswordAPI(data)
      const response = res as IBackendResponse<null>
      if (response.statusCode === 200) {
        return response
      } else {
        throw new Error(response.message.toString() || 'Gửi yêu cầu thất bại.')
      }
    },
    onSuccess: (res, variables) => {
      localStorage.setItem('reset_email', variables.email)
      toast.success((res as IBackendResponse<null>).message.toString())
      navigate(`/verifycode?email=${variables.email}`)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Gửi yêu cầu không thành công. Vui lòng thử lại.')
    }
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (values.email) {
      sendEmailMutation.mutate({ email: values.email })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-4 px-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row shadow-2xl rounded-xl overflow-hidden bg-white">
          {/* Left Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block lg:w-1/2 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 to-pink-900/40 z-10"></div>
            <img className="w-full h-full object-cover" alt="Bộ sưu tập nước hoa" src="https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGVyZnVtZXxlbnwwfHwwfHx8MA%3D%3D" />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-20 text-white"
            >
              <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">Khôi Phục Tài Khoản</h2>
              <p className="text-xl drop-shadow-md">Lấy lại quyền truy cập của bạn</p>
            </motion.div>
          </motion.div>

          {/* Right Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 p-6 lg:p-16 flex flex-col justify-center"
          >
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-bold text-[#333333] text-2xl lg:text-3xl mb-4"
            >
              Quên mật khẩu
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-8 font-normal text-[#666666] text-base lg:text-lg"
            >
              Vui lòng nhập email của bạn để nhận mã xác minh.
            </motion.p>

            {/* Social Login Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-3 px-5 py-3 lg:py-4 rounded-lg border border-solid border-[#3c4242] font-medium text-[#8a33fd] text-lg lg:text-xl hover:bg-purple-50"
              >
                <img className="w-5 h-5" alt="Google" src={googleIcon} />
                Tiếp tục với Google
              </Button>

              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-3 px-5 py-3 lg:py-4 rounded-lg border border-solid border-[#3c4242] font-medium text-[#8a33fd] text-lg lg:text-xl hover:bg-purple-50"
              >
                <img className="w-5 h-5" alt="Twitter" src={twitterIcon} />
                Tiếp tục với Twitter
              </Button>
            </motion.div>

            {/* OR Divider */}
            <div className="flex items-center justify-center my-6">
              <div className="w-[40%] h-[1px] bg-[#66666640]"></div>
              <span className="mx-4 font-normal text-[#666666] text-base lg:text-lg">
                Hoặc
              </span>
              <div className="w-[40%] h-[1px] bg-[#66666640]"></div>
            </div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6"
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-900">Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="example@gmail.com"
                            {...field}
                            className="border-purple-200 focus:border-purple-500 transition-all duration-300 rounded-md py-2"
                          />
                        </FormControl>
                        <FormMessage className="text-pink-600" />
                      </FormItem>
                    )}
                  />

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                  >
                    <Button
                      type="submit"
                      className={`w-full lg:w-48 flex items-center justify-center gap-3 px-5 py-3 lg:py-4 rounded-lg font-medium text-white text-base lg:text-lg transition-all duration-500 ${isHovered ? 'bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg shadow-purple-300' : 'bg-[#8a33fd]'}`}
                      disabled={sendEmailMutation.isPending}
                    >
                      {sendEmailMutation.isPending ? 'Đang gửi...' : 'Gửi mã xác minh'}
                    </Button>
                  </motion.div>
                </form>
              </Form>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6 font-normal text-[#3c4242] text-sm lg:text-base"
              >
                Quay lại{' '}
                <Link to="/signin" className="text-purple-700 underline hover:text-purple-900 transition-colors duration-300">
                  Đăng nhập
                </Link>
              </motion.p>
            </motion.div>

            {/* Decorative Elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-gradient-to-br from-purple-200/30 to-pink-200/30 blur-md z-0 hidden lg:block"
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage