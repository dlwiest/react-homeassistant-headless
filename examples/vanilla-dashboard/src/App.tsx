import React from 'react'
import { HAProvider } from 'hass-react'
import { ConnectionStatus } from './components/layout/ConnectionStatus'
import { UserGreeting } from './components/layout/UserGreeting'
import { LightCard, SwitchCard, SensorCard, BinarySensorCard, TodoCard, FanCard, LockCard, CoverCard, MediaPlayerCard, CameraCard, NumberCard, ClimateCard, WeatherCard, VacuumCard, CalendarCard, SceneCard, AlarmControlPanelCard } from './components/cards'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs'
import { Lightbulb, Thermometer, Shield, Music, ListTodo } from 'lucide-react'
import './styles/dashboard.css'
import './components/ui/tabs.css'

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

  // Calendar
  'calendar.personal': {
    entity_id: 'calendar.personal',
    state: 'on', // Event currently happening
    attributes: {
      friendly_name: 'Personal Calendar',
      message: 'Team Standup',
      all_day: false,
      start_time: new Date(Date.now() - 60 * 60 * 1000).toISOString().slice(0, 19),
      end_time: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 19),
      location: 'Conference Room A',
      description: 'Daily team sync',
      supported_features: 7, // CREATE_EVENT (1) + DELETE_EVENT (2) + UPDATE_EVENT (4)
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-24', parent_id: null, user_id: null }
  },

  // Scenes
  'scene.movie_night': {
    entity_id: 'scene.movie_night',
    state: 'scening',
    attributes: {
      friendly_name: 'Movie Night',
      icon: 'mdi:movie'
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-25', parent_id: null, user_id: null }
  },
  'scene.bright': {
    entity_id: 'scene.bright',
    state: 'scening',
    attributes: {
      friendly_name: 'Bright',
      icon: 'mdi:brightness-7'
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-26', parent_id: null, user_id: null }
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

  // Climate entities
  'climate.living_room': {
    entity_id: 'climate.living_room',
    state: 'heat',
    attributes: {
      friendly_name: 'Living Room Thermostat',
      current_temperature: 70,
      temperature: 72,
      min_temp: 50,
      max_temp: 90,
      hvac_modes: ['off', 'heat', 'cool', 'auto'],
      hvac_mode: 'heat',
      fan_modes: ['auto', 'low', 'medium', 'high'],
      fan_mode: 'auto',
      supported_features: 27, // Temperature + fan mode + HVAC mode
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-27', parent_id: null, user_id: null }
  },

  // Number entities
  'number.speaker_volume': {
    entity_id: 'number.speaker_volume',
    state: '65',
    attributes: {
      friendly_name: 'Speaker Volume',
      min: 0,
      max: 100,
      step: 1,
      unit_of_measurement: '%',
      mode: 'slider',
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-28', parent_id: null, user_id: null }
  },
  'number.brightness_threshold': {
    entity_id: 'number.brightness_threshold',
    state: '50',
    attributes: {
      friendly_name: 'Brightness Threshold',
      min: 0,
      max: 100,
      step: 1,
      unit_of_measurement: '%',
      mode: 'box',
      device_class: 'illuminance'
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-29', parent_id: null, user_id: null }
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
    context: { id: 'context-30', parent_id: null, user_id: null }
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
    context: { id: 'context-31', parent_id: null, user_id: null }
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
    context: { id: 'context-32', parent_id: null, user_id: null }
  },

  // Weather
  'weather.home': {
    entity_id: 'weather.home',
    state: 'sunny',
    attributes: {
      friendly_name: 'Home Weather',
      temperature: 72,
      temperature_unit: '°F',
      humidity: 45,
      pressure: 29.92,
      pressure_unit: 'inHg',
      wind_speed: 8,
      wind_speed_unit: 'mph',
      wind_bearing: 180,
      visibility: 10,
      visibility_unit: 'mi',
      cloud_coverage: 15,
      dew_point: 48,
      apparent_temperature: 70,
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-33', parent_id: null, user_id: null }
  },

  // Vacuum
  'vacuum.roborock': {
    entity_id: 'vacuum.roborock',
    state: 'cleaning',
    attributes: {
      friendly_name: 'Roborock S7',
      battery_level: 85,
      fan_speed: 'Turbo',
      fan_speed_list: ['Silent', 'Standard', 'Medium', 'Turbo'],
      status: 'Cleaning living room',
      supported_features: 14204, // Start, Pause, Stop, Return Home, Fan Speed, Locate, Clean Spot
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-34', parent_id: null, user_id: null }
  },

  // Alarm Control Panel
  'alarm_control_panel.home': {
    entity_id: 'alarm_control_panel.home',
    state: 'disarmed',
    attributes: {
      friendly_name: 'Home Security System',
      code_format: 'number',
      changed_by: 'Manual',
      code_arm_required: false,
      supported_features: 63, // All arming modes + trigger
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-35', parent_id: null, user_id: null }
  },
}

const Dashboard = () => {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div>
            <h1 className="dashboard-title">Smart Home</h1>
            <p className="dashboard-subtitle">Manage your connected devices</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <UserGreeting />
            <ConnectionStatus />
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        <Tabs defaultValue="lighting" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-slate-800/50 border border-slate-700/50 h-auto p-1">
            <TabsTrigger value="lighting" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">Lighting & Power</span>
            </TabsTrigger>
            <TabsTrigger value="climate" className="flex items-center gap-2">
              <Thermometer className="h-4 w-4" />
              <span className="hidden sm:inline">Climate & Environment</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="entertainment" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              <span className="hidden sm:inline">Entertainment</span>
            </TabsTrigger>
            <TabsTrigger value="productivity" className="flex items-center gap-2">
              <ListTodo className="h-4 w-4" />
              <span className="hidden sm:inline">Productivity</span>
            </TabsTrigger>
          </TabsList>

          {/* Lighting & Power Tab */}
          <TabsContent value="lighting" className="space-y-6">
            <section>
              <h2 className="section-title">Lights</h2>
              <div className="dashboard-grid">
                <LightCard entityId="living_room_main" name="Living Room Main" />
                <LightCard entityId="living_room_accent" name="Living Room Accent" />
                <LightCard entityId="bedroom_ceiling" name="Bedroom Ceiling" />
                <LightCard entityId="bedside_lamp" name="Bedside Lamp" />
              </div>
            </section>

            <section>
              <h2 className="section-title">Switches</h2>
              <div className="dashboard-grid">
                <SwitchCard entityId="coffee_maker" name="Coffee Maker" />
                <SwitchCard entityId="desk_fan" name="Desk Fan" />
                <SwitchCard entityId="outdoor_lights" name="Outdoor Lights" />
              </div>
            </section>

            <section>
              <h2 className="section-title">Fans</h2>
              <div className="dashboard-grid">
                <FanCard entityId="fan.living_room_ceiling" name="Living Room Ceiling Fan" />
                <FanCard entityId="fan.bedroom_fan" name="Bedroom Fan" />
              </div>
            </section>

            <section>
              <h2 className="section-title">Scenes</h2>
              <div className="dashboard-grid">
                <SceneCard entityId="scene.movie_night" name="Movie Night" />
                <SceneCard entityId="scene.bright" name="Bright" />
              </div>
            </section>
          </TabsContent>

          {/* Climate & Environment Tab */}
          <TabsContent value="climate" className="space-y-6">
            <section>
              <h2 className="section-title">Weather</h2>
              <div className="dashboard-grid">
                <WeatherCard entityId="weather.home" name="Current Weather" />
              </div>
            </section>

            <section>
              <h2 className="section-title">Climate Control</h2>
              <div className="dashboard-grid">
                <ClimateCard entityId="climate.living_room" name="Living Room Thermostat" />
              </div>
            </section>

            <section>
              <h2 className="section-title">Sensors</h2>
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

            <section>
              <h2 className="section-title">Binary Sensors</h2>
              <div className="dashboard-grid">
                <BinarySensorCard entityId="binary_sensor.front_door" name="Front Door" />
                <BinarySensorCard entityId="binary_sensor.motion_sensor" name="Living Room Motion" />
                <BinarySensorCard entityId="binary_sensor.bedroom_window" name="Bedroom Window" />
              </div>
            </section>

            <section>
              <h2 className="section-title">Numbers</h2>
              <div className="dashboard-grid">
                <NumberCard entityId="number.speaker_volume" name="Speaker Volume" />
                <NumberCard entityId="number.brightness_threshold" name="Brightness Threshold" />
              </div>
            </section>
          </TabsContent>

          {/* Security & Access Tab */}
          <TabsContent value="security" className="space-y-6">
            <section>
              <h2 className="section-title">Alarm System</h2>
              <div className="dashboard-grid">
                <AlarmControlPanelCard entityId="alarm_control_panel.home" name="Home Security System" />
              </div>
            </section>

            <section>
              <h2 className="section-title">Cameras</h2>
              <div className="dashboard-grid">
                <CameraCard entityId="camera.front_door" name="Front Door Camera" />
                <CameraCard entityId="camera.backyard" name="Backyard Camera" />
                <CameraCard entityId="camera.garage" name="Garage Camera" />
              </div>
            </section>

            <section>
              <h2 className="section-title">Locks</h2>
              <div className="dashboard-grid">
                <LockCard entityId="lock.front_door" name="Front Door" />
                <LockCard entityId="lock.back_door" name="Back Door" />
              </div>
            </section>

            <section>
              <h2 className="section-title">Covers</h2>
              <div className="dashboard-grid">
                <CoverCard entityId="cover.garage_door" name="Garage Door" />
                <CoverCard entityId="cover.living_room_blinds" name="Living Room Blinds" />
                <CoverCard entityId="cover.bedroom_curtains" name="Bedroom Curtains" />
              </div>
            </section>
          </TabsContent>

          {/* Entertainment Tab */}
          <TabsContent value="entertainment" className="space-y-6">
            <section>
              <h2 className="section-title">Media Players</h2>
              <div className="dashboard-grid">
                <MediaPlayerCard entityId="media_player.living_room_speaker" name="Living Room Speaker" />
                <MediaPlayerCard entityId="media_player.kitchen_display" name="Kitchen Display" />
                <MediaPlayerCard entityId="media_player.bedroom_tv" name="Bedroom TV" />
              </div>
            </section>
          </TabsContent>

          {/* Productivity Tab */}
          <TabsContent value="productivity" className="space-y-6">
            <section>
              <h2 className="section-title">Vacuum Cleaners</h2>
              <div className="dashboard-grid">
                <VacuumCard entityId="vacuum.roborock" name="Roborock S7" />
              </div>
            </section>

            <section>
              <h2 className="section-title">Todo Lists</h2>
              <div className="dashboard-grid">
                <TodoCard entityId="todo.shopping_list" name="Shopping List" />
                <TodoCard entityId="todo.weekend_projects" name="Weekend Projects" />
              </div>
            </section>

            <section>
              <h2 className="section-title">Calendar</h2>
              <div className="dashboard-grid">
                <CalendarCard entityId="calendar.personal" name="Personal Calendar" />
              </div>
            </section>
          </TabsContent>
        </Tabs>

        <footer className="dashboard-footer">
          <h3 className="footer-title">
            About This Example
          </h3>
          <p className="footer-description">
            This dashboard showcases the <strong>hass-react</strong> library with
            <strong> vanilla CSS styling</strong>. It demonstrates:
          </p>
          <ul className="footer-list">
            <li><strong>Vanilla CSS integration</strong> - Clean, custom styling without frameworks</li>
            <li><strong>Tabbed navigation</strong> - Organized entity management</li>
            <li><strong>TypeScript support</strong> - Type-safe Home Assistant integration</li>
            <li><strong>Mock mode</strong> - Perfect for development and demos</li>
          </ul>
          <p className="footer-note">
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
      mockUser={{
        id: 'demo-user-123',
        name: 'Demo User',
        is_owner: true,
        is_admin: true,
        local_only: false,
        system_generated: false,
        group_ids: ['system-users', 'system-admin']
      }}
    >
      <Dashboard />
    </HAProvider>
  )
}

