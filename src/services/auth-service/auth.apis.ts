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

export const forgotPasswordAPI = (data: { email: string }) => {
  const url = '/api/v1/auth/forgot-password'
  return axios.post<IBackendResponse<null>>(url, data)
}

export const verifyForgotPasswordCodeAPI = (data: { email: string; code: string }) => {
  const url = '/api/v1/auth/verify-forgot-password-code'
  return axios.post<IBackendResponse<null>>(url, data)
}

export const resetPasswordAPI = (data: { email: string; password: string; code: string}) => {
  const url = '/api/v1/auth/reset-password'
  return axios.post<IBackendResponse<null>>(url, data)
}

export const verifyResetPasswordCodeAPI = (data: { email: string; code: string }) => {
  const url = `/api/v1/auth/verify-reset-password?email=${data.email}`
  return axios.post<IBackendResponse<null>>(url, { code: data.code })
}
