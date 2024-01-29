import { MicIcon, MicOff, Video, VideoOff } from 'lucide-react'
import { useEffect } from 'react'

interface MediaControllerProps {
  toogle: (type: 'Audio' | 'Video', on: boolean) => void
  audioEnabled?: boolean
  videoEnabled?: boolean
}

const style =
  'border border-2 rounded-md p-1 text-white border-yellow-200 cursor-pointer min-w-14 min-h-8'

export const MediaController = ({
  toogle,
  audioEnabled = false,
  videoEnabled = false,
}: MediaControllerProps) => {
  const Micro = !audioEnabled ? (
    <MicOff className={style} onClick={() => toogle('Audio', true)} />
  ) : (
    <MicIcon className={style} onClick={() => toogle('Audio', false)} />
  )
  const Vid = !videoEnabled ? (
    <VideoOff className={style} onClick={() => toogle('Video', true)} />
  ) : (
    <Video className={style} onClick={() => toogle('Video', false)} />
  )

  useEffect(() => {
    return () => {
      toogle('Audio', false)
      toogle('Video', false)
    }
  }, [])

  return (
    <div className='flex flex-flow gap-5'>
      {Micro}
      {Vid}
    </div>
  )
}
