import { CSSProperties, useState, useEffect } from 'react'

export interface ImageProps {
  url: string | null
  alt?: string
  style?: CSSProperties
  className?: string
  onError?: () => void
}

export function Image({
  url,
  alt = 'Camera image',
  style,
  className,
  onError
}: ImageProps) {
  const [hasError, setHasError] = useState(false)

  // Reset error state when URL changes
  useEffect(() => {
    setHasError(false)
  }, [url])

  if (!url || hasError) {
    return null
  }

  const defaultStyle: CSSProperties = {
    width: '100%',
    maxWidth: '640px',
    height: 'auto',
    display: 'block',
    ...style
  }

  return (
    <img
      src={url}
      alt={alt}
      style={defaultStyle}
      className={className}
      onError={() => {
        setHasError(true)
        onError?.()
      }}
    />
  )
}
