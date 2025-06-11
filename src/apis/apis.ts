import axios from '@/config/axios.customize'
// Write functions to call APIs here

export const fetchListProduct = async (params: any) => {
  const response = await axios.get('/api/v1/products', { params })
  return response
}

export const fetchListBlog = async (params: any) => {
  const response = await axios.get('/api/v1/blogs', { params })
  return response
}

export const fetchBlogDetail = async (blogId: string) => {
  const response = await axios.get(`/api/v1/blogs/${blogId}`)
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
