import { useAppSelector } from '@/redux/hooks'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

const AppHeader = () => {
  const [open, setOpen] = useState(false)
  const [iconMenuOpen, setIconMenuOpen] = useState(false)
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)

  const handleRedirectAccount = () => {
    if (!user) {
      navigate('/signin')
      return
    }
    navigate(`/account/${user._id}`)
  }

  return (
    <header className="w-full h-20 border-b border-stone-300 bg-white px-4 md:px-8 lg:px-24 flex items-center">
      {/* Logo */}
      <Link to='/' className="flex items-center mr-2 md:mr-8">
        <img
          src="https://imagizer.imageshack.com/img923/4443/DdHwew.png"
          alt="VIETPERFUME Logo"
          className="w-30 md:h-12 object-contain"
        />
      </Link>
      {/* Menu */}
      <nav className={`${
        open ? 'flex' : 'hidden'
      } absolute top-20 left-0 w-full bg-white flex-col gap-4 px-4 py-4 shadow md:static md:flex md:flex-row md:gap-10 md:bg-transparent md:shadow-none z-50`}>
        <Link to="/" className="text-neutral-700 text-lg md:text-xl font-bold  hover:text-purple-600 transition">Trang chủ</Link>
        <Link to="/shops" className="text-zinc-500 text-lg md:text-xl font-medium  hover:text-purple-600 transition">Cửa hàng</Link>
        <Link to="/women" className="text-zinc-500 text-lg md:text-xl font-medium  hover:text-purple-600 transition">Danh mục</Link>
        <Link to="/blogs" className="text-zinc-500 text-lg md:text-xl font-medium  hover:text-purple-600 transition">Tin tức</Link>
        <Link to="/joggers" className="text-zinc-500 text-lg md:text-xl font-medium  hover:text-purple-600 transition">Giới thiệu</Link>
      </nav>
      {/* Hamburger menu on mobile */}
      <button
        className="md:hidden ml-auto p-2"
        onClick={() => setOpen(!open)}
        aria-label="Mở menu"
      >
        <i className="fa fa-bars text-2xl text-zinc-700"></i>
      </button>
      {/* Search */}
      <div className="hidden md:block mx-4 flex-shrink-0">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="w-48 md:w-72 lg:w-96 h-10 md:h-12 px-4 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />
      </div>
      {/* Icons */}
      <div className="hidden md:flex gap-2 md:gap-3 ml-2">
        <button className="p-2 md:p-3 bg-neutral-100 rounded-lg hover:bg-purple-100 transition cursor-pointer">
          <span className="sr-only">Yêu thích</span>
          <i className="fa fa-heart text-zinc-500"></i>
        </button>
        <button className="p-2 md:p-3 bg-neutral-100 rounded-lg hover:bg-purple-100 transition cursor-pointer">
          <span className="sr-only">Giỏ hàng</span>
          <i className="fa fa-shopping-cart text-zinc-500"></i>
        </button>
        <button className="p-2 md:p-3 bg-neutral-100 rounded-lg hover:bg-purple-100 transition cursor-pointer" onClick={handleRedirectAccount}>
          <span className="sr-only">Tài khoản</span>
          <i className="fa fa-user text-zinc-500"></i>
        </button>
      </div>
      {/* Nút menu icon trên mobile */}
      <div className="md:hidden ml-2 relative">
        <button
          className="p-2 bg-neutral-100 rounded-lg hover:bg-purple-100 transition cursor-pointer"
          onClick={() => setIconMenuOpen(!iconMenuOpen)}
          aria-label="Mở menu icon"
        >
          <i className="fa fa-ellipsis-v text-zinc-700"></i>
        </button>
        {iconMenuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg flex flex-col z-50">
            <button className="p-3 hover:bg-purple-100 transition flex items-center gap-2">
              <i className="fa fa-heart text-zinc-500"></i>
              <span>Yêu thích</span>
            </button>
            <button className="p-3 hover:bg-purple-100 transition flex items-center gap-2">
              <i className="fa fa-shopping-cart text-zinc-500"></i>
              <span>Giỏ hàng</span>
            </button>
            <button className="p-3 hover:bg-purple-100 transition flex items-center gap-2">
              <i className="fa fa-user text-zinc-500"></i>
              <span>Tài khoản</span>
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default AppHeader
