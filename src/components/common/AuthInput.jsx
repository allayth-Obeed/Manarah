/**
 * Auth Input Component
 * حقل إدخال موحد للمصادقة مع تصميم إبداعي ومظهر واضح
 */
import React, { useState } from 'react'
import { useTheme } from '../../theme/themeContext'
import { withAlpha } from '../../theme/theme'

const AuthInput = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
  required = false,
  autoComplete,
  ...props
}) => {
  const { activeTheme } = useTheme()
  const [focused, setFocused] = useState(false)

  return (
    <div className="w-full">
      {/* تسمية الحقل - مظهر واضح */}
      {label && (
        <label
          className="block text-sm font-bold mb-2 px-2 py-1 rounded-lg"
          style={{
            color: activeTheme.colors.secondary,
            backgroundColor: withAlpha(activeTheme.colors.secondary, activeTheme.colors.mode === 'dark' ? 0.15 : 0.12),
          }}
        >
          {label}
          {required && (
            <span className="mr-1" style={{ color: activeTheme.layout.danger }}>
              *
            </span>
          )}
        </label>
      )}

      {/* حاوية الحقل */}
      <div className="relative">
        {/* الأيقونة إذا وُجدت */}
        {Icon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Icon
              className="h-5 w-5 transition-colors"
              style={{ color: focused || value ? activeTheme.colors.primary : activeTheme.colors.mutedText }}
            />
          </div>
        )}

        {/* حقل الإدخال - تم تحسين وضوح النص */}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete={autoComplete}
          className={`
            w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-300 outline-none
            text-right text-base font-semibold
            ${Icon ? 'pr-12 pl-4' : 'px-4'}
            placeholder:text-[#475569] placeholder:text-sm
            ${!error && 'hover:border-[#C5A059]/50'}
          `}
          style={{
            color: activeTheme.colors.mode === 'dark' ? activeTheme.colors.text : activeTheme.colors.secondary,
            backgroundColor: activeTheme.colors.surface,
            borderColor: error ? activeTheme.colors.danger500 : focused ? activeTheme.colors.primary : activeTheme.colors.border,
            boxShadow: focused ? `0 0 0 3px ${withAlpha(activeTheme.colors.secondary, 0.25)}` : 'none',
          }}
          {...props}
        />

        {/* مؤشر التركيز الزخرفي */}
        <div
          className={`
            absolute bottom-0 left-0 h-0.5 transition-all duration-300
            ${focused ? 'w-full' : 'w-0'}
          `}
          style={{ backgroundImage: `linear-gradient(to right, ${activeTheme.colors.primary}, ${activeTheme.colors.secondary})` }}
        />
      </div>

      {/* رسالة الخطأ - مظهر واضح */}
      {error && (
        <p className="mt-2 text-sm text-right font-medium" style={{ color: activeTheme.colors.danger500 }}>
          {error}
        </p>
      )}
    </div>
  )
}

export default AuthInput
