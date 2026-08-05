/**
 * خدمة المستخدم الحالي - User Service
 * رفع الصورة الشخصية للمستخدم المسجَّل دخوله
 */

import { API_ORIGIN } from './apiClient' // ADDED: لبناء رابط الـ API بدون استخدام apiClient نفسه (انظر السبب أدناه)

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

export default { uploadAvatar }
