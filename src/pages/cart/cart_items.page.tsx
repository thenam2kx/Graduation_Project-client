import React from 'react'
import { Trash2, Plus, Minus, Heart } from 'lucide-react'
import { motion } from 'framer-motion'

interface CartItemProps {
  item: CartItemWithProduct
  onIncrease: (id: string) => void
  onDecrease: (id: string) => void
  onRemove: (id: string) => void
}

export interface CartItemWithProduct {
  cart_item: { _id: string; variantId: string; quantity: number; price: number }
  product: { _id: string; title: string; author: string; image: string; category: string }
}

const CartItem: React.FC<CartItemProps> = ({ item, onIncrease, onDecrease, onRemove }) => {
  const { cart_item, product } = item
  const { quantity, price, _id } = cart_item
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <div 
      className="p-6 transition-all duration-300 border-b border-gray-100 last:border-b-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Product Image */}
        <div className="relative flex-shrink-0">
          <div className="relative group">
            <img 
              src={product.image || 'https://via.placeholder.com/150x200?text=No+Image'} 
              alt={product.title} 
              className="w-full sm:w-24 h-32 object-cover rounded-xl shadow-sm" 
            />
            <motion.div 
              className="absolute inset-0 bg-black bg-opacity-40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 0.05 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-white font-medium">Xem</div>
            </motion.div>
          </div>
        </div>
        
        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row justify-between">
            <div>
              <h3 className="text-lg font-bold line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer">
                {product.title}
              </h3>
              <p className="text-gray-600 text-sm mt-1">{product.author}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full inline-flex items-center">
                  {product.category}
                </span>
                {cart_item.variantId && (
                  <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full">
                    Phiên bản: {cart_item.variantId}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-3 sm:mt-0">
              <button 
                className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                aria-label="Thêm vào danh sách yêu thích"
              >
                <Heart className="w-5 h-5" />
              </button>
              <button 
                onClick={() => onRemove(_id)} 
                className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                aria-label="Xóa sản phẩm"
              >
                <Trash2 className="w-5 h-5"/>
              </button>
            </div>
          </div>
          
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="text-xl font-bold text-red-600">{price.toLocaleString()}đ</div>
            
            <div className="flex items-center mt-3 sm:mt-0">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button 
                  onClick={() => onDecrease(_id)} 
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors border-r border-gray-300 focus:outline-none"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4"/>
                </button>
                <span className="font-medium text-center w-10">{quantity}</span>
                <button 
                  onClick={() => onIncrease(_id)} 
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors border-l border-gray-300 focus:outline-none"
                >
                  <Plus className="w-4 h-4"/>
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-2 text-sm text-gray-500">
            Tổng: <span className="font-medium">{(price * quantity).toLocaleString()}đ</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItem
