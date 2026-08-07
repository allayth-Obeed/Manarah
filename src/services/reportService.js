/**
 * خدمة التقارير - Report Service
 * تنزيل تقارير CSV من الباك اند (مساجد، ...) — نفس نمط downloadEmployeesReport
 */

// عميل axios الموحّد لإرفاق التوكن تلقائياً بطلب التنزيل
import apiClient from './apiClient'

/**
 * تنزيل تقرير المساجد بصيغة CSV
 * GET /api/reports/mosques/download
 */
export const downloadMosquesReport = async () => {
  try {
    // responseType: 'blob' لازم لاستقبال ملف بدل نص JSON
    const response = await apiClient.get('/reports/mosques/download', {
      responseType: 'blob',
    })

    // استخراج اسم الملف من الـ header نفس أسلوب تقرير الموظفين
    const contentDisposition = response.headers['content-disposition']
    let filename = 'mosques_report.csv'
    if (contentDisposition && contentDisposition.includes('filename=')) {
      const filenameMatch = contentDisposition.match(/filename=([^;]+)/)
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].trim()
      }
    }

    // إنشاء رابط تنزيل مؤقت وتفعيله ثم تنظيفه
    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('خطأ في تنزيل تقرير المساجد:', error)
    throw error
  }
}

/**
 * ADDED: تنزيل تقرير التبرعات بصيغة CSV
 * GET /api/reports/donations/download
 */
export const downloadDonationsReport = async () => {
  try {
    const response = await apiClient.get('/reports/donations/download', {
      responseType: 'blob',
    })

    const contentDisposition = response.headers['content-disposition']
    let filename = 'donations_report.csv'
    if (contentDisposition && contentDisposition.includes('filename=')) {
      const filenameMatch = contentDisposition.match(/filename=([^;]+)/)
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].trim()
      }
    }

    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('خطأ في تنزيل تقرير التبرعات:', error)
    throw error
  }
}

export default { downloadMosquesReport, downloadDonationsReport }
