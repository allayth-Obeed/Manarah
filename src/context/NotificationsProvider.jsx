import { useCallback, useEffect, useState } from 'react'
import { Snackbar, Alert } from '@mui/material'
import { useCurrentUser } from './userContext'
import { NotificationsContext } from './notificationsContext'
import { connectSocket, disconnectSocket } from '../services/socket'
import { getMyNotifications, markAllNotificationsRead } from '../services/notificationService'

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
// يحوّل سجل إشعار شخصي محفوظ قادم من الباك اند (id رقمي حقيقي، isRead) لنفس شكل عناصر القائمة المحلية
const fromPersisted = (record) => ({
  id: record.id,
  message: record.message,
  read: record.isRead,
  createdAt: new Date(record.createdAt),
  persisted: true,
})

export function NotificationsProvider({ children }) {
  const { user } = useCurrentUser()
  const [notifications, setNotifications] = useState([])
  const [toast, setToast] = useState(null)

  // ADDED: جلب الإشعارات الشخصية المحفوظة عند تسجيل الدخول — تصله حتى لو لم يكن متصلاً وقت وقوع الحدث
  useEffect(() => {
    if (!user) return undefined

    let cancelled = false
    getMyNotifications()
      .then((records) => {
        if (!cancelled) setNotifications(records.map(fromPersisted))
      })
      .catch(() => {})

    // عند تسجيل الخروج (أو تبديل المستخدم) نفرّغ القائمة بدل إبقاء إشعارات المستخدم السابق ظاهرة
    return () => {
      cancelled = true
      setNotifications([])
    }
  }, [user])

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

    // ADDED: إشعار شخصي موجَّه ومحفوظ (تكليف خطبة، إسناد صيانة...) — يصل مباشرة كسجل حقيقي بدل بناء رسالة من payload عام
    const personalHandler = (record) => {
      const item = fromPersisted(record)
      setNotifications((prev) => [item, ...prev].slice(0, 30))
      setToast(item)
    }
    socket.on('notification.new', personalHandler)

    return () => {
      entries.forEach(([event, handler]) => socket.off(event, handler))
      socket.off('notification.new', personalHandler)
    }
  }, [user])

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    markAllNotificationsRead().catch(() => {})
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
