import { toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

export enum E_Toastify {
  success = 'success',
  error = 'error',
}

const position = 'bottom-right'

export const ToastifyRoot = {
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
