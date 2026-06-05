import React from 'react'
import defaultImg from '../../assets/images/announcement-default.svg'

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
}) {
  const src = typeof image === 'string' && image.trim() ? image : defaultImg

  return (
    <article
      dir="rtl"
      onClick={onClick}
      className="w-full border-2 border-dashed border-blue-400 rounded-lg p-4 flex gap-4 items-start bg-white hover:shadow-md transition-shadow cursor-pointer"
    >
      <img
        src={src}
        alt={title || 'announcement'}
        className="w-24 h-20 object-cover rounded-md flex-shrink-0 bg-gray-50"
        onError={(event) => {
          event.currentTarget.src = defaultImg
        }}
      />

      <div className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 leading-tight">
            {title}
          </h3>
        </div>

        <p
          className="mt-2 text-sm text-gray-600 leading-relaxed"
          style={{
            WebkitLineClamp: 3,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {excerpt}
        </p>

        <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
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
                className="h-4 w-4 text-gray-400"
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
                className="h-4 w-4 text-gray-400"
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

          <div className="flex items-center gap-2 text-green-600">
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
        </div>
      </div>
    </article>
  )
}
