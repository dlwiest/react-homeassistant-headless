import React, { useState } from 'react'
import { Todo } from 'hass-react'
import { Card, CardHeader, CardContent, CardFooter } from '../layout/Card'

interface TodoCardProps {
  entityId: string
  name: string
}

const getStatusEmoji = (status: 'needs_action' | 'completed') => {
  return status === 'completed' ? '✅' : '⬜'
}

const getPriorityColor = (status: 'needs_action' | 'completed') => {
  return status === 'completed' ? '#999' : '#333'
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
            <Card>
              <CardHeader 
                title={name}
                subtitle="Entity Error"
              />
              <CardContent>
                <div className="error-message">
                  ⚠️ {todo.error.message}
                </div>
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
          <Card>
            <CardHeader 
              title={name}
              subtitle={
                <div className="binary-sensor-status">
                  <span>{todo.isConnected ? `${todo.itemCount} items` : 'Disconnected'}</span>
                  {!todo.isConnected && <span className="disconnected">📶</span>}
                </div>
              }
              icon="📝"
              action={
                todo.supportsClearCompleted && completedItems > 0 && (
                  <button 
                    className="button-secondary small"
                    onClick={handleClearCompleted}
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                  >
                    Clear completed
                  </button>
                )
              }
            />

            {/* Display action errors */}
            {actionError && (
              <CardContent>
                <div className="error-message">
                  ❌ {actionError}
                  <button 
                    className="error-dismiss"
                    onClick={() => setActionError(null)}
                  >
                    ×
                  </button>
                </div>
              </CardContent>
            )}

            <CardContent>
              <div className="todo-content">
                {/* Add new item */}
                {todo.supportsAddItem && (
                  <div style={{ marginBottom: '1rem' }}>
                    {addingItem ? (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                          type="text"
                          className="input"
                          placeholder="Add new task..."
                          value={newItemText}
                          onChange={(e) => setNewItemText(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleAddItem()
                            }
                          }}
                          autoFocus
                          style={{ flex: 1 }}
                        />
                        <button 
                          className="button-primary"
                          onClick={handleAddItem}
                          disabled={!newItemText.trim()}
                        >
                          Add
                        </button>
                        <button 
                          className="button-secondary"
                          onClick={() => {
                            setAddingItem(false)
                            setNewItemText('')
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="button-secondary"
                        onClick={() => setAddingItem(true)}
                        style={{ width: '100%' }}
                      >
                        + Add Item
                      </button>
                    )}
                  </div>
                )}

                {/* Progress bar */}
                {todo.items.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem'
                    }}>
                      <span><strong>Progress</strong></span>
                      <span>{completedItems}/{todo.items.length}</span>
                    </div>
                    <div style={{ 
                      backgroundColor: '#e5e7eb', 
                      height: '8px', 
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div 
                        style={{ 
                          backgroundColor: '#10b981', 
                          height: '100%', 
                          width: `${completionPercent}%`,
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Stats section */}
                <div className="status-section">
                  <div className="status-header">
                    <span>Summary</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span className="status-value active">
                        ✅ {completedItems} completed
                      </span>
                      <span className="status-value inactive">
                        ⬜ {pendingItems} pending
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items list */}
                {todo.items.length > 0 ? (
                  <div className="todo-items">
                    {todo.items.slice(0, 5).map((item) => (
                      <div 
                        key={item.uid} 
                        className="todo-item"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem',
                          borderBottom: '1px solid #e5e7eb',
                          borderRadius: '4px',
                          transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <button
                          style={{ 
                            fontSize: '1.2rem',
                            background: 'none',
                            border: 'none',
                            cursor: todo.supportsUpdateItem ? 'pointer' : 'default',
                            opacity: todo.supportsUpdateItem ? 1 : 0.5,
                            padding: 0
                          }}
                          onClick={() => handleToggleItem(item.uid)}
                          disabled={!todo.supportsUpdateItem}
                        >
                          {getStatusEmoji(item.status)}
                        </button>
                        <span 
                          style={{
                            flex: 1,
                            textDecoration: item.status === 'completed' ? 'line-through' : 'none',
                            color: getPriorityColor(item.status),
                            fontSize: '0.875rem',
                            cursor: todo.supportsUpdateItem ? 'pointer' : 'default'
                          }}
                          onClick={() => handleToggleItem(item.uid)}
                        >
                          {item.summary}
                        </span>
                        {item.due && (
                          <span style={{ 
                            fontSize: '0.75rem', 
                            color: '#6b7280',
                            backgroundColor: '#f3f4f6',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px'
                          }}>
                            {new Date(item.due).toLocaleDateString()}
                          </span>
                        )}
                        {todo.supportsRemoveItem && (
                          <button
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              padding: '0.25rem',
                              fontSize: '1rem',
                              opacity: 0.7,
                              transition: 'opacity 0.2s'
                            }}
                            onClick={() => handleRemoveItem(item.uid)}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                            title="Remove item"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                    {todo.items.length > 5 && (
                      <div style={{ 
                        textAlign: 'center', 
                        padding: '0.5rem',
                        color: '#6b7280',
                        fontSize: '0.875rem'
                      }}>
                        ... and {todo.items.length - 5} more items
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="context-message">
                    📝 No items in this list
                  </div>
                )}

                {/* Features info */}
                <div className="device-info">
                  <div><strong>Total Items:</strong> {todo.itemCount}</div>
                  <div><strong>Completed:</strong> {completedItems}</div>
                  <div><strong>Pending:</strong> {pendingItems}</div>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <div className="binary-sensor-info">
                <div className="tags">
                  <span className="tag">Todo List</span>
                  <span className="tag secondary">{todo.itemCount} items</span>
                  {completedItems > 0 && <span className="tag active">{completedItems} done</span>}
                  {pendingItems > 0 && <span className="tag">{pendingItems} pending</span>}
                </div>
                <div className="entity-details">
                  <span><strong>Entity ID:</strong> {todo.entityId}</span>
                  <span><strong>Last Updated:</strong> {todo.lastUpdated.toLocaleTimeString()}</span>
                  <span><strong>Features:</strong> 
                    {todo.supportsAddItem && ' Add'}
                    {todo.supportsRemoveItem && ' Remove'} 
                    {todo.supportsUpdateItem && ' Update'}
                    {todo.supportsClearCompleted && ' Clear'}
                  </span>
                </div>
                {!todo.isConnected && (
                  <p className="connection-warning">
                    ⚠️ Not connected to Home Assistant
                  </p>
                )}
              </div>
            </CardFooter>
          </Card>
        )
      }}
    </Todo>
  )
}