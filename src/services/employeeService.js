/**
 * خدمة الموظفين - Employee Service
 *
 * هذا الملف يحتوي على دوال الاتصال بالـ API لإدارة الموظفين
 *
 * @description
 * - getAllEmployees: جلب جميع الموظفين
 * - getEmployee: جلب موظف واحد بالـ ID
 * - createEmployee: إنشاء موظف جديد
 * - updateEmployee: تحديث بيانات موظف
 * - deleteEmployee: حذف موظف
 * - downloadEmployeesReport: تنزيل تقرير الموظفين بصيغة CSV
 */

import axios from 'axios';

// رابط الـ API الأساسي - Backend يعمل على المنفذ 3001
// تم تعديل المسار من api/v1 إلى api لتتوافق مع إعدادات NestJS
const API_BASE_URL = 'http://localhost:3001/api';

// إنشاء مثيث axios مع الإعدادات الأساسية
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ تم الإضافة: interceptor لإضافة Bearer token تلقائياً لكل طلب من localStorage
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
 * جلب جميع الموظفين
 * @returns {Promise} Promise يحتوي على قائمة الموظفين
 */
export const getAllEmployees = async () => {
  try {
    const response = await apiClient.get('/employees');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الموظفين:', error);
    throw error;
  }
};

/**
 * جلب موظف واحد بالـ ID
 * @param {number} id - رقم الموظف
 * @returns {Promise} Promise يحتوي بيانات الموظف
 */
export const getEmployee = async (id) => {
  try {
    const response = await apiClient.get(`/employees/${id}`);
    return response.data;
  } catch (error) {
    console.error(`خطأ في جلب الموظف رقم ${id}:`, error);
    throw error;
  }
};

/**
 * إنشاء موظف جديد
 * @param {Object} employeeData - بيانات الموظف الجديد
 * @param {string} employeeData.firstName - الاسم الأول
 * @param {string} employeeData.lastName - الاسم الأخير
 * @param {string} employeeData.position - المنصب/الوظيفة
 * @param {string} [employeeData.department] - القسم (اختياري)
 * @param {string} [employeeData.phone] - رقم الهاتف (اختياري)
 * @param {number} [employeeData.salary] - الراتب (اختياري)
 * @param {string} [employeeData.hireDate] - تاريخ التوظيف (اختياري)
 * @returns {Promise} Promise يحتوي على الموظف المنشأ
 */
export const createEmployee = async (employeeData) => {
  try {
    const response = await apiClient.post('/employees', employeeData);
    return response.data;
  } catch (error) {
    console.error('خطأ في إنشاء الموظف:', error);
    throw error;
  }
};

/**
 * تحديث بيانات موظف
 * @param {number} id - رقم الموظف
 * @param {Object} employeeData - البيانات المراد تحديثها
 * @returns {Promise} Promise يحتوي على الموظف المحدث
 */
export const updateEmployee = async (id, employeeData) => {
  try {
    const response = await apiClient.patch(`/employees/${id}`, employeeData);
    return response.data;
  } catch (error) {
    console.error(`خطأ في تحديث الموظف رقم ${id}:`, error);
    throw error;
  }
};

/**
 * حذف موظف
 * @param {number} id - رقم الموظف المراد حذفه
 * @returns {Promise} Promise يحتوي على نتيجة الحذف
 */
export const deleteEmployee = async (id) => {
  try {
    const response = await apiClient.delete(`/employees/${id}`);
    return response.data;
  } catch (error) {
    console.error(`خطأ في حذف الموظف رقم ${id}:`, error);
    throw error;
  }
};

/**
 * تنزيل تقرير الموظفين بصيغة CSV
 * يقوم بإنشاء ملف تقرير وتنزيله تلقائياً
 */
export const downloadEmployeesReport = async () => {
  try {
    const response = await apiClient.get('/reports/employees/download', {
      responseType: 'blob',
    });

    // استخراج اسم الملف من الـ header
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'employees_report.csv';

    if (contentDisposition && contentDisposition.includes('filename=')) {
      const filenameMatch = contentDisposition.match(/filename=([^;]+)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].trim();
      }
    }

    // إنشاء رابط التنزيل وتنفيذه
    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('خطأ في تنزيل التقرير:', error);
    throw error;
  }
};

// تصدير افتراضي للملف
export default {
  getAllEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  downloadEmployeesReport,
};
