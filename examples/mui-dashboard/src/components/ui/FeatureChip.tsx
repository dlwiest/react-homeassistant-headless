import React from 'react'
import { Chip, ChipProps } from '@mui/material'

const FeatureChip = (props: ChipProps) => {
  return (
    <Chip
      size="small"
      sx={{
        bgcolor: 'rgba(51, 65, 85, 0.5)',
        border: '1px solid rgba(71, 85, 105, 0.5)',
        color: 'text.secondary',
        ...props.sx
      }}
      {...props}
    />
  )
}

export default FeatureChip
