import { Button } from '@/components/modules'
import { useEffect, useState } from 'react'

import { api } from '@/api/api'
import { ToastifyRoot } from '@/features'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { ERoutes } from '@/routes'
import { VerifyResponse } from '@/types/auth.types'
import { createRoom, getRoomLink } from '@/utils/room'
import { Copy, CopyCheckIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useOutletContext } from 'react-router'

export const Rooms = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('rooms')
  const [isCopied, handleCopy] = useCopyToClipboard()
  const [roomId, setRoomId] = useState('')
  const [roomLink, setRoomLink] = useState('')

  const user = useOutletContext<VerifyResponse>()
  const domain = new URL(window.location.href).origin
  
  const generateRoom = async () => {
    if (!user?.subscription?.stripe_session_id) {
      ToastifyRoot.error('Sorry, you need to have a subscription to create a room.')
      return
    }

    const room = await createRoom(user.email)

    if (!room) {
      ToastifyRoot.error(t('error'))
      return
    }

    setRoomId(room.room_id)
    setRoomLink(room.link)
  }

  const handleNavigate = () => {
    navigate(`/rooms/pending?room_id=${roomId}`)
  }

  console.log(user)
  useEffect(() => {
    if (!user) {
      navigate(ERoutes.home)
    }

    const roomId = getRoomLink()

    if (roomId) {
      api
        .get(`/room/${roomId}`)
        .then(({ data }) => {
          if (!data?.room_id) return

          setRoomId(data?.room_id)
          setRoomLink(domain + `/rooms/pending?room_id=${data?.room_id}`)
        })
        .catch((_) => ToastifyRoot.error(t('error')))
    }
  }, [])

  return (
    <div className='min-h-screen flex flex-col items-center justify-start'>
      <h2 className='text-2xl font-bold text-yellow-200 text-center p-2'>{t('title')}</h2>
      <div className='flex flex-row gap-10 p-2 w-full'>
        {!roomLink && <Button label={t('create')} onClick={generateRoom} className='w-full' />}
        {roomLink && (
          <div className='flex flex-row flex-wrap gap-5'>
            <Button label={t('preview')} onClick={handleNavigate} className='w-full' />
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
