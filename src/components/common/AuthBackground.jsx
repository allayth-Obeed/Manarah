/**
 * Auth Background Component
 * خلفية إبداعية متحركة لصفحة المصادقة
 */
import React from 'react'
import { useTheme } from '../../theme/themeContext'
import { syrianIdentityPalette, themeTokens, withAlpha } from '../../theme/theme'

const AuthBackground = () => {
  const { activeTheme } = useTheme()

  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      {/* الخلفية دائماً داكنة بدرجات الأخضر من الهوية البصرية بغض النظر عن وضع الثيم */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to bottom right, ${syrianIdentityPalette.forest.dark}, ${syrianIdentityPalette.forest.mid}, ${themeTokens.dark.colors.background})`,
        }}
      />

      {/* دوامات زخرفية */}
      <div
        className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl animate-pulse"
        style={{ backgroundColor: withAlpha(syrianIdentityPalette.forest.light, 0.2) }}
      />
      <div
        className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000"
        style={{ backgroundColor: withAlpha(syrianIdentityPalette.goldenWheat.mid, 0.15) }}
      />

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
