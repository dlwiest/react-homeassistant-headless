import React from 'react'
import { HAProvider } from 'hass-react'
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper
} from '@mui/material'
import {
  Lightbulb,
  Thermostat,
  Shield,
  MusicNote,
  Assignment
} from '@mui/icons-material'
import { ConnectionStatus } from './components/ConnectionStatus'
import { UserGreeting } from './components/layout/UserGreeting'
import {
  LightCard,
  SwitchCard,
  SensorCard,
  BinarySensorCard,
  TodoCard,
  FanCard,
  LockCard,
  CoverCard,
  MediaPlayerCard,
  CameraCard,
  NumberCard,
  ClimateCard,
  WeatherCard,
  VacuumCard
} from './components/cards'

// Create dark MUI theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(71, 85, 105, 0.5)',
          transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            borderColor: '#3b82f6',
            boxShadow: '0 0 8px 2px rgba(59, 130, 246, 0.25)',
          },
        },
      },
    },
  },
})

// Mock data matching vanilla/shadcn examples
const mockData = {
  // Lights
  'light.living_room_main': {
    entity_id: 'light.living_room_main',
    state: 'on',
    attributes: {
      friendly_name: 'Living Room Main Light',
      brightness: 180,
      rgb_color: [255, 255, 255],
      supported_features: 63,
      effect_list: ['None', 'Colorloop', 'Breath', 'Strobe', 'Police'],
      effect: 'None',
      min_mireds: 153,
      max_mireds: 500,
      color_temp: 250
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
      effect: 'None',
      min_mireds: 153,
      max_mireds: 500,
      color_temp: 250
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-2', parent_id: null, user_id: null }
  },
  'light.bedroom_ceiling': {
    entity_id: 'light.bedroom_ceiling',
    state: 'on',
    attributes: {
      friendly_name: 'Bedroom Ceiling',
      brightness: 120,
      supported_features: 1,
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
      supported_features: 31,
      min_mireds: 153,
      max_mireds: 500,
      color_temp: 370
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-4', parent_id: null, user_id: null }
  },

  // Switches
  'switch.coffee_maker': {
    entity_id: 'switch.coffee_maker',
    state: 'off',
    attributes: { friendly_name: 'Coffee Maker' },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-5', parent_id: null, user_id: null }
  },
  'switch.desk_fan': {
    entity_id: 'switch.desk_fan',
    state: 'on',
    attributes: { friendly_name: 'Desk Fan' },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-6', parent_id: null, user_id: null }
  },
  'switch.outdoor_lights': {
    entity_id: 'switch.outdoor_lights',
    state: 'on',
    attributes: { friendly_name: 'Outdoor Lights' },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-7', parent_id: null, user_id: null }
  },

  // Sensors
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
      supported_features: 15,
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
      supported_features: 9,
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
      supported_features: 1,
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
      supported_features: 0,
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
      supported_features: 15,
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
      supported_features: 15,
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-23', parent_id: null, user_id: null }
  },

  // Climate
  'climate.living_room': {
    entity_id: 'climate.living_room',
    state: 'heat',
    attributes: {
      friendly_name: 'Living Room Thermostat',
      temperature: 72,
      current_temperature: 70,
      hvac_modes: ['off', 'heat', 'cool', 'heat_cool', 'auto'],
      hvac_mode: 'heat',
      fan_modes: ['auto', 'low', 'medium', 'high'],
      fan_mode: 'auto',
      min_temp: 50,
      max_temp: 90,
      supported_features: 27,
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-24', parent_id: null, user_id: null }
  },

  // Cameras
  'camera.front_door': {
    entity_id: 'camera.front_door',
    state: 'idle',
    attributes: {
      friendly_name: 'Front Door Camera',
      access_token: 'mock_token_front_door',
      supported_features: 3,
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
      supported_features: 1,
      brand: 'Wyze',
      model: 'Cam v3',
      motion_detection: false,
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-26', parent_id: null, user_id: null }
  },

  // Numbers
  'number.speaker_volume': {
    entity_id: 'number.speaker_volume',
    state: '65',
    attributes: {
      friendly_name: 'Speaker Volume',
      min: 0,
      max: 100,
      step: 1,
      mode: 'slider',
      unit_of_measurement: '%',
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-27', parent_id: null, user_id: null }
  },
  'number.brightness_threshold': {
    entity_id: 'number.brightness_threshold',
    state: '50',
    attributes: {
      friendly_name: 'Auto-Light Brightness Threshold',
      min: 0,
      max: 100,
      step: 1,
      mode: 'slider',
      unit_of_measurement: '%',
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-27a', parent_id: null, user_id: null }
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
    context: { id: 'context-30', parent_id: null, user_id: null }
  },

  // Vacuum
  'vacuum.roborock_s7': {
    entity_id: 'vacuum.roborock_s7',
    state: 'docked',
    attributes: {
      friendly_name: 'Roborock S7',
      battery_level: 85,
      fan_speed: 'balanced',
      fan_speed_list: ['silent', 'standard', 'balanced', 'turbo', 'max'],
      status: 'Charging',
      supported_features: 14204,
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-31', parent_id: null, user_id: null }
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
      supported_features: 20925,
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z',
    context: { id: 'context-28', parent_id: null, user_id: null }
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

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

const Dashboard = () => {
  const [tabValue, setTabValue] = React.useState(0)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          py: 3,
          px: 2
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
                Smart Home
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage your connected devices
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <UserGreeting />
              <ConnectionStatus />
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Tabs */}
        <Paper sx={{ mb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<Lightbulb />} label="Lighting & Power" iconPosition="start" />
            <Tab icon={<Thermostat />} label="Climate & Environment" iconPosition="start" />
            <Tab icon={<Shield />} label="Security" iconPosition="start" />
            <Tab icon={<MusicNote />} label="Entertainment" iconPosition="start" />
            <Tab icon={<Assignment />} label="Productivity" iconPosition="start" />
          </Tabs>
        </Paper>

        {/* Lighting & Power Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Lights
            </Typography>
            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', maxWidth: '100%', '@media (min-width: 1200px)': { gridTemplateColumns: 'repeat(3, 1fr)' } }}>
              <LightCard entityId="living_room_main" name="Living Room Main" />
              <LightCard entityId="living_room_accent" name="Living Room Accent" />
              <LightCard entityId="bedroom_ceiling" name="Bedroom Ceiling" />
              <LightCard entityId="bedside_lamp" name="Bedside Lamp" />
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Switches
            </Typography>
            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', maxWidth: '100%', '@media (min-width: 1200px)': { gridTemplateColumns: 'repeat(3, 1fr)' } }}>
              <SwitchCard entityId="coffee_maker" name="Coffee Maker" />
              <SwitchCard entityId="desk_fan" name="Desk Fan" />
              <SwitchCard entityId="outdoor_lights" name="Outdoor Lights" />
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Fans
            </Typography>
            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', maxWidth: '100%', '@media (min-width: 1200px)': { gridTemplateColumns: 'repeat(3, 1fr)' } }}>
              <FanCard entityId="fan.living_room_ceiling" name="Living Room Ceiling Fan" />
              <FanCard entityId="fan.bedroom_fan" name="Bedroom Fan" />
            </Box>
          </Box>
        </TabPanel>

        {/* Climate & Environment Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Weather
            </Typography>
            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', maxWidth: '100%', '@media (min-width: 1200px)': { gridTemplateColumns: 'repeat(3, 1fr)' } }}>
              <WeatherCard entityId="weather.home" name="Home Weather" />
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Climate Control
            </Typography>
            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', maxWidth: '100%', '@media (min-width: 1200px)': { gridTemplateColumns: 'repeat(3, 1fr)' } }}>
              <ClimateCard entityId="climate.living_room" name="Living Room Thermostat" />
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Sensors
            </Typography>
            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', maxWidth: '100%', '@media (min-width: 1200px)': { gridTemplateColumns: 'repeat(3, 1fr)' } }}>
              <SensorCard entityId="living_room_temperature" name="Living Room Temperature" precision={1} />
              <SensorCard entityId="living_room_humidity" name="Living Room Humidity" precision={1} />
              <SensorCard entityId="outdoor_temperature" name="Outdoor Temperature" precision={1} />
              <SensorCard entityId="energy_usage" name="Current Energy Usage" precision={2} />
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Binary Sensors
            </Typography>
            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', maxWidth: '100%', '@media (min-width: 1200px)': { gridTemplateColumns: 'repeat(3, 1fr)' } }}>
              <BinarySensorCard entityId="binary_sensor.front_door" name="Front Door" />
              <BinarySensorCard entityId="binary_sensor.motion_sensor" name="Living Room Motion" />
              <BinarySensorCard entityId="binary_sensor.bedroom_window" name="Bedroom Window" />
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Numbers
            </Typography>
            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', maxWidth: '100%', '@media (min-width: 1200px)': { gridTemplateColumns: 'repeat(3, 1fr)' } }}>
              <NumberCard entityId="number.speaker_volume" name="Speaker Volume" />
              <NumberCard entityId="number.brightness_threshold" name="Auto-Light Threshold" />
            </Box>
          </Box>
        </TabPanel>

        {/* Security Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Cameras
            </Typography>
            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', maxWidth: '100%', '@media (min-width: 1200px)': { gridTemplateColumns: 'repeat(3, 1fr)' } }}>
              <CameraCard entityId="camera.front_door" name="Front Door Camera" />
              <CameraCard entityId="camera.backyard" name="Backyard Camera" />
              <CameraCard entityId="camera.garage" name="Garage Camera" />
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Locks
            </Typography>
            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', maxWidth: '100%', '@media (min-width: 1200px)': { gridTemplateColumns: 'repeat(3, 1fr)' } }}>
              <LockCard entityId="lock.front_door" name="Front Door" />
              <LockCard entityId="lock.back_door" name="Back Door" />
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Covers
            </Typography>
            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', maxWidth: '100%', '@media (min-width: 1200px)': { gridTemplateColumns: 'repeat(3, 1fr)' } }}>
              <CoverCard entityId="cover.garage_door" name="Garage Door" />
              <CoverCard entityId="cover.living_room_blinds" name="Living Room Blinds" />
              <CoverCard entityId="cover.bedroom_curtains" name="Bedroom Curtains" />
            </Box>
          </Box>
        </TabPanel>

        {/* Entertainment Tab */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Media Players
            </Typography>
            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', maxWidth: '100%', '@media (min-width: 1200px)': { gridTemplateColumns: 'repeat(3, 1fr)' } }}>
              <MediaPlayerCard entityId="media_player.living_room_speaker" name="Living Room Speaker" />
              <MediaPlayerCard entityId="media_player.kitchen_display" name="Kitchen Display" />
              <MediaPlayerCard entityId="media_player.bedroom_tv" name="Bedroom TV" />
            </Box>
          </Box>
        </TabPanel>

        {/* Productivity Tab */}
        <TabPanel value={tabValue} index={4}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Vacuum
            </Typography>
            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', maxWidth: '100%', '@media (min-width: 1200px)': { gridTemplateColumns: 'repeat(3, 1fr)' } }}>
              <VacuumCard entityId="vacuum.roborock_s7" name="Roborock S7" />
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Todo Lists
            </Typography>
            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', maxWidth: '100%', '@media (min-width: 1200px)': { gridTemplateColumns: 'repeat(3, 1fr)' } }}>
              <TodoCard entityId="todo.shopping_list" name="Shopping List" />
              <TodoCard entityId="todo.weekend_projects" name="Weekend Projects" />
            </Box>
          </Box>
        </TabPanel>

        {/* Footer */}
        <Paper sx={{ mt: 6, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            About This Example
          </Typography>
          <Typography variant="body1" paragraph>
            This dashboard showcases the <strong>hass-react</strong> library with{' '}
            <strong>Material-UI components</strong>. It demonstrates:
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <Typography component="li" variant="body2" paragraph>
              <strong>Material-UI integration</strong> - Accessible components with Material Design
            </Typography>
            <Typography component="li" variant="body2" paragraph>
              <strong>Tabbed navigation</strong> - Organized entity management
            </Typography>
            <Typography component="li" variant="body2" paragraph>
              <strong>TypeScript support</strong> - Type-safe Home Assistant integration
            </Typography>
            <Typography component="li" variant="body2">
              <strong>Mock mode</strong> - Perfect for development and demos
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Navigate through the tabs to explore different entity types and features!
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}

export const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
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
    </ThemeProvider>
  )
}

