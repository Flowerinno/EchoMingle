import { ERoutes } from '@/routes'
import { Link } from 'react-router-dom'

interface LinkProps {
  label: string
  to: ERoutes | string
  isHtml?: boolean
  children?: React.ReactNode
}

const linkStyle =
  'text-white rounded-md font-bold hover:text-yellow-200 transition-colors duration-300 ease-in-out'

export const Anchor = ({ label, to, isHtml, children }: LinkProps) => {
  if (isHtml) {
    return (
      <a href={to} className={linkStyle} target='_blank'>
        {label}
        {children}
      </a>
    )
  }

  return (
    <Link to={to} className={linkStyle}>
      {label}
    </Link>
  )
}
