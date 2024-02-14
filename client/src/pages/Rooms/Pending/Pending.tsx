import { Media } from '@/components'
import { Button } from '@/components/modules'
import { ToastifyRoot } from '@/features'
import { useMediaDevice } from '@/hooks/useMediaDevice'
import { ERoutes } from '@/routes'
import { VerifyResponse } from '@/types/auth.types'
import { getRoomById } from '@/utils/room'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useOutletContext } from 'react-router'
import { useSearchParams } from 'react-router-dom'

type Settings = {
  audioEnabled: boolean
  videoEnabled: boolean
  soundEnabled: boolean
}

export const Pending = () => {
  const { t } = useTranslation('pending')
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const roomId = params.get('room_id')

  const user = useOutletContext<VerifyResponse>()

  const cache = JSON.parse(
    window.localStorage.getItem('echomingle_media_settings') as string,
  ) as Settings

  const { stream } = useMediaDevice({
    cache,
  })

  const joinRoom = async () => {
    if (!roomId || !user?.email) return
    const roomInfo = await getRoomById(roomId, user?.email)

    if (!roomInfo) {
      return
    }

    if (roomInfo.isDeleted) {
      ToastifyRoot.error('The room has been deleted.')
      navigate(ERoutes.home)
      return
    }

    if (!roomInfo.isAdminConnected) {
      ToastifyRoot.error('The room admin is not connected.')
      return
    }

    navigate(`/rooms/${roomId}`)
  }

  useEffect(() => {
    if (!roomId) {
      navigate(ERoutes.home)
    }
  }, [])

  return (
    <div className='flex flex-col gap-5 items-center justify-start min-h-screen p-3'>
      <h1 className='text-2xl text-yellow-200 font-bold'>{t('title')}</h1>
      <Media isLocal stream={stream} />
      <Button label={t('join')} className='w-8/12' onClick={joinRoom} />
    </div>
  )
}
