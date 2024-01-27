import { Routes, Route } from 'react-router'
import { Main } from '../components'
import { Home, Auth, Privacy, Terms, Profile, Plans, Contact } from '../pages'

import { ERoutes } from './routes'

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<Main />}>
        <Route path={ERoutes.home} element={<Home />} />
        <Route path={ERoutes.auth} element={<Auth />} />
        <Route path={ERoutes.privacy} element={<Privacy />} />
        <Route path={ERoutes.terms} element={<Terms />} />
        <Route path={ERoutes.profile} element={<Profile />} />
        <Route path={ERoutes.plans} element={<Plans />} />
        <Route path={ERoutes.contact} element={<Contact />} />
      </Route>
    </Routes>
  )
}
