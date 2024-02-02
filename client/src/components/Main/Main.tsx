import { getToken } from '@/utils'
import { Outlet } from 'react-router'
import { Footer, Header } from '..'

export const Main = () => {
  const token = getToken()

  return (
    <div className='flex flex-col items-center'>
      <Header token={token} />
      <Outlet />
      <Footer />
    </div>
  )
}
