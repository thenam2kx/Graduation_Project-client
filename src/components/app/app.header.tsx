import { Link } from 'react-router'

const AppHeader = () => {
  return (
    <header className='w-full h-28 flex items-center border-b border-stone-300 bg-white px-24'>
      <div className='flex-1 flex items-center'>
        <Link to='/' className="text-neutral-700 text-4xl font-normal font-['Mintaka'] mr-16 hover:text-purple-600 transition">VIETPERFUME</Link>
        <nav className="flex gap-10">
          <Link to="/shop" className="text-neutral-700 text-xl font-bold font-['Causten'] hover:text-purple-600 transition">Cửa hàng</Link>
          <Link to="/men" className="text-zinc-500 text-xl font-medium font-['Causten'] hover:text-purple-600 transition">Nam</Link>
          <Link to="/women" className="text-zinc-500 text-xl font-medium font-['Causten'] hover:text-purple-600 transition">Nữ</Link>
          <Link to="/combos" className="text-zinc-500 text-xl font-medium font-['Causten'] hover:text-purple-600 transition">Bài viết</Link>
          <Link to="/joggers" className="text-zinc-500 text-xl font-medium font-['Causten'] hover:text-purple-600 transition">Giới thiệu</Link>
        </nav>
      </div>
      <div className="mx-4">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="w-96 h-12 px-4 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />
      </div>
      <div className="flex gap-3">
        <button className="p-3 bg-neutral-100 rounded-lg hover:bg-purple-100 transition cursor-pointer">
          <span className="sr-only">Yêu thích</span>
          <i className="fa fa-heart text-zinc-500"></i>
        </button>
        <button className="p-3 bg-neutral-100 rounded-lg hover:bg-purple-100 transition cursor-pointer">
          <span className="sr-only">Giỏ hàng</span>
          <i className="fa fa-shopping-cart text-zinc-500"></i>
        </button>
        <button className="p-3 bg-neutral-100 rounded-lg hover:bg-purple-100 transition cursor-pointer">
          <span className="sr-only">Tài khoản</span>
          <i className="fa fa-user text-zinc-500"></i>
        </button>
      </div>
    </header>
  )
}

export default AppHeader
