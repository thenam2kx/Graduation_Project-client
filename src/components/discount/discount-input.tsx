import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface DiscountInputProps {
  onApply?: (code: string) => void
  loading?: boolean
  orderValue?: number
  cartItems?: any[]
  onDiscountApplied?: (discount: any) => void
  appliedDiscount?: any
}

export const DiscountInput = ({ onApply, loading }: DiscountInputProps) => {
  const [code, setCode] = useState('')

  const handleApply = () => {
    if (code.trim() && onApply) {
      onApply(code.trim())
    }
  }

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Nhập mã giảm giá"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onApply && handleApply()}
      />
      <Button onClick={handleApply} disabled={!code.trim() || loading || !onApply}>
        {loading ? 'Đang áp dụng...' : 'Áp dụng'}
      </Button>
    </div>
  )
}