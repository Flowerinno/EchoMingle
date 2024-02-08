import axios from 'axios'
import Cookies from 'js-cookie'
import { AuthResponse } from './types'

const baseURL = import.meta.env.VITE_SERVER_URL

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Basic ${Cookies.get('echomingle_user_token')}`,
  },
})

export const googleLogin = async (access_token: string): Promise<AuthResponse> => {
  const { data } = await api.post(`/auth/google`, {
    access_token,
  })

  if (!data?.token) {
    return { message: data.message }
  }

  return data
}

export const formRegister = async (name: string, email: string): Promise<AuthResponse> => {
  const { data } = await api.post(`/auth/register`, {
    name,
    email,
  })

  if (!data?.token) {
    return { message: data.message }
  }

  return data
}

export const formLogin = async (email: string): Promise<AuthResponse> => {
  const { data } = await api.post(`/auth/login`, {
    email,
  })

  if (!data?.token) {
    return { message: data.message }
  }

  return data
}
