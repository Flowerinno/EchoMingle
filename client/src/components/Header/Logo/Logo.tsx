import { Link } from 'react-router-dom'
import AppLogo from '../../../assets/images/Logo.png'

export const Logo = () => {
  return (
    <div>
      <Link to='/'>
        <img src={AppLogo} alt='EchoMingle Logo Image' className='w-16 h-16 min-w-16 min-h-16' />
      </Link>
    </div>
  )
}
