import axios from '@/config/axios.customize'

export const fetchAccountAPI = async () => {
  const url = '/api/v1/auth/account'
  return axios.get<IBackendResponse<IUserAuth>>(url)
}
