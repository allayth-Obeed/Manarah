/**
 * Sign In Page Component
 * صفحة تسجيل الدخول الإبداعية مع تصميم حديث
 */
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '@fontsource/amiri/700.css' // ADDED: خط Amiri الكلاسيكي الأنيق لعبارة "استعن بالله ولا تعجز" فقط
import { useTheme } from '../../theme/themeContext'
import AuthBackground from '../../components/common/AuthBackground'
import AuthInput from '../../components/common/AuthInput'
import LoginSplashLogo from '../../components/common/LoginSplashLogo' // ADDED: شاشة شعار الشركة بعد نجاح تسجيل الدخول
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import MosqueRoundedIcon from '@mui/icons-material/MosqueRounded' // ADDED: نفس أيقونة الشعار المستخدمة بالقائمة الجانبية بدل حرف "م"
import useAuth from '../../hooks/useAuth'
import { useCurrentUser } from '../../context/userContext' // ADDED: لتحديث بيانات المستخدم المشتركة فور نجاح الدخول

const SignInPage = () => {
  const { activeTheme } = useTheme()
  const navigate = useNavigate()
  const { signIn, loading, error, clearError } = useAuth()
  const { refreshUser } = useCurrentUser() // ADDED: بدون هذا يبقى الـ Context فارغاً حتى إعادة تحميل الصفحة يدوياً

  // حالة النموذج
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  // حالة إظهار كلمة المرور
  const [showPassword, setShowPassword] = useState(false)

  // ADDED: حالة إظهار شاشة شعار الشركة بعد نجاح تسجيل الدخول
  const [showSplash, setShowSplash] = useState(false)

  // التعامل مع تغيير الحقول
  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    if (error) clearError()
  }

  // إرسال النموذج
  const handleSubmit = async (e) => {
    e.preventDefault()

    const result = await signIn(formData.email, formData.password)
    if (result.success) {
      await refreshUser() // ADDED: مزامنة Context المستخدم المشترك بالتوكن الجديد قبل الانتقال
      setShowSplash(true) // ADDED: عرض شعار الشركة بدل الانتقال الفوري للوحة التحكم
    }
  }

  // ADDED: تُستدعى بعد اكتمال شاشة الشعار (10 ثواني + تلاشي) للانتقال الفعلي للوحة التحكم
  const handleSplashFinish = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" dir="rtl">
      {/* الخلفية الإبداعية */}
      <AuthBackground />

      {/* بطاقة تسجيل الدخول */}
      {/* MODIFIED: تلاشي وتصغير تدريجي للبطاقة عند نجاح الدخول قبل ظهور شعار الشركة */}
      <div
        className={`w-full max-w-md transition-all duration-500 ease-in-out ${
          showSplash ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      >
        {/* جزء التصميم العلوي */}
        <div className="text-center mb-8">
          {/* شعار المشروع */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 shadow-lg relative overflow-hidden">
            {/* MODIFIED: تغميق إضافي — الأخضر الداكن والعميق جداً من الهوية بدل الدرجة الفاتحة */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#054239] to-[#002623] animate-pulse" />
            {/* MODIFIED: أيقونة مسجد (نفس شعار القائمة الجانبية) بدل حرف "م" المفرد */}
            <MosqueRoundedIcon className="relative text-white" sx={{ fontSize: 36 }} />
          </div>

          {/* MODIFIED: تحية إسلامية بدل "مرحباً بعودتك" */}
          <h1 className="text-3xl font-bold mb-2" style={{ color: activeTheme.colors.text }}>
            السلام عليكم
          </h1>
          <p className="text-sm" style={{ color: activeTheme.colors.mutedText }}>
            قم بتسجيل الدخول للمتابعة إلى لوحة التحكم
          </p>

          {/* ADDED: عبارة تحفيزية بخط Amiri الأنيق فوق نموذج الدخول */}
          <p
            className="mt-3 text-xl"
            style={{
              fontFamily: '"Amiri", serif',
              fontWeight: 700,
              color: activeTheme.colors.secondary,
            }}
          >
            استعن بالله ولا تعجز
          </p>
        </div>

        {/* نموذج تسجيل الدخول */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* بطاقة النموذج */}
          <div className="bg-white dark:bg-[#111827] rounded-3xl p-8 shadow-xl border border-[#E7E3DC]">
            {/* حقل البريد الإلكتروني */}
            <AuthInput
              label="البريد الإلكتروني"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              placeholder="أدخل بريدك الإلكتروني"
              required
              icon={EmailIcon}
              autoComplete="email"
            />

            {/* حقل كلمة المرور */}
            <div className="mt-5 relative">
              <AuthInput
                label="كلمة المرور"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange('password')}
                placeholder="أدخل كلمة المرور"
                required
                icon={LockIcon}
                autoComplete="current-password"
              />

              {/* زر إظهار/إخفاء كلمة المرور */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-[42px] p-1 rounded-lg hover:bg-[#F1F4F2] transition-colors"
              >
                {showPassword ? (
                  <VisibilityOffIcon className="h-5 w-5 text-[#64748B]" />
                ) : (
                  <VisibilityIcon className="h-5 w-5 text-[#64748B]" />
                )}
              </button>
            </div>

            {/* خيارات مساعدة */}
            <div className="flex items-center justify-between mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[#E2E8F0] text-[#054239] focus:ring-[#054239]" // MODIFIED: تغميق إضافي لأخضر الهوية
                />
                <span className="text-sm" style={{ color: activeTheme.colors.mutedText }}>
                  تذكرني
                </span>
              </label>

              <Link
                to="/auth/signup"
                className="text-sm font-medium text-[#054239] hover:text-[#B9A779] transition-colors" // MODIFIED: تغميق إضافي لأخضر الهوية
              >
                إنشاء حساب جديد
              </Link>
            </div>

            {/* زر تسجيل الدخول */}
            <button
              type="submit"
              disabled={loading}
              className={`
                w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all duration-300
                bg-gradient-to-r from-[#054239] to-[#002623] text-white
                hover:shadow-lg hover:scale-[1.02] transform
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                flex items-center justify-center gap-2
              `}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  جاري تسجيل الدخول...
                </>
              ) : (
                'تسجيل الدخول'
              )}
            </button>

            {/* رسالة الخطأ العامة */}
            {error && (
              <div className="mt-4 p-3 rounded-lg bg-[#FFF3F3] border border-[#FCE7E7]">
                <p className="text-sm text-center text-[#DC2626]">{error}</p>
              </div>
            )}
          </div>
        </form>

        {/* نسخة المشروع */}
        <p className="mt-8 text-center text-xs" style={{ color: activeTheme.colors.mutedText }}>
          © 2026 منارة - جميع الحقوق محفوظة
        </p>
      </div>

      {/* ADDED: شاشة شعار الشركة بعد نجاح تسجيل الدخول، تظهر 10 ثواني ثم تختفي وتنتقل للوحة التحكم */}
      {showSplash && <LoginSplashLogo onFinish={handleSplashFinish} />}
    </div>
  )
}

export default SignInPage
