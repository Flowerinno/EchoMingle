import { Anchor } from '@/components/modules/Anchor'
import { ERoutes } from '@/routes/routes'
import { useTranslation } from 'react-i18next'
import { Each } from '../modules'
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
      <div className='flex flex-col gap-4 md:flex-row md:justify-between w-full p-4 items-center'>
        <Logo />
        <div className='md:flex-1 flex justify-center flex-row gap-5 md:justify-end'>
          <Each
            of={notAuthedLinks}
            render={(link, index) => <Anchor key={index} label={link.label} to={link.to} />}
          />
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-4 md:flex-row md:justify-between w-full p-4 items-center'>
      <Logo />
      <div className='md:flex-1 flex justify-center flex-row gap-5 md:justify-end'>
        <Anchor to={ERoutes.plans} label={t('plans')} />
        <Anchor to={ERoutes.rooms} label={t('rooms')} />
        <Anchor to={ERoutes.profile} label={t('profile')} />
      </div>
    </div>
  )
}
