import axios from '@/config/axios.customize'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createOrderAPI = async (data: any) => {
  try {
    console.log('Creating order with data:', data)
    const url = '/api/v1/orders'
    const response = await axios.post(url, data)
    console.log('Order creation response:', response)
    return response
  } catch (error) {
    console.error('Error creating order:', error)
    console.error('Error details:', error.response?.data || error.message)
    throw error
  }
}

export const confirmReceivedOrderAPI = async (orderId: string) => {
  try {
    const response = await axios.patch(`/api/v1/orders/${orderId}/status`, { 
      status: 'completed' 
    })
    return response
  } catch (error) {
    console.error('Error confirming received order:', error)
    throw error
  }
}
