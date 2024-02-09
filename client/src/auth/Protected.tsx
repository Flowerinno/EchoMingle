import { ToastifyRoot } from '@/features'
import { ERoutes } from '@/routes'
import { VerifyResponse } from '@/types/auth.types'
import { removeToken, verify } from '@/utils'
import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'

export const Protected = () => {
  const [user, setUser] = useState<VerifyResponse | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const room_id = new URLSearchParams(location.search).get('room_id')

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await verify()
        if (!res?.id) {
          removeToken()
          if (room_id) {
            navigate(`${ERoutes.auth}?room_id=${room_id}`)
            return
          }
          navigate(ERoutes.auth)
        }
        setUser(res)
      } catch (error) {
        ToastifyRoot.error('Whoops...')
      }
    }

    fetch()
  }, [])

  if (!user) return null //should't be here, but just in case

  return <Outlet context={user satisfies VerifyResponse} />
}
