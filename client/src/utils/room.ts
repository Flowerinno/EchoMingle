import { api } from '@/api/api'
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

  const domain = new URL(window.location.href).origin
  const link = `${domain}/rooms/pending?room_id=${data?.room_id}`

  setRoomLink(data.room_id)

  return { link, room_id: data?.room_id }
}

export const removeRoomLink = () => {
  Cookies.remove('echomingle_room')
}

export const setRoomLink = (room_id: string) => {
  Cookies.set('echomingle_room', room_id, {
    expires: 1 / 48, //30minutes
  })
}

export const getRoomLink = () => {
  return Cookies.get('echomingle_room')
}

export const getRoomById = async (room_id: string, userEmail: string) => {
  const { data } = await api.get(`/room/${room_id}/${userEmail}`)

  if (!data?.room_id) return null

  return data
}
