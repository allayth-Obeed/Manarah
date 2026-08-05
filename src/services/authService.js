/**
 * Authentication Service
 * يتعامل مع عمليات المصادقة (تسجيل الدخول/التسجيل) وإدارة الرموز المميزة
 */

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

// عنوان الـ API الأساسي
const API_BASE_URL = 'http://localhost:3001/api'

// طلب تسجيل الدخول - متصل بالـ API الحقيقي
// ملاحظة: الباك إند (NestJS) يعيد { access_token, user } وليس { accessToken, user }
const signIn = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'فشل تسجيل الدخول')
  }

  const data = await response.json()
  // ✅ تم التعديل: الباك إند يعيد access_token (snake_case) فتعيينه إلى accessToken (camelCase) للتوافق مع باقي التطبيق
  return {
    accessToken: data.access_token,
    user: {
      id: data.user?.id,
      email: data.user?.email,
      name: data.user?.name,
      role: data.user?.role,
    },
  }
}

// طلب التسجيل - متصل بالـ API الحقيقي
// ملاحظة: الباك إند (AuthService.register) لا يعيد access_token عند التسجيل، فقط يعيد user object
// لذلك هنا نضطر لتسجيل الدخول بعد التسجيل للحصول على التوكن
const signUp = async (userData) => {
  // أولاً: إنشاء الحساب
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: userData.fullName,
      email: userData.email,
      password: userData.password,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'فشل إنشاء الحساب')
  }

  // ثانياً: بعد التسجيل الناجح، نسجل دخول للحصول على التوكن
  // لأن الباك إند لا يعيد توكن في register
  const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: userData.email,
      password: userData.password,
    }),
  })

  if (!loginResponse.ok) {
    // إذا فشل تسجيل الدخول، نرجع نجاح التسجيل فقط بدون توكن
    const data = await response.json()
    return {
      accessToken: null,
      user: {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
      },
    }
  }

  const loginData = await loginResponse.json()
  return {
    accessToken: loginData.access_token,
    user: {
      id: loginData.user?.id,
      email: loginData.user?.email,
      name: loginData.user?.name,
      role: loginData.user?.role,
    },
  }
}

// تسجيل الخروج
const signOut = async () => {
  removeToken()
  // في المستقبل قد يتم إضافة طلب إلغاء الرمز المميز للـ API
  return Promise.resolve({ success: true })
}

// التحقق من صلاحية الرمز المميز
// ✅ تم التعديل: الآن يرسل طلب GET إلى /api/users/me للتحقق من صحة التوكن عبر JwtAuthGuard
const validateToken = async () => {
  const token = getStoredToken()
  if (!token) return { valid: false }

  try {
    // محاولة فك التوكن محلياً للحصول على معلومات المستخدم
    // نستخدم fetch للتحقق من صحة التوكن عبر API
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      // إذا كان التوكن غير صالح، نمسحه
      removeToken()
      return { valid: false }
    }

    const data = await response.json()
    return {
      valid: true,
      user: data.user || data,
    }
  } catch {
    // إذا فشل الاتصال بالخادم لا نعتبر الجلسة صالحة.
    // هذا يضمن ظهور صفحة تسجيل الدخول أولاً بدل الدخول التلقائي بتوكن قديم.
    removeToken()
    return { valid: false }
  }
}

export { signIn, signUp, signOut, validateToken, getStoredToken, storeToken, removeToken }
