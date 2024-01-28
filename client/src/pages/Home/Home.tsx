import FirstImage from '@/assets/images/Home/1.png'
import ThirdImage from '@/assets/images/Home/3.jpg'

import { Image } from '@/components/modules'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export const Home = () => {
  const { t } = useTranslation('home')

  const [activeSection, setActiveSection] = useState('section-1')

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const sections = document.querySelectorAll('section')

      sections.forEach((section) => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.offsetHeight

        if (
          scrollPosition >= sectionTop - 200 &&
          scrollPosition < sectionTop + sectionHeight - 50
        ) {
          setActiveSection(section.id)
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const handleUrlAnchorChange = () => {
      const sectionFromUrl = window.location.hash.substring(1)
      setActiveSection(sectionFromUrl)
    }

    window.addEventListener('hashchange', handleUrlAnchorChange)
    return () => {
      window.removeEventListener('hashchange', handleUrlAnchorChange)
    }
  }, [])

  useEffect(() => {
    window.location.hash = activeSection
  }, [activeSection])

  return (
    <div className='p-5 relative'>
      <section className='z-10 absolute top-5 flex flex-col gap-5 text-white' id='section-1'>
        <h1 className='font-bold text-4xl select-none'>{t('title')}</h1>
        <p className='text-2xl w-11/12 md:full font-bold'>{t('subtitle')}</p>
      </section>
      <Image src={FirstImage} alt='Landing Page EchoMingle' className='p-2 select-none' />
      <section id='section-2' className='h-96'>
        123
      </section>
      <section id='section-3' className='h-96'>
        123
      </section>
    </div>
  )
}
