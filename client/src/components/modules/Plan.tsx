import { ERoutes } from '@/routes'
import { useNavigate } from 'react-router'
import { Button } from './Button'

interface PlanProps {
  title: string
  description: string
  price: number | string
  isFullWidth?: boolean
  href?: ERoutes | string
}

export const Plan = ({ title, description, price, isFullWidth, href }: PlanProps) => {
  const navigate = useNavigate()
  const w = isFullWidth ? 'w-full' : 'w-4/12'

  const onClick = () => {
    if (href) {
      navigate(href)
    }
  }

  return (
    <div
      className={`border-2 rounded-md p-3 flex flex-col items-center justify-center md:justify-around gap-10 ${w} border-yellow-200 min-w-72`}
    >
      <div className='flex-1'>
        <h1 className='text-yellow-200 font-bold text-2xl text-center'>{title}</h1>
        <p className='text-center text-white'>{description}</p>
      </div>
      <Button className='w-48 text-white' label={price} onClick={onClick} />
    </div>
  )
}
