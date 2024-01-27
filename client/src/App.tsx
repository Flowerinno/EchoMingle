import { ToastContainer } from 'react-toastify'
import { AppRouter, ERoutes } from './routes'
import CookieConsent from 'react-cookie-consent'

function App() {
  return (
    <>
      <AppRouter />
      <ToastContainer hideProgressBar autoClose={3000} />
      <CookieConsent
        location='bottom'
        buttonText='Accept'
        cookieName='echomingleCookieConsent'
        style={{ background: '#2B373B' }}
        buttonStyle={{ color: '#4e503b', fontSize: '13px' }}
        expires={150}
      >
        This website uses cookies to enhance the user experience. By continuing to use this site,
        you are agreeing to our Privacy Policy.
      </CookieConsent>
    </>
  )
}

export default App
