import { ERoutes } from '@/routes'
import { Link } from 'react-router-dom'

interface LinkProps {
  label: string
  to: ERoutes
  isHtml?: boolean
}

const linkStyle = 'text-sm text-red-400 hover:text-gray-900 '

export const Anchor = ({ label, to, isHtml }: LinkProps) => {
  if (isHtml) {
    return (
      <a href={to} className={linkStyle} target='_blank'>
        {label}
      </a>
    )
  }

  return (
    <Link to={to} className={linkStyle}>
      {label}
    </Link>
  )
}
