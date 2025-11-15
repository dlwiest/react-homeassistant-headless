import React from 'react'
import { Todo } from 'hass-react'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Stack,
  Chip,
  Checkbox,
  IconButton
} from '@mui/material'

interface TodoCardProps {
  entityId: string
  name: string
}

const TodoCard = ({ entityId, name }: TodoCardProps) => {

  return (
    <Todo entityId={entityId}>
      {(todo) => {
        const completedItems = todo.items.filter(item => item.status === 'completed').length
        const pendingItems = todo.items.filter(item => item.status === 'needs_action').length

        const handleAddItem = () => {
          const text = prompt('Enter new item:')
          if (text) {
            todo.addItem(text)
          }
        }

        return (
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardHeader
              title={
                <Typography variant="h6" component="h2">
                  {name}
                </Typography>
              }
              subheader={`${todo.itemCount} items`}
              action={
                <Typography variant="body2" color="text.secondary">
                  {completedItems}/{todo.items.length} completed
                </Typography>
              }
            />

            <CardContent sx={{ flexGrow: 1 }}>
              <Stack spacing={2}>
                <Button
                  onClick={handleAddItem}
                  variant="outlined"
                  size="small"
                  fullWidth
                >
                  + Add Item
                </Button>

                <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                  {todo.items.map((item) => (
                    <Box
                      key={item.uid}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        py: 1,
                        borderBottom: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Checkbox
                        checked={item.status === 'completed'}
                        onChange={() => todo.toggleItem(item.uid)}
                        size="small"
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          flexGrow: 1,
                          textDecoration: item.status === 'completed' ? 'line-through' : 'none',
                          color: item.status === 'completed' ? 'text.disabled' : 'text.primary'
                        }}
                      >
                        {item.summary}
                      </Typography>
                      {todo.supportsRemoveItem && (
                        <IconButton
                          onClick={() => todo.removeItem(item.uid)}
                          size="small"
                          sx={{ p: 0.5 }}
                        >
                          <Typography variant="body1">×</Typography>
                        </IconButton>
                      )}
                    </Box>
                  ))}
                </Box>
              </Stack>
            </CardContent>

            <CardActions sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Stack direction="row" spacing={0.5} flexWrap="wrap">
                <Chip label={`${completedItems} completed`} size="small" />
                <Chip label={`${pendingItems} pending`} size="small" />
              </Stack>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: todo.isConnected ? 'success.main' : 'error.main'
                  }}
                />
                <Typography variant="caption">
                  {todo.isConnected ? 'Online' : 'Offline'}
                </Typography>
              </Box>
            </CardActions>
          </Card>
        )
      }}
    </Todo>
  )
}

export default TodoCard
