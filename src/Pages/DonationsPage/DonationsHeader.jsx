import React from 'react'
import { Box, Typography } from '@mui/material'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import VolunteerActivismRoundedIcon from '@mui/icons-material/VolunteerActivismRounded'
import CurrencyExchangeRoundedIcon from '@mui/icons-material/CurrencyExchangeRounded'
import { useTheme } from '../../theme/themeContext'
import MainFun from '../DashboardPage/MainFun.jsx'

const summaryCards = [
  {
    title: 'متوسط التبرع الشهري',
    value: '5,200',
    currency: 'د.ا',
    icon: VolunteerActivismRoundedIcon,
    iconBg: 'accent',
    iconColor: 'primary',
  },
  {
    title: 'المتبرعون الجدد',
    value: '284',
    extra: '18%',
    icon: CurrencyExchangeRoundedIcon,
    iconBg: 'dateBg',
    iconColor: 'secondary',
  },
  {
    title: 'إجمالي التبرعات السنوي',
    value: '1,450,280',
    currency: 'د.ا',
    progress: '75% من المستهدف',
    growth: '+12.5%',
    dark: true,
  },
]

function StatCard({ card, colors }) {
  if (card.dark) {
    return (
      <Box
        sx={{
          flex: '1 1 0',
          minWidth: 0,
          height: 158,
          borderRadius: 4,
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
          color: colors.onPrimary,
          boxShadow: '0 18px 30px rgba(6, 84, 55, 0.16)',
          px: 4,
          py: 2.5,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 700,
              lineHeight: 1,
              color: colors.onPrimaryMuted,
              backgroundColor: 'rgba(255,255,255,0.08)',
              borderRadius: 999,
              px: 2,
              py: 0.8,
            }}
          >
            {card.growth}
          </Typography>
          <Box sx={{ textAlign: 'right' }}>
            <Typography
              sx={{ fontSize: 15, fontWeight: 600, color: colors.onPrimaryMuted, mb: 0.8 }}
            >
              {card.title}
            </Typography>
            <Box
              sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 1 }}
            >
              <Typography sx={{ fontSize: 22, fontWeight: 700, color: colors.onPrimary }}>
                {card.currency}
              </Typography>
              <Typography
                sx={{
                  fontSize: 31,
                  fontWeight: 800,
                  lineHeight: 1,
                  color: colors.onPrimary,
                  letterSpacing: '-0.03em',
                }}
              >
                {card.value}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              flex: 1,
              height: 4,
              borderRadius: 999,
              backgroundColor: 'rgba(255,255,255,0.16)',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                width: '75%',
                height: '100%',
                borderRadius: 999,
                backgroundColor: 'rgba(255,255,255,0.78)',
              }}
            />
          </Box>
          <Typography sx={{ fontSize: 11, color: colors.onPrimaryMuted, whiteSpace: 'nowrap' }}>
            {card.progress}
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        flex: '0 0 208px',
        height: 158,
        borderRadius: 4,
        backgroundColor: colors.surface,
        boxShadow: '0 10px 26px rgba(15, 23, 42, 0.06)',
        px: 3,
        py: 2.6,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box
        sx={{
          alignSelf: 'flex-end',
          width: 40,
          height: 40,
          borderRadius: 3,
          backgroundColor: colors[card.iconBg] ?? colors.accent,
          opacity: 0.92,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {card.icon ? (
          <card.icon sx={{ fontSize: 22, color: colors[card.iconColor] ?? colors.primary }} />
        ) : null}
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: colors.mutedText, mb: 0.8 }}>
          {card.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 1 }}>
          {card.currency ? (
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: colors.text }}>
              {card.currency}
            </Typography>
          ) : null}
          <Typography
            sx={{
              fontSize: 29,
              fontWeight: 800,
              lineHeight: 1,
              color: colors.text,
              letterSpacing: '-0.02em',
            }}
          >
            {card.value}
          </Typography>
        </Box>
      </Box>
      {card.extra ? (
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
            color: colors.primary,
            alignSelf: 'flex-start',
          }}
        >
          {card.extra}
        </Typography>
      ) : null}
    </Box>
  )
}

export default function DonationsHeader({ onAddClick }) {
  const { activeTheme } = useTheme()
  const { colors } = activeTheme

  return (
    <Box dir="rtl" sx={{ width: '100%' }}>
      <MainFun
        title="إدارة التبرعات"
        description="متابعة التبرعات المالية والمساهمات الوقفية الجارية"
        announcementButton="تصفية البيانات"
        addButton="إصدار تقرير"
        announcementIcon={<FilterAltOutlinedIcon />}
        addIcon={<DescriptionOutlinedIcon />}
        onAddClick={onAddClick}
      />

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'stretch' }}>
        {summaryCards.map((card) => (
          <StatCard key={card.title} card={card} colors={colors} />
        ))}
      </Box>
    </Box>
  )
}
