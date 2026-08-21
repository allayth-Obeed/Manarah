/**
 * Sign Up Page Component
 * صفحة إنشاء حساب جديد إبداعية مع تصميم حديث
 */
import React, { useRef, useState } from 'react' // MODIFIED: useRef للوصول لعنصر اختيار الملف المخفي
import { useNavigate, Link } from 'react-router-dom'
import { useTheme } from '../../theme/themeContext'
import AuthBackground from '../../components/common/AuthBackground'
import AuthInput from '../../components/common/AuthInput'
import PersonIcon from '@mui/icons-material/Person'
import LockIcon from '@mui/icons-material/Lock'
import EmailIcon from '@mui/icons-material/Email'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import CameraAltIcon from '@mui/icons-material/CameraAlt' // ADDED: أيقونة اختيار/تغيير الصورة الشخصية
import CloseIcon from '@mui/icons-material/Close' // ADDED: زر إزالة الصورة المختارة
import useAuth from '../../hooks/useAuth'
import { uploadAvatar } from '../../services/userService' // ADDED: رفع الصورة الشخصية بعد نجاح إنشاء الحساب

const SignUpPage = () => {
  const { activeTheme } = useTheme()
  const navigate = useNavigate()
  const { signUp, loading, error, clearError } = useAuth()

  // حالة النموذج
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  // حالة إظهار كلمة المرور
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // حالة الخطأ
  const [errors, setErrors] = useState({})

  // ADDED: حالة الصورة الشخصية المختارة (ملف + رابط معاينة محلي) — اختيارية عند التسجيل
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [photoError, setPhotoError] = useState('')
  const fileInputRef = useRef(null)

  // ADDED: التحقق من نوع/حجم الصورة محلياً قبل رفعها (نفس القيود المفروضة بالباك اند: jpeg/png/webp حتى 2MB)
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setPhotoError('الصورة يجب أن تكون بصيغة JPEG أو PNG أو WEBP')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setPhotoError('حجم الصورة يجب ألا يتجاوز 2 ميجابايت')
      return
    }

    setPhotoError('')
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file)) // ADDED: معاينة فورية قبل الرفع الفعلي
  }

  // ADDED: إزالة الصورة المختارة قبل الإرسال
  const handleRemovePhoto = () => {
    setPhotoFile(null)
    setPhotoPreview(null)
    setPhotoError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // التعامل مع تغيير الحقول
  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
    if (error) clearError()
  }

  // التحقق من صحة البيانات
  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'الاسم الكامل مطلوب'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح'
    }

    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة'
    } else if (formData.password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'كلمة المرور غير متطابقة'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // إرسال النموذج
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    const result = await signUp(formData)
    if (result.success) {
      // ADDED: رفع الصورة الشخصية (إن اختارها المستخدم) بعد نجاح إنشاء الحساب وتسجيل الدخول التلقائي —
      // التوكن أصبح متوفراً الآن بالتخزين المحلي، وهو مطلوب لمصادقة طلب الرفع
      if (photoFile) {
        try {
          await uploadAvatar(photoFile)
        } catch (err) {
          // لا نمنع إكمال التسجيل بسبب فشل رفع الصورة — الحساب أُنشئ بنجاح بالفعل، يمكنه إضافة الصورة لاحقاً
          console.error('خطأ في رفع الصورة الشخصية:', err)
        }
      }
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" dir="rtl">
      {/* الخلفية الإبداعية */}
      <AuthBackground />

      {/* بطاقة إنشاء الحساب */}
      <div className="w-full max-w-md">
        {/* جزء التصميم العلوي */}
        <div className="text-center mb-8">
          {/* MODIFIED: استُبدل شعار "م" الثابت بمُنتقي صورة شخصية حقيقي — اختياري عند إنشاء الحساب */}
          <div className="relative inline-block mb-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl shadow-lg relative overflow-hidden cursor-pointer"
              title="اختر صورة شخصية"
            >
              {photoPreview ? (
                // ADDED: معاينة الصورة المختارة بدل الشعار الثابت
                <img src={photoPreview} alt="الصورة الشخصية" className="w-full h-full object-cover" />
              ) : (
                <>
                  {/* MODIFIED: تغميق إضافي — نفس الأخضر الداكن والعميق جداً من الهوية بدل الأخضر السابق */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#054239] to-[#002623]" />
                  <CameraAltIcon className="relative text-white" sx={{ fontSize: 28 }} />
                </>
              )}
            </button>
            {photoPreview && (
              // ADDED: زر صغير لإزالة الصورة المختارة قبل الإرسال
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full bg-[#DC2626] text-white flex items-center justify-center shadow"
                title="إزالة الصورة"
              >
                <CloseIcon sx={{ fontSize: 14 }} />
              </button>
            )}
          </div>
          {photoError && (
            <p className="text-xs text-[#DC2626] mb-2">{photoError}</p>
          )}
          {/* ADDED: توضيح أن اختيار الصورة اختياري وليس شعاراً ثابتاً كما كان سابقاً */}
          <p className="text-xs mb-2" style={{ color: activeTheme.colors.mutedText }}>
            {photoPreview ? 'اضغط لتغيير الصورة' : 'اختياري: اضغط لإضافة صورة شخصية'}
          </p>

          <h1 className="text-3xl font-bold mb-2" style={{ color: activeTheme.colors.text }}>
            إنشاء حساب جديد
          </h1>
          <p className="text-sm" style={{ color: activeTheme.colors.mutedText }}>
            انضم إلينا اليوم وابدأ رحلتك
          </p>
        </div>

        {/* نموذج إنشاء الحساب */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* بطاقة النموذج */}
          <div className="bg-white dark:bg-[#111827] rounded-3xl p-8 shadow-xl border border-[#E7E3DC]">
            {/* حقل الاسم الكامل */}
            <AuthInput
              label="الاسم الكامل"
              type="text"
              value={formData.fullName}
              onChange={handleChange('fullName')}
              placeholder="أدخل اسمك الكامل"
              required
              error={errors.fullName}
              icon={PersonIcon}
              autoComplete="name"
            />

            {/* حقل البريد الإلكتروني */}
            <div className="mt-5">
              <AuthInput
                label="البريد الإلكتروني"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                placeholder="أدخل بريدك الإلكتروني"
                required
                error={errors.email}
                icon={EmailIcon}
                autoComplete="email"
              />
            </div>

            {/* حقل كلمة المرور */}
            <div className="mt-5 relative">
              <AuthInput
                label="كلمة المرور"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange('password')}
                placeholder="اختر كلمة مرور"
                required
                error={errors.password}
                icon={LockIcon}
                autoComplete="new-password"
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

            {/* حقل تأكيد كلمة المرور */}
            <div className="mt-5 relative">
              <AuthInput
                label="تأكيد كلمة المرور"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                placeholder="أكد كلمة المرور"
                required
                error={errors.confirmPassword}
                icon={LockIcon}
                autoComplete="new-password"
              />

              {/* زر إظهار/إخفاء كلمة المرور */}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute left-3 top-[42px] p-1 rounded-lg hover:bg-[#F1F4F2] transition-colors"
              >
                {showConfirmPassword ? (
                  <VisibilityOffIcon className="h-5 w-5 text-[#64748B]" />
                ) : (
                  <VisibilityIcon className="h-5 w-5 text-[#64748B]" />
                )}
              </button>
            </div>

            {/* زر إنشاء الحساب */}
            <button
              type="submit"
              disabled={loading}
              className={`
                w-full mt-8 py-4 rounded-xl font-bold text-lg transition-all duration-300
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
                  جاري إنشاء الحساب...
                </>
              ) : (
                'إنشاء حساب'
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

        {/* رابط تسجيل الدخول */}
        <div className="mt-6 text-center">
          <span className="text-sm" style={{ color: activeTheme.colors.mutedText }}>
            لديك حساب بالفعل؟{' '}
          </span>
          <Link
            to="/auth/signin"
            className="text-sm font-medium text-[#054239] hover:text-[#B9A779] transition-colors" // MODIFIED: تغميق إضافي لأخضر الهوية
          >
            سجل دخولك الآن
          </Link>
        </div>

        {/* نسخة المشروع */}
        <p className="mt-8 text-center text-xs" style={{ color: activeTheme.colors.mutedText }}>
          © 2025 منارة - جميع الحقوق محفوظة
        </p>
      </div>
    </div>
  )
}

export default SignUpPage
