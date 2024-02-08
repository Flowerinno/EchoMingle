import { formLogin, formRegister, googleLogin } from '@/api/api'
import { Button } from '@/components/modules'
import { ToastifyRoot } from '@/features'
import { ERoutes } from '@/routes'
import { getToken, setToken } from '@/utils'
import { useGoogleLogin } from '@react-oauth/google'
import { LogInIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router'

import { Switch } from '@/components/ui/switch'

import { Login } from './Login'
import { Register } from './Register'

export const Auth = () => {
  const { t } = useTranslation('auth')
  const [isLogin, setIsLogin] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  const room_id = new URLSearchParams(location.search).get('room_id')

  const handleSuccess = (token: string) => {
    ToastifyRoot.success(t('welcome'))
    setToken(token)

    if (room_id) {
      navigate(`${ERoutes.pending}?room_id=${room_id}`)
      return
    }

    navigate(ERoutes.profile)
  }

  const login = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      const { access_token } = credentialResponse
      try {
        const userInfo = await googleLogin(access_token)

        if (userInfo?.token) {
          handleSuccess(userInfo.token)
        }
      } catch (error) {
        ToastifyRoot.error(t('error'))
      }
    },
    onError: () => {
      ToastifyRoot.error(t('error'))
    },
    scope: 'email profile',
  })

  useEffect(() => {
    const token = getToken()
    if (token) {
      navigate(ERoutes.home)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)

    const { type, email, name } = data as { type: string; email: string; name: string }
    try {
      if (type === 'login') {
        const res = await formLogin(email)

        if (res?.token) {
          handleSuccess(res.token)
          return
        }
        ToastifyRoot.error(res?.message)
      } else {
        const res = await formRegister(name, email)

        if (res?.token) {
          handleSuccess(res.token)
          return
        }

        ToastifyRoot.error(res?.message)
      }
    } catch (error) {
      ToastifyRoot.error(t('error'))
    }
  }

  return (
    <div className='flex flex-col gap-5 items-center'>
      <div className='flex flex-row gap-1 items-center justify-center'>
        <Button label={t('login_label')} onClick={login} />
        <LogInIcon className='text-yellow-200' />
      </div>
      <div className='flex flex-row gap-2 w-full justify-around'>
        <span style={{ color: !isLogin ? 'black' : 'transparent' }}>register</span>
        <Switch checked={isLogin} onCheckedChange={() => setIsLogin((prev) => !prev)} />
        <span style={{ color: isLogin ? 'black' : 'transparent' }}>login</span>
      </div>
      {isLogin ? <Login handleSubmit={handleSubmit} /> : <Register handleSubmit={handleSubmit} />}
    </div>
  )
}
