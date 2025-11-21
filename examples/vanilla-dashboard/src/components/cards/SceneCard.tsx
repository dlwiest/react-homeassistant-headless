import React, { useState } from 'react'
import { Scene } from 'hass-react'
import { Card, CardHeader, CardContent, CardFooter } from '../layout/Card'

interface SceneCardProps {
  entityId: string
  name: string
}

export const SceneCard = ({ entityId, name }: SceneCardProps) => {
  const [transition, setTransition] = useState(0)

  return (
    <Scene entityId={entityId}>
      {(scene) => (
        <Card>
          <CardHeader
            title={name}
            subtitle={scene.attributes.friendly_name || 'Scene'}
            action={
              <button
                onClick={() => scene.activate(transition > 0 ? transition : undefined)}
                className="media-button"
              >
                Activate
              </button>
            }
          />

          <CardContent>
            <div className="card-info" style={{ marginBottom: '1em' }}>
              Last changed: {scene.lastChanged.toLocaleTimeString()}
            </div>

            <div style={{ marginTop: '1em' }}>
              <label style={{ display: 'block', marginBottom: '0.5em', fontSize: '0.9em', opacity: 0.9 }}>
                Transition (seconds):
              </label>
              <input
                type="number"
                min="0"
                max="60"
                value={transition}
                onChange={(e) => setTransition(parseInt(e.target.value) || 0)}
                className="select-input"
                style={{
                  width: '100%',
                  WebkitAppearance: 'none',
                  MozAppearance: 'textfield'
                }}
              />
            </div>
          </CardContent>

          <CardFooter>
            <div className={`connection-indicator ${scene.isConnected ? 'connected' : 'disconnected'}`}>
              <div className="connection-dot"></div>
              <span>{scene.isConnected ? 'Online' : 'Offline'}</span>
            </div>
          </CardFooter>
        </Card>
      )}
    </Scene>
  )
}
