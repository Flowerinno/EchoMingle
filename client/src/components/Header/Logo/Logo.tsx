import { Link } from 'react-router-dom'
import AppLogo from '../../../assets/images/Logo.png'

export const Logo = () => {
  return (
    <div>
      <Link to='/'>
        <img src={AppLogo} alt='EchoMingle Logo Image' width={70} height={70} />
      </Link>
    </div>
  )
}
