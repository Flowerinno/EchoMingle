import FirstImage from '@/assets/images/Home/1.png'

import { Button, Plan } from '@/components/modules'
import { ERoutes } from '@/routes'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

export const Home = () => {
  const { t } = useTranslation('home')
  const navigate = useNavigate()

  const onClick = () => {
    navigate(ERoutes.profile)
  }

  const mockedPlans = [
    {
      id: 1,
      title: t('section_2.plans.free.title'),
      description: t('section_2.plans.free.description'),
      price: '0$',
      href: '/plans/checkout/1',
    },
    {
      id: 2,
      title: t('section_2.plans.yearly.title'),
      description: t('section_2.plans.yearly.description'),
      price: '29.99$',
      href: '/plans/checkout/2',
    },
    {
      id: 3,
      title: t('section_2.plans.enterprise.title'),
      description: t('section_2.plans.enterprise.description'),
      price: 'Contact us',
      href: '/plans/checkout/3',
    },
  ]

  return (
    <div
      className='p-5 relative flex flex-col gap-10 items-center w-full bg-fixed'
      style={{
        backgroundImage: `url(${FirstImage})`,
        backgroundPositionY: 'top',
        backgroundSize: 'cover',
      }}
    >
      <section
        id='section-1'
        className='z-10 flex flex-col items-start  gap-5 text-white w-11/12 md:w-9/12'
      >
        <h1 className='font-bold text-4xl select-none text-yellow-200'>{t('title')}</h1>
        <p className='text-2xl w-11/12 md:full font-bold'>{t('subtitle')}</p>
        <p className='text-2xl w-11/12 md:full font-bold'>{t('subtitle_1')}</p>
        <span className='text-sm w-11/12 md:full font-bold text-yellow-200'>{t('subtitle_2')}</span>
        <Button label='Mingle now!' className='w-full' onClick={onClick} />
      </section>
      <section
        className=' bottom-40 flex flex-col items-start gap-5 text-white w-11/12 md:w-9/12'
        id='section-2'
      >
        <h1 className='font-bold text-4xl select-none text-yellow-200'>{t('section_2.title')}</h1>
        <p className='text-2xl w-11/12 md:full font-bold'>{t('subtitle')}</p>
        <div className='flex flex-row flex-wrap justify-around gap-5 w-11/12'>
          {mockedPlans.map((plan, index) => {
            return <Plan key={index} {...plan} />
          })}
        </div>
      </section>
    </div>
  )
}
