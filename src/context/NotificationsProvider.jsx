import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Snackbar, Alert } from '@mui/material'
import { useCurrentUser } from './userContext'
import { connectSocket, disconnectSocket } from '../services/socket'

const NotificationsContext = createContext(null)

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider')
  }
  return context
}

const STATUS_LABELS = { OPEN: 'مفتوحة', IN_PROGRESS: 'قيد المعالجة', RESOLVED: 'تم الحل', CLOSED: 'مغلقة' }

// دوال بناء نص عربي مقروء لكل نوع حدث لحظي يبثّه الباك اند
const EVENT_MESSAGES = {
  'donation.created': (p) =>
    `تبرع جديد من ${p.donorName || 'متبرع'} بقيمة ${p.amount || 0} ر.س${p.mosqueName ? ` — ${p.mosqueName}` : ''}`,
  'maintenance.created': (p) =>
    `تذكرة صيانة جديدة: ${p.title}${p.mosqueName ? ` — ${p.mosqueName}` : ''}`,
  'maintenance.statusChanged': (p) =>
    `تحديث حالة تذكرة "${p.title}" إلى ${STATUS_LABELS[p.status] || p.status}`,
  'assignment.created': (p) => `تكليف جديد: ${p.preacherName} — ${p.mosqueName}`,
  // ADDED: يصل هذا الحدث تحديداً لموظفي/خطباء المسجد المعني (بث موجَّه من الباك اند) بدل الجميع
  'announcement.created': (p) => `إعلان جديد بمسجدك: ${p.title}${p.mosqueName ? ` — ${p.mosqueName}` : ''}`,
}

// Provider واحد على مستوى التطبيق يفتح اتصال Socket.IO حال تسجيل الدخول، ويجمّع الأحداث اللحظية
// (تبرع جديد، تذكرة صيانة، تغيّر حالة تذكرة، تكليف خطيب) في قائمة إشعارات + توست فوري
export function NotificationsProvider({ children }) {
  const { user } = useCurrentUser()
  const [notifications, setNotifications] = useState([])
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!user) {
      disconnectSocket()
      return undefined
    }

    const socket = connectSocket()
    if (!socket) return undefined

    const entries = Object.entries(EVENT_MESSAGES).map(([event, buildMessage]) => {
      const handler = (payload) => {
        const item = {
          id: `${event}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          message: buildMessage(payload),
          read: false,
          createdAt: new Date(),
        }
        setNotifications((prev) => [item, ...prev].slice(0, 30))
        setToast(item)
      }
      socket.on(event, handler)
      return [event, handler]
    })

    return () => {
      entries.forEach(([event, handler]) => socket.off(event, handler))
    }
  }, [user])

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const clearToast = useCallback(() => setToast(null), [])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, markAllRead }}>
      {children}
      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={5000}
        onClose={clearToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Alert onClose={clearToast} severity="info" variant="filled" sx={{ direction: 'rtl' }}>
          {toast?.message}
        </Alert>
      </Snackbar>
    </NotificationsContext.Provider>
  )
}
