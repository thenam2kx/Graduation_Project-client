import axios from '@/config/axios.customize'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createOrderAPI = async (data: any) => {
  const url = '/api/v1/orders'
  const response = await axios.post(url, data)
  return response
}
