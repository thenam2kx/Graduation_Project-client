import React from 'react'
import { Trash2, Plus, Minus } from 'lucide-react'

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

  return (
    <div className="p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group rounded-lg">
      <div className="flex space-x-6">
        <div className="relative flex-shrink-0">
          <img src={product.image} alt={product.title} className="w-24 h-32 object-cover rounded-xl" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold">{product.title}</h3>
              <p className="text-slate-600">{product.author}</p>
              <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full mt-2 inline-block">
                {product.category}
              </span>
            </div>
            <button onClick={() => onRemove(_id)} className="text-slate-400 hover:text-red-500">
              <Trash2 className="w-5 h-5"/>
            </button>
          </div>
          <div className="mt-6 flex justify-between items-center">
            <div className="text-2xl font-bold text-red-600">{price.toLocaleString()}đ</div>
            <div className="flex items-center space-x-4">
              <button onClick={() => onDecrease(_id)} className="p-2 bg-slate-100 rounded-full hover:bg-white">
                <Minus className="w-4 h-4"/>
              </button>
              <span className="font-bold text-lg">{quantity}</span>
              <button onClick={() => onIncrease(_id)} className="p-2 bg-slate-100 rounded-full hover:bg-white">
                <Plus className="w-4 h-4"/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItem
