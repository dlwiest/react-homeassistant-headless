import React from 'react'
import { useHAConnection } from 'hass-react'
import { Box } from '@mui/material'

const ConnectionStatus = () => {
  const { connected } = useHAConnection()

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1,
        border: '1px solid',
        borderColor: connected ? '#059669' : '#dc2626',
        borderRadius: 2,
        bgcolor: connected ? 'rgba(5, 150, 105, 0.1)' : 'rgba(220, 38, 38, 0.1)',
      }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: connected ? '#10b981' : '#ef4444',
        }}
      />
      <Box
        sx={{
          fontSize: '0.875rem',
          fontWeight: 500,
          color: connected ? '#10b981' : '#ef4444',
        }}
      >
        {connected ? 'Connected' : 'Disconnected'}
      </Box>
    </Box>
  )
}

export default ConnectionStatus
