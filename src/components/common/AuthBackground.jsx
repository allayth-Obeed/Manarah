/**
 * Auth Background Component
 * خلفية إبداعية متحركة لصفحة المصادقة
 */
import React from 'react'
import { useTheme } from '../../theme/themeContext'

const AuthBackground = () => {
  const { activeTheme } = useTheme()

  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      {/* MODIFIED: خلفية داكنة بدرجات الأخضر العميق من الهوية البصرية بدل التدرج الفاتح جداً السابق */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#002623] via-[#054239] to-[#0B1220]" />

      {/* دوامات زخرفية — MODIFIED: شفافية أعلى لتظهر بوضوح فوق الخلفية الداكنة الجديدة */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#428177]/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#B9A779]/15 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* نمط هندسي إبداعي */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 10% 20%, ${activeTheme.colors.primary} 0%, transparent 20%),
                           radial-gradient(circle at 90% 80%, ${activeTheme.colors.secondary} 0%, transparent 20%)`,
          }}
        />
      </div>

      {/* طبقة توهج خفيف — MODIFIED: توهج داكن شفاف بدل الأبيض الذي كان يضيء الخلفية أكثر */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-black/10 to-transparent" />
    </div>
  )
}

export default AuthBackground
