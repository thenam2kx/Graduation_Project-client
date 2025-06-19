import React from 'react'

const AboutPage = () => {
  return (
    <div className="bg-white text-gray-800 py-12 px-4 md:px-20">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-purple-700 mb-4">VIETPERFUME</h1>
        <p className="text-lg max-w-2xl mx-auto">
          VIETPERFUME là thương hiệu nước hoa hàng đầu tại Việt Nam, chuyên cung cấp những dòng nước hoa cao cấp, chính hãng với hương thơm tinh tế và đẳng cấp.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-center mb-12">
        <div>
          <img
            src="https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1000"
            alt="Perfume"
            className="rounded-2xl shadow-lg h-[500px] w-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-purple-700">Chúng tôi là ai?</h2>
            <p className="text-base text-gray-600 leading-relaxed">
            - Với hơn 10 năm kinh nghiệm, chúng tôi tự hào mang đến những sản phẩm nước hoa được tuyển chọn kỹ lưỡng từ các thương hiệu nổi tiếng trên thế giới. 
            Sự hài lòng của khách hàng là động lực lớn nhất giúp VIETPERFUME không ngừng đổi mới và phát triển.
            </p>
            <p className="text-base text-gray-600 leading-relaxed">
            - Chúng tôi không chỉ cung cấp sản phẩm, mà còn truyền tải giá trị về phong cách, cá tính và cảm xúc thông qua từng mùi hương.
            </p>
            <p className="text-base text-gray-600 leading-relaxed">
            - Đội ngũ của chúng tôi gồm những chuyên gia đam mê và am hiểu sâu sắc về nước hoa, luôn sẵn sàng tư vấn để khách hàng tìm được mùi hương phù hợp nhất với mình.
            </p>
            <p className="text-base text-gray-600 leading-relaxed">
            - VIETPERFUME cam kết mang đến trải nghiệm mua sắm chuyên nghiệp, sản phẩm chất lượng và dịch vụ hậu mãi tận tâm.
            </p>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-center mb-6 text-purple-700">Giá trị cốt lõi</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Chất lượng', desc: 'Cam kết cung cấp sản phẩm chính hãng 100%.' },
            { title: 'Tinh tế', desc: 'Mỗi hương thơm là một nghệ thuật.' },
            { title: 'Khách hàng', desc: 'Luôn đặt trải nghiệm khách hàng lên hàng đầu.' },
          ].map((item, index) => (
            <div key={index} className="p-6 bg-pink-50 rounded-xl shadow">
              <h3 className="text-xl font-bold mb-2 text-purple-600">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4 text-purple-700">Tầm nhìn & Sứ mệnh</h2>
        <p className="max-w-4xl mx-auto text-gray-600 leading-relaxed">
          VIETPERFUME hướng đến trở thành hệ thống phân phối nước hoa hàng đầu Đông Nam Á. Chúng tôi cam kết truyền cảm hứng và sự tự tin cho mọi người thông qua hương thơm – một ngôn ngữ không lời của cảm xúc.
        </p>
      </div>
    </div>
  )
}

export default AboutPage
