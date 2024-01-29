import { ERoutes } from '@/routes/routes'
import { Anchor } from '../modules'
import { Github } from 'lucide-react'

const links = [
  {
    id: 1,
    label: 'Home',
    href: ERoutes.home,
  },
  {
    id: 2,
    label: 'Profile',
    href: ERoutes.profile,
  },
  {
    id: 3,
    label: 'Contact',
    href: ERoutes.contact,
  },
  {
    id: 4,
    label: 'Auth',
    href: ERoutes.auth,
  },
]

export const Footer = () => {
  return (
    <>
      <ul className='bg-none p-5 flex flex-row gap-5'>
        {links.map(({ id, label, href }) => (
          <Anchor key={id} label={label} to={href} />
        ))}
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
