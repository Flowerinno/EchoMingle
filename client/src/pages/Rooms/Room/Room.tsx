import { Button } from '@/components/modules'
import { socket } from '@/lib/ws'
import { useEffect, useState } from 'react'

export const Room = () => {
  const [message, setMessage] = useState('')

  socket.on('onError', (data) => {
    setMessage('')
    setMessage(data.message)
    return
  })

  const joinRoom = () => {
    if (socket.connected && socket?.id) {
      socket.emit('connectToRoom', {
        room_id: 'Test',
        username: 'Test',
        socket_id: socket?.id,
        user_id: '1234',
      })
    }
  }

  useEffect(() => {
    socket.connect()
  }, [])

  return (
    <div className='flex flex-col gap-5 items-center justify-center'>
      <h1 className='text-2xl text-yellow-200 font-bold'>You are about to join the room</h1>
      {message && <p className='text-red-300'>{message}</p>}
      <Button label={'Join'} onClick={joinRoom} />
      {/* <Button onClick={joinRoom} /> */}
    </div>
  )
}
