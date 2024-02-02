import { getToken } from '@/utils'
import axios from 'axios'
import { GoogleLoginResponse } from './types'

const baseURL = import.meta.env.VITE_SERVER_URL

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Basic ${getToken()}`,
  },
})

export const googleLogin = async (access_token: string): Promise<GoogleLoginResponse> => {
  const userInfo = await api.post(`/auth/google`, {
    access_token,
  })

  if (!userInfo) {
    return null
  }

  return userInfo.data
}
