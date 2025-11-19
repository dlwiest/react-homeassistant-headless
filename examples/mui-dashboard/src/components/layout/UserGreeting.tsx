import { useCurrentUser } from 'hass-react'
import { Box, Chip, Typography } from '@mui/material'
import { Person } from '@mui/icons-material'

export function UserGreeting() {
  const user = useCurrentUser()

  if (!user) {
    return null
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 1,
        bgcolor: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    >
      <Person sx={{ fontSize: 20, color: 'text.secondary' }} />
      <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
        Hello, {user.name}!
      </Typography>
      {user.is_admin && (
        <Chip
          label="Admin"
          size="small"
          sx={{
            height: 20,
            fontSize: '0.7rem',
            fontWeight: 700,
            bgcolor: 'rgba(33, 150, 243, 0.15)',
            color: 'info.light',
            borderColor: 'info.dark',
            border: '1px solid',
          }}
        />
      )}
      {user.is_owner && (
        <Chip
          label="Owner"
          size="small"
          sx={{
            height: 20,
            fontSize: '0.7rem',
            fontWeight: 700,
            bgcolor: 'rgba(76, 175, 80, 0.15)',
            color: 'success.light',
            borderColor: 'success.dark',
            border: '1px solid',
          }}
        />
      )}
    </Box>
  )
}
