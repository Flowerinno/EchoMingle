interface ButtonProps {
  label: string | number
  onClick?: () => void
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
}

const styles = {
  small: 'p-1 w-3/12',
  medium: 'p-2 w-6/12',
  large: 'p-4 w-9/12',
}

export const Button = ({ label, onClick, disabled, size = 'medium' }: ButtonProps) => {
  const SIZE = styles[size]

  return (
    <button
      className={`border-2 border-yellow-200 rounded-md ${SIZE} font-bold hover:bg-yellow-200 hover:text-black transition-colors duration-300 ease-in-out`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  )
}
