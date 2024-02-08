import { Button, TextField } from '@/components/modules'

interface LoginProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export const Login = ({ handleSubmit }: LoginProps) => {
  return (
    <form method='POST' onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <TextField name='email' type='email' required placeholder='email' autoComplete='email' />
      <input type='hidden' name='type' value='login' />
      <Button label='Login' type='submit' />
    </form>
  )
}
