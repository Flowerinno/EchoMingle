interface ImageProps {
  src: string
  alt: string
  className?: string
}

/**
 * @param {string} src - image source
 * @param {string} alt - image alt
 * @param {string} className - image tailwind classes
 */

export const Image = ({ src, alt, className }: ImageProps) => {
  return <img draggable={false} src={src} alt={alt} className={className} />
}
