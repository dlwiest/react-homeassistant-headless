import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  )
}

interface CardHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export const CardHeader = ({ title, subtitle, action }: CardHeaderProps) => {
  return (
    <div className="card-header">
      <div>
        <h3 className="card-title">{title}</h3>
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

interface CardContentProps {
  children: ReactNode
}

export const CardContent = ({ children }: CardContentProps) => {
  return <div className="card-content">{children}</div>
}

interface CardFooterProps {
  children: ReactNode
}

export const CardFooter = ({ children }: CardFooterProps) => {
  return <div className="card-footer">{children}</div>
}