/**
 * خدمة الإعلانات - Announcement Service
 *
 * هذا الملف يحتوي على دوال الاتصال بالـ API لإدارة الإعلانات
 *
 * @description
 * يستخدم axios للتواصل مع الباك إند (NestJS) على المنفذ 3001
 * جميع الطلبات ترسل auto token من localStorage عبر interceptor
 */

import axios from 'axios';

// رابط الـ API الأساسي
const API_BASE_URL = 'http://localhost:3001/api';

// إنشاء مثيل axios مع الإعدادات الأساسية
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// interceptor: إضافة Bearer token تلقائياً لكل طلب من localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * جلب جميع الإعلانات
 * GET /api/announcements
 * @returns {Promise} مصفوفة الإعلانات مع بيانات المسجد المرتبط
 */
export const getAllAnnouncements = async () => {
  try {
    const response = await apiClient.get('/announcements');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الإعلانات:', error);
    throw error;
  }
};

/**
 * جلب إعلان واحد بالـ ID
 * GET /api/announcements/:id
 * @param {number} id - رقم الإعلان
 * @returns {Promise} بيانات الإعلان
 */
export const getAnnouncement = async (id) => {
  try {
    const response = await apiClient.get(`/announcements/${id}`);
    return response.data;
  } catch (error) {
    console.error(`خطأ في جلب الإعلان رقم ${id}:`, error);
    throw error;
  }
};

/**
 * إنشاء إعلان جديد
 * POST /api/announcements
 * @param {Object} announcementData - بيانات الإعلان { title, content, mosqueId, priority?, isActive? }
 * @returns {Promise} الإعلان المنشأ
 */
export const createAnnouncement = async (announcementData) => {
  try {
    const response = await apiClient.post('/announcements', announcementData);
    return response.data;
  } catch (error) {
    console.error('خطأ في إنشاء الإعلان:', error);
    throw error;
  }
};

/**
 * تحديث بيانات إعلان
 * PATCH /api/announcements/:id
 * @param {number} id - رقم الإعلان
 * @param {Object} announcementData - البيانات المحدثة
 * @returns {Promise} الإعلان المحدث
 */
export const updateAnnouncement = async (id, announcementData) => {
  try {
    const response = await apiClient.patch(`/announcements/${id}`, announcementData);
    return response.data;
  } catch (error) {
    console.error(`خطأ في تحديث الإعلان رقم ${id}:`, error);
    throw error;
  }
};

/**
 * حذف إعلان
 * DELETE /api/announcements/:id
 * @param {number} id - رقم الإعلان المراد حذفه
 * @returns {Promise} نتيجة الحذف
 */
export const deleteAnnouncement = async (id) => {
  try {
    const response = await apiClient.delete(`/announcements/${id}`);
    return response.data;
  } catch (error) {
    console.error(`خطأ في حذف الإعلان رقم ${id}:`, error);
    throw error;
  }
};

// تصدير افتراضي
export default {
  getAllAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
