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
      {/* خلفية بألوان المشروع */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F5F2EB] via-[#E7E3DC] to-[#F7F6F3]" />

      {/* دوامات زخرفية */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#006747]/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#C5A059]/5 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* نمط هندسي إبداعي */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 10% 20%, ${activeTheme.colors.primary} 0%, transparent 20%),
                           radial-gradient(circle at 90% 80%, ${activeTheme.colors.secondary} 0%, transparent 20%)`,
          }}
        />
      </div>

      {/* طبقة توهج خفيف */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent" />
    </div>
  )
}

export default AuthBackground
