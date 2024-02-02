import { ERoutes } from '@/routes'
import { VerifyResponse } from '@/types/auth.types'
import { verify } from '@/utils'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router'

export const Protected = () => {
  const [user, setUser] = useState<VerifyResponse | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    verify().then((res) => {
      if (!res) {
        navigate(ERoutes.auth)
      }
      setUser(res)
    })
  }, [])

  if (!user) return null //should't be here, but just in case

  return <Outlet context={user satisfies VerifyResponse} />
}
