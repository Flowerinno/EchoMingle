import { Media } from '@/components'
import { Button } from '@/components/modules'
import { useMediaDevice } from '@/hooks/useMediaDevice'
import { ERoutes } from '@/routes'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'

type Settings = {
  audioEnabled: boolean
  videoEnabled: boolean
  soundEnabled: boolean
}

export const Pending = () => {
  //auth here required!
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const roomId = params.get('room_id')

  const cache = JSON.parse(
    window.localStorage.getItem('echomingle_media_settings') as string,
  ) as Settings

  const { stream, toogle, audioEnabled, videoEnabled } = useMediaDevice({
    isAutoStart: true,
    cache,
  })

  const joinRoom = () => {
    navigate(`/rooms/${roomId}`)
  }

  useEffect(() => {
    if (!roomId) {
      navigate(ERoutes.home)
    }
  }, [])

  return (
    <div className='flex flex-col gap-5 items-center justify-start min-h-screen p-3'>
      <h1 className='text-2xl text-yellow-200 font-bold'>You are about to join the room</h1>
      <Media
        isAutoStart
        isLocal
        toogle={toogle}
        audioEnabled={audioEnabled}
        videoEnabled={videoEnabled}
        stream={stream}
      />
      <Button label={'Join'} className='w-6/12' onClick={joinRoom} />
    </div>
  )
}
