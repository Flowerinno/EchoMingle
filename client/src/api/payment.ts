import { ToastifyRoot } from '@/features'
import { api } from './api'
import { Subscription } from './types'

export const checkSession = async (
  session_id: string,
  userId: string,
): Promise<Subscription | undefined> => {
  try {
    console.log('checking session')
    const session = await api.get(`/stripe/session/?session_id=${session_id}&user_id=${userId}`)
    return session.data
  } catch (error) {
    ToastifyRoot.error('Could not verify session. Please login.')
  }
}
