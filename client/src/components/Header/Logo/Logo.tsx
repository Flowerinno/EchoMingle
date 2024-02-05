import { Link } from 'react-router-dom'
import AppLogo from '../../../assets/images/Logo.png'

export const Logo = () => {
  return (
    <Link to='/' className='flex flex-row gap-5 items-center'>
      <img src={AppLogo} alt='EchoMingle Logo Image' className='w-16 h-16 min-w-16 min-h-16' />
      <h1 className='text-4xl font-bold text-yellow-200'>EchoMingle</h1>
    </Link>
  )
}
