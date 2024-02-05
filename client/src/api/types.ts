export type GoogleLoginResponse = {
  id: string
  email: string
  name: string
  token: string
} | null

export type Subscription = {
  id: string
  createdAt: Date
  updatedAt: Date
  userId: string
  expires_at: Date
  type: '1' | '12'
  stripe_session_id: string
}
