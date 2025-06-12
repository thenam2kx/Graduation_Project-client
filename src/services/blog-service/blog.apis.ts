import axios from '@/config/axios.customize'

export const fetchListBlog = async (params: any) => {
  const response = await axios.get('/api/v1/blogs', { params })
  return response
}

export const fetchBlogDetail = async (blogId: string) => {
  const response = await axios.get(`/api/v1/blogs/${blogId}`)
  return response
}

export const fetchListCateBlog = async () => {
  const response = await axios.get('/api/v1/cateblog')
  return response
}

export const fetchCateBlogDetail = async (cateBlogId: string) => {
  const response = await axios.get(`/api/v1/cateblog/${cateBlogId}`)
  return response
}