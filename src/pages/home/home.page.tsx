import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation' // Thêm dòng này
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Fake data
const categoriesWomen = [
  { name: 'Nước hoa nữ cao cấp', desc: 'Khám phá ngay!', img: 'https://placehold.co/270x393?text=Nuoc+hoa+nu+1' },
  { name: 'Nước hoa Pháp', desc: 'Khám phá ngay!', img: 'https://placehold.co/270x393?text=Nuoc+hoa+nu+2' },
  { name: 'Nước hoa mùa hè', desc: 'Khám phá ngay!', img: 'https://placehold.co/270x393?text=Nuoc+hoa+nu+3' },
  { name: 'Gift set nước hoa', desc: 'Khám phá ngay!', img: 'https://placehold.co/270x393?text=Nuoc+hoa+nu+4' },
  { name: 'Nước hoa mùa đông', desc: 'Khám phá ngay!', img: 'https://placehold.co/270x393?text=Nuoc+hoa+nu+5' },
  { name: 'Nước hoa thể thao', desc: 'Khám phá ngay!', img: 'https://placehold.co/270x393?text=Nuoc+hoa+nu+6' }
]

const categoriesMen = [
  { name: 'Nước hoa nam sang trọng', desc: 'Khám phá ngay!', img: 'https://placehold.co/270x393?text=Nuoc+hoa+nam+1' },
  { name: 'Nước hoa Ý', desc: 'Khám phá ngay!', img: 'https://placehold.co/270x393?text=Nuoc+hoa+nam+2' },
  { name: 'Nước hoa thể thao', desc: 'Khám phá ngay!', img: 'https://placehold.co/270x393?text=Nuoc+hoa+nam+3' },
  { name: 'Gift set nam', desc: 'Khám phá ngay!', img: 'https://placehold.co/270x393?text=Nuoc+hoa+nam+4' },
  { name: 'Nước hoa mùa hè', desc: 'Khám phá ngay!', img: 'https://placehold.co/270x393?text=Nuoc+hoa+nam+5' },
  { name: 'Nước hoa mùa đông', desc: 'Khám phá ngay!', img: 'https://placehold.co/270x393?text=Nuoc+hoa+nam+6' }
]

const products = [
  { name: 'Dior Sauvage EDP', brand: 'Dior', price: 2500000, img: 'https://placehold.co/282x370?text=Dior+Sauvage' },
  { name: 'Chanel Bleu', brand: 'Chanel', price: 3200000, img: 'https://placehold.co/282x370?text=Chanel+Bleu' },
  { name: 'Gucci Bloom', brand: 'Gucci', price: 2800000, img: 'https://placehold.co/282x370?text=Gucci+Bloom' },
  { name: 'Versace Eros', brand: 'Versace', price: 2300000, img: 'https://placehold.co/282x370?text=Versace+Eros' },
  { name: 'Dolce & Gabbana Light Blue', brand: 'Dolce & Gabbana', price: 2400000, img: 'https://placehold.co/282x370?text=Dolce+Gabbana+Light+Blue' },
  { name: 'Yves Saint Laurent Black Opium', brand: 'YSL', price: 2700000, img: 'https://placehold.co/282x370?text=YSL+Black+Opium' }
]

const feedbacks = [
  { name: 'Nguyễn Văn A', content: 'Mùi hương rất sang trọng, lưu hương lâu. Sẽ ủng hộ shop dài dài!', img: 'https://placehold.co/58x58?text=A' },
  { name: 'Trần Thị B', content: 'Shop tư vấn nhiệt tình, nước hoa chính hãng, rất hài lòng.', img: 'https://placehold.co/58x58?text=B' },
  { name: 'Lê Văn C', content: 'Đóng gói cẩn thận, giao hàng nhanh, mùi thơm đúng gu!', img: 'https://placehold.co/58x58?text=C' },
  { name: 'Phạm Thị D', content: 'Sản phẩm chất lượng, giá hợp lý, sẽ giới thiệu bạn bè.', img: 'https://placehold.co/58x58?text=D' },
  { name: 'Ngô Văn E', content: 'Mua lần đầu nhưng rất ưng ý, sẽ quay lại mua thêm.', img: 'https://placehold.co/58x58?text=E' },
  { name: 'Đỗ Thị F', content: 'Nước hoa thơm, giá cả phải chăng, giao hàng nhanh chóng.', img: 'https://placehold.co/58x58?text=F' }
]

const brands = [
  { name: 'Dior', img: 'https://placehold.co/149x53?text=Dior' },
  { name: 'Chanel', img: 'https://placehold.co/122x68?text=Chanel' },
  { name: 'Gucci', img: 'https://placehold.co/111x56?text=Gucci' },
  { name: 'Versace', img: 'https://placehold.co/149x49?text=Versace' },
  { name: 'Dolce & Gabbana', img: 'https://placehold.co/149x53?text=Dolce+Gabbana' },
  { name: 'YSL', img: 'https://placehold.co/149x53?text=YSL' },
  { name: 'Armani', img: 'https://placehold.co/149x53?text=Armani' },
  { name: 'Burberry', img: 'https://placehold.co/149x53?text=Burberry' },
  { name: 'Prada', img: 'https://placehold.co/149x53?text=Prada' },
  { name: 'Hermès', img: 'https://placehold.co/149x53?text=Hermès' }
]

const bannerSlides = [
  {
    title: 'Khám phá nước hoa chính hãng',
    desc: 'Nước hoa nam & nữ - Sang trọng, quyến rũ, cá tính',
    img: 'https://placehold.co/400x400?text=Perfume+Banner',
    btn: 'Mua ngay'
  },
  {
    title: 'Ưu đãi mùa hè',
    desc: 'Giảm giá lên đến 30% cho nước hoa hot',
    img: 'https://placehold.co/400x400?text=Summer+Sale',
    btn: 'Xem ngay'
  },
  {
    title: 'Bộ sưu tập mới 2025',
    desc: 'Khám phá mùi hương mới nhất từ các thương hiệu nổi tiếng',
    img: 'https://placehold.co/400x400?text=New+Collection+2025',
    btn: 'Khám phá'
  },
  {
    title: 'Quà tặng đặc biệt',
    desc: 'Tặng kèm gift set cho đơn hàng từ 2 triệu',
    img: 'https://placehold.co/400x400?text=Gift+Set',
    btn: 'Nhận quà'
  }
]

const fashionSlides = [
  {
    left: {
      bg: 'https://placehold.co/400x400?text=Gift+Set',
      title: 'WE MADE YOUR EVERYDAY FASHION BETTER!',
      desc: 'In our journey to improve everyday fashion, euphoria presents EVERYDAY wear range - Comfortable & Affordable fashion 24/7',
      btn: 'Shop Now'
    }
  },
  {
    left: {
      bg: 'https://placehold.co/400x400?text=Gift+Set',
      title: 'NEW SUMMER COLLECTION',
      desc: 'Explore the latest summer trends and stay cool with our new arrivals.',
      btn: 'Explore Now'
    }
  },
  {
    left: {
      bg: 'https://placehold.co/400x400?text=Gift+Set',
      title: 'FASHION FOR EVERY OCCASION',
      desc: 'From casual to formal, find the perfect outfit for any event.',
      btn: 'Shop All'
    }
  }
]

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15 }
  })
}

const HomePage = () => {
  return (
    <div className='bg-white min-h-screen p-3'>
      {/* Banner with Swiper */}
      <section className='container mx-auto rounded-xl p-2 md:p-8 mb-5'>
        <Swiper loop autoplay={{ delay: 3500, disableOnInteraction: false }} pagination={{ clickable: true }} modules={[Autoplay, Pagination]} className='rounded-xl'>
          {bannerSlides.map((slide, idx) => (
            <SwiperSlide key={idx}>
              <div className='flex flex-col md:flex-row items-stretch justify-between bg-gradient-to-r from-purple-600 to-blue-400 rounded-xl p-4 md:p-16 h-92 md:h-[400px] overflow-hidden'>
                <motion.div className='z-10 max-w-xs md:max-w-lg flex flex-col justify-center' initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                  <h2 className='text-white text-xl md:text-5xl font-extrabold mb-4'>{slide.title}</h2>
                  <p className='text-white text-base md:text-xl mb-6'>{slide.desc}</p>
                  <button className='px-4 py-2 md:px-8 md:py-3 bg-white text-purple-700 font-bold rounded-lg shadow hover:bg-purple-700 hover:text-white transition duration-200 transform hover:scale-105 cursor-pointer'>{slide.btn}</button>
                </motion.div>
                <motion.img
                  src={slide.img}
                  alt='Banner'
                  className='w-40 h-40 md:w-80 md:h-80 object-cover rounded-xl shadow-lg z-0 mt-8 md:mt-0 md:ml-8 self-center'
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Categories For Women */}
      <motion.section className='container mx-auto mb-8' initial='hidden' whileInView='visible' viewport={{ once: true }} variants={fadeInUp}>
        <h3 className='text-3xl font-semibold mb-6 ml-1'>Nước hoa dành cho nữ</h3>
        <Swiper
          navigation={{
            nextEl: `.custom-next-women`,
            prevEl: `.custom-prev-women`
          }}
          spaceBetween={24}
          slidesPerView={2}
          breakpoints={{
            1024: { slidesPerView: 4 }
          }}
          modules={[Navigation]}
          className="category-women-swiper relative"
        >
          {categoriesWomen.map((cat, idx) => (
            <SwiperSlide key={idx}>
              <motion.div className='bg-white rounded-xl border-2 border-gray-200 shadow hover:shadow-xl transition p-2 md:p-4 flex flex-col items-center group cursor-pointer' custom={idx} initial='hidden' whileInView='visible' viewport={{ once: true }} variants={fadeInUp}>
                <img src={cat.img} alt={cat.name} className='w-full h-60 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-200 cursor-pointer' />
                <div
                  className='font-bold text-lg mb-1 cursor-pointer text-center line-clamp-2 max-w-[200px] h-12 flex items-center justify-center'
                >
                  {cat.name}
                </div>
                <div className='text-purple-600 font-medium text-sm group-hover:underline transition cursor-pointer line-clamp-2 h-10 flex items-center justify-center text-center max-w-[180px]'>
                  {cat.desc}
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
          {/* Custom navigation buttons */}
          <button className="custom-prev-women absolute top-1/2 -left-4 z-10 bg-white shadow rounded-full p-2 flex items-center justify-center hover:bg-purple-100 transition border border-gray-200 active:scale-90">
            <ChevronLeft size={28} className="text-purple-600" />
          </button>
          <button className="custom-next-women absolute top-1/2 -right-4 z-10 bg-white shadow rounded-full p-2 flex items-center justify-center hover:bg-purple-100 transition border border-gray-200 active:scale-90">
            <ChevronRight size={28} className="text-purple-600" />
          </button>
        </Swiper>
      </motion.section>

      {/* Categories For Men */}
      <motion.section className='container mx-auto mb-8' initial='hidden' whileInView='visible' viewport={{ once: true }} variants={fadeInUp}>
        <h3 className='text-3xl font-semibold mb-6 ml-1'>Nước hoa dành cho nam</h3>
        <Swiper
          navigation={{
            nextEl: `.custom-next-men`,
            prevEl: `.custom-prev-men`
          }}
          spaceBetween={24}
          slidesPerView={2}
          breakpoints={{
            1024: { slidesPerView: 4 }
          }}
          modules={[Navigation]}
          className="category-men-swiper relative"
        >
          {categoriesMen.map((cat, idx) => (
            <SwiperSlide key={idx}>
              <motion.div className='bg-white rounded-xl border-2 border-gray-200 shadow hover:shadow-xl transition p-2 md:p-4 flex flex-col items-center group cursor-pointer' custom={idx} initial='hidden' whileInView='visible' viewport={{ once: true }} variants={fadeInUp}>
                <img src={cat.img} alt={cat.name} className='w-full h-60 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-200 cursor-pointer' />
                <div className='font-bold text-lg mb-1 cursor-pointer text-center line-clamp-2 max-w-[200px] h-12 flex items-center justify-center'>{cat.name}</div>
                <div className='text-purple-600 font-medium text-sm group-hover:underline transition cursor-pointer line-clamp-2 h-10 flex items-center justify-center text-center max-w-[180px]'>
                  {cat.desc}
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
          <button className="custom-prev-men absolute top-1/2 -left-4 z-10 bg-white shadow rounded-full p-2 flex items-center justify-center hover:bg-purple-100 transition border border-gray-200 active:scale-90">
            <ChevronLeft size={28} className="text-purple-600" />
          </button>
          <button className="custom-next-men absolute top-1/2 -right-4 z-10 bg-white shadow rounded-full p-2 flex items-center justify-center hover:bg-purple-100 transition border border-gray-200 active:scale-90">
            <ChevronRight size={28} className="text-purple-600" />
          </button>
        </Swiper>
      </motion.section>

      {/* Fashion Slideshow Section */}
      <section className='container mx-auto mb-8'>
        <Swiper loop autoplay={{ delay: 3500, disableOnInteraction: false }} pagination={{ clickable: true }} modules={[Autoplay, Pagination]}>
          {fashionSlides.map((slide, idx) => (
            <SwiperSlide key={idx}>
              <div className='flex flex-col md:flex-row rounded-xl overflow-hidden shadow-lg bg-white h-120'>
                {/* Left side with image only */}
                <div className='flex-1 flex items-center justify-center bg-yellow-100'>
                  <img src={slide.left.bg} alt={slide.left.title} className='object-cover w-full h-80 md:h-full' style={{ maxWidth: 400 }} />
                </div>
                {/* Right side with text */}
                <div className='flex-1 flex flex-col justify-center p-8 md:p-12'>
                  <h2 className='text-black text-2xl md:text-3xl font-extrabold mb-4'>{slide.left.title}</h2>
                  <p className='text-zinc-700 text-base md:text-lg mb-6'>{slide.left.desc}</p>
                  <button className='px-6 py-2 bg-black text-white font-bold rounded-lg shadow hover:bg-white hover:text-black border border-black transition duration-200 cursor-pointer'>{slide.left.btn}</button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Product Section */}
      <motion.section className='container mx-auto mb-8' initial='hidden' whileInView='visible' viewport={{ once: true }} variants={fadeInUp}>
        <h3 className='text-3xl font-semibold mb-6 ml-1'>Sản phẩm nổi bật</h3>
        <Swiper
          navigation={{
            nextEl: `.custom-next-product`,
            prevEl: `.custom-prev-product`
          }}
          spaceBetween={24}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 }
          }}
          modules={[Navigation]}
          className="product-swiper relative"
        >
          {products.map((prod, idx) => (
            <SwiperSlide key={idx}>
              <motion.div className='bg-white rounded-xl border-2 border-gray-200 shadow hover:shadow-xl transition p-2 md:p-4 flex flex-col items-center group cursor-pointer' custom={idx} initial='hidden' whileInView='visible' viewport={{ once: true }} variants={fadeInUp}>
                <img src={prod.img} alt={prod.name} className='w-full h-32 md:h-60 object-cover rounded-lg mb-2 md:mb-4 group-hover:scale-105 transition-transform duration-200 cursor-pointer' />
                <div
                  className='font-bold text-base mb-1 cursor-pointer text-center line-clamp-2 max-w-[200px] h-12 flex items-center justify-center'
                >
                  {prod.name}
                </div>
                <div className='text-zinc-500 text-sm mb-2 cursor-pointer line-clamp-1 h-6 flex items-center justify-center text-center max-w-[180px]'>
                  {prod.brand}
                </div>
                <div className='bg-neutral-100 rounded-lg px-2 md:px-4 py-1 md:py-2 font-bold text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition cursor-pointer'>{prod.price.toLocaleString()}₫</div>
              </motion.div>
            </SwiperSlide>
          ))}
          <button className="custom-prev-product absolute top-1/2 -left-4 z-10 bg-white shadow rounded-full p-2 flex items-center justify-center hover:bg-purple-100 transition border border-gray-200 active:scale-90">
            <ChevronLeft size={28} className="text-purple-600" />
          </button>
          <button className="custom-next-product absolute top-1/2 -right-4 z-10 bg-white shadow rounded-full p-2 flex items-center justify-center hover:bg-purple-100 transition border border-gray-200 active:scale-90">
            <ChevronRight size={28} className="text-purple-600" />
          </button>
        </Swiper>
      </motion.section>

      {/* Feedback Section */}
      <motion.section className='container mx-auto mb-8' initial='hidden' whileInView='visible' viewport={{ once: true }} variants={fadeInUp}>
        <h3 className='text-3xl font-semibold mb-6 ml-1'>Khách hàng nói gì?</h3>
        <Swiper
          navigation={{
            nextEl: `.custom-next-feedback`,
            prevEl: `.custom-prev-feedback`
          }}
          spaceBetween={24}
          slidesPerView={2}
          breakpoints={{
            1024: { slidesPerView: 4 }
          }}
          modules={[Navigation]}
          className="feedback-swiper relative"
        >
          {feedbacks.map((fb, idx) => (
            <SwiperSlide key={idx}>
              <motion.div className='bg-white rounded-xl border-2 border-gray-200 shadow hover:shadow-xl transition p-6 flex flex-col items-center group cursor-pointer' custom={idx} initial='hidden' whileInView='visible' viewport={{ once: true }} variants={fadeInUp}>
                <img src={fb.img} alt={fb.name} className='w-16 h-16 rounded-full mb-4 border-4 border-purple-100 group-hover:border-purple-600 transition cursor-pointer' />
                <div
                  className='font-bold text-lg mb-2 cursor-pointer text-center line-clamp-2 max-w-[150px] h-12 flex items-center justify-center'
                >
                  {fb.name}
                </div>
                <div className='text-zinc-500 text-sm text-center cursor-pointer line-clamp-3 h-14 flex items-center justify-center'>
                  {fb.content}
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
          <button className="custom-prev-feedback absolute top-1/2 -left-4 z-10 bg-white shadow rounded-full p-2 flex items-center justify-center hover:bg-purple-100 transition border border-gray-200 active:scale-90">
            <ChevronLeft size={28} className="text-purple-600" />
          </button>
          <button className="custom-next-feedback absolute top-1/2 -right-4 z-10 bg-white shadow rounded-full p-2 flex items-center justify-center hover:bg-purple-100 transition border border-gray-200 active:scale-90">
            <ChevronRight size={28} className="text-purple-600" />
          </button>
        </Swiper>
      </motion.section>

      {/* Brand Section */}
      <motion.section className='container mx-auto mb-8' initial='hidden' whileInView='visible' viewport={{ once: true }} variants={fadeInUp}>
        <h3 className='text-3xl font-semibold mb-6 ml-1'>Thương hiệu nổi bật</h3>
        <Swiper
          loop
          slidesPerView={2}
          spaceBetween={24}
          speed={3000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true // Dừng khi hover
          }}
          breakpoints={{
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 6 }
          }}
          modules={[Autoplay]}
          className="brand-swiper"
          style={{ cursor: 'pointer' }}
        >
          {brands.map((brand, idx) => (
            <SwiperSlide key={idx}>
              <motion.div className='bg-white rounded-xl border-2 border-gray-200 shadow hover:shadow-lg transition p-4 flex flex-col items-center group cursor-pointer' custom={idx} initial='hidden' whileInView='visible' viewport={{ once: true }} variants={fadeInUp}>
                <img src={brand.img} alt={brand.name} className='w-36 h-14 object-contain mb-2 group-hover:scale-110 transition-transform duration-200 cursor-pointer' />
                <div
                  className='font-medium text-base cursor-pointer text-center line-clamp-1 max-w-[150px] h-6 flex items-center justify-center'
                >
                  {brand.name}
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.section>
    </div>
  )
}

export default HomePage
