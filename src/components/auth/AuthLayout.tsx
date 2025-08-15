import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
  imageTitle: string
  imageSubtitle: string
  showSocialLogin?: boolean
}

const AuthLayout = ({ 
  children, 
  title, 
  subtitle, 
  imageTitle, 
  imageSubtitle, 
  showSocialLogin = false 
}: AuthLayoutProps) => {
  return (
    <div className="flex flex-row justify-center items-center w-screen h-screen overflow-hidden p-0 m-0 bg-gradient-to-br from-purple-50 to-pink-50 auth-container">
      <div className="w-full relative flex justify-center items-center">
        <div className="flex shadow-2xl rounded-xl overflow-hidden max-w-7xl w-full">
          {/* Left Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-1/2 h-screen relative overflow-hidden hidden lg:block auth-image-container"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 to-pink-900/40 z-10"></div>
            <img 
              className="w-full h-full object-cover auth-image" 
              alt="Bộ sưu tập nước hoa" 
              src="https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGVyZnVtZXxlbnwwfHwwfHx8MA%3D%3D" 
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-20 text-white"
            >
              <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">{imageTitle}</h2>
              <p className="text-xl drop-shadow-md">{imageSubtitle}</p>
            </motion.div>
          </motion.div>

          {/* Right Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 px-8 lg:px-16 py-10 relative bg-white min-h-screen lg:min-h-0 flex flex-col justify-center auth-form-container"
          >
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-bold text-[#333333] text-2xl lg:text-3xl mb-6 lg:mb-8 auth-heading"
            >
              {title}
            </motion.h1>

            {subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-6 font-normal text-[#666666] text-sm lg:text-base auth-text"
              >
                {subtitle}
              </motion.p>
            )}

            {children}

            {/* Decorative Elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-gradient-to-br from-purple-200/30 to-pink-200/30 blur-md z-0 hidden lg:block auth-decorative"
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout