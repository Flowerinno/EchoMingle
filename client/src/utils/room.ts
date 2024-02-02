import { api } from '@/api/api'
import { config } from '@/config/env.config'
import Cookies from 'js-cookie'

export const createRoom = async (
  email: string,
): Promise<{ link: string; room_id: string } | null> => {
  const { data } = await api.post<{ room_id: string }>('/room/create', {
    owner_email: email,
  })

  if (!data?.room_id) {
    return null
  }

  const link = `${config.origin_url}/rooms/pending?room_id=${data?.room_id}`

  setRoomLink(data.room_id)

  return { link, room_id: data?.room_id }
}

export const setRoomLink = (room_id: string) => {
  Cookies.set('echomingle_room', room_id, {
    expires: 1 / 48, //30minutes
  })
}

export const getRoomLink = () => {
  return Cookies.get('echomingle_room')
}
