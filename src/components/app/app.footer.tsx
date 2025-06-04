const AppFooter = () => {
  return (
    <footer className="w-full bg-neutral-700 text-white py-8 md:py-12 mt-5">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-4 md:px-8 border-b border-neutral-500 pb-8">
        <div>
          <div className="text-2xl md:text-3xl font-bold mb-4 text-purple-300">Location</div>
          <div className="text-base md:text-lg font-medium">support@euphoria.in</div>
          <div className="text-base md:text-lg font-medium">Eklingpura Chouraha, Ahmedabad Main Road</div>
          <div className="text-base md:text-lg font-medium">(NH 8- Near Mahadev Hotel) Udaipur, India- 313002</div>
        </div>
        <div>
          <div className="text-2xl md:text-3xl font-bold mb-4 text-purple-300">More Info</div>
          <div className="text-base md:text-lg font-medium hover:text-purple-200 cursor-pointer transition">Term and Conditions</div>
          <div className="text-base md:text-lg font-medium hover:text-purple-200 cursor-pointer transition">Privacy Policy</div>
          <div className="text-base md:text-lg font-medium hover:text-purple-200 cursor-pointer transition">Shipping Policy</div>
          <div className="text-base md:text-lg font-medium hover:text-purple-200 cursor-pointer transition">Sitemap</div>
        </div>
        <div>
          <div className="text-2xl md:text-3xl font-bold mb-4 text-purple-300">Need Help</div>
          <div className="text-base md:text-lg font-medium hover:text-purple-200 cursor-pointer transition">Contact Us</div>
          <div className="text-base md:text-lg font-medium hover:text-purple-200 cursor-pointer transition">Track Order</div>
          <div className="text-base md:text-lg font-medium hover:text-purple-200 cursor-pointer transition">Returns & Refunds</div>
          <div className="text-base md:text-lg font-medium hover:text-purple-200 cursor-pointer transition">FAQ's</div>
          <div className="text-base md:text-lg font-medium hover:text-purple-200 cursor-pointer transition">Career</div>
        </div>
        <div>
          <div className="text-2xl md:text-3xl font-bold mb-4 text-purple-300">Company</div>
          <div className="text-base md:text-lg font-medium hover:text-purple-200 cursor-pointer transition">About Us</div>
          <div className="text-base md:text-lg font-medium hover:text-purple-200 cursor-pointer transition">euphoria Blog</div>
          <div className="text-base md:text-lg font-medium hover:text-purple-200 cursor-pointer transition">euphoriastan</div>
          <div className="text-base md:text-lg font-medium hover:text-purple-200 cursor-pointer transition">Collaboration</div>
          <div className="text-base md:text-lg font-medium hover:text-purple-200 cursor-pointer transition">Media</div>
        </div>
      </div>
      <div className="text-center mt-8 text-base md:text-lg font-bold">
        Copyright © 2025 VIETPE Folks Pvt Ltd. All rights reserved.
      </div>
    </footer>
  )
}

export default AppFooter
