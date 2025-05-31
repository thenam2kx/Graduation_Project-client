const AppFooter = () => {
  return (
    <footer className="w-full bg-neutral-700 text-white py-12 mt-16">
      <div className="container mx-auto flex flex-col md:flex-row justify-between gap-8 px-8">
        <div>
          <div className="text-3xl font-bold mb-4">Location</div>
          <div className="text-lg font-medium">support@euphoria.in</div>
          <div className="text-lg font-medium">Eklingpura Chouraha, Ahmedabad Main Road</div>
          <div className="text-lg font-medium">(NH 8- Near Mahadev Hotel) Udaipur, India- 313002</div>
        </div>
        <div>
          <div className="text-3xl font-bold mb-4">More Info</div>
          <div className="text-lg font-medium">Term and Conditions</div>
          <div className="text-lg font-medium">Privacy Policy</div>
          <div className="text-lg font-medium">Shipping Policy</div>
          <div className="text-lg font-medium">Sitemap</div>
        </div>
        <div>
          <div className="text-3xl font-bold mb-4">Need Help</div>
          <div className="text-lg font-medium">Contact Us</div>
          <div className="text-lg font-medium">Track Order</div>
          <div className="text-lg font-medium">Returns & Refunds</div>
          <div className="text-lg font-medium">FAQ's</div>
          <div className="text-lg font-medium">Career</div>
        </div>
        <div>
          <div className="text-3xl font-bold mb-4">Company</div>
          <div className="text-lg font-medium">About Us</div>
          <div className="text-lg font-medium">euphoria Blog</div>
          <div className="text-lg font-medium">euphoriastan</div>
          <div className="text-lg font-medium">Collaboration</div>
          <div className="text-lg font-medium">Media</div>
        </div>
      </div>
      <div className="text-center mt-8 text-lg font-bold">
        Copyright © 2023 Euphoria Folks Pvt Ltd. All rights reserved.
      </div>
    </footer>
  )
}

export default AppFooter
