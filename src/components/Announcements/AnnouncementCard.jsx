import React from 'react'
import defaultImg from '../../assets/images/announcement-default.svg'
import { useTheme } from '../../theme/themeContext' // ADDED: لاستبدال ألوان Tailwind الثابتة برموز الثيم المتوافقة مع الوضع الليلي

// AnnouncementCard: reusable, RTL-friendly, API-ready props
export default function AnnouncementCard({
  image,
  title,
  excerpt,
  dateLabel,
  views,
  comments,
  status,
  onClick,
  onDeleteClick,
}) {
  const src = typeof image === 'string' && image.trim() ? image : defaultImg
  const { activeTheme } = useTheme() // ADDED: نفس نمط الثيم المستخدم ببقية المشروع بدل كلاسات bg-white/text-gray-* الثابتة
  const { colors } = activeTheme

  return (
    <article
      dir="rtl"
      onClick={onClick}
      // MODIFIED: حُذفت bg-white من الكلاسات، وتُضبط الخلفية والألوان الآن عبر style من رموز الثيم
      className="w-full border-2 border-dashed border-blue-400 rounded-lg p-4 flex gap-4 items-start hover:shadow-md transition-shadow cursor-pointer"
      style={{ backgroundColor: colors.surface, color: colors.text }}
    >
      <img
        src={src}
        alt={title || 'announcement'}
        className="w-24 h-20 object-cover rounded-md flex-shrink-0"
        style={{ backgroundColor: colors.bgelem }} // MODIFIED: بدل bg-gray-50 الثابت
        onError={(event) => {
          event.currentTarget.src = defaultImg
        }}
      />

      <div className="flex-1">
        <div className="flex items-start justify-between gap-4">
          {/* MODIFIED: بدل text-gray-900 الثابت */}
          <h3 className="text-base md:text-lg font-semibold leading-tight" style={{ color: colors.text }}>
            {title}
          </h3>
        </div>

        <p
          className="mt-2 text-sm leading-relaxed"
          style={{
            color: colors.mutedText, // MODIFIED: بدل text-gray-600 الثابت
            WebkitLineClamp: 3,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {excerpt}
        </p>

        <div
          className="mt-3 flex items-center justify-between text-sm"
          style={{ color: colors.mutedText }} // MODIFIED: بدل text-gray-500 الثابت
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                style={{ color: colors.mutedText }} // MODIFIED: بدل text-gray-400 الثابت
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>{dateLabel}</span>
            </div>

            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                style={{ color: colors.mutedText }} // MODIFIED: بدل text-gray-400 الثابت
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span>{views}</span>
            </div>

            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                style={{ color: colors.mutedText }} // MODIFIED: بدل text-gray-400 الثابت
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.9L3 20l1.1-3.9A8.012 8.012 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>{comments}</span>
            </div>
          </div>

          {/* MODIFIED: بدل text-green-600 الثابت — نستخدم primary من الثيم */}
          <div className="flex items-center gap-2" style={{ color: colors.primary }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium">{status}</span>
          </div>

          {onDeleteClick && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDeleteClick()
              }}
              // MODIFIED: بدل text-red-500 hover:text-red-700 الثابتة — نستخدم danger500/danger700 من الثيم
              className="text-sm font-medium flex items-center gap-1"
              style={{ color: colors.danger500 }}
              onMouseEnter={(e) => { e.currentTarget.style.color = colors.danger700 }}
              onMouseLeave={(e) => { e.currentTarget.style.color = colors.danger500 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              حذف
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
