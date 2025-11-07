import { Switch } from 'react-homeassistant-headless'
import { Card, CardHeader, CardFooter } from '../layout/Card'

interface SwitchCardProps {
  entityId: string
  name: string
  icon?: string
}

export const SwitchCard = ({ entityId, name, icon = '🔌' }: SwitchCardProps) => {
  return (
    <Switch entityId={entityId}>
      {(switchEntity) => (
        <Card>
          <CardHeader 
            title={name}
            subtitle={switchEntity.isOn ? 'On' : 'Off'}
            action={
              <button 
                className={`toggle-switch ${switchEntity.isOn ? 'on' : ''}`}
                onClick={switchEntity.toggle}
                aria-label={`Toggle ${name}`}
              />
            }
          />
          
          <div style={{ 
            textAlign: 'center', 
            fontSize: '3rem', 
            margin: '1rem 0',
            opacity: switchEntity.isOn ? 1 : 0.3,
            transition: 'opacity 0.3s ease'
          }}>
            {icon}
          </div>

          <CardFooter>
            Last changed: {switchEntity.lastChanged.toLocaleTimeString()}
          </CardFooter>
        </Card>
      )}
    </Switch>
  )
}