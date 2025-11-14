import { useState } from 'react'
import { Todo } from 'hass-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ConnectionIndicator } from "@/components/ui/connection-indicator"
import {
  CheckCircle2,
  Circle,
  X,
  Plus
} from "lucide-react"

interface TodoCardProps {
  entityId: string
  name: string
}

const getStatusIcon = (status: 'needs_action' | 'completed') => {
  return status === 'completed' ?
    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> :
    <Circle className="h-4 w-4 text-slate-400" />
}

export function TodoCard({ entityId, name }: TodoCardProps) {
  const [newItemText, setNewItemText] = useState('')
  const [addingItem, setAddingItem] = useState(false)

  return (
    <Todo entityId={entityId}>
      {(todo) => {
        const completedItems = todo.items.filter(item => item.status === 'completed').length
        const pendingItems = todo.items.filter(item => item.status === 'needs_action').length

        const handleAddItem = async () => {
          if (!newItemText.trim() || !todo.supportsAddItem) return

          try {
            await todo.addItem(newItemText.trim())
            setNewItemText('')
            setAddingItem(false)
          } catch (error) {
            console.error('Failed to add item:', error)
          }
        }

        const handleToggleItem = async (uid: string) => {
          if (!todo.supportsUpdateItem) return

          try {
            await todo.toggleItem(uid)
          } catch (error) {
            console.error('Failed to update item:', error)
          }
        }

        const handleRemoveItem = async (uid: string) => {
          if (!todo.supportsRemoveItem) return

          try {
            await todo.removeItem(uid)
          } catch (error) {
            console.error('Failed to remove item:', error)
          }
        }

        return (
          <Card className="h-full flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{name}</CardTitle>
                  <CardDescription>
                    {todo.itemCount} {todo.itemCount === 1 ? 'item' : 'items'}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold text-white">
                    {completedItems}/{todo.itemCount}
                  </div>
                  <div className="text-xs text-slate-400">completed</div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-3">
              {/* Add new item */}
              {todo.supportsAddItem && (
                <div>
                  {addingItem ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex h-9 w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-1 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      <Button size="sm" onClick={handleAddItem} disabled={!newItemText.trim()}>
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => {
                        setAddingItem(false)
                        setNewItemText('')
                      }}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => setAddingItem(true)}
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  )}
                </div>
              )}

              {/* Items List */}
              {todo.items.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {todo.items.map((item) => (
                    <div key={item.uid} className="flex items-start gap-2 p-2 rounded-md hover:bg-slate-700/30 transition-colors group">
                      <button
                        onClick={() => handleToggleItem(item.uid)}
                        disabled={!todo.supportsUpdateItem}
                        className="mt-0.5 disabled:opacity-50"
                      >
                        {getStatusIcon(item.status)}
                      </button>
                      <div
                        className={`flex-1 text-sm cursor-pointer ${
                          item.status === 'completed'
                            ? 'line-through text-slate-500'
                            : 'text-slate-200'
                        }`}
                        onClick={() => handleToggleItem(item.uid)}
                      >
                        {item.summary}
                      </div>
                      {todo.supportsRemoveItem && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                          onClick={() => handleRemoveItem(item.uid)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-slate-400 py-8">
                  No items in this list
                </div>
              )}
            </CardContent>

            <CardFooter className="flex-col items-start gap-2">
              <div className="flex flex-wrap gap-1.5">
                {completedItems > 0 && <Badge>{completedItems} completed</Badge>}
                {pendingItems > 0 && <Badge>{pendingItems} pending</Badge>}
                {todo.supportsAddItem && <Badge>Add</Badge>}
                {todo.supportsRemoveItem && <Badge>Remove</Badge>}
                {todo.supportsUpdateItem && <Badge>Update</Badge>}
              </div>
              <ConnectionIndicator isConnected={todo.isConnected} className="pt-2" />
            </CardFooter>
          </Card>
        )
      }}
    </Todo>
  )
}
