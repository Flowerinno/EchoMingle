import { Header, Footer } from '..'
import { Outlet } from 'react-router'

const mockedUserData = {
  name: 'John Doe',
  email: 'akellastoopi@gmail.com',
  token: '1234567890',
}

export const Main = () => {
  //fetch user data

  return (
    <div className='flex flex-col items-center'>
      <Header />
      <Outlet context={mockedUserData} />
      <Footer />
    </div>
  )
}
