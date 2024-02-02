import { Anchor } from '@/components/modules/Anchor'
import { ERoutes } from '@/routes/routes'
import { useTranslation } from 'react-i18next'
import { Logo } from './Logo/Logo'

interface HeaderProps {
  token?: string
}

export const Header = ({ token }: HeaderProps) => {
  const { t } = useTranslation('header')

  const notAuthedLinks = [
    {
      label: t('plans'),
      to: ERoutes.plans,
    },
    {
      label: t('contact'),
      to: ERoutes.contact,
    },
    {
      label: t('auth'),
      to: ERoutes.auth,
    },
  ]

  if (!token) {
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
        <Anchor to={ERoutes.rooms} label={t('rooms')} />
        <Anchor to={ERoutes.profile} label={t('profile')} />
      </div>
    </div>
  )
}
