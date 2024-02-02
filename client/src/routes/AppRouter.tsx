import { Main } from '@/components'
import { Auth, Contact, Home, Pending, Plans, Privacy, Profile, Room, Rooms, Terms } from '@/pages'
import { Route, Routes, useLocation } from 'react-router'

import { Protected } from '@/auth/Protected'
import { NotFound } from '@/pages/NotFound'
import { Lang } from '@/types/lang.types'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ERoutes } from './routes'

export const AppRouter = () => {
  const location = useLocation()
  const { i18n } = useTranslation()
  const lang = localStorage.getItem('lang') as Lang | null

  useEffect(() => {
    if (lang) {
      i18n.changeLanguage(lang)
    }
  }, [])

  return (
    <Routes>
      <Route element={<Main />}>
        <Route path={ERoutes.home} element={<Home />} />
        <Route path={ERoutes.auth} element={<Auth />} />
        <Route path={ERoutes.privacy} element={<Privacy />} />
        <Route path={ERoutes.terms} element={<Terms />} />
        <Route path={ERoutes.plans} element={<Plans />} />
        <Route path={ERoutes.contact} element={<Contact />} />
        <Route element={<Protected />}>
          <Route path={ERoutes.rooms} element={<Rooms />} />
          <Route path={ERoutes.profile} element={<Profile lang={lang} />} />
          <Route path={ERoutes.pending} element={<Pending />} />
          <Route path={ERoutes.room} element={<Room />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  )
}
