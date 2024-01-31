import { Button } from '@/components/modules'
import { useGoogleLogin } from '@react-oauth/google'
import { LogInIcon } from 'lucide-react'

export const Auth = () => {
  const login = useGoogleLogin({
    onSuccess: (credentialResponse) => {
      console.log(credentialResponse)
    },
    onError: (error) => {
      console.log(error)
    },
    scope: 'email profile',
  })

  return (
    <div className='flex flex-row gap-5 items-center'>
      <Button label='Sign in with google' onClick={login} />
      <LogInIcon className='text-yellow-200' />
    </div>
  )
}
