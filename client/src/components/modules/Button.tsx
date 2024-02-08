interface ButtonProps {
  label: string | number
  onClick?: () => void
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
  value?: string
  name?: string
}

const defaultStyle =
  'border-2 border-yellow-200 rounded-md  font-bold hover:bg-yellow-200 hover:text-black transition-colors duration-300 ease-in-out p-5'

export const Button = ({
  label,
  onClick,
  disabled,
  className,
  type = 'button',
  value = '',
  name = '',
}: ButtonProps) => {
  const style = className ? `${defaultStyle} ${className}` : defaultStyle

  return (
    <button
      type={type}
      className={style}
      onClick={onClick}
      disabled={disabled}
      value={value}
      name={name}
    >
      {label}
    </button>
  )
}
