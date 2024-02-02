import Cookies from 'js-cookie'

export const getToken = () => {
  return Cookies.get('echomingle_user_token')
}

export const setToken = (token: string) => {
  Cookies.set('echomingle_user_token', token, { expires: 7 })
}
