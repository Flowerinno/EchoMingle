import { ToastContainer } from 'react-toastify'
import { AppRouter } from './routes'

function App() {
  return (
    <>
      <AppRouter />
      <ToastContainer hideProgressBar autoClose={3000} />
    </>
  )
}

export default App
