import axios from '@/config/axios.customize'

export const signupAPI = (data: { email: string; password: string }) => {
  const url = '/api/v1/auth/signup'
  return axios.post<IBackendResponse<IAuth>>(url, { ...data })
}

export const verifyAPI = (data: { email: string; code: string }) => {
  const url = `/api/v1/auth/verify-email?email=${data.email}`
  return axios.post<IBackendResponse<IAuth>>(url, { code: data.code })
}

export const reSendCodeAPI = (data: { email: string }) => {
  const url = `/api/v1/auth/resend-code?email=${data.email}`
  return axios.post<IBackendResponse<IAuth>>(url)
}

export const signinAPI = (data: { email: string; password: string }) => {
  const url = '/api/v1/auth/signin'
  return axios.post<IBackendResponse<IAuth>>(url, { ...data })
}
