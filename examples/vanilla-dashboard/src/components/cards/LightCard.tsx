import React from 'react'
import { Light } from 'react-homeassistant-headless'
import { Card, CardHeader, CardContent, CardFooter } from '../layout/Card'

interface LightCardProps {
  entityId: string
  name: string
}

export const LightCard = ({ entityId, name }: LightCardProps) => {
  return (
    <Light entityId={entityId}>
      {(light) => (
        <Card>
          <CardHeader 
            title={name}
            subtitle={light.isOn ? 'On' : 'Off'}
            action={
              <button 
                className={`toggle-switch ${light.isOn ? 'on' : ''}`}
                onClick={light.toggle}
                aria-label={`Toggle ${name}`}
              />
            }
          />
          
          {light.isOn && (
            <CardContent>
              <div className="light-controls">
                {light.supportsBrightness && (
                  <div className="control-row">
                    <label className="control-label">
                      Brightness: {light.brightnessPercent}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="255"
                      value={light.brightness}
                      onChange={(e) => light.setBrightness(parseInt(e.target.value))}
                      className="slider"
                    />
                  </div>
                )}

                {light.supportsRgb && (
                  <div className="control-row">
                    <label className="control-label">Colors:</label>
                    <div className="color-buttons">
                      <button 
                        className="color-btn" 
                        style={{ backgroundColor: '#ef4444' }}
                        onClick={() => light.setRgbColor([255, 0, 0])}
                        aria-label="Set to red"
                      />
                      <button 
                        className="color-btn" 
                        style={{ backgroundColor: '#10b981' }}
                        onClick={() => light.setRgbColor([0, 255, 0])}
                        aria-label="Set to green"
                      />
                      <button 
                        className="color-btn" 
                        style={{ backgroundColor: '#3b82f6' }}
                        onClick={() => light.setRgbColor([0, 0, 255])}
                        aria-label="Set to blue"
                      />
                      <button 
                        className="color-btn" 
                        style={{ backgroundColor: '#f59e0b' }}
                        onClick={() => light.setRgbColor([255, 165, 0])}
                        aria-label="Set to orange"
                      />
                      <button 
                        className="color-btn" 
                        style={{ backgroundColor: '#8b5cf6' }}
                        onClick={() => light.setRgbColor([139, 92, 246])}
                        aria-label="Set to purple"
                      />
                      <button 
                        className="color-btn" 
                        style={{ backgroundColor: '#ffffff', border: '2px solid #e5e7eb' }}
                        onClick={() => light.setRgbColor([255, 255, 255])}
                        aria-label="Set to white"
                      />
                    </div>
                  </div>
                )}

                {light.supportsEffects && light.availableEffects.length > 0 && (
                  <div className="control-row">
                    <label className="control-label">Effect:</label>
                    <select
                      value={(!light.effect || light.effect === 'off') ? '' : light.effect}
                      onChange={(e) => {
                        if (e.target.value === '') {
                          light.setEffect(null)
                        } else {
                          light.setEffect(e.target.value)
                        }
                      }}
                      style={{ 
                        padding: '0.5rem', 
                        borderRadius: '6px', 
                        border: '1px solid #d1d5db',
                        flex: 1
                      }}
                    >
                      <option value="">None</option>
                      {light.availableEffects
                        .filter(effect => effect.toLowerCase() !== 'none')
                        .map(effect => (
                          <option key={effect} value={effect}>{effect}</option>
                        ))}
                    </select>
                  </div>
                )}
              </div>
            </CardContent>
          )}

          <CardFooter>
            Features: {[
              light.supportsBrightness && 'Brightness',
              light.supportsRgb && 'RGB Color',
              light.supportsColorTemp && 'Color Temperature',
              light.supportsEffects && 'Effects'
            ].filter(Boolean).join(', ') || 'Basic On/Off'}
          </CardFooter>
        </Card>
      )}
    </Light>
  )
}