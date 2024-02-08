export type AuthResponse = User

type User = {
  id?: string
  email?: string
  name?: string
  token?: string
  message: string
}

export type Subscription = {
  id: string
  createdAt: Date
  updatedAt: Date
  userId: string
  expires_at: Date
  type: '1' | '12'
  stripe_session_id: string
}
