import { MicIcon, MicOff, PhoneMissed, Video, VideoOff, Volume2, VolumeX } from 'lucide-react'
import { useEffect } from 'react'

interface MediaControllerProps {
  toogle?: (type: 'Audio' | 'Video' | 'Sound', on: boolean) => void
  audioEnabled?: boolean
  videoEnabled?: boolean
  soundEnabled?: boolean
  disconnect?: () => void
}

const style = 'border border-2 rounded-md p-1 border-yellow-200 cursor-pointer min-w-20 min-h-8'

export const MediaController = ({
  toogle,
  audioEnabled,
  videoEnabled,
  soundEnabled,
  disconnect,
}: MediaControllerProps) => {
  if (!toogle) {
    return null
  }

  const Micro = !audioEnabled ? (
    <MicOff className={`${style} text-red-400`} onClick={() => toogle('Audio', true)} />
  ) : (
    <MicIcon className={`${style} text-green-400`} onClick={() => toogle('Audio', false)} />
  )

  const Sound = soundEnabled ? (
    <Volume2 className={`${style} text-green-400`} onClick={() => toogle('Sound', false)} />
  ) : (
    <VolumeX className={`${style} text-red-400`} onClick={() => toogle('Sound', true)} />
  )

  const Vid = !videoEnabled ? (
    <VideoOff className={`${style} text-red-400`} onClick={() => toogle('Video', true)} />
  ) : (
    <Video className={`${style} text-green-400`} onClick={() => toogle('Video', false)} />
  )

  useEffect(() => {
    return () => {
      toogle('Audio', false)
      toogle('Video', false)
    }
  }, [])

  return (
    <div className='flex flex-flow gap-5 justify-center w-full'>
      {Micro}
      {/* {Sound} */}
      {Vid}
      <PhoneMissed
        onClick={disconnect}
        aria-label='disconnect'
        className='text-red-400 border-2 rounded-md p-1 border-yellow-200 cursor-pointer min-w-20 min-h-8'
      />
    </div>
  )
}
