/**
 * خدمة الخطباء - Preacher Service
 *
 * هذا الملف يحتوي على دوال الاتصال بالـ API لإدارة الخطباء وتعييناتهم
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
 * جلب جميع الخطباء
 * GET /api/preachers
 * @returns {Promise} مصفوفة الخطباء مع بيانات المستخدم والتعيينات
 */
export const getAllPreachers = async () => {
  try {
    const response = await apiClient.get('/preachers');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الخطباء:', error);
    throw error;
  }
};

/**
 * جلب خطيب واحد بالـ ID
 * GET /api/preachers/:id
 * @param {number} id - رقم الخطيب
 * @returns {Promise} بيانات الخطيب
 */
export const getPreacher = async (id) => {
  try {
    const response = await apiClient.get(`/preachers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`خطأ في جلب الخطيب رقم ${id}:`, error);
    throw error;
  }
};

/**
 * إنشاء خطيب جديد
 * POST /api/preachers
 * @param {Object} preacherData - بيانات الخطيب { firstName, lastName, phone?, email?, specialization? }
 * @returns {Promise} الخطيب المنشأ
 */
export const createPreacher = async (preacherData) => {
  try {
    const response = await apiClient.post('/preachers', preacherData);
    return response.data;
  } catch (error) {
    console.error('خطأ في إنشاء الخطيب:', error);
    throw error;
  }
};

/**
 * تحديث بيانات خطيب
 * PATCH /api/preachers/:id
 * @param {number} id - رقم الخطيب
 * @param {Object} preacherData - البيانات المحدثة
 * @returns {Promise} الخطيب المحدث
 */
export const updatePreacher = async (id, preacherData) => {
  try {
    const response = await apiClient.patch(`/preachers/${id}`, preacherData);
    return response.data;
  } catch (error) {
    console.error(`خطأ في تحديث الخطيب رقم ${id}:`, error);
    throw error;
  }
};

/**
 * حذف خطيب
 * DELETE /api/preachers/:id
 * @param {number} id - رقم الخطيب المراد حذفه
 * @returns {Promise} نتيجة الحذف
 */
export const deletePreacher = async (id) => {
  try {
    const response = await apiClient.delete(`/preachers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`خطأ في حذف الخطيب رقم ${id}:`, error);
    throw error;
  }
};

// تصدير افتراضي
export default {
  getAllPreachers,
  getPreacher,
  createPreacher,
  updatePreacher,
  deletePreacher,
};
