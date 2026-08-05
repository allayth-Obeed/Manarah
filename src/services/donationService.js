/**
 * خدمة التبرعات - Donation Service
 *
 * هذا الملف يحتوي على دوال الاتصال بالـ API لإدارة التبرعات
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
 * جلب جميع التبرعات
 * GET /api/donations
 * @returns {Promise} مصفوفة التبرعات مع بيانات المسجد المرتبط
 */
export const getAllDonations = async () => {
  try {
    const response = await apiClient.get('/donations');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب التبرعات:', error);
    throw error;
  }
};

/**
 * جلب تبرع واحد بالـ ID
 * GET /api/donations/:id
 * @param {number} id - رقم التبرع
 * @returns {Promise} بيانات التبرع
 */
export const getDonation = async (id) => {
  try {
    const response = await apiClient.get(`/donations/${id}`);
    return response.data;
  } catch (error) {
    console.error(`خطأ في جلب التبرع رقم ${id}:`, error);
    throw error;
  }
};

/**
 * إنشاء تبرع جديد
 * POST /api/donations
 * @param {Object} donationData - بيانات التبرع { donorName, amount, mosqueId, purpose?, notes? }
 * @returns {Promise} التبرع المنشأ
 */
export const createDonation = async (donationData) => {
  try {
    const response = await apiClient.post('/donations', donationData);
    return response.data;
  } catch (error) {
    console.error('خطأ في إنشاء التبرع:', error);
    throw error;
  }
};

/**
 * تحديث بيانات تبرع
 * PATCH /api/donations/:id
 * @param {number} id - رقم التبرع
 * @param {Object} donationData - البيانات المحدثة
 * @returns {Promise} التبرع المحدث
 */
export const updateDonation = async (id, donationData) => {
  try {
    const response = await apiClient.patch(`/donations/${id}`, donationData);
    return response.data;
  } catch (error) {
    console.error(`خطأ في تحديث التبرع رقم ${id}:`, error);
    throw error;
  }
};

/**
 * حذف تبرع
 * DELETE /api/donations/:id
 * @param {number} id - رقم التبرع المراد حذفه
 * @returns {Promise} نتيجة الحذف
 */
export const deleteDonation = async (id) => {
  try {
    const response = await apiClient.delete(`/donations/${id}`);
    return response.data;
  } catch (error) {
    console.error(`خطأ في حذف التبرع رقم ${id}:`, error);
    throw error;
  }
};

// تصدير افتراضي
export default {
  getAllDonations,
  getDonation,
  createDonation,
  updateDonation,
  deleteDonation,
};
