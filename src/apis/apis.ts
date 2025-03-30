import axios from '@/config/axios.customize'
// Write functions to call APIs here

export const fetchListProduct = async (params: any) => {
  const response = await axios.get('/products', { params })
  return response
}
