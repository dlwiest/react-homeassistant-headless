import { useState } from 'react'
import { Todo } from 'hass-react'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Box,
  Stack,
  Chip,
  Alert,
  AlertTitle,
  Collapse,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  LinearProgress,
  Divider,
  TextField,
  IconButton,
  Checkbox,
  CircularProgress
} from '@mui/material'
import { 
  Assignment,
  CheckCircle,
  Warning,
  WifiOff,
  Close,
  Event,
  PendingActions,
  Add,
  Delete,
  ClearAll
} from '@mui/icons-material'

interface TodoCardProps {
  entityId: string
  name: string
}

export const TodoCard = ({ entityId, name }: TodoCardProps) => {
  const [actionError, setActionError] = useState<string | null>(null)
  const [newItemText, setNewItemText] = useState('')
  const [addingItem, setAddingItem] = useState(false)

  return (
    <Todo entityId={entityId}>
      {(todo) => {
        // Check for entity availability errors
        if (todo.error) {
          return (
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardHeader
                avatar={<Warning sx={{ color: 'error.main', fontSize: 32 }} />}
                title={
                  <Typography variant="h6" component="h2">
                    {name}
                  </Typography>
                }
                subheader="Entity Error"
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Alert severity="error">
                  <AlertTitle>Entity Not Available</AlertTitle>
                  {todo.error.message}
                </Alert>
              </CardContent>
            </Card>
          )
        }

        const completedItems = todo.items.filter(item => item.status === 'completed').length
        const pendingItems = todo.items.filter(item => item.status === 'needs_action').length
        const completionPercent = todo.items.length > 0 ? (completedItems / todo.items.length) * 100 : 0

        const handleAddItem = async () => {
          if (!newItemText.trim() || !todo.supportsAddItem) return
          
          try {
            setActionError(null)
            await todo.addItem(newItemText.trim())
            setNewItemText('')
            setAddingItem(false)
          } catch (error) {
            setActionError(error instanceof Error ? error.message : 'Failed to add item')
          }
        }

        const handleToggleItem = async (uid: string) => {
          if (!todo.supportsUpdateItem) return
          
          try {
            setActionError(null)
            await todo.toggleItem(uid)
          } catch (error) {
            setActionError(error instanceof Error ? error.message : 'Failed to update item')
          }
        }

        const handleRemoveItem = async (uid: string) => {
          if (!todo.supportsRemoveItem) return
          
          try {
            setActionError(null)
            await todo.removeItem(uid)
          } catch (error) {
            setActionError(error instanceof Error ? error.message : 'Failed to remove item')
          }
        }

        const handleClearCompleted = async () => {
          if (!todo.supportsClearCompleted) return
          
          try {
            setActionError(null)
            await todo.clearCompleted()
          } catch (error) {
            setActionError(error instanceof Error ? error.message : 'Failed to clear completed items')
          }
        }

        return (
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardHeader
              avatar={
                <Box sx={{ 
                  color: completedItems === todo.items.length && todo.items.length > 0 ? 'success.main' : 'primary.main'
                }}>
                  <Assignment sx={{ fontSize: 32 }} />
                </Box>
              }
              title={
                <Typography variant="h6" component="h2">
                  {name}
                </Typography>
              }
              subheader={
                <Box display="flex" alignItems="center" gap={1}>
                  <span>{todo.isConnected ? `${todo.items.length} items` : 'Disconnected'}</span>
                  {!todo.isConnected && <WifiOff fontSize="small" />}
                </Box>
              }
              action={
                <Box display="flex" alignItems="center" gap={1}>
                  {todo.supportsClearCompleted && completedItems > 0 && (
                    <IconButton size="small" onClick={handleClearCompleted} title="Clear completed">
                      <ClearAll />
                    </IconButton>
                  )}
                  {todo.items.length > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      {Math.round(completionPercent)}%
                    </Typography>
                  )}
                </Box>
              }
            />

            {/* Display action errors */}
            <Collapse in={!!actionError}>
              {actionError && (
                <Box sx={{ px: 2, pb: 1 }}>
                  <Alert 
                    severity="error" 
                    action={
                      <Button 
                        color="inherit" 
                        size="small"
                        onClick={() => setActionError(null)}
                      >
                        <Close fontSize="small" />
                      </Button>
                    }
                  >
                    {actionError}
                  </Alert>
                </Box>
              )}
            </Collapse>

            <CardContent sx={{ flexGrow: 1 }}>
              <Stack spacing={2}>
                {/* Add new item */}
                {todo.supportsAddItem && (
                  <Box>
                    {addingItem ? (
                      <Stack direction="row" spacing={1}>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="Add new task..."
                          value={newItemText}
                          onChange={(e) => setNewItemText(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleAddItem()
                            }
                          }}
                          autoFocus
                        />
                        <IconButton size="small" onClick={handleAddItem} disabled={!newItemText.trim()}>
                          <CheckCircle />
                        </IconButton>
                        <IconButton size="small" onClick={() => {
                          setAddingItem(false)
                          setNewItemText('')
                        }}>
                          <Close />
                        </IconButton>
                      </Stack>
                    ) : (
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={() => setAddingItem(true)}
                        size="small"
                      >
                        Add Item
                      </Button>
                    )}
                  </Box>
                )}

                {/* Progress indicator */}
                {todo.items.length > 0 && (
                  <Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2" fontWeight="medium">
                        Progress
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {completedItems}/{todo.items.length}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={completionPercent}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                )}

                {/* Stats */}
                <Box display="flex" gap={1} flexWrap="wrap">
                  <Chip 
                    icon={<CheckCircle />}
                    label={`${completedItems} completed`}
                    color="success"
                    variant="outlined"
                    size="small"
                  />
                  <Chip 
                    icon={<PendingActions />}
                    label={`${pendingItems} pending`}
                    color="default"
                    variant="outlined"
                    size="small"
                  />
                </Box>

                {/* Items list */}
                {todo.isLoadingItems ? (
                  <Box display="flex" justifyContent="center" p={2}>
                    <CircularProgress size={24} />
                  </Box>
                ) : todo.items.length > 0 ? (
                  <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                    <List dense disablePadding>
                      {todo.items.map((item, index) => (
                        <Box key={item.uid}>
                          <ListItem
                            disablePadding
                            secondaryAction={
                              todo.supportsRemoveItem && (
                                <IconButton edge="end" size="small" onClick={() => handleRemoveItem(item.uid)}>
                                  <Delete fontSize="small" />
                                </IconButton>
                              )
                            }
                          >
                            <ListItemButton onClick={() => handleToggleItem(item.uid)} disabled={!todo.supportsUpdateItem}>
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                <Checkbox
                                  edge="start"
                                  checked={item.status === 'completed'}
                                  tabIndex={-1}
                                  disableRipple
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      textDecoration: item.status === 'completed' ? 'line-through' : 'none',
                                      color: item.status === 'completed' ? 'text.disabled' : 'text.primary'
                                    }}
                                  >
                                    {item.summary}
                                  </Typography>
                                }
                                secondary={
                                  item.due ? (
                                    <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                                      <Event fontSize="small" />
                                      <Typography variant="caption">
                                        {new Date(item.due).toLocaleDateString()}
                                      </Typography>
                                    </Box>
                                  ) : null
                                }
                              />
                            </ListItemButton>
                          </ListItem>
                          {index < todo.items.length - 1 && <Divider />}
                        </Box>
                      ))}
                    </List>
                  </Box>
                ) : (
                  <Alert severity="info" sx={{ mt: 1 }}>
                    <Typography variant="body2">
                      No items in this list
                    </Typography>
                  </Alert>
                )}
              </Stack>
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
              {!todo.isConnected && (
                <Typography variant="caption" color="error" display="flex" alignItems="center" gap={0.5}>
                  <Warning fontSize="inherit" />
                  Not connected to Home Assistant
                </Typography>
              )}
            </CardActions>
          </Card>
        )
      }}
    </Todo>
  )
}