import React from 'react'
import { HAProvider } from 'hass-react'
import { ConnectionStatus } from './components/layout/ConnectionStatus'
import { LightCard, SwitchCard, SensorCard, FanCard, LockCard } from './components/cards'
import './styles/dashboard.css'

// Mock data for demo - simulating a typical smart home setup
const mockData = {
  // Living room lights with full RGB support
  'light.living_room_main': {
    entity_id: 'light.living_room_main',
    state: 'on',
    attributes: {
      friendly_name: 'Living Room Main Light',
      brightness: 180,
      rgb_color: [255, 255, 255],
      supported_features: 63, // Brightness + RGB + Effects
      effect_list: ['None', 'Colorloop', 'Breath', 'Strobe', 'Police'],
      effect: 'None'
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-1', parent_id: null, user_id: null }
  },
  'light.living_room_accent': {
    entity_id: 'light.living_room_accent',
    state: 'off',
    attributes: {
      friendly_name: 'Living Room Accent',
      brightness: 0,
      rgb_color: [255, 0, 0],
      supported_features: 63,
      effect_list: ['None', 'Colorloop', 'Breath', 'Strobe'],
      effect: 'None'
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-2', parent_id: null, user_id: null }
  },
  
  // Bedroom lights
  'light.bedroom_ceiling': {
    entity_id: 'light.bedroom_ceiling',
    state: 'on',
    attributes: {
      friendly_name: 'Bedroom Ceiling',
      brightness: 120,
      supported_features: 1, // Brightness only
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-3', parent_id: null, user_id: null }
  },
  'light.bedside_lamp': {
    entity_id: 'light.bedside_lamp',
    state: 'off',
    attributes: {
      friendly_name: 'Bedside Lamp',
      brightness: 0,
      rgb_color: [255, 180, 120],
      supported_features: 31, // Brightness + RGB
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-4', parent_id: null, user_id: null }
  },

  // Switches for various devices
  'switch.coffee_maker': {
    entity_id: 'switch.coffee_maker',
    state: 'off',
    attributes: {
      friendly_name: 'Coffee Maker',
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-5', parent_id: null, user_id: null }
  },
  'switch.desk_fan': {
    entity_id: 'switch.desk_fan',
    state: 'on',
    attributes: {
      friendly_name: 'Desk Fan',
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-6', parent_id: null, user_id: null }
  },
  'switch.outdoor_lights': {
    entity_id: 'switch.outdoor_lights',
    state: 'on',
    attributes: {
      friendly_name: 'Outdoor Lights',
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-7', parent_id: null, user_id: null }
  },

  // Environmental sensors
  'sensor.living_room_temperature': {
    entity_id: 'sensor.living_room_temperature',
    state: '72.5',
    attributes: {
      friendly_name: 'Living Room Temperature',
      unit_of_measurement: '°F',
      device_class: 'temperature',
      state_class: 'measurement'
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-8', parent_id: null, user_id: null }
  },
  'sensor.living_room_humidity': {
    entity_id: 'sensor.living_room_humidity',
    state: '45.2',
    attributes: {
      friendly_name: 'Living Room Humidity',
      unit_of_measurement: '%',
      device_class: 'humidity',
      state_class: 'measurement'
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-9', parent_id: null, user_id: null }
  },
  'sensor.outdoor_temperature': {
    entity_id: 'sensor.outdoor_temperature',
    state: '68.1',
    attributes: {
      friendly_name: 'Outdoor Temperature',
      unit_of_measurement: '°F',
      device_class: 'temperature',
      state_class: 'measurement'
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-10', parent_id: null, user_id: null }
  },
  'sensor.energy_usage': {
    entity_id: 'sensor.energy_usage',
    state: '2.45',
    attributes: {
      friendly_name: 'Current Energy Usage',
      unit_of_measurement: 'kW',
      device_class: 'power',
      state_class: 'measurement'
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-11', parent_id: null, user_id: null }
  },

  // Fans
  'fan.living_room_ceiling': {
    entity_id: 'fan.living_room_ceiling',
    state: 'on',
    attributes: {
      friendly_name: 'Living Room Ceiling Fan',
      percentage: 66,
      preset_modes: ['Auto', 'Sleep', 'Low', 'Medium', 'High'],
      preset_mode: 'Medium',
      oscillating: false,
      direction: 'forward',
      supported_features: 15, // Speed + Oscillate + Direction + Preset
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-12', parent_id: null, user_id: null }
  },
  'fan.bedroom_fan': {
    entity_id: 'fan.bedroom_fan',
    state: 'off',
    attributes: {
      friendly_name: 'Bedroom Fan',
      percentage: 0,
      preset_modes: ['Low', 'Medium', 'High'],
      preset_mode: null,
      oscillating: false,
      supported_features: 9, // Speed + Preset
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-13', parent_id: null, user_id: null }
  },

  // Locks
  'lock.front_door': {
    entity_id: 'lock.front_door',
    state: 'locked',
    attributes: {
      friendly_name: 'Front Door',
      changed_by: 'Manual',
      supported_features: 1, // Open support
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-14', parent_id: null, user_id: null }
  },
  'lock.back_door': {
    entity_id: 'lock.back_door',
    state: 'unlocked',
    attributes: {
      friendly_name: 'Back Door',
      changed_by: 'Key',
      supported_features: 0, // Basic lock/unlock only
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-15', parent_id: null, user_id: null }
  },
}

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Smart Home Dashboard</h1>
          <p className="dashboard-subtitle">Built with hass-react + shadcn/ui</p>
        </header>

        <ConnectionStatus />

        <section className="dashboard-section">
          <h2 className="section-title">💡 Lighting</h2>
          <div className="dashboard-grid">
            <LightCard entityId="living_room_main" name="Living Room Main" />
            <LightCard entityId="living_room_accent" name="Living Room Accent" />
            <LightCard entityId="bedroom_ceiling" name="Bedroom Ceiling" />
            <LightCard entityId="bedside_lamp" name="Bedside Lamp" />
          </div>
        </section>

        <section className="dashboard-section">
          <h2 className="section-title">🌪️ Fans</h2>
          <div className="dashboard-grid">
            <FanCard entityId="fan.living_room_ceiling" name="Living Room Ceiling Fan" />
            <FanCard entityId="fan.bedroom_fan" name="Bedroom Fan" />
          </div>
        </section>

        <section className="dashboard-section">
          <h2 className="section-title">🔒 Security</h2>
          <div className="dashboard-grid">
            <LockCard entityId="lock.front_door" name="Front Door" />
            <LockCard entityId="lock.back_door" name="Back Door" />
          </div>
        </section>

        <section className="dashboard-section">
          <h2 className="section-title">🔌 Devices & Switches</h2>
          <div className="dashboard-grid">
            <SwitchCard entityId="coffee_maker" name="Coffee Maker" icon="☕" />
            <SwitchCard entityId="desk_fan" name="Desk Fan" icon="🌪️" />
            <SwitchCard entityId="outdoor_lights" name="Outdoor Lights" icon="🏠" />
          </div>
        </section>

        <section className="dashboard-section">
          <h2 className="section-title">📊 Environmental Sensors</h2>
          <div className="dashboard-grid">
            <SensorCard 
              entityId="living_room_temperature" 
              name="Living Room Temperature"
              precision={1}
            />
            <SensorCard 
              entityId="living_room_humidity" 
              name="Living Room Humidity"
              precision={1}
            />
            <SensorCard 
              entityId="outdoor_temperature" 
              name="Outdoor Temperature"
              precision={1}
            />
            <SensorCard 
              entityId="energy_usage" 
              name="Current Energy Usage"
              precision={2}
            />
          </div>
        </section>

        <footer style={{ 
          marginTop: '3rem', 
          padding: '2rem', 
          background: 'rgba(255, 255, 255, 0.1)', 
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          color: 'white'
        }}>
          <h3>About This Example</h3>
          <p>
            This dashboard showcases the <strong>hass-react</strong> library with 
            <strong> shadcn/ui components</strong>. It demonstrates:
          </p>
          <ul style={{ marginTop: '1rem' }}>
            <li><strong>shadcn/ui integration</strong> - Beautiful, accessible components</li>
            <li><strong>Tailwind CSS styling</strong> - Modern utility-first CSS</li>
            <li><strong>Radix UI primitives</strong> - Robust, accessible foundations</li>
            <li><strong>TypeScript support</strong> - Type-safe Home Assistant integration</li>
            <li><strong>Mock mode</strong> - Perfect for development and demos</li>
          </ul>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
            Try toggling lights, adjusting brightness, changing colors, and exploring the different features!
          </p>
        </footer>
      </div>
    </div>
  )
}

const App = () => {
  return (
    <HAProvider 
      url="http://homeassistant.local:8123" 
      mockMode={true} 
      mockData={mockData}
    >
      <Dashboard />
    </HAProvider>
  )
}

export default App