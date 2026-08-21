import { createContext, useContext } from 'react'

// نفس نمط userContext.js — Context منفصل عن الـ Provider لتفادي مشاكل Fast Refresh
export const NotificationsContext = createContext(null)

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider')
  }
  return context
}
