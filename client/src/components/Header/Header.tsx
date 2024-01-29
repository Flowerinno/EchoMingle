import { Anchor } from '@/components/modules/Anchor'
import { Logo } from './Logo/Logo'
import { ERoutes } from '@/routes/routes'

interface HeaderProps {
  user?: {
    name: string
    email: string
    token: string
  }
}

const notAuthedLinks = [
  {
    label: 'rooms',
    to: ERoutes.rooms,
  },
  {
    label: 'plans',
    to: ERoutes.plans,
  },
  {
    label: 'auth',
    to: ERoutes.auth,
  },
  {
    label: 'contact',
    to: ERoutes.contact,
  },
]

export const Header = ({ user }: HeaderProps) => {
  if (!user) {
    return (
      <div className='flex flex-row justify-between w-full p-4 items-center'>
        <Logo />
        <div className='flex-1 flex flex-row gap-5 justify-end'>
          {notAuthedLinks.map((link) => (
            <Anchor key={link.label} to={link.to} label={link.label} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-row justify-between w-full p-4 items-center'>
      <Logo />
      <div className='flex-1 flex flex-row gap-5 justify-end'>
        <Anchor to={ERoutes.rooms} label='rooms' />
        <Anchor to={ERoutes.profile} label='profile' />
      </div>
    </div>
  )
}
