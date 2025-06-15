import axios from '@/config/axios.customize'

export const fetchListProduct = async (params: any) => {
  const response = await axios.get('/api/v1/products', { params })
  return response
}

export const fetchListCategory = async () => {
  const response = await axios.get('/api/v1/categories')
  return response
}

export const fetchListBrand = async () => {
  const response = await axios.get('/api/v1/brand')
  return response
}