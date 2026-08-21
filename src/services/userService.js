/**
 * خدمة المستخدم الحالي - User Service
 * رفع الصورة الشخصية للمستخدم المسجَّل دخوله
 */

import apiClient, { API_ORIGIN } from './apiClient' // ADDED: لبناء رابط الـ API بدون استخدام apiClient نفسه (انظر السبب أدناه)

// ملاحظة: نستخدم fetch الخام هنا بدل apiClient (axios) عمداً — apiClient يفرض
// Content-Type: application/json افتراضياً على كل الطلبات، وهذا يكسر رفع الملفات
// (multipart/form-data يحتاج boundary يُولِّده المتصفح تلقائياً عند استخدام fetch/FormData بدون تحديد Content-Type يدوياً)
const API_BASE_URL = `${API_ORIGIN}/api`

/**
 * رفع صورة شخصية جديدة للمستخدم الحالي (المسجَّل دخوله بالتوكن المخزَّن)
 * POST /api/users/me/avatar
 * @param {File} file - ملف الصورة (jpeg/png/webp، حتى 2MB)
 * @returns {Promise<{avatarUrl: string}>}
 */
export const uploadAvatar = async (file) => {
  const token = localStorage.getItem('accessToken')
  const formData = new FormData()
  formData.append('avatar', file)

  const response = await fetch(`${API_BASE_URL}/users/me/avatar`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      // لا نضبط Content-Type يدوياً — المتصفح يضبطه تلقائياً مع الـ boundary الصحيح لـ FormData
    },
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'فشل رفع الصورة الشخصية')
  }

  return response.json()
}

/**
 * جلب لوحة المستخدم الحالي الشخصية: بيانات الخطيب/الموظف المرتبطة بحسابه (إن وُجدت) مع تكليفاته/تذاكره
 * GET /api/users/me/overview
 * @returns {Promise<{preacher: object|null, employee: object|null}>}
 */
export const getMyOverview = async () => {
  const { data } = await apiClient.get('/users/me/overview')
  return data
}

/**
 * جلب قائمة كل المستخدمين (ADMIN/MANAGER فقط) — لربط حساب دخول بسجل خطيب/موظف جديد
 * GET /api/users
 * @returns {Promise<Array<{id, name, email, role, isLinked}>>}
 */
export const getAllUsers = async () => {
  const { data } = await apiClient.get('/users')
  return data
}

/**
 * تحديث دور مستخدم — مستخدم عادي/خطيب/موظف فقط (ADMIN/MANAGER فقط يقدرون، ولا تعمل على حساب مسؤول نظام)
 * PATCH /api/users/:id/role
 * @param {number} id
 * @param {'USER'|'PREACHER'|'EMPLOYEE'} role
 */
export const updateUserRole = async (id, role) => {
  const { data } = await apiClient.patch(`/users/${id}/role`, { role })
  return data
}

/**
 * حذف حساب مستخدم نهائياً (ADMIN فقط، ولا يعمل على حساب مسؤول نظام أو حسابك الخاص)
 * DELETE /api/users/:id
 * @param {number} id
 */
export const deleteUser = async (id) => {
  const { data } = await apiClient.delete(`/users/${id}`)
  return data
}

export default { uploadAvatar, getMyOverview, getAllUsers, updateUserRole, deleteUser }
