import { X, ShoppingBag, Heart, User, LogOut } from 'lucide-react';

const WishlistPage = () => {
  return (
    <div className="flex flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 gap-6">
      {/* Sidebar menu (mobile hidden, desktop visible) */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:space-y-6 text-sm text-gray-600">
        <h2 className="text-purple-700 font-semibold border-l-4 border-purple-700 pl-2 mb-4">Hello Jhanvi</h2>
        <p className="mb-8 text-gray-400">Welcome to your Account</p>
        <nav className="space-y-1" aria-label="Sidebar">
          <a href="#" className="flex items-center px-4 py-2 rounded-md hover:bg-purple-100 cursor-pointer gap-3">
            <ShoppingBag className="text-gray-400" size={20} />
            My orders
          </a>
          <a href="#" className="flex items-center px-4 py-2 rounded-md bg-purple-100 text-purple-700 font-semibold cursor-default gap-3" aria-current="page">
            <Heart className="text-purple-700" size={20} />
            Wishlist
          </a>
          <a href="#" className="flex items-center px-4 py-2 rounded-md hover:bg-purple-100 cursor-pointer gap-3">
            <User className="text-gray-400" size={20} />
            My info
          </a>
          <a href="#" className="flex items-center px-4 py-2 rounded-md hover:bg-purple-100 cursor-pointer gap-3">
            <LogOut className="text-gray-400" size={20} />
            Sign out
          </a>
        </nav>
      </aside>

      {/* Wishlist Content */}
      <main className="flex-1 bg-white rounded-lg shadow p-6">
        <h1 className="text-lg font-semibold mb-6">Wishlist</h1>
        <ul className="divide-y divide-gray-200">
          {/* Each wishlist item */}
          <li className="flex items-center py-4 flex-wrap md:flex-nowrap gap-4">
            <button aria-label="Remove Blue Flower Print Crop Top" className="text-gray-400 hover:text-red-500 self-start md:self-auto cursor-pointer">
              <X />
            </button>
            <img
              src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/0299505b-9155-4460-9597-934db4e70fbd.png"
              alt="Blue Flower Print Crop Top"
              className="w-20 h-20 rounded-md object-cover"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold truncate">Blue Flower Print Crop Top</h2>
              <p className="text-gray-600 text-xs mt-1">
                Color : <span className="font-semibold">Yellow</span>
              </p>
              <p className="text-gray-600 text-xs">
                Quantity : <span className="font-semibold">1</span>
              </p>
            </div>
            <p className="w-16 text-right font-semibold">$29.00</p>
            <button className="bg-purple-600 text-white px-4 py-1 rounded-md text-sm hover:bg-purple-700 transition">Add to cart</button>
          </li>

          <li className="flex items-center py-4 flex-wrap md:flex-nowrap gap-4">
            <button aria-label="Remove Yellow Flower Print Dress" className="text-gray-400 hover:text-red-500 self-start md:self-auto cursor-pointer">
              <X />
            </button>
            <img
              src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/385688a4-f979-46d8-9a1f-6be57ef1b371.png"
              alt="Yellow Flower Print Dress"
              className="w-20 h-20 rounded-md object-cover"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold truncate">Yellow Flower Print Dress</h2>
              <p className="text-gray-600 text-xs mt-1">
                Color : <span className="font-semibold">Yellow</span>
              </p>
              <p className="text-gray-600 text-xs">
                Quantity : <span className="font-semibold">1</span>
              </p>
            </div>
            <p className="w-16 text-right font-semibold">$78.00</p>
            <button className="bg-purple-600 text-white px-4 py-1 rounded-md text-sm hover:bg-purple-700 transition">Add to cart</button>
          </li>

          <li className="flex items-center py-4 flex-wrap md:flex-nowrap gap-4">
            <button aria-label="Remove White Hoodie long sleeve" className="text-gray-400 hover:text-red-500 self-start md:self-auto cursor-pointer">
              <X />
            </button>
            <img
              src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/32ec529c-e732-40f0-a988-9177648d1d02.png"
              alt="White Hoodie long sleeve"
              className="w-20 h-20 rounded-md object-cover"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold truncate">White Hoodie long sleeve</h2>
              <p className="text-gray-600 text-xs mt-1">
                Color : <span className="font-semibold">White</span>
              </p>
              <p className="text-gray-600 text-xs">
                Quantity : <span className="font-semibold">1</span>
              </p>
            </div>
            <p className="w-16 text-right font-semibold">$134.00</p>
            <button className="bg-purple-600 text-white px-4 py-1 rounded-md text-sm hover:bg-purple-700 transition">Add to cart</button>
          </li>

          <li className="flex items-center py-4 flex-wrap md:flex-nowrap gap-4">
            <button aria-label="Remove Brown men’s long sleeve T-shirt" className="text-gray-400 hover:text-red-500 self-start md:self-auto cursor-pointer">
              <X />
            </button>
            <img
              src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/86c0434b-fac7-4041-a087-8d4e6bf6f68f.png"
              alt="Brown men’s long sleeve T-shirt"
              className="w-20 h-20 rounded-md object-cover"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold truncate">Brown men’s long sleeve T-shirt</h2>
              <p className="text-gray-600 text-xs mt-1">
                Color : <span className="font-semibold">Brown</span>
              </p>
              <p className="text-gray-600 text-xs">
                Quantity : <span className="font-semibold">1</span>
              </p>
            </div>
            <p className="w-16 text-right font-semibold">$93.00</p>
            <button className="bg-purple-600 text-white px-4 py-1 rounded-md text-sm hover:bg-purple-700 transition">Add to cart</button>
          </li>
        </ul>
      </main>
    </div>
  );
};

export default WishlistPage;
