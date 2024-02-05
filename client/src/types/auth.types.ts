export type VerifyResponse = {
  id: string
  email: string
  name: string
  subscription: {
    id: string
    expires_at: Date
    type: '1' | '12'
    stripe_session_id: string
  }
}
