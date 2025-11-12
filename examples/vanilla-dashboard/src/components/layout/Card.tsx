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
  subtitle?: string | ReactNode
  action?: ReactNode
  icon?: string
}

export const CardHeader = ({ title, subtitle, action, icon }: CardHeaderProps) => {
  return (
    <div className="card-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {icon && <span style={{ fontSize: '1.5rem' }}>{icon}</span>}
        <div>
          <h3 className="card-title">{title}</h3>
          {subtitle && (
            typeof subtitle === 'string' ? 
              <p className="card-subtitle">{subtitle}</p> : 
              <div className="card-subtitle">{subtitle}</div>
          )}
        </div>
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