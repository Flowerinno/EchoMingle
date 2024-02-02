import { googleLogin } from '@/api/api'
import { Button } from '@/components/modules'
import { ToastifyRoot } from '@/features'
import { ERoutes } from '@/routes'
import { getToken, setToken } from '@/utils'
import { useGoogleLogin } from '@react-oauth/google'
import { LogInIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

export const Auth = () => {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const login = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      const { access_token } = credentialResponse

      const userInfo = await googleLogin(access_token)

      if (userInfo) {
        ToastifyRoot.success(t('welcome'))
        setToken(userInfo.token)
        navigate(ERoutes.profile)
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

  return (
    <div className='flex flex-row gap-5 items-center min-h-72'>
      <Button label={t('login_label')} onClick={login} />
      <LogInIcon className='text-yellow-200' />
    </div>
  )
}
