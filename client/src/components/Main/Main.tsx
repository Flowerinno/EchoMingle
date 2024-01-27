import { Header, Footer } from '..'
import { Outlet } from 'react-router'

export const Main = () => {
  return (
    <div className='flex flex-col items-center'>
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}
