import React from 'react'
import { useTheme } from '../../theme/themeContext'

const AnnouncementsStats = ({
  mainLabel = 'أحدث وصول للجمهور',
  mainValue = '15,240+',
  mainCaption = 'مشاهدة هذا الأسبوع',
  activeAds = 12,
  totalAds = 128,
}) => {
  const { activeTheme } = useTheme()
  const { colors, layout } = activeTheme

  return (
    <div dir="rtl" className="w-full">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
        <div className="grid gap-3 sm:grid-cols-2 lg:w-[420px] lg:flex-none">
          <div
            className="flex h-full min-h-[112px] items-center gap-3 rounded-2xl px-5 py-4 text-right shadow-[0_1px_3px_rgba(15,23,42,0.08)] sm:px-6"
            style={{
              backgroundColor: colors.surface,
              color: colors.text,
              border: `1px solid ${colors.border}`,
            }}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11"
              style={{
                backgroundColor: layout.navActiveBg,
                color: layout.navActiveText,
              }}
            >
              <AnnouncementIcon />
            </div>

            <div className="flex flex-1 flex-col items-end justify-center gap-2">
              <div className="text-xs sm:text-sm" style={{ color: colors.mutedText }}>
                الإعلانات النشطة
              </div>
              <div
                className="text-[28px] font-semibold leading-none sm:text-[30px]"
                style={{ color: colors.primary }}
              >
                {activeAds}
              </div>
            </div>
          </div>

          <div
            className="flex h-full min-h-[112px] items-center gap-3 rounded-2xl px-5 py-4 text-right shadow-[0_1px_3px_rgba(15,23,42,0.08)] sm:px-6"
            style={{
              backgroundColor: colors.surface,
              color: colors.text,
              border: `1px solid ${colors.border}`,
            }}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11"
              style={{
                backgroundColor: layout.navActiveBg,
                color: colors.primary,
              }}
            >
              <TableIcon />
            </div>

            <div className="flex flex-1 flex-col items-end justify-center gap-2">
              <div className="text-xs sm:text-sm" style={{ color: colors.mutedText }}>
                إجمالي الإعلانات
              </div>
              <div
                className="text-[28px] font-semibold leading-none sm:text-[30px]"
                style={{ color: colors.primary }}
              >
                {totalAds}
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex min-h-[112px] flex-1 items-center gap-4 rounded-2xl px-5 py-4 text-white shadow-[0_8px_20px_rgba(13,90,56,0.18)] sm:px-6 lg:px-7"
          style={{
            backgroundColor: colors.primaryDark,
            color: colors.onPrimary,
          }}
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: colors.onPrimary }}
          >
            <GrowthIcon />
          </div>

          <div className="text-right">
            <div className="text-xs sm:text-sm" style={{ color: colors.onPrimaryMuted }}>
              {mainLabel}
            </div>
            <div className="mt-2 text-xl font-semibold leading-none sm:text-[26px]">
              <span>{mainValue}</span>
              <span
                className="mr-2 text-sm font-medium sm:text-base"
                style={{ color: colors.onPrimary }}
              >
                {mainCaption}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const AnnouncementIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
    <path
      d="M4 12.5V8.6c0-.9.7-1.6 1.6-1.6H9l5.5-3.4c.7-.4 1.5.1 1.5.9V18c0 .8-.8 1.3-1.5.9L9 15.5H5.6c-.9 0-1.6-.7-1.6-1.6v-1.4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.3 13.3v2.1c0 1.1.9 2 2 2h.9"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const TableIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
    <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M4 9h16M4 13h16M9 5v14M15 5v14" stroke="currentColor" strokeWidth="1.6" />
  </svg>
)

const GrowthIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
    <path
      d="M6 15.5l4-4 3 3 5.5-6.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.5 8.5H19v3.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default AnnouncementsStats
