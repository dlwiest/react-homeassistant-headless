import React, { createContext, useContext, useState, ReactNode } from 'react'
import './tabs.css'

interface TabsContextValue {
  activeTab: string
  setActiveTab: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined)

interface TabsProps {
  defaultValue: string
  children: ReactNode
  className?: string
}

export const Tabs = ({ defaultValue, children, className = '' }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue)

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`tabs ${className}`}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

interface TabsListProps {
  children: ReactNode
  className?: string
}

export const TabsList = ({ children, className = '' }: TabsListProps) => {
  return (
    <div className={`tabs-list ${className}`}>
      {children}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  children: ReactNode
  className?: string
}

export const TabsTrigger = ({ value, children, className = '' }: TabsTriggerProps) => {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabsTrigger must be used within Tabs')

  const { activeTab, setActiveTab } = context
  const isActive = activeTab === value

  return (
    <button
      className={`tabs-trigger ${isActive ? 'active' : ''} ${className}`}
      onClick={() => setActiveTab(value)}
      data-state={isActive ? 'active' : 'inactive'}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: ReactNode
  className?: string
}

export const TabsContent = ({ value, children, className = '' }: TabsContentProps) => {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabsContent must be used within Tabs')

  const { activeTab } = context
  if (activeTab !== value) return null

  return (
    <div className={`tabs-content ${className}`}>
      {children}
    </div>
  )
}
