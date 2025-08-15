/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link, useNavigate } from 'react-router'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { verifyForgotPasswordCodeAPI } from '@/services/auth-service/auth.apis'
import { motion } from 'framer-motion'

const formSchema = z.object({
  code: z
    .string()
    .min(6, { message: 'Mã xác minh phải có 6 ký tự.' })
    .max(6, { message: 'Mã xác minh phải có 6 ký tự.' })
})

const VerifyCodePage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState<string>('')
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const storedEmail = localStorage.getItem('reset_email')
    if (!storedEmail) {
      setTimeout(() => {
        toast.error('Không tìm thấy email. Vui lòng nhập lại.')
        navigate('/forgot-password')
      }, 0)
    } else {
      setEmail(storedEmail)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: ''
    }
  })

  const verifyCodeMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = await verifyForgotPasswordCodeAPI({ email, code: data.code })
      return res
    },
    onSuccess: (_, variables) => {
      toast.success('Xác minh thành công! Vui lòng đặt lại mật khẩu.')
      navigate('/reset-password', {
        state: {
          email,
          code: variables.code
        }
      })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Xác minh thất bại. Vui lòng thử lại.')
    }
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    verifyCodeMutation.mutate(values)
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
              <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">Xác Minh Bảo Mật</h2>
              <p className="text-xl drop-shadow-md">Bảo vệ tài khoản của bạn</p>
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
              Xác minh mã
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-8 font-normal text-[#666666] text-base lg:text-lg"
            >
              Nhập mã xác minh đã được gửi đến email <strong className="text-purple-700">{email}</strong>.
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
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-900">Mã xác minh</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập mã gồm 6 chữ số"
                            {...field}
                            className="border-purple-200 focus:border-purple-500 transition-all duration-300 rounded-md py-2 text-center text-lg tracking-widest"
                            maxLength={6}
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
                      disabled={verifyCodeMutation.isPending}
                    >
                      {verifyCodeMutation.isPending ? 'Đang xác minh...' : 'Xác minh'}
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
                Bạn chưa nhận được mã?{' '}
                <Link to="/forgot-password" className="text-purple-700 underline hover:text-purple-900 transition-colors duration-300">
                  Gửi lại
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

export default VerifyCodePage
