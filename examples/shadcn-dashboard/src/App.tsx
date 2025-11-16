import { HAProvider } from 'hass-react'
import { ConnectionStatus } from './components/layout/ConnectionStatus'
import { LightCard, SwitchCard, SensorCard, BinarySensorCard, TodoCard, FanCard, LockCard, CoverCard, MediaPlayerCard, CameraCard } from './components/cards'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs'
import { Lightbulb, Thermometer, Shield, Music, ListTodo } from 'lucide-react'
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

  // Covers
  'cover.garage_door': {
    entity_id: 'cover.garage_door',
    state: 'closed',
    attributes: {
      friendly_name: 'Garage Door',
      current_position: 0,
      device_class: 'garage',
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-16', parent_id: null, user_id: null }
  },
  'cover.living_room_blinds': {
    entity_id: 'cover.living_room_blinds',
    state: 'open',
    attributes: {
      friendly_name: 'Living Room Blinds',
      current_position: 85,
      device_class: 'blind',
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-17', parent_id: null, user_id: null }
  },
  'cover.bedroom_curtains': {
    entity_id: 'cover.bedroom_curtains',
    state: 'opening',
    attributes: {
      friendly_name: 'Bedroom Curtains',
      current_position: 45,
      device_class: 'curtain',
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-18', parent_id: null, user_id: null }
  },

  // Binary Sensors
  'binary_sensor.front_door': {
    entity_id: 'binary_sensor.front_door',
    state: 'off',
    attributes: {
      friendly_name: 'Front Door',
      device_class: 'door',
      icon: 'mdi:door'
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-19', parent_id: null, user_id: null }
  },
  'binary_sensor.motion_sensor': {
    entity_id: 'binary_sensor.motion_sensor',
    state: 'on',
    attributes: {
      friendly_name: 'Living Room Motion',
      device_class: 'motion',
      icon: 'mdi:motion-sensor'
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-20', parent_id: null, user_id: null }
  },
  'binary_sensor.bedroom_window': {
    entity_id: 'binary_sensor.bedroom_window',
    state: 'on',
    attributes: {
      friendly_name: 'Bedroom Window',
      device_class: 'opening',
      icon: 'mdi:window-open'
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-21', parent_id: null, user_id: null }
  },

  // Todo lists
  'todo.shopping_list': {
    entity_id: 'todo.shopping_list',
    state: '2',
    attributes: {
      friendly_name: 'Shopping List',
      supported_features: 15, // All features
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-22', parent_id: null, user_id: null }
  },
  'todo.weekend_projects': {
    entity_id: 'todo.weekend_projects',
    state: '2',
    attributes: {
      friendly_name: 'Weekend Projects',
      supported_features: 15, // All features
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-23', parent_id: null, user_id: null }
  },

  // Cameras
  'camera.front_door': {
    entity_id: 'camera.front_door',
    state: 'idle',
    attributes: {
      friendly_name: 'Front Door Camera',
      access_token: 'mock_token_front_door',
      supported_features: 3, // SUPPORT_ON_OFF (1) + SUPPORT_STREAM (2)
      brand: 'Nest',
      model: 'Cam IQ',
      motion_detection: true,
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-24', parent_id: null, user_id: null }
  },
  'camera.backyard': {
    entity_id: 'camera.backyard',
    state: 'recording',
    attributes: {
      friendly_name: 'Backyard Camera',
      access_token: 'mock_token_backyard',
      supported_features: 3,
      brand: 'Ring',
      model: 'Spotlight Cam',
      motion_detection: true,
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-25', parent_id: null, user_id: null }
  },
  'camera.garage': {
    entity_id: 'camera.garage',
    state: 'off',
    attributes: {
      friendly_name: 'Garage Camera',
      access_token: 'mock_token_garage',
      supported_features: 1, // SUPPORT_ON_OFF only, no streaming
      brand: 'Wyze',
      model: 'Cam v3',
      motion_detection: false,
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-26', parent_id: null, user_id: null }
  },

  // Media Players
  'media_player.living_room_speaker': {
    entity_id: 'media_player.living_room_speaker',
    state: 'playing',
    attributes: {
      friendly_name: 'Living Room Speaker',
      media_title: 'Bohemian Rhapsody',
      media_artist: 'Queen',
      media_album_name: 'A Night at the Opera',
      media_duration: 354,
      media_position: 120,
      volume_level: 0.65,
      is_volume_muted: false,
      source: 'Spotify',
      source_list: ['Spotify', 'Bluetooth', 'AirPlay', 'Line In'],
      supported_features: 20925, // Play, Pause, Volume, Seek, Source selection
      app_name: 'Spotify'
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-27', parent_id: null, user_id: null }
  },
  'media_player.kitchen_display': {
    entity_id: 'media_player.kitchen_display',
    state: 'paused',
    attributes: {
      friendly_name: 'Kitchen Display',
      media_title: 'Morning News',
      media_artist: 'NPR',
      volume_level: 0.4,
      is_volume_muted: false,
      source: 'Radio',
      source_list: ['Radio', 'Bluetooth', 'USB'],
      supported_features: 20925,
      app_name: 'NPR One'
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-28', parent_id: null, user_id: null }
  },
  'media_player.bedroom_tv': {
    entity_id: 'media_player.bedroom_tv',
    state: 'off',
    attributes: {
      friendly_name: 'Bedroom TV',
      volume_level: 0.3,
      is_volume_muted: true,
      source: 'HDMI 1',
      source_list: ['HDMI 1', 'HDMI 2', 'Netflix', 'YouTube'],
      supported_features: 20925
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-29', parent_id: null, user_id: null }
  },
}

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Smart Home</h1>
              <p className="text-sm text-slate-400">Manage your connected devices</p>
            </div>
            <ConnectionStatus />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

        <Tabs defaultValue="lighting" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-slate-800/50 border border-slate-700/50 h-auto p-1">
            <TabsTrigger
              value="lighting"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white text-slate-300"
            >
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">Lighting & Power</span>
            </TabsTrigger>
            <TabsTrigger
              value="climate"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white text-slate-300"
            >
              <Thermometer className="h-4 w-4" />
              <span className="hidden sm:inline">Climate & Environment</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white text-slate-300"
            >
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger
              value="entertainment"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white text-slate-300"
            >
              <Music className="h-4 w-4" />
              <span className="hidden sm:inline">Entertainment</span>
            </TabsTrigger>
            <TabsTrigger
              value="productivity"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white text-slate-300"
            >
              <ListTodo className="h-4 w-4" />
              <span className="hidden sm:inline">Productivity</span>
            </TabsTrigger>
          </TabsList>

          {/* Lighting & Power Tab */}
          <TabsContent value="lighting" className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">Lights</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <LightCard entityId="living_room_main" name="Living Room Main" />
                <LightCard entityId="living_room_accent" name="Living Room Accent" />
                <LightCard entityId="bedroom_ceiling" name="Bedroom Ceiling" />
                <LightCard entityId="bedside_lamp" name="Bedside Lamp" />
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">Switches</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <SwitchCard entityId="coffee_maker" name="Coffee Maker" />
                <SwitchCard entityId="desk_fan" name="Desk Fan" />
                <SwitchCard entityId="outdoor_lights" name="Outdoor Lights" />
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">Fans</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FanCard entityId="fan.living_room_ceiling" name="Living Room Ceiling Fan" />
                <FanCard entityId="fan.bedroom_fan" name="Bedroom Fan" />
              </div>
            </section>
          </TabsContent>

          {/* Climate & Environment Tab */}
          <TabsContent value="climate" className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">Sensors</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">Binary Sensors</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <BinarySensorCard entityId="binary_sensor.front_door" name="Front Door" />
                <BinarySensorCard entityId="binary_sensor.motion_sensor" name="Living Room Motion" />
                <BinarySensorCard entityId="binary_sensor.bedroom_window" name="Bedroom Window" />
              </div>
            </section>
          </TabsContent>

          {/* Security & Access Tab */}
          <TabsContent value="security" className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">Cameras</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <CameraCard entityId="camera.front_door" name="Front Door Camera" />
                <CameraCard entityId="camera.backyard" name="Backyard Camera" />
                <CameraCard entityId="camera.garage" name="Garage Camera" />
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">Locks</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <LockCard entityId="lock.front_door" name="Front Door" />
                <LockCard entityId="lock.back_door" name="Back Door" />
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">Covers</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <CoverCard entityId="cover.garage_door" name="Garage Door" />
                <CoverCard entityId="cover.living_room_blinds" name="Living Room Blinds" />
                <CoverCard entityId="cover.bedroom_curtains" name="Bedroom Curtains" />
              </div>
            </section>
          </TabsContent>

          {/* Entertainment Tab */}
          <TabsContent value="entertainment" className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">Media Players</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <MediaPlayerCard entityId="media_player.living_room_speaker" name="Living Room Speaker" />
                <MediaPlayerCard entityId="media_player.kitchen_display" name="Kitchen Display" />
                <MediaPlayerCard entityId="media_player.bedroom_tv" name="Bedroom TV" />
              </div>
            </section>
          </TabsContent>

          {/* Productivity Tab */}
          <TabsContent value="productivity" className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">Todo Lists</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <TodoCard entityId="todo.shopping_list" name="Shopping List" />
                <TodoCard entityId="todo.weekend_projects" name="Weekend Projects" />
              </div>
            </section>
          </TabsContent>
        </Tabs>

        <footer className="mt-16 pt-8 border-t border-slate-700/30 text-slate-400 text-sm">
          <h3 className="text-white text-lg font-semibold mb-4">
            About This Example
          </h3>
          <p className="mb-4">
            This dashboard showcases the <strong>hass-react</strong> library with
            <strong> shadcn/ui components</strong>. It demonstrates:
          </p>
          <ul className="mt-3 ml-5 space-y-1">
            <li><strong>shadcn/ui integration</strong> - Accessible components</li>
            <li><strong>Tailwind CSS styling</strong> - Modern utility-first CSS</li>
            <li><strong>Radix UI primitives</strong> - Robust, accessible foundations</li>
            <li><strong>TypeScript support</strong> - Type-safe Home Assistant integration</li>
            <li><strong>Mock mode</strong> - Perfect for development and demos</li>
          </ul>
          <p className="mt-4 opacity-70">
            Navigate through the tabs to explore different entity types and features!
          </p>
        </footer>
      </div>
    </div>
  )
}

export const App = () => {
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

