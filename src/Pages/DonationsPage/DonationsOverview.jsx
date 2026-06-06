import React from 'react'
import { Box, Typography } from '@mui/material'
import MosquePhoto from '../../assets/images/Mosque.png'
import { useTheme } from '../../theme/themeContext'

const allocationRows = [
  { label: 'صيانة المساجد', value: '45%' },
  { label: 'المشاريع التعليمية', value: '30%' },
  { label: 'الإغاثة المباشرة', value: '25%' },
]

const activityRows = [
  {
    name: 'أحمد محمود الكردي',
    initial: 'أ',
    date: '12-05-2026',
    type: 'تبرع عام',
    tone: 'blue',
    value: '1500 ل.س',
  },
  {
    name: 'فاطمة الزهراء',
    initial: 'ف',
    date: '10-05-2026',
    type: 'وقف',
    tone: 'green',
    value: '500 ل.س',
  },
  {
    name: 'يوسف علي',
    initial: 'ي',
    date: '08-05-2026',
    type: 'تبرع مخصص',
    tone: 'gray',
    value: '300 ل.س',
  },
]

function AllocationBar({ label, value, fill, colors }) {
  return (
    <Box sx={{ mb: 1.25 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: colors.text, textAlign: 'right' }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: 13, fontWeight: 800, color: colors.primary }}>
          {value}
        </Typography>
      </Box>
      <Box
        sx={{ height: 8, borderRadius: 999, backgroundColor: colors.bgelem, overflow: 'hidden' }}
      >
        <Box sx={{ width: fill, height: '100%', background: colors.accent }} />
      </Box>
    </Box>
  )
}

function ActivityRow({ row, colors }) {
  const pillColors = {
    blue: { backgroundColor: colors.accent, color: colors.primary },
    green: { backgroundColor: colors.dateBg, color: colors.secondary },
    gray: { backgroundColor: colors.bgelem, color: colors.mutedText },
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'minmax(180px, 1.1fr) 130px 120px 170px',
        alignItems: 'center',
        gap: 2,
        px: 2,
        py: 1.4,
        borderRadius: 2,
        backgroundColor: colors.surface,
      }}
    >
      {/* المساهم */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 1 }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            backgroundColor: colors.accent,
            color: colors.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          {row.initial}
        </Box>

        <Typography
          sx={{
            fontSize: 15,
            fontWeight: 700,
            color: colors.text,
            textAlign: 'right',
          }}
        >
          {row.name}
        </Typography>
      </Box>

      {/* التاريخ */}
      <Typography
        sx={{
          fontSize: 13,
          color: colors.mutedText,
          textAlign: 'right',
          direction: 'rtl', // <-- EDITED
          unicodeBidi: 'plaintext', // <-- EDITED
        }}
      >
        {row.date}
      </Typography>

      {/* النوع */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Box
          sx={{
            px: 1.6,
            py: 0.6,
            borderRadius: 999,
            ...(pillColors[row.tone] || pillColors.gray),
            fontSize: 12,
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          {row.type}
        </Box>
      </Box>

      {/* القيمة */}
      <Typography
        sx={{
          fontSize: 15,
          fontWeight: 800,
          color: colors.primaryDark,
          textAlign: 'right',
        }}
      >
        {row.value}
      </Typography>
    </Box>
  )
}

export default function DonationsOverview() {
  const { activeTheme } = useTheme()
  const { colors } = activeTheme

  return (
    <Box dir="rtl" sx={{ width: '100%', mt: 2.5 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row-reverse' },
          gap: 2,
          alignItems: 'stretch',
        }}
      >
        {/* Left narrow column: allocations + success story */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: '0 0 250px' }}>
          <Box
            sx={{
              backgroundColor: colors.surface,
              borderRadius: 3,
              px: 2.25,
              py: 2.25,
              boxShadow: `inset 0 0 0 1px ${colors.borderLight}`,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2.25,
              }}
            >
              <Typography sx={{ fontSize: 14, fontWeight: 800, color: colors.primary }}>
                توزيع الأوقاف
              </Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 800, color: colors.primary }}>
                عرض الكل
              </Typography>
            </Box>

            {allocationRows.map((row, index) => (
              <AllocationBar
                key={row.label}
                label={row.label}
                value={row.value}
                fill={index === 0 ? '92%' : index === 1 ? '64%' : '46%'}
                colors={colors}
              />
            ))}
          </Box>

          {/* Success story card (قصص النجاح) */}
          <Box>
            <Box
              sx={{
                position: 'relative',
                height: 175,
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 12px 28px rgba(15, 23, 42, 0.08)',
              }}
            >
              <Box
                component="img"
                src={MosquePhoto}
                alt="قصص النجاح"
                sx={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />

              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%)',
                }}
              />

              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  p: 3,
                }}
              >
                <Box sx={{ maxWidth: 185, alignSelf: 'flex-end', textAlign: 'right' }}>
                  <Typography
                    sx={{ fontSize: 11, fontWeight: 800, color: colors.secondary, mb: 0.5 }}
                  >
                    قصص النجاح
                  </Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.onPrimary }}>
                    اكتمال ترميم مسجد الصحابة
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Right main column: recent activity */}
        <Box
          sx={{
            backgroundColor: colors.surface,
            borderRadius: 3,
            px: 2.4,
            py: 2.25,
            flex: '1 1 0',
            minWidth: 0,
          }}
        >
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.1 }}
          >
            <Typography sx={{ fontSize: 14, fontWeight: 800, color: colors.primary }}>
              أحدث العمليات
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'minmax(180px, 1.1fr) 130px 120px 170px',
              gap: 2,
              px: 2,
              py: 1.25,
              borderRadius: 2,
              backgroundColor: colors.bgelem,
              mb: 1.25,
            }}
          >
            <Typography
              sx={{ fontSize: 13, fontWeight: 800, color: colors.mutedText, textAlign: 'right' }}
            >
              المساهم
            </Typography>
            <Typography
              sx={{ fontSize: 13, fontWeight: 800, color: colors.mutedText, textAlign: 'right' }}
            >
              التاريخ
            </Typography>
            <Typography
              sx={{ fontSize: 13, fontWeight: 800, color: colors.mutedText, textAlign: 'right' }}
            >
              النوع
            </Typography>
            <Typography
              sx={{ fontSize: 13, fontWeight: 800, color: colors.mutedText, textAlign: 'right' }}
            >
              القيمة
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.1 }}>
            {activityRows.map((row) => (
              <ActivityRow key={row.name} row={row} colors={colors} />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
