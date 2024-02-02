import CookieConsent from 'react-cookie-consent'
import { ToastContainer } from 'react-toastify'
import { AppRouter } from './routes'

function App() {
  return (
    <>
      <AppRouter />
      <ToastContainer closeOnClick hideProgressBar autoClose={1500} />
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
