interface TextFieldProps {
  type?: 'text' | 'password' | 'email'
  required?: boolean
  placeholder?: string
  className?: string
  name?: string
  autoComplete?: string
}

export const TextField = ({
  type = 'text',
  placeholder = '',
  className,
  name = '',
  required = false,
  autoComplete = '',
}: TextFieldProps) => {
  return (
    <input
      type={type}
      name={name}
      autoComplete={autoComplete}
      required={required}
      placeholder={placeholder}
      className={`border-2 p-2 rounded-md border-yellow-200 text-black flex flex-row gap-2 w-full text-center items-center justify-center ${className}`}
    />
  )
}
