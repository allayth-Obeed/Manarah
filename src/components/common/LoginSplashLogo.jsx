/**
 * Login Splash Logo Component
 * شاشة عرض شعار الشركة بعد نجاح تسجيل الدخول قبل الانتقال للوحة التحكم
 */
import React, { useEffect, useState } from 'react'
import logoImage from '../../assets/images/المنارة نهائي.jpg'

const DISPLAY_DURATION = 10000 // مدة ظهور الشعار على الشاشة (10 ثواني)
const FADE_DURATION = 600 // مدة تأثير التلاشي بالميلي ثانية

const LoginSplashLogo = ({ onFinish }) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // تأخير بسيط عبر إطارين حتى يبدأ المتصفح من حالة opacity: 0 فعلياً قبل تشغيل الانتقال
    const showFrame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true))
    })

    const hideTimer = setTimeout(() => setVisible(false), DISPLAY_DURATION)
    const finishTimer = setTimeout(() => onFinish?.(), DISPLAY_DURATION + FADE_DURATION)

    return () => {
      cancelAnimationFrame(showFrame)
      clearTimeout(hideTimer)
      clearTimeout(finishTimer)
    }
  }, [onFinish])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center transition-opacity ease-in-out"
      style={{
        transitionDuration: `${FADE_DURATION}ms`,
        opacity: visible ? 1 : 0,
        background: '#000', // MODIFIED: خلفية بيضاء لكامل الشاشة، ومربع الشعار الداكن يبقى داخل الملف نفسه
      }}
    >
      <img
        src={logoImage}
        alt="شعار منارة"
        className="w-64 h-64 sm:w-96 sm:h-96 object-contain drop-shadow-2xl transition-transform ease-out"
        style={{
          transitionDuration: `${FADE_DURATION}ms`,
          transform: visible ? 'scale(1)' : 'scale(0.85)',
        }}
      />
    </div>
  )
}

export default LoginSplashLogo
