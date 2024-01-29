import { ERoutes } from '@/routes'
import { isAuthenticated } from '@/utils'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'

export const Profile = () => {
  const navigate = useNavigate()
  const isAuth = isAuthenticated()

  useEffect(() => {
    if (!isAuth) {
      navigate(ERoutes.auth)
    }
  })

  if (!isAuth) {
    return null
  }

  return <div>Profile</div>
}
