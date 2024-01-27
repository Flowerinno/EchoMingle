import { Anchor } from '@/components/modules/Anchor'
import { Logo } from './Logo/Logo'
import { ERoutes } from '@/routes'

export const Header = () => {
  return (
    <div className='flex flex-row justify-between'>
      <Logo />
      <div>
        <Anchor to={ERoutes.auth} label='Auth' />
      </div>
    </div>
  )
}
