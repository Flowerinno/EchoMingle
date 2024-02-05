import { Each, PaymentButton, Spinner } from '@/components/modules'
import { VerifyResponse } from '@/types/auth.types'
import { useTranslation } from 'react-i18next'
import { useOutletContext } from 'react-router'

export const Plans = () => {
  const { t } = useTranslation('plans')

  const user = useOutletContext<VerifyResponse>()

  const plans = [
    {
      id: 1,
      buttonId: 'buy_btn_1OgBnCEQwGRtgrzoBrGy1pfr',
    },
    {
      id: 12,
      buttonId: 'buy_btn_1OgCAGEQwGRtgrzokZdv9Mvn',
    },
  ]

  if (!user) return <Spinner />

  return (
    <div className='flex flex-col items-center p-10 gap-5'>
      <h2 className='text-2xl text-white font-bold text-center'>{t('title')}</h2>
      <p className='text-center'>{t('custom')}</p>
      <div className='flex flex-row flex-wrap justify-evenly p-10 gap-5'>
        <Each
          of={plans}
          render={(plan, index) => (
            <PaymentButton
              key={index}
              paymentId={plan.id}
              buttonId={plan.buttonId}
              type={user?.subscription.type}
              expires_at={user?.subscription.expires_at}
            />
          )}
        />
      </div>
    </div>
  )
}
