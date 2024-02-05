import moment from 'moment'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface PaymentButtonProps {
  buttonId: string
  paymentId: number
  type?: '1' | '12'
  expires_at?: Date
}

export const PaymentButton = ({ buttonId, type, expires_at, paymentId }: PaymentButtonProps) => {
  const { t } = useTranslation('payment_button')
  const [message, setMessage] = useState({
    title: '',
    expires_at: '',
  })
  const types = {
    1: t('types.1'),
    12: t('types.12'),
  }
  useEffect(() => {
    if (type && expires_at && type === paymentId.toString()) {
      setMessage({
        title: `${t('title_1')} ${types[type]} ${t('title_2')}`,
        expires_at: `${t('expires_at')} ${moment(expires_at).format('DD/MM/YYYY HH:mm')}`,
      })
    }
  }, [type])

  return (
    <div>
      <div className='flex flex-col gap-2 items-center justify-center max-w-80'>
        <h3 className='text-2xl text-white font-bold text-center'>{message.title}</h3>
        <p className='text-center text-yellow-200'>{message.expires_at}</p>
      </div>
      {!(type === paymentId.toString()) && (
        <stripe-buy-button
          buy-button-id={buttonId}
          publishable-key='pk_test_51NpGEPEQwGRtgrzo7JkIDSTFXeXyDRTQOeOf6eQ9QUsOuTy3NAIsKVJTwhu0bU15qCFS9fU8yNxz7ItMwiYkAwdh00Zzhr3are'
        ></stripe-buy-button>
      )}
    </div>
  )
}
