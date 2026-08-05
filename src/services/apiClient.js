// عميل axios موحّد لكل خدمات الفرونت اند — كان كل ملف خدمة ينشئ نسخته الخاصة (6 نسخ مكررة)
/**
 * API Client موحّد
 *
 * @description
 * نسخة axios واحدة مشتركة بين كل ملفات src/services/*Service.js
 * تقرأ عنوان الباك اند من متغير البيئة VITE_API_URL بدل تكراره كنص ثابت بكل ملف
 */

import axios from 'axios'

// عنوان الـ API يُقرأ من .env؛ نستخدم عنوان محلي افتراضي فقط لو المتغير غير معرَّف
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// ADDED: أصل الباك اند بدون لاحقة /api — لازم لبناء رابط كامل لصور المستخدمين المرفوعة (تُخدَّم من /uploads وليس /api)
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '')

// إنشاء مثيل axios الوحيد الذي تستورده كل الخدمات
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// طلب: إضافة Bearer token تلقائياً لكل طلب من localStorage (نفس منطق الملفات السابقة)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// استجابة: عند 401 (توكن منتهي/غير صالح) نمسح الجلسة ونعيد التوجيه لتسجيل الدخول مركزياً
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken') // مسح التوكن غير الصالح
      // تفادي حلقة إعادة توجيه لا نهائية لو الخطأ صدر من صفحة تسجيل الدخول نفسها
      if (!window.location.pathname.startsWith('/auth/')) {
        window.location.href = '/auth/signin'
      }
    }
    return Promise.reject(error)
  },
)

export default apiClient
