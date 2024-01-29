import { Media } from '@/components'
import { Button } from '@/components/modules'
import { ERoutes } from '@/routes'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'

export const Pending = () => {
  //auth here required!
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const roomId = params.get('room_id')

  const joinRoom = () => {
    navigate(`/rooms/`)
  }

  useEffect(() => {
    if (!roomId) {
      navigate(ERoutes.home)
    }
  }, [])

  return (
    <div className='flex flex-col gap-5 items-center justify-center'>
      <h1 className='text-2xl text-yellow-200 font-bold'>You are about to join the room</h1>
      <Media isAutoStart={true} />
      <Button label={'Join'} onClick={joinRoom} />
    </div>
  )
}
