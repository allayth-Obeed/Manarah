/**
 * Authentication Service
 * يتعامل مع عمليات المصادقة (تسجيل الدخول/التسجيل) وإدارة الرموز المميزة
 */

// عميل axios موحّد بدل fetch الخام — يوحّد معالجة الأخطاء وإعادة التوجيه عند 401
import apiClient from './apiClient'

// قراءة الرمز المميز من التخزين المحلي
const getStoredToken = () => {
  try {
    return localStorage.getItem('accessToken')
  } catch (error) {
    console.error('خطأ في قراءة الرمز المميز:', error)
    return null
  }
}

// حفظ الرمز المميز في التخزين المحلي
const storeToken = (token) => {
  try {
    localStorage.setItem('accessToken', token)
    return true
  } catch (error) {
    console.error('خطأ في حفظ الرمز المميز:', error)
    return false
  }
}

// حذف الرمز المميز من التخزين المحلي
const removeToken = () => {
  try {
    localStorage.removeItem('accessToken')
    return true
  } catch (error) {
    console.error('خطأ في حذف الرمز المميز:', error)
    return false
  }
}

// طلب تسجيل الدخول - متصل بالـ API الحقيقي
// ملاحظة: الباك إند (NestJS) يعيد { access_token, user } وليس { accessToken, user }
const signIn = async (email, password) => {
  try {
    // apiClient.post يرمي استثناءً تلقائياً عند رد غير ناجح (بدل فحص response.ok يدوياً)
    const { data } = await apiClient.post('/auth/login', { email, password })
    return {
      accessToken: data.access_token,
      user: {
        id: data.user?.id,
        email: data.user?.email,
        name: data.user?.name,
        role: data.user?.role,
      },
    }
  } catch (error) {
    // رسالة الخطأ من الباك اند تصل عبر error.response.data.message مع axios
    throw new Error(error.response?.data?.message || 'فشل تسجيل الدخول')
  }
}

// طلب التسجيل - متصل بالـ API الحقيقي
// ملاحظة: الباك إند (AuthService.register) لا يعيد access_token عند التسجيل، فقط يعيد user object
// لذلك هنا نضطر لتسجيل الدخول بعد التسجيل للحصول على التوكن
const signUp = async (userData) => {
  try {
    // أولاً: إنشاء الحساب (بدون role — الباك اند يفرض USER دائماً على التسجيل العام)
    await apiClient.post('/auth/register', {
      name: userData.fullName,
      email: userData.email,
      password: userData.password,
    })
  } catch (error) {
    throw new Error(error.response?.data?.message || 'فشل إنشاء الحساب')
  }

  try {
    // ثانياً: بعد التسجيل الناجح، نسجل دخول للحصول على التوكن لأن الباك إند لا يعيد توكن في register
    const { data: loginData } = await apiClient.post('/auth/login', {
      email: userData.email,
      password: userData.password,
    })
    return {
      accessToken: loginData.access_token,
      user: {
        id: loginData.user?.id,
        email: loginData.user?.email,
        name: loginData.user?.name,
        role: loginData.user?.role,
      },
    }
  } catch {
    // فشل تسجيل الدخول بعد التسجيل الناجح: نرجع نجاح بدون توكن (سيسجل المستخدم دخوله يدوياً)
    return {
      accessToken: null,
      user: {
        email: userData.email,
        name: userData.fullName,
      },
    }
  }
}

// تسجيل الخروج
const signOut = async () => {
  removeToken()
  // في المستقبل قد يتم إضافة طلب إلغاء الرمز المميز للـ API
  return Promise.resolve({ success: true })
}

// التحقق من صلاحية الرمز المميز وجلب بيانات المستخدم الحقيقية
const validateToken = async () => {
  const token = getStoredToken()
  if (!token) return { valid: false }

  try {
    const { data } = await apiClient.get('/auth/me')
    if (!data.valid) {
      // الباك اند نفسه أعاد valid:false (توكن بدون userId أو مستخدم محذوف)
      removeToken()
      return { valid: false }
    }
    return {
      valid: true,
      user: data.user || data,
    }
  } catch {
    // فشل الاتصال أو توكن مرفوض: لا نعتبر الجلسة صالحة
    removeToken()
    return { valid: false }
  }
}

export { signIn, signUp, signOut, validateToken, getStoredToken, storeToken, removeToken }
