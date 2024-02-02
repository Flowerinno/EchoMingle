import { googleLogin } from '@/api/api'
import { Button } from '@/components/modules'
import { ToastifyRoot } from '@/features'
import { ERoutes } from '@/routes'
import { getToken, setToken } from '@/utils'
import { useGoogleLogin } from '@react-oauth/google'
import { LogInIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'

export const Auth = () => {
  const navigate = useNavigate()
  const login = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      const { access_token } = credentialResponse

      const userInfo = await googleLogin(access_token)

      if (userInfo) {
        setToken(userInfo.token)
        ToastifyRoot.success('Welcome to EchoMingle!')
        navigate(ERoutes.profile)
      }
    },
    onError: () => {
      ToastifyRoot.error('Error while logging in')
    },
    scope: 'email profile',
  })

  useEffect(() => {
    const token = getToken()
    if (token) {
      navigate(ERoutes.home)
    }
  }, [])

  return (
    <div className='flex flex-row gap-5 items-center'>
      <Button label='Sign in with google' onClick={login} />
      <LogInIcon className='text-yellow-200' />
    </div>
  )
}
