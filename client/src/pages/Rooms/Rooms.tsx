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
import { useLocation, useNavigate, useOutletContext } from 'react-router'

export const Rooms = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { state } = location

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
    navigate(`/rooms/${roomId}`)
  }

  useEffect(() => {
    if (!user) {
      navigate(ERoutes.home)
    }
    if (state?.isAdminDisconnected) {
      ToastifyRoot.error('Admin has left the room')
    }

    const roomId = getRoomLink()

    if (roomId) {
      api
        .get(`/room/${roomId}/${user.email}`)
        .then(({ data }) => {
          if (!data?.room_id) return

          setRoomId(data?.room_id)
          setRoomLink(domain + `/rooms/${data?.room_id}`)
        })
        .catch((_) => ToastifyRoot.error(t('error')))
    }
  }, [])

  return (
    <div className='min-w-0 w-11/12 flex flex-col flex-wrap items-center justify-start p-5'>
      <h2 className='text-2xl font-bold text-yellow-200 text-center p-2'>{t('title')}</h2>
      <div className='flex flex-row gap-10 p-2 w-11/12'>
        {!roomLink && <Button label={t('create')} onClick={generateRoom} className='w-full' />}
        {roomLink && (
          <div className='flex flex-row flex-wrap items-center justify-center gap-5 min-w-0 w-full'>
            <Button label={t('preview')} onClick={handleNavigate} className='w-full' />
            <div
              className='border-2 p-2 rounded-md border-yellow-200 text-white flex flex-row text-balance text-clip gap-4 w-full text-center items-center justify-center cursor-pointer'
              onClick={(e) => handleCopy(roomLink)}
            >
              <span className='truncate text-center text-ellipsis w-8/12 max-w-8/12'>
                {roomLink}
              </span>
              {isCopied ? <CopyCheckIcon /> : <Copy />}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
