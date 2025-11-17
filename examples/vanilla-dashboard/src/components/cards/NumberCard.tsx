import React from 'react'
import { Number } from 'hass-react'
import { Card, CardHeader, CardContent, CardFooter } from '../layout/Card'

interface NumberCardProps {
  entityId: string
  name: string
}

export const NumberCard = ({ entityId, name }: NumberCardProps) => {
  return (
    <Number entityId={entityId}>
      {(numberEntity) => (
        <Card>
          <CardHeader
            title={name}
            subtitle={numberEntity.deviceClass || 'Number'}
          />

          <CardContent>
            <div className="control-group">
              <div className="control-header">
                <span className="control-label">Value</span>
                <span className="control-value">
                  {numberEntity.value}{numberEntity.unit ? ` ${numberEntity.unit}` : ''}
                </span>
              </div>
              <input
                type="range"
                min={numberEntity.min}
                max={numberEntity.max}
                step={numberEntity.step}
                value={numberEntity.value}
                onChange={(e) => numberEntity.setValue(parseFloat(e.target.value))}
                className="slider"
              />
              <div className="control-header">
                <span className="control-value">{numberEntity.min}</span>
                <span className="control-value">{numberEntity.max}</span>
              </div>
            </div>

            <div className="button-group">
              <button
                onClick={numberEntity.decrement}
                disabled={numberEntity.value <= numberEntity.min}
                className="btn btn-secondary"
              >
                - Decrease
              </button>
              <button
                onClick={numberEntity.increment}
                disabled={numberEntity.value >= numberEntity.max}
                className="btn btn-secondary"
              >
                + Increase
              </button>
            </div>
          </CardContent>

          <CardFooter>
            <div className="badge-container">
              <span className="badge">Range: {numberEntity.min}-{numberEntity.max}</span>
            </div>
            <div className={`connection-indicator ${numberEntity.isConnected ? 'connected' : 'disconnected'}`}>
              <div className="connection-dot"></div>
              <span>{numberEntity.isConnected ? 'Online' : 'Offline'}</span>
            </div>
          </CardFooter>
        </Card>
      )}
    </Number>
  )
}
