import React from 'react'
import { Switch } from 'hass-react'
import { Card, CardHeader, CardContent, CardFooter } from '../layout/Card'

interface SwitchCardProps {
  entityId: string
  name: string
}

const SwitchCard = ({ entityId, name }: SwitchCardProps) => {
  return (
    <Switch entityId={entityId}>
      {(switchEntity) => (
        <Card>
          <CardHeader
            title={name}
            subtitle={switchEntity.isOn ? 'On' : 'Off'}
            action={
              <label className="switch-toggle">
                <input
                  type="checkbox"
                  checked={switchEntity.isOn}
                  onChange={switchEntity.toggle}
                />
                <span className="switch-toggle-slider"></span>
              </label>
            }
          />

          <CardContent>
            <div className="card-info">
              Last changed: {switchEntity.lastChanged.toLocaleTimeString()}
            </div>
          </CardContent>

          <CardFooter>
            <div className={`connection-indicator ${switchEntity.isConnected ? 'connected' : 'disconnected'}`}>
              <div className="connection-dot"></div>
              <span>{switchEntity.isConnected ? 'Online' : 'Offline'}</span>
            </div>
          </CardFooter>
        </Card>
      )}
    </Switch>
  )
}

export default SwitchCard
