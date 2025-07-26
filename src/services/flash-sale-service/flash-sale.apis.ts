import axios from '@/config/axios.customize'

export const getFlashSaleProducts = async () => {
  try {
    const response = await axios.get('/api/v1/flash-sales/active-products')
    return response.data || { data: [] }
  } catch (error) {
    console.error('Error fetching flash sale products:', error)
    return { data: [] }
  }
}