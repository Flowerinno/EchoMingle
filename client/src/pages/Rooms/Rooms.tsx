import { Button } from '@/components/modules'
import { useEffect, useState } from 'react'

import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { Copy, CopyCheckIcon } from 'lucide-react'
import { api } from '@/api/api'
import { ToastifyRoot } from '@/features'
import { useNavigate } from 'react-router'
import { config } from '@/config/env.config'

export const Rooms = () => {
  const navigate = useNavigate()
  const [isCopied, handleCopy] = useCopyToClipboard()
  const [roomId, setRoomId] = useState('')
  const [roomLink, setRoomLink] = useState('')

  const generateRoom = async () => {
    const { data } = await api.post<{ room_id: string }>('/room/create', {
      owner_email: 'akellastoopi@gmail.com',
    })

    if (!data?.room_id) {
      ToastifyRoot.error('Failed to create a room')
      return
    }
    const link = `${config.origin_url}/rooms/pending?room_id=${data?.room_id}`
    setRoomId(data?.room_id)
    setRoomLink(link)
    window.localStorage.setItem(`echomingle_room`, data?.room_id)
  }

  const handleNavigate = () => {
    navigate(`/rooms/pending?room_id=${roomId}`)
  }

  useEffect(() => {
    const roomId = window.localStorage.getItem('echomingle_room')

    if (roomId) {
      api.get(`/room/${roomId}`).then(({ data }) => {
        if (!data?.room_id) return

        setRoomId(data?.room_id)
        setRoomLink(config.origin_url + `/rooms/pending?room_id=${data?.room_id}`)
      })
    }
  }, [])

  return (
    <div className='min-h-screen flex flex-col items-center justify-start'>
      <h2 className='text-2xl font-bold text-yellow-200 text-center p-2'>
        Create a new mingle and share the link with your people.
      </h2>
      <div className='flex flex-row gap-10 p-2 w-full'>
        {!roomLink && <Button label='create room' onClick={generateRoom} className='w-full' />}
        {roomLink && (
          <div className='flex flex-row flex-wrap gap-5'>
            <Button label='Preview' onClick={handleNavigate} className='w-full' />
            <button
              className='border-2 p-2 rounded-md border-yellow-200 text-white flex flex-row gap-2 w-full text-center items-center justify-center'
              value={roomLink}
              onClick={(e) => handleCopy(e?.currentTarget?.value)}
            >
              {roomLink}
              {isCopied ? <CopyCheckIcon /> : <Copy />}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
