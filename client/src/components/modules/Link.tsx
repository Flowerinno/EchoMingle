import { ERoutes } from 'routes'
import { Link } from 'react-router-dom'

interface LinkProps {
  label: string
  to: ERoutes
  isHtml?: boolean
}

const linkStyle = 'text-blue-500 hover:text-blue-800 visited:text-purple-600'

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
