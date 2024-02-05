import { checkSession } from '@/api/payment'
import { Spinner } from '@/components/modules'
import { VerifyResponse } from '@/types/auth.types'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useOutletContext } from 'react-router'

const types = {
  1: 'Enjoy your monthly subscription!',
  12: 'Enjoy your yearly subscription!',
}

export const Payment = () => {
  const [subscription, setSubscription] = useState('')
  const [isCalled, setIsCalled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const session_id = new URLSearchParams(location.search).get('session_id') as string
  const user = useOutletContext<VerifyResponse>()

  useEffect(() => {
    const fetchData = async () => {
      if (!session_id) {
        navigate('/')
        return
      }
      if (!isCalled) {
        const res = await checkSession(session_id, user.id)
        if (res) {
          setSubscription(types[res.type])
          setIsCalled(true)
        }
      }
    }

    fetchData()
  }, [])

  if (!subscription) return <Spinner />

  return (
    <div>
      <h2 className='text-white font-bold text-2xl text-center p-4'>
        Thank you for mingling with us! <strong className='text-yellow-200'>{subscription}</strong>{' '}
        If you have any questions, please don't hesitate to contact us.
      </h2>
    </div>
  )
}
