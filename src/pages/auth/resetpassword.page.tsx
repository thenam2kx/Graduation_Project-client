/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link, useLocation, useNavigate } from 'react-router'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { resetPasswordAPI } from '@/services/auth-service/auth.apis'
import { motion } from 'framer-motion'

const formSchema = z
  .object({
    password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' }),
    confirmPassword: z.string().min(6, { message: 'Xác nhận mật khẩu phải có ít nhất 6 ký tự.' })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp.',
    path: ['confirmPassword']
  })

const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const resetState = location.state as { email: string; code: string } | null
  const [email, setEmail] = useState<string>('')
  const [code, setCode] = useState<string>('')
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (!resetState?.email || !resetState?.code) {
      toast.error('Thiếu thông tin đặt lại mật khẩu. Vui lòng thử lại.')
      navigate('/forgot-password')
      return
    }
    setEmail(resetState.email)
    setCode(resetState.code)
  }, [resetState, navigate])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = await resetPasswordAPI({
        email,
        code,
        password: data.password
      })
      return res
    },
    onSuccess: () => {
      toast.success('Đặt lại mật khẩu thành công!')
      navigate('/signin')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Đặt lại mật khẩu thất bại.')
    }
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values)
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
              <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">Mới Bắt Đầu</h2>
              <p className="text-xl drop-shadow-md">Tạo mật khẩu mới an toàn</p>
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
              Đặt lại mật khẩu
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-8 font-normal text-[#666666] text-base lg:text-lg"
            >
              Nhập mật khẩu mới cho tài khoản <strong className="text-purple-700">{email}</strong>.
            </motion.p>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6"
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-900">Mật khẩu mới</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                            className="border-purple-200 focus:border-purple-500 transition-all duration-300 rounded-md py-2"
                          />
                        </FormControl>
                        <FormMessage className="text-pink-600" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-900">Xác nhận mật khẩu</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
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
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
                    </Button>
                  </motion.div>
                </form>
              </Form>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
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

export default ResetPasswordPage
