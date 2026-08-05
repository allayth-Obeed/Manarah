/**
 * خدمة المساجد - Mosque Service
 *
 * هذا الملف يحتوي على دوال الاتصال بالـ API لإدارة المساجد
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
 * جلب جميع المساجد
 * GET /api/mosques
 * @returns {Promise} مصفوفة المساجد مع بيانات الخطباء والإعلانات والتبرعات المرتبطة
 */
export const getAllMosques = async () => {
  try {
    const response = await apiClient.get('/mosques');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب المساجد:', error);
    throw error;
  }
};

/**
 * جلب مسجد واحد بالـ ID
 * GET /api/mosques/:id
 * @param {number} id - رقم المسجد
 * @returns {Promise} بيانات المسجد
 */
export const getMosque = async (id) => {
  try {
    const response = await apiClient.get(`/mosques/${id}`);
    return response.data;
  } catch (error) {
    console.error(`خطأ في جلب المسجد رقم ${id}:`, error);
    throw error;
  }
};

/**
 * إنشاء مسجد جديد
 * POST /api/mosques
 * @param {Object} mosqueData - بيانات المسجد { name, address, city, phone?, capacity?, latitude?, longitude? }
 * @returns {Promise} المسجد المنشأ
 */
export const createMosque = async (mosqueData) => {
  try {
    const response = await apiClient.post('/mosques', mosqueData);
    return response.data;
  } catch (error) {
    console.error('خطأ في إنشاء المسجد:', error);
    throw error;
  }
};

/**
 * تحديث بيانات مسجد
 * PATCH /api/mosques/:id
 * @param {number} id - رقم المسجد
 * @param {Object} mosqueData - البيانات المحدثة
 * @returns {Promise} المسجد المحدث
 */
export const updateMosque = async (id, mosqueData) => {
  try {
    const response = await apiClient.patch(`/mosques/${id}`, mosqueData);
    return response.data;
  } catch (error) {
    console.error(`خطأ في تحديث المسجد رقم ${id}:`, error);
    throw error;
  }
};

/**
 * حذف مسجد
 * DELETE /api/mosques/:id
 * @param {number} id - رقم المسجد المراد حذفه
 * @returns {Promise} نتيجة الحذف
 */
export const deleteMosque = async (id) => {
  try {
    const response = await apiClient.delete(`/mosques/${id}`);
    return response.data;
  } catch (error) {
    console.error(`خطأ في حذف المسجد رقم ${id}:`, error);
    throw error;
  }
};

// تصدير افتراضي
export default {
  getAllMosques,
  getMosque,
  createMosque,
  updateMosque,
  deleteMosque,
};
