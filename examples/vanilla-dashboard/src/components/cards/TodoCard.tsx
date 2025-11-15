import React from 'react'
import { Todo } from 'hass-react'
import { Card, CardHeader, CardContent, CardFooter } from '../layout/Card'

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

        return (
          <Card>
            <CardHeader
              title={name}
              subtitle={`${todo.itemCount} items`}
              action={
                <div className="todo-completion">
                  {completedItems}/{todo.items.length} completed
                </div>
              }
            />

            <CardContent>
              <button
                onClick={() => {
                  const text = prompt('Enter new item:')
                  if (text) {
                    todo.addItem(text)
                  }
                }}
                className="todo-add-button"
              >
                + Add Item
              </button>

              <div className="todo-items">
                {todo.items.map((item) => (
                  <div key={item.uid} className="todo-item">
                    <input
                      type="checkbox"
                      checked={item.status === 'completed'}
                      onChange={() => todo.toggleItem(item.uid)}
                      className="todo-checkbox"
                    />
                    <span className={`todo-text ${item.status === 'completed' ? 'completed' : ''}`}>
                      {item.summary}
                    </span>
                    {todo.supportsRemoveItem && (
                      <button
                        onClick={() => todo.removeItem(item.uid)}
                        className="todo-remove-button"
                        title="Remove item"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter>
              <div className="todo-footer-buttons">
                <button className="todo-footer-button">{completedItems} completed</button>
                <button className="todo-footer-button">{pendingItems} pending</button>
                <button className="todo-footer-button" onClick={() => todo.addItem('New item')}>Add</button>
                <button className="todo-footer-button" onClick={() => todo.clearCompleted()}>Remove</button>
                {todo.supportsUpdateItem && <button className="todo-footer-button">Update</button>}
              </div>
              <div className={`connection-indicator ${todo.isConnected ? 'connected' : 'disconnected'}`}>
                <div className="connection-dot"></div>
                <span>{todo.isConnected ? 'Online' : 'Offline'}</span>
              </div>
            </CardFooter>
          </Card>
        )
      }}
    </Todo>
  )
}

export default TodoCard