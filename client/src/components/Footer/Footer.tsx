import { ERoutes } from '@/routes/routes'
import { Github } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Anchor, Each } from '../modules'

export const Footer = () => {
  const { t } = useTranslation('footer')
  const links = [
    {
      id: 1,
      label: t('home'),
      href: ERoutes.home,
    },
    {
      id: 2,
      label: t('profile'),
      href: ERoutes.profile,
    },
    {
      id: 3,
      label: t('contact'),
      href: ERoutes.contact,
    },
    {
      id: 4,
      label: t('auth'),
      href: ERoutes.auth,
    },
  ]
  return (
    <>
      <ul className='bg-none p-5 flex flex-row gap-5'>
        <Each
          of={links}
          render={(link, index) => <Anchor key={index} label={link.label} to={link.href} />}
        />
      </ul>
      <ul className='bg-none p-5 flex flex-row gap-5'>
        <li className='text-white'>© 2024 EchoMingle </li>
        <Anchor isHtml label='' to='https://github.com/Flowerinno/EchoMingle'>
          <Github />
        </Anchor>
      </ul>
    </>
  )
}
