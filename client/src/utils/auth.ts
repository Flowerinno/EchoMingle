import { api } from '@/api/api'
import { VerifyResponse } from '@/types/auth.types'
import { googleLogout } from '@react-oauth/google'
import Cookies from 'js-cookie'

export const getToken = () => {
  return Cookies.get('echomingle_user_token')
}

export const setToken = (token: string) => {
  Cookies.set('echomingle_user_token', token, { expires: 7 })
}

export const removeToken = () => {
  Cookies.remove('echomingle_user_token')
}

export const verify = async (): Promise<VerifyResponse | null> => {
  const token = getToken()
  if (!token) return null

  const response = await api.get(`auth/verify/${token}`)

  if (response.status !== 200) {
    removeToken()
    return null
  }

  return response.data
}

export const logout = () => {
  removeToken()
  googleLogout()
  window.location.href = '/'
}
