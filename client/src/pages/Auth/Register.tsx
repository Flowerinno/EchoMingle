import { Button, TextField } from '@/components/modules'

interface RegisterProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export const Register = ({ handleSubmit }: RegisterProps) => {
  return (
    <form method='POST' onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <TextField name='name' type='text' required placeholder='name' autoComplete='name' />
      <TextField name='email' type='email' required placeholder='email' autoComplete='email' />
      <input type='hidden' name='type' value='register' />
      <Button label='Register' type='submit' />
    </form>
  )
}
