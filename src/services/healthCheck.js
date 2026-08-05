/**
 * خدمة فحص الاتصال بالباك إند
 * تتحقق من أن الباك إند يعمل بشكل صحيح
 */

const API_BASE_URL = 'http://localhost:3001/api'

/**
 * فحص الاتصال بالباك إند
 * @returns {Promise<boolean>} true إذا كان الباك إند يعمل
 */
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // إذا كان الرمز صالح، الباك إند يعمل
    // إذا كان الرمز غير صالح، الباك إند يعمل لكن المستخدم غير مسجل دخول
    return response.status === 200 || response.status === 401
  } catch (error) {
    console.error('❌ الباك إند غير متاح:', error)
    return false
  }
}

/**
 * فحص الاتصال بالـ API مع عرض رسالة واضحة
 */
export const verifyBackendConnection = async () => {
  const isHealthy = await checkBackendHealth()

  if (!isHealthy) {
    alert(
      '❌ لا يمكن الاتصال بالخادم (Backend)\n\n' +
      'تأكد من:\n' +
      '1. تشغيل الباك إند: cd manarah-backend && npm run start:dev\n' +
      '2. تشغيل PostgreSQL\n' +
      '3. الباك إند يعمل على المنفذ 3001\n\n' +
      'راجع الـ Console للمزيد من التفاصيل'
    )
  }

  return isHealthy
}
