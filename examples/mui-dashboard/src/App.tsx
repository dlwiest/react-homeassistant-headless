import React from 'react'
import {
  HAProvider,
  useHAConnection
} from 'hass-react'
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert,
  AlertTitle,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material'
import {
  CheckCircle,
  Error,
  HourglassEmpty,
  Warning,
  Home,
  Lightbulb,
  Settings,
  Security,
  Lock,
  Speed,
  Smartphone
} from '@mui/icons-material'
import { LightCard, SwitchCard, SensorCard, FanCard, LockCard } from './components/cards'

// Create MUI theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
})

// Mock data for demo - same as other examples
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

const ConnectionStatus = () => {
  const { connected, connecting, error, reconnect, config } = useHAConnection()
  
  const autoReconnectEnabled = config.options?.autoReconnect !== false

  const getStatusIcon = () => {
    if (connected) return <CheckCircle color="success" />
    if (connecting) return <HourglassEmpty color="warning" />
    if (error) return <Error color="error" />
    return <Warning color="warning" />
  }

  const getStatusText = () => {
    if (connecting && !connected) return 'Connecting to Home Assistant...'
    if (connected && !connecting) return 'Connected to Home Assistant'
    if (!connected && !connecting && error && autoReconnectEnabled) return 'Reconnecting...'
    if (!connected && !connecting && error && !autoReconnectEnabled) return `Error: ${error.message}`
    if (!connected && !connecting && !error) return 'Disconnected'
    return ''
  }

  const getSeverity = () => {
    if (connected) return 'success'
    if (connecting) return 'info' 
    if (error) return 'error'
    return 'warning'
  }

  return (
    <Alert 
      severity={getSeverity() as any}
      icon={getStatusIcon()}
      sx={{ mb: 3 }}
      action={
        !connected && !connecting && error && !autoReconnectEnabled ? (
          <Button color="inherit" size="small" onClick={reconnect}>
            Retry
          </Button>
        ) : null
      }
    >
      <AlertTitle>Connection Status</AlertTitle>
      {getStatusText()}
    </Alert>
  )
}

const Dashboard = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Smart Home Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Built with hass-react + Material-UI
        </Typography>
      </Box>

      <ConnectionStatus />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Lightbulb /> Lighting
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <LightCard entityId="living_room_main" name="Living Room Main" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <LightCard entityId="living_room_accent" name="Living Room Accent" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <LightCard entityId="bedroom_ceiling" name="Bedroom Ceiling" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <LightCard entityId="bedside_lamp" name="Bedside Lamp" />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Speed /> Fans
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <FanCard entityId="fan.living_room_ceiling" name="Living Room Ceiling Fan" />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FanCard entityId="fan.bedroom_fan" name="Bedroom Fan" />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Lock /> Security
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <LockCard entityId="lock.front_door" name="Front Door" />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <LockCard entityId="lock.back_door" name="Back Door" />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Settings /> Devices & Switches
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <SwitchCard entityId="coffee_maker" name="Coffee Maker" icon="☕" />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <SwitchCard entityId="desk_fan" name="Desk Fan" icon="🌪️" />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <SwitchCard entityId="outdoor_lights" name="Outdoor Lights" icon="🏠" />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Speed /> Environmental Sensors
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <SensorCard 
              entityId="living_room_temperature" 
              name="Living Room Temperature"
              precision={1}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <SensorCard 
              entityId="living_room_humidity" 
              name="Living Room Humidity"
              precision={1}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <SensorCard 
              entityId="outdoor_temperature" 
              name="Outdoor Temperature"
              precision={1}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <SensorCard 
              entityId="energy_usage" 
              name="Current Energy Usage"
              precision={2}
            />
          </Grid>
        </Grid>
      </Box>

      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            About This Example
          </Typography>
          <Typography variant="body1" paragraph>
            This dashboard showcases the <strong>hass-react</strong> library with{' '}
            <strong>Material-UI components</strong>. It demonstrates:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon><Smartphone /></ListItemIcon>
              <ListItemText primary="Material-UI integration" secondary="Beautiful, accessible components with Material Design" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Security /></ListItemIcon>
              <ListItemText primary="TypeScript support" secondary="Type-safe Home Assistant integration" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Home /></ListItemIcon>
              <ListItemText primary="Mock mode" secondary="Perfect for development and demos" />
            </ListItem>
          </List>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Try toggling lights, adjusting brightness, changing colors, and exploring the different features!
          </Typography>
        </CardContent>
      </Card>
    </Container>
  )
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HAProvider 
        url="http://homeassistant.local:8123" 
        mockMode={true} 
        mockData={mockData}
      >
        <Dashboard />
      </HAProvider>
    </ThemeProvider>
  )
}