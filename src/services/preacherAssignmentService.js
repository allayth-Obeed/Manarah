/**
 * خدمة تعيينات الخطباء - Preacher Assignment Service
 *
 * هذا الملف يحتوي على دوال الاتصال بالـ API لإدارة تعيينات الخطباء للمساجد
 *
 * @description
 * يستخدم axios للتواصل مع الباك إند (NestJS) على المنفذ 3001
 * جميع الطلبات ترسل auto token من localStorage عبر interceptor
 */

import axios from 'axios'

// رابط الـ API الأساسي
const API_BASE_URL = 'http://localhost:3001/api'

// إنشاء مثيل axios مع الإعدادات الأساسية
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// interceptor: إضافة Bearer token تلقائياً لكل طلب من localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

/**
 * جلب جميع تعيينات الخطباء
 * GET /api/preacher-assignments
 * @returns {Promise} مصفوفة التعيينات مع بيانات الخطيب والمسجد
 */
export const getAllAssignments = async () => {
  try {
    const response = await apiClient.get('/preacher-assignments')
    return response.data
  } catch (error) {
    console.error('خطأ في جلب تعيينات الخطباء:', error)
    throw error
  }
}

/**
 * جلب تعيين واحد بالـ ID
 * GET /api/preacher-assignments/:id
 * @param {number} id - رقم التعيين
 * @returns {Promise} بيانات التعيين
 */
export const getAssignment = async (id) => {
  try {
    const response = await apiClient.get(`/preacher-assignments/${id}`)
    return response.data
  } catch (error) {
    console.error(`خطأ في جلب التعيين رقم ${id}:`, error)
    throw error
  }
}

/**
 * إنشاء تعيين جديد
 * POST /api/preacher-assignments
 * @param {Object} assignmentData - بيانات التعيين { preacherId, mosqueId, startDate?, endDate?, isActive? }
 * @returns {Promise} التعيين المنشأ
 */
export const createAssignment = async (assignmentData) => {
  try {
    const response = await apiClient.post('/preacher-assignments', assignmentData)
    return response.data
  } catch (error) {
    console.error('خطأ في إنشاء التعيين:', error)
    throw error
  }
}

/**
 * فحص تعارض الخطيب في يوم معيّن
 * GET /api/preacher-assignments/conflict-check?preacherId=1&date=2026-08-07
 * @param {number} preacherId - رقم الخطيب
 * @param {string} date - التاريخ بصيغة ISO أو YYYY-MM-DD
 * @returns {Promise} نتيجة الفحص { hasConflict, conflictCount, conflicts[] }
 */
export const checkPreacherConflict = async (preacherId, date) => {
  // ADDED: تعريف دالة فحص تعارض الخطيب عبر API
  try {
    // ADDED: بدء كتلة try لمعالجة الطلب بشكل آمن
    const response = await apiClient.get('/preacher-assignments/conflict-check', {
      // ADDED: استدعاء endpoint فحص التعارض في الباك إند
      params: { preacherId, date }, // ADDED: إرسال معرف الخطيب والتاريخ كـ query params
    }) // ADDED: إغلاق إعدادات الطلب
    return response.data // ADDED: إرجاع نتيجة الفحص كما وصلت من الخادم
  } catch (error) {
    // ADDED: التقاط أي خطأ في طلب فحص التعارض
    console.error('خطأ في فحص تعارض الخطيب:', error) // ADDED: تسجيل الخطأ لتسهيل التشخيص
    throw error // ADDED: إعادة رمي الخطأ ليُعالَج في طبقة الواجهة
  } // ADDED: نهاية معالجة الخطأ
} // ADDED: نهاية دالة فحص تعارض الخطيب

/**
 * تحديث بيانات تعيين
 * PATCH /api/preacher-assignments/:id
 * @param {number} id - رقم التعيين
 * @param {Object} assignmentData - البيانات المحدثة
 * @returns {Promise} التعيين المحدث
 */
export const updateAssignment = async (id, assignmentData) => {
  try {
    const response = await apiClient.patch(`/preacher-assignments/${id}`, assignmentData)
    return response.data
  } catch (error) {
    console.error(`خطأ في تحديث التعيين رقم ${id}:`, error)
    throw error
  }
}

/**
 * حذف تعيين
 * DELETE /api/preacher-assignments/:id
 * @param {number} id - رقم التعيين المراد حذفه
 * @returns {Promise} نتيجة الحذف
 */
export const deleteAssignment = async (id) => {
  try {
    const response = await apiClient.delete(`/preacher-assignments/${id}`)
    return response.data
  } catch (error) {
    console.error(`خطأ في حذف التعيين رقم ${id}:`, error)
    throw error
  }
}

// تصدير افتراضي
export default {
  getAllAssignments,
  getAssignment,
  createAssignment,
  checkPreacherConflict, // ADDED: تصدير دالة فحص التعارض للاستخدام في صفحة توزيع الخطباء
  updateAssignment,
  deleteAssignment,
}
