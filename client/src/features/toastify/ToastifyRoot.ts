import { toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

enum E_Toastify {
  success = 'success',
  error = 'error',
}

const position = 'bottom-right'

type ToastifyRootType = {
  [E_Toastify.success]: (text: string) => void
  [E_Toastify.error]: (text: string) => void
}

export const ToastifyRoot: ToastifyRootType = {
  [E_Toastify.success]: (text: string) => {
    return toast.success(text, {
      position,
    })
  },
  [E_Toastify.error]: (text: string) => {
    return toast.error(text, {
      position,
    })
  },
}
