/**
 * خدمة المناطق - Region Service
 *
 * هذا الملف يحتوي على دوال الاتصال بالـ API لجلب التراتبية الجغرافية
 * (محافظة → منطقة → منطقة فرعية → موقع) المستخدمة لتصنيف المساجد
 */

import apiClient from './apiClient';

/**
 * جلب شجرة التقسيم الإداري الكاملة
 * GET /api/regions/tree
 * @returns {Promise} مصفوفة المحافظات، كل واحدة تحتوي مناطقها ومناطقها الفرعية ومواقعها متداخلة
 */
export const getRegionsTree = async () => {
  try {
    const response = await apiClient.get('/regions/tree');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب التقسيم الجغرافي:', error);
    throw error;
  }
};

export default {
  getRegionsTree,
};
