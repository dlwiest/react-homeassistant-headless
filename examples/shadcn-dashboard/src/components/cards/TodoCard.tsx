import { useState } from 'react'
import { Todo } from 'hass-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  CheckCircle2, 
  Circle, 
  FileText, 
  Calendar,
  AlertTriangle,
  WifiOff,
  X
} from "lucide-react"

interface TodoCardProps {
  entityId: string
  name: string
}

const getStatusIcon = (status: 'needs_action' | 'completed') => {
  return status === 'completed' ? 
    <CheckCircle2 className="h-4 w-4 text-green-600" /> : 
    <Circle className="h-4 w-4 text-gray-400" />
}

export function TodoCard({ entityId, name }: TodoCardProps) {
  const [actionError, setActionError] = useState<string | null>(null)
  const [newItemText, setNewItemText] = useState('')
  const [addingItem, setAddingItem] = useState(false)

  return (
    <Todo entityId={entityId}>
      {(todo) => {
        if (todo.error) {
          return (
            <Card className="h-full flex flex-col">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <AlertTriangle className="h-8 w-8 text-destructive mr-2" />
                <div className="flex flex-col">
                  <CardTitle className="text-lg">{name}</CardTitle>
                  <CardDescription>Entity Error</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-red-800">Entity Not Available</h4>
                      <p className="text-sm text-red-700 mt-1">{todo.error.message}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        }

        const completedItems = todo.items.filter(item => item.status === 'completed').length
        const pendingItems = todo.items.filter(item => item.status === 'needs_action').length
        const completionPercent = todo.itemCount > 0 ? (completedItems / todo.itemCount) * 100 : 0

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
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <FileText className={`h-8 w-8 mr-2 ${
                completedItems === todo.itemCount && todo.itemCount > 0 
                  ? 'text-green-600' 
                  : 'text-blue-600'
              }`} />
              <div className="flex flex-col flex-1">
                <CardTitle className="text-lg">{name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <span>{todo.isConnected ? `${todo.itemCount} items` : 'Disconnected'}</span>
                  {!todo.isConnected && <WifiOff className="h-3 w-3" />}
                </CardDescription>
              </div>
              <div className="flex items-start gap-2">
                {todo.supportsClearCompleted && completedItems > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleClearCompleted}
                    className="text-xs"
                  >
                    Clear completed
                  </Button>
                )}
                {todo.itemCount > 0 && (
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {Math.round(completionPercent)}%
                    </div>
                    <div className="text-xs text-gray-500">complete</div>
                  </div>
                )}
              </div>
            </CardHeader>

            {actionError && (
              <div className="px-6 pb-2">
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <p className="text-sm text-red-700">{actionError}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setActionError(null)}
                      className="h-auto p-1 ml-2"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <CardContent className="flex-1">
              <div className="space-y-4">
                {/* Add new item */}
                {todo.supportsAddItem && (
                  <div>
                    {addingItem ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                          Add
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
                      >
                        Add Item
                      </Button>
                    )}
                  </div>
                )}

                {/* Progress Bar */}
                {todo.itemCount > 0 && (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Progress</span>
                      <span className="text-gray-600">{completedItems}/{todo.itemCount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${completionPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="flex gap-2 flex-wrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✅ {completedItems} completed
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                    ⏳ {pendingItems} pending
                  </span>
                </div>

                {/* Items List */}
                {todo.items.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {todo.items.slice(0, 5).map((item) => (
                      <div key={item.uid} className="flex items-start gap-2 p-2 rounded-md hover:bg-gray-50 transition-colors group">
                        <button
                          onClick={() => handleToggleItem(item.uid)}
                          disabled={!todo.supportsUpdateItem}
                          className="mt-0.5 disabled:opacity-50"
                        >
                          {getStatusIcon(item.status)}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div 
                            className={`text-sm cursor-pointer ${
                              item.status === 'completed' 
                                ? 'line-through text-gray-500' 
                                : 'text-gray-900'
                            }`}
                            onClick={() => handleToggleItem(item.uid)}
                          >
                            {item.summary}
                          </div>
                          {item.due && (
                            <div className="flex items-center gap-1 mt-1">
                              <Calendar className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {new Date(item.due).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                        {todo.supportsRemoveItem && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                            onClick={() => handleRemoveItem(item.uid)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {todo.items.length > 5 && (
                      <div className="text-center py-2 text-sm text-gray-500">
                        ... and {todo.items.length - 5} more items
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <p className="text-sm text-blue-700">No items in this list</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col items-start space-y-2 pt-0">
              <div className="flex gap-1 flex-wrap">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">Todo List</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border border-gray-200 text-gray-700">{todo.itemCount} items</span>
                {completedItems > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    {completedItems} done
                  </span>
                )}
              </div>
              <div className="flex gap-1 flex-wrap">
                {todo.supportsAddItem && <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs border border-gray-200 text-gray-600">Add</span>}
                {todo.supportsRemoveItem && <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs border border-gray-200 text-gray-600">Remove</span>}
                {todo.supportsUpdateItem && <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs border border-gray-200 text-gray-600">Update</span>}
                {todo.supportsClearCompleted && <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs border border-gray-200 text-gray-600">Clear</span>}
              </div>
              {!todo.isConnected && (
                <div className="flex items-center gap-1 text-xs text-destructive">
                  <AlertTriangle className="h-3 w-3" />
                  Not connected to Home Assistant
                </div>
              )}
            </CardFooter>
          </Card>
        )
      }}
    </Todo>
  )
}