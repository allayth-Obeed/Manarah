/**
 * خدمة الإشعارات الشخصية المحفوظة - Notifications Service
 * إشعارات المستخدم الحالي فقط (تكليف خطبة، إسناد صيانة...)
 */
import apiClient from './apiClient'

// جلب آخر 50 إشعاراً شخصياً محفوظاً للمستخدم الحالي
// GET /api/notifications
export const getMyNotifications = async () => {
  const { data } = await apiClient.get('/notifications')
  return data
}

// تعليم إشعار واحد كمقروء
// PATCH /api/notifications/:id/read
export const markNotificationRead = async (id) => {
  const { data } = await apiClient.patch(`/notifications/${id}/read`)
  return data
}

// تعليم كل الإشعارات كمقروءة
// PATCH /api/notifications/read-all
export const markAllNotificationsRead = async () => {
  const { data } = await apiClient.patch('/notifications/read-all')
  return data
}

export default { getMyNotifications, markNotificationRead, markAllNotificationsRead }
