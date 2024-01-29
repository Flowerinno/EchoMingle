import FirstImage from '@/assets/images/Home/1.png'
import { useEffect } from 'react'

export const NotFound = () => {
  useEffect(() => {
    document.title = 'EchoMingle - 404'
    window.scrollTo(0, 0)
  }, [])

  return (
    <div
      className='min-h-screen w-full'
      style={{
        backgroundImage: `url(${FirstImage})`,
        backgroundSize: '100%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <h1 className='text-2xl text-center text-red-300'>
        Looks like mingling went wrong. Let's try again!
      </h1>
    </div>
  )
}
