import { Button } from '@/components/modules'
import { VerifyResponse } from '@/types/auth.types'
import { Lang } from '@/types/lang.types'
import { logout } from '@/utils'
import { useTranslation } from 'react-i18next'

import { useOutletContext } from 'react-router'

interface ProfileProps {
  lang: Lang | null
}

export const Profile = ({ lang }: ProfileProps) => {
  const { t, i18n } = useTranslation('profile')

  const user = useOutletContext<VerifyResponse>()

  const languageHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    i18n.changeLanguage(value)
    localStorage.setItem('lang', value)
  }

  return (
    <div className='min-h-screen w-11/12 flex justify-center mt-10'>
      <div className='rounded-md min-h-80 min-w-80 w-10/12 flex flex-col items-center gap-8'>
        <h1 className='font-bold text-2xl text-white'>{user.name}</h1>
        <ul>
          <li className='text-white'>
            <strong>Email: </strong> {user.email}
          </li>
        </ul>
        <select
          className='w-11/12 outline-none rounded-md p-1'
          onChange={languageHandler}
          defaultValue={lang ?? 'ua'}
        >
          <option className='p-1' value='ua'>
            Українська
          </option>
          <option value='en'>English</option>
        </select>
        <Button
          label={t('logout')}
          onClick={logout}
          className='w-11/12 border-red-400 hover:bg-red-400'
        />
      </div>
    </div>
  )
}
