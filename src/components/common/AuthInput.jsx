/**
 * Auth Input Component
 * حقل إدخال موحد للمصادقة مع تصميم إبداعي ومظهر واضح
 */
import React, { useState } from 'react'
import { useTheme } from '../../theme/themeContext'

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
            backgroundColor: activeTheme.colors.mode === 'dark' ? 'rgba(197, 160, 89, 0.15)' : 'rgba(197, 160, 89, 0.12)',
          }}
        >
          {label}
          {required && <span className="text-[#D64040] mr-1">*</span>}
        </label>
      )}

      {/* حاوية الحقل */}
      <div className="relative">
        {/* الأيقونة إذا وُجدت */}
        {Icon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Icon
              className={`h-5 w-5 transition-colors ${
                focused || value ? 'text-[#006747]' : 'text-[#64748B]'
              }`}
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
            ${error ? 'border-[#DC2626]' : focused ? 'border-[#006747]' : 'border-[#E2E8F0]'}
            bg-white dark:bg-[#111827]
            placeholder:text-[#475569] placeholder:text-sm
            ${!error && 'hover:border-[#C5A059]/50'}
          `}
          style={{
            color: activeTheme.colors.mode === 'dark' ? '#F8FAFC' : activeTheme.colors.secondary,
            boxShadow: focused ? '0 0 0 3px rgba(197, 160, 89, 0.25)' : 'none',
          }}
          {...props}
        />

        {/* مؤشر التركيز الزخرفي */}
        <div
          className={`
            absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#006747] to-[#C5A059]
            transition-all duration-300
            ${focused ? 'w-full' : 'w-0'}
          `}
        />
      </div>

      {/* رسالة الخطأ - مظهر واضح */}
      {error && <p className="mt-2 text-sm text-[#DC2626] text-right font-medium">{error}</p>}
    </div>
  )
}

export default AuthInput
